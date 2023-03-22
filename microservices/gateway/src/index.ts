import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import * as amqp from 'amqplib';
import * as dotenv from 'dotenv';
import * as EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';

const fastify = Fastify({
  logger: true,
});

dotenv.config();

const REPLY_QUEUE = 'amq.rabbitmq.reply-to';
const userQueue: string = process.env.RABBITMQ_USER_QUEUE_NAME;
const cacheQueue: string = process.env.RABBITMQ_CACHE_QUEUE_NAME;
const [hostname, port]: string[] = process.env.RABBITMQ_HOST.split(':');

fastify.register(import('fastify-amqp'), {
  hostname: hostname,
  port: Number(port),
  username: process.env.RABBITMQ_DEFAULT_USER,
  password: process.env.RABBITMQ_DEFAULT_PASS,
});

const createClient = () =>
  fastify.amqp.connection
    .createChannel()
    .then((channel: amqp.Channel & { responseEmitter: EventEmitter }) => {
      channel.responseEmitter = new EventEmitter();
      channel.responseEmitter.setMaxListeners(0);
      channel.consume(
        REPLY_QUEUE,
        (msg) => {
          channel.responseEmitter.emit(
            msg.properties.correlationId,
            msg.content.toString('utf8'),
          );
        },
        { noAck: true },
      );
      return channel;
    });

const sendRPCMessage = <T>(
  channel: amqp.Channel & { responseEmitter: EventEmitter },
  data: T,
  rpcQueue: string,
  pattern: string,
): Promise<string> =>
  new Promise((resolve) => {
    const correlationId: string = uuidv4();

    const payload = JSON.stringify({
      id: correlationId,
      pattern,
      data: data,
    });

    channel.responseEmitter.once(correlationId, resolve);
    channel.sendToQueue(rpcQueue, Buffer.from(payload), {
      correlationId,
      replyTo: REPLY_QUEUE,
    });
  });

// ROUTES
fastify.get(
  '/users',
  async function (request: FastifyRequest, reply: FastifyReply) {
    const res: string = await sendRPCMessage<unknown>(
      fastify.amqp.channel as amqp.Channel & { responseEmitter: EventEmitter },
      request.query,
      userQueue,
      'users',
    );

    const parsed = JSON.parse(res);

    parsed.err
      ? ((reply.statusCode = 403), reply.send(parsed))
      : reply.send(parsed.response);
  },
);

fastify.get(
  '/users/totals',
  async function (_request: FastifyRequest, reply: FastifyReply) {
    const res: string = await sendRPCMessage<null>(
      fastify.amqp.channel as amqp.Channel & { responseEmitter: EventEmitter },
      null,
      userQueue,
      'totals',
    );

    const parsed = JSON.parse(res);

    parsed.err
      ? ((reply.statusCode = 403), reply.send(parsed))
      : reply.send(parsed.response);
  },
);

fastify.get(
  '/users/:id',
  async function (request: FastifyRequest, reply: FastifyReply) {
    const res: string = await sendRPCMessage<string>(
      fastify.amqp.channel as amqp.Channel & { responseEmitter: EventEmitter },
      request.params['id'],
      cacheQueue,
      'userById',
    );

    const parsed = JSON.parse(res);

    parsed.err
      ? ((reply.statusCode = 403), reply.send(parsed))
      : reply.send(parsed.response);
  },
);

const start = async function () {
  try {
    await fastify.listen({
      port: Number(process.env.MICROSERVICE_GATEWAY_PORT),
      host: '0.0.0.0',
    });

    fastify.amqp.channel = await createClient();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
