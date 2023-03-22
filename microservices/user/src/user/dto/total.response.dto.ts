export class TotalResponseDto {
  constructor(
    public country: string,
    public city: string,
    public usersCount: number,
  ) {}
}
