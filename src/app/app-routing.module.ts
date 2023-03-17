import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AuthGuard } from './_helpers/auth.guard';
import { RedirectGuard } from './_helpers/redirect.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    pathMatch: 'full',
    component: HomeComponent,
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
