import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // <<<< import it here
import { AppComponent } from './app.component';
import { Comp1Component } from './comp1/comp1.component';
// import {routes} from './app.router';

@NgModule({
  declarations: [
    AppComponent,
    Comp1Component
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: AppComponent },
      { path: 'app', component: AppComponent },
      { path: 'comp1', component: Comp1Component }
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
