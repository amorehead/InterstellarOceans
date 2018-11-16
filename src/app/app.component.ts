import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'interstellar-oceans';
  tournamentForm: FormGroup;
  numberOfTeams = 20;
  numberOfQuizzes: number;
  numberOfRooms: number;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tournamentForm = this.fb.group({
      numberOfTeams: ['', [Validators.required]],
      numberOfQuizzes: ['', [Validators.required]],
      numberOfRooms: ['', [Validators.required]]
    });
  }

  submit() {
    // this.numberOfTeams = this.fb.group().get('numberOfTeams');
    // this.numberOfQuizzes = this.fb.group().get('numberOfQuizzes');
    // this.numberOfRooms = this.fb.group().get('numberOfRooms');

    // The following populates a list with a range of integers representing each team.
    const teams = [];
    for (let i = 1; i < this.numberOfTeams + 1; i++) {
      teams.push(i);
    }

    // This calls a function to generate the powerset of "teams".
    this.genPowerSet(teams);
  }

  // This function will generate the powerset for a given list of integers.
  genPowerSet(ints: number[]) {
    const getAllSubsets = theArray =>
      theArray.reduce(
        (subsets, value) => subsets.concat(subsets.map(set => [set, ...value])),
        [[]]
      );

    // This displays the result of the computation.
    console.log(getAllSubsets(ints));
  }
}
