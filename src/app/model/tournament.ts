export class Tournament {
  constructor(
    public numberOfTeams: number,
    public numberOfQuizzes: number,
    public numberOfRooms: number,
    public idealNumberOfTimeSlots: number,
    public actualNumberOfTimeSlots: number,
    public primaryMatchups: any[],
    public alternativeMatchups: any[]
  ) {}
}
