import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AppComponent } from './app.component';
import { Comp1Component } from './comp1/comp1.component';

export const router: Routes = [
    { path: '', redirectTo: 'app', pathMatch: 'Full' },
    { path: 'comp1', component: Comp1Component },
];
export const routes: ModuleWithProviders = RouterModule.forRoot(router);

