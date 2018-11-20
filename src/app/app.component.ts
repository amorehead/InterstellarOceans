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
  tournament = new Tournament(0, 0, 0, 0, 0, []);
  tournamentForm: FormGroup;

  constructor(private fb: FormBuilder, private httpService: HttpClient) {}

  ngOnInit() {
    this.tournamentForm = this.fb.group({
      numberOfTeams: ['', [Validators.required]],
      numberOfQuizzes: ['', [Validators.required]],
      numberOfRooms: ['', [Validators.required]]
    });
  }

  onSubmitClick() {
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

    // This calls a function to filter down the powerset.
    this.searchPowerSet(this.tournament.numberOfTeams);

    // This calls a function to find the ideal number of time slots for the tournament.
    this.calculateIdealNumberOfTimeSlots(this.tournament.numberOfTeams);

    // This calls a function to find the realistic number of time slots for the tournament.
    this.calculateActualNumberOfTimeSlots(
      this.tournament.numberOfTeams,
      this.tournament.numberOfQuizzes,
      this.tournament.numberOfRooms
    );
  }

  // This function will filter down the powerset based on the provided parameter.
  searchPowerSet(numberOfTeams: number) {
    const teams = [];

    const nonRepeatingTriples = [];

    const presentPairs = new Map();

    for (let i = 1; i <= numberOfTeams; i++) {
      teams.push(i);
    }

    for (let i = 0; i < teams.length - 2; i++) {
      for (let j = i + 1; j < teams.length - 1; j++) {
        for (let k = j + 1; k < teams.length; k++) {
          const tripleSet = [teams[i], teams[j], teams[k]];

          const firstPair = `${tripleSet[0]}${tripleSet[1]}`;
          const secondPair = `${tripleSet[1]}${tripleSet[2]}`;
          const thirdPair = `${tripleSet[0]}${tripleSet[2]}`;

          if (
            !presentPairs.has(firstPair) &&
            !presentPairs.has(secondPair) &&
            !presentPairs.has(thirdPair)
          ) {
            nonRepeatingTriples.push(tripleSet);

            presentPairs.set(firstPair, tripleSet);
            presentPairs.set(secondPair, tripleSet);
            presentPairs.set(thirdPair, tripleSet);
          }
        }
      }
    }

    this.tournament.matchups = nonRepeatingTriples;
  }

  // This function finds an ideal number of time slots that must be used for scheduling a given tournament.
  calculateIdealNumberOfTimeSlots(numberOfTeams: number) {
    /* In a perfect round-robin scenario, the number of teams can
    determine the number of quizzes((number of teams - 1) / 2)
    and the number of rooms(number of teams / 3). */
    const idealNumberOfQuizzes = (numberOfTeams - 1) / 2;
    const idealNumberOfRooms = numberOfTeams / 3;
    const idealNumberOfMatches = (numberOfTeams * idealNumberOfQuizzes) / 3;
    this.tournament.idealNumberOfTimeSlots =
      idealNumberOfMatches / idealNumberOfRooms;
  }

  // This function finds a realistic number of time slots that must be used for scheduling a given tournament.
  calculateActualNumberOfTimeSlots(
    numberOfTeams: number,
    numberOfQuizzes: number,
    numberOfRooms: number
  ) {
    const numberOfMatches = numberOfTeams / numberOfQuizzes / 3;
    if (numberOfMatches % 3 === 0) {
      this.tournament.actualNumberOfTimeSlots = numberOfMatches / numberOfRooms;
    } else {
      this.tournament.actualNumberOfTimeSlots = Math.ceil(numberOfMatches);
    }
  }
}
