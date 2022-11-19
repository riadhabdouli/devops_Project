import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterComponent } from './auth/register/register.component';
import { TrainerViewComponent } from './trainer-view/trainer-view.component';
import { workoutPlan } from './plans/workout/workout.component';
import { nutrtionPlan } from './plans/nutrition/nutrition.component';
import {AdminHomeComponent} from './admin-home/admin-home.component';
import { membersComponent } from './members/members.component';
import { WelcomeComponent } from './welcom/welcome.component';



const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent, canActivate : [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login' , component: LoginComponent},
  { path: 'register' , component:RegisterComponent},
  { path: 'trainerview/:id', component:TrainerViewComponent ,canActivate : [AuthGuard]},
  { path: 'workout/:id', component: workoutPlan,canActivate : [AuthGuard] },
  { path: 'nutrition/:id', component: nutrtionPlan,canActivate : [AuthGuard] },
  { path: 'nutrition', component: nutrtionPlan,canActivate : [AuthGuard] },
  { path: 'workout', component: workoutPlan ,canActivate : [AuthGuard] },
  { path: 'admin' , component: AdminHomeComponent},
  { path: 'members' , component: membersComponent,canActivate : [AuthGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
