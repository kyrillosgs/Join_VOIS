import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { PositionsComponent } from './features/positions/positions.component';
import { ProfileComponent } from './features/profile/profile.component';
import { QuestionsComponent } from './features/questions/questions.component';
import { AuthGuard } from './_helpers/auth.guard';
import { RedirectGuard } from './_helpers/redirect.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'home',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { name: 'home' },
  },
  {
    path: 'candidates',
    canActivate: [RedirectGuard],
    component: ProfileComponent,
  },
  {
    path: 'candidates/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'positions',
    pathMatch: 'full',
    component: PositionsComponent,
    canActivate: [AuthGuard],
    data: { name: 'positions' },
  },
  {
    path: 'questions',
    pathMatch: 'full',
    component: QuestionsComponent,
    canActivate: [AuthGuard],
    data: { name: 'questions' },
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
