import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule from @angular/forms

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './MyComponents/input/input.component';
import { OutputComponent } from './MyComponents/output/output.component';
import { CorrLogicComponent } from './MyComponents/corr-logic/corr-logic.component';
import { DisplayComponent } from './MyComponents/display/display.component';
import { ArrayDataService } from './data.service'; // Adjust the path accordingly

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    OutputComponent,
    CorrLogicComponent,
    DisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule // Add FormsModule here
  ],
  providers: [ArrayDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
