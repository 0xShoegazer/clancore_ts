export class Player {
  constructor(
    public socketId: string,
    public id: string,
    public name: string,
    public bankroll: number,
  ) {}
}
