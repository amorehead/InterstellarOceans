import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Tournament } from './model/tournament';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'interstellar-oceans';
  // This sets up a FormGroup for the current tournament.
  tournamentForm: FormGroup;
  // This creates an initial tournament object for us.
  tournament = new Tournament();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tournamentForm = this.fb.group({
      numberOfTeams: ['', [Validators.required]],
      numberOfQuizzes: ['', [Validators.required]],
      numberOfRooms: ['', [Validators.required]]
    });
  }

  submit() {
    // This updates the tournament parameters with the user's input.
    alert(this.tournamentForm.get('numberOfTeams').value);
    this.tournament.numberOfTeams = this.tournamentForm.get(
      'numberOfTeams'
    ).value[0];
    alert(this.tournamentForm.get('numberOfQuizzes').value);
    this.tournament.numberOfQuizzes = this.tournamentForm.get(
      'numberOfQuizzes'
    ).value[0];
    alert(this.tournamentForm.get('numberOfRooms').value);
    this.tournament.numberOfRooms = this.tournamentForm.get(
      'numberOfRooms'
    ).value[0];

    // The following populates a list with a range of integers representing each team.
    const teams = [];
    for (let i = 1; i < this.tournament.numberOfTeams + 1; i++) {
      teams.push(i);
    }

    // This calls a function to generate the powerset of "teams".
    this.generatePowerSet(teams);
  }

  // This function will generate the powerset for a given list of integers.
  generatePowerSet(ints: number[]): any {
    const getAllSubsets = theArray =>
      theArray.reduce(
        (subsets, value) => subsets.concat(subsets.map(set => [set, ...value])),
        [[]]
      );

    // This displays the result of the computation.
    this.tournament.possibleMatchups = getAllSubsets(ints);
  }
}
