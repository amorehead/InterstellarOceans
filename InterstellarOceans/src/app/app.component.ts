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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tournamentForm = this.fb.group({
      numberOfTeams: ['', [Validators.required]],
      numberOfQuizzes: ['', [Validators.required]],
      numberOfRooms: ['', [Validators.required]]
    });
  }
  submit() {}
}
