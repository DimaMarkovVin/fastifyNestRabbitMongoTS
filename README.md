# How to run
1) `docker-compose up` - and wait for **mongoDB** and **user** containers to start
2) `npm i` - at the root of the project
3) `node .\scripts\index.js` - to fill the base (variable **CHUNK_LIMIT** in `scripts/index.js` can be increased to speed up filling)
4) routes:
- http://0.0.0.0:3000/users?country=[~Germany]&city=[~Riverside]&pageNumber=[number]&amountPerPage=[number]
- http://0.0.0.0:3000/users/totals
- http://0.0.0.0:3000/users/:id
