import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Tournament } from './model/tournament';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // This specifies the name of the application.
  title = 'interstellar-oceans';

  // The following initializes variables for this component:
  tournament = new Tournament(0, 0, 0, 0, 0, [], []);
  tournamentForm: FormGroup;

  resultGroupANumberOfAppearances: any[];
  resultGroupBNumberOfAppearances: any[];

  constructor(private fb: FormBuilder, private httpService: HttpClient) {}

  ngOnInit() {
    this.tournamentForm = this.fb.group({
      numberOfTeams: ['', [Validators.required]],
      numberOfQuizzes: ['', [Validators.required]],
      numberOfRooms: ['', [Validators.required]]
    });
  }

  onSubmitClick() {
    this.resultGroupANumberOfAppearances = [];
    this.resultGroupBNumberOfAppearances = [];

    // This updates the tournament parameters with the user's input.
    this.tournament.numberOfTeams = this.tournamentForm.get(
      'numberOfTeams'
    ).value;
    this.tournament.numberOfQuizzes = this.tournamentForm.get(
      'numberOfQuizzes'
    ).value;
    this.tournament.numberOfRooms = this.tournamentForm.get(
      'numberOfRooms'
    ).value;

    // This calls a function to find the ideal number of time slots for the tournament.
    this.calculateIdealNumberOfTimeSlots(this.tournament.numberOfTeams);

    // This calls a function to find the realistic number of time slots for the tournament.
    this.calculateActualNumberOfTimeSlots(
      this.tournament.numberOfTeams,
      this.tournament.numberOfQuizzes,
      this.tournament.numberOfRooms
    );

    // This finds the triplet team matchups in an alternative way.
    this.generateTripletTeamPairings(this.tournament.numberOfTeams);
  }

  // This function finds an ideal number of time slots that must be used for scheduling a given tournament.
  calculateIdealNumberOfTimeSlots(numberOfTeams: number) {
    /* In a perfect round-robin scenario, the number of teams can
    determine the number of quizzes((number of teams - 1) / 2)
    and the number of rooms(number of teams / 3). */
    const idealNumberOfQuizzes = (numberOfTeams - 1) / 2;
    const idealNumberOfRooms = numberOfTeams / 3;
    const idealNumberOfMatches = (numberOfTeams * idealNumberOfQuizzes) / 3;
    this.tournament.idealNumberOfTimeSlots = Math.ceil(
      idealNumberOfMatches / idealNumberOfRooms
    );
  }

  // This function finds a realistic number of time slots that must be used for scheduling a given tournament.
  calculateActualNumberOfTimeSlots(
    numberOfTeams: number,
    numberOfQuizzes: number,
    numberOfRooms: number
  ) {
    const numberOfMatches = (numberOfTeams * numberOfQuizzes) / 3;
    if (numberOfMatches % 3 === 0) {
      this.tournament.actualNumberOfTimeSlots = Math.ceil(
        numberOfMatches / numberOfRooms
      );
    } else {
      this.tournament.actualNumberOfTimeSlots = Math.ceil(numberOfMatches);
    }
  }

  // This function triplet will find all unique triplet pairings based on the provided parameter.
  generateTripletTeamPairings(numberOfTeams: number) {
    const teams = [];
    const nonRepeatingTriplesA = [];
    const nonRepeatingTriplesB = [];
    const allTriples = [];
    const presentPairsA = new Map();

    for (let i = 1; i <= numberOfTeams; i++) {
      teams.push(i);
    }

    for (let i = 0; i < teams.length - 2; i++) {
      for (let j = i + 1; j < teams.length - 1; j++) {
        for (let k = j + 1; k < teams.length; k++) {
          const tripleSet = [teams[i], teams[j], teams[k]];

          allTriples.push(tripleSet);

          const firstPair = `${tripleSet[0]}${tripleSet[1]}`;
          const secondPair = `${tripleSet[1]}${tripleSet[2]}`;
          const thirdPair = `${tripleSet[0]}${tripleSet[2]}`;

          if (
            !presentPairsA.has(firstPair) &&
            !presentPairsA.has(secondPair) &&
            !presentPairsA.has(thirdPair)
          ) {
            nonRepeatingTriplesA.push(tripleSet);

            presentPairsA.set(firstPair, tripleSet);
            presentPairsA.set(secondPair, tripleSet);
            presentPairsA.set(thirdPair, tripleSet);
          }
        }
      }
    }

    // This assigns the final result of this function's computations to a display variable.
    this.tournament.primaryMatchups = nonRepeatingTriplesA;

    // **** This marks the end of the approach (A) and the beginning of approach (B). **** //

    let searchSet = allTriples.slice(0);

    for (let i = 0; i < teams.length - 1; i++) {
      let filteredSet = searchSet.filter(set =>
        set.some(num => num === teams[i])
      );
      // searchSet = searchSet.filter(set => !set.some(num => num === teams[i]));

      teams.slice(i + 1).forEach(team => {
        const firstResult = filteredSet.find(
          set =>
            set.some(num => num === team) && set.some(num => num === teams[i])
        );
        if (firstResult) {
          const firstPair = [firstResult[0], firstResult[1]];
          const secondPair = [firstResult[0], firstResult[2]];
          const thirdPair = [firstResult[1], firstResult[2]];

          filteredSet = filteredSet.filter(set => {
            return (
              !(
                set.some(num => num === firstPair[0]) &&
                set.some(num => num === firstPair[1])
              ) &&
              !(
                set.some(num => num === secondPair[0]) &&
                set.some(num => num === secondPair[1])
              ) &&
              !(
                set.some(num => num === thirdPair[0]) &&
                set.some(num => num === thirdPair[1])
              )
            );
          });

          searchSet = searchSet.filter(set => {
            return (
              !(
                set.some(num => num === firstPair[0]) &&
                set.some(num => num === firstPair[1])
              ) &&
              !(
                set.some(num => num === secondPair[0]) &&
                set.some(num => num === secondPair[1])
              ) &&
              !(
                set.some(num => num === thirdPair[0]) &&
                set.some(num => num === thirdPair[1])
              )
            );
          });
          nonRepeatingTriplesB.push(firstResult);
        }
      });
    }

    // console.log(`Number of sets with team 1: ${nonRepeatingTriples.filter(triple => triple.some(num => num === 1)).length}`)
    // console.log(`Number of sets with team 12: ${nonRepeatingTriples.filter(triple => triple.some(num => num === 12)).length}`)
    // console.log(`Number of sets with team 23: ${nonRepeatingTriples.filter(triple => triple.some(num => num === 23)).length}`)

    console.log(`Number of triples: ${nonRepeatingTriplesA.length}`);

    for (let i = 0; i < teams.length; i++) {
      this.resultGroupANumberOfAppearances.push(`Number of Triples with ${teams[i]}: ${
        nonRepeatingTriplesA.filter(triple =>
          triple.some(num => num === teams[i])
        ).length
      }`);

      this.resultGroupBNumberOfAppearances.push(`Number of Triples with ${teams[i]}: ${
        nonRepeatingTriplesB.filter(triple =>
          triple.some(num => num === teams[i])
        ).length
      }`);
    }

    // console.log(nonRepeatingTriples);
    // console.log(presentPairs);

    // This assigns the final result of this function's computations to a display variable.
    this.tournament.alternativeMatchups = nonRepeatingTriplesB;
  }
}
