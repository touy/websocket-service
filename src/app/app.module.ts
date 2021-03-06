import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // <<<< import it here
import { AppComponent } from './app.component';
import { Comp1Component } from './comp1/comp1.component';
import {PouchDBService} from './pouchdb.service';
import { IceMakerComponent } from './ice-maker/ice-maker.component';
// import {routes} from './app.router';

@NgModule({
  declarations: [
    AppComponent,
    Comp1Component,
    IceMakerComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent },
      { path: 'icemaker', component: IceMakerComponent },
      { path: 'comp1', component: Comp1Component }
    ]),
  ],
  providers: [PouchDBService],
  bootstrap: [AppComponent]
})
export class AppModule { }
