import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
