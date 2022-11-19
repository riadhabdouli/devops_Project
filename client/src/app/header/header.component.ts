import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service" ;
import { HeadService } from "./head.service";
import { TrainerService } from "../services/trainer.service";
import { Router,NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized  } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  profession : any ;
  hires : any;
  notif : any;
  private authListenerSubs: Subscription = new Subscription;
  
  constructor(private authService: AuthService, private headService : HeadService ,private router: Router, private trainerService :TrainerService) {  }
  public email : string = "";

  ngOnInit() {
    this.router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        this.profession = this.authService.getProfession();
       // console.log(this.profession);
       this.trainerService.getHireRequest().subscribe(hires=>{
        this.hires = hires
        this.notif=this.hires.length
        console.log(this.hires.length);
      })
      }
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
      
     
     } 
  
     onClickProfile(){
       this.email = localStorage.getItem("userId") || "";
       this.router.navigate(['profile', this.email]);
     }
     onClickWorkoutPlan(){
      this.email = this.authService.getUserId();
      if(this.profession =='member'){
        this.router.navigate(['workout', this.email]);
       }else{
          this.router.navigate(['workout']);
        }
    
     }
     onClicknutriPlan(){
      this.email = this.authService.getUserId();
      if(this.profession =='member'){
      this.router.navigate(['nutrition', this.email]);
      }else{
        this.router.navigate(['nutrition']);
      }
     }

   /*onUpdate(email : string){  // this methode is for making the fetching available after profile updating
       this.email = email; 
       console.log(this.email);
   } */
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}