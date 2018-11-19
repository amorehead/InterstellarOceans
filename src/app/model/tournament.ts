export class Tournament {
  constructor(
    public numberOfTeams = 10,
    public numberOfQuizzes = 15,
    public numberOfRooms = 5,
    public possibleMatchups = []
  ) {}
}
