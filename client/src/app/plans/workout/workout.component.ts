import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm} from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { workoutData } from "../workout.model";
import { MemberService } from "src/app/services/member.service";
import { AuthService } from "src/app/auth/auth.service";
import { plansService } from "../plans.service";
import { TrainerService } from "src/app/services/trainer.service";
import {MatDialog} from '@angular/material/dialog';
import { DialogMessageComponent } from "src/app/dialog-message/dialog-message.component"


export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: "app-wplan",
  templateUrl: "./workout.component.html",
  styleUrls: ["./workout.component.css"],
})
export class workoutPlan implements OnInit {
  workoutForm: any;
  memberId: any;
  workoutPlan: any;
  workoutData: workoutData[] = [];
  profession: any;
  trainer: any;
  public members: any;
  constructor(
    public route: ActivatedRoute,
    public authService: AuthService,
    public memberService: MemberService,
    public plansService: plansService,
    public trainerService :TrainerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.workoutForm = new FormGroup({
      S1Monday: new FormControl(null, { validators: [] }),
      S1Tuesday: new FormControl(null, { validators: [] }),
      S1Wednesday: new FormControl(null, { validators: [] }),
      S1Thursday: new FormControl(null, { validators: [] }),
      S1Friday: new FormControl(null, { validators: [] }),
      S1Saturday: new FormControl(null, { validators: [] }),
      S1Sunday: new FormControl(null, { validators: [] }),

      S2Monday: new FormControl(null, { validators: [] }),
      S2Tuesday: new FormControl(null, { validators: [] }),
      S2Wednesday: new FormControl(null, { validators: [] }),
      S2Thursday: new FormControl(null, { validators: [] }),
      S2Friday: new FormControl(null, { validators: [] }),
      S2Saturday: new FormControl(null, { validators: [] }),
      S2Sunday: new FormControl(null, { validators: [] }),
    });

    this.profession = this.authService.getProfession();
   // this.memberId = this.authService.getUserId();
    this.memberId = localStorage.getItem("userId") || "";
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (this.profession == "member") {
        this.plansService.getWPlan(this.memberId).subscribe((workoutData) => {
          this.workoutPlan = {
            Monday: workoutData.Monday,
            Tuesday: workoutData.Tuesday,
            Wednesday: workoutData.Wednesday,
            Thursday: workoutData.Thursday,
            Friday: workoutData.Friday,
            Saturday: workoutData.Saturday,
            Sunday: workoutData.Sunday,
          };
          this.workoutForm.setValue({
            S1Monday: this.workoutPlan.Monday[0],
            S1Tuesday: this.workoutPlan.Tuesday[0],
            S1Wednesday: this.workoutPlan.Wednesday[0],
            S1Thursday: this.workoutPlan.Thursday[0],
            S1Friday: this.workoutPlan.Friday[0],
            S1Saturday: this.workoutPlan.Saturday[0],
            S1Sunday: this.workoutPlan.Sunday[0],

            S2Monday: this.workoutPlan.Monday[1],
            S2Tuesday: this.workoutPlan.Tuesday[1],
            S2Wednesday: this.workoutPlan.Wednesday[1],
            S2Thursday: this.workoutPlan.Thursday[1],
            S2Friday: this.workoutPlan.Friday[1],
            S2Saturday: this.workoutPlan.Saturday[1],
            S2Sunday: this.workoutPlan.Sunday[1],
          });
        });
      }else{
        this.trainerService
           .getTrainer(this.memberId)
         .subscribe( async (TrainerData) => {
           console.log(TrainerData);
             this.trainer = {
               id: TrainerData._id,
               first_name: TrainerData.first_name,
               last_name: TrainerData.last_name,
               email: TrainerData.email,
               profile_image: TrainerData.profile_image,
               profession: TrainerData.profession,
               members: TrainerData.members,
             };
             this.members = await  this.trainer.members;
           }); 
    
       }
    });
  }
  
  viewPlan(name : any){
    this.plansService.getWPlan(name.value).subscribe((workoutData) => {
      this.workoutPlan = {   
        pid: workoutData._id,
        memberId:workoutData.memberId,
        Monday: workoutData.Monday,
        Tuesday: workoutData.Tuesday,
        Wednesday: workoutData.Wednesday,
        Thursday: workoutData.Thursday,
        Friday: workoutData.Friday,
        Saturday: workoutData.Saturday,
        Sunday: workoutData.Sunday,
      };
      this.workoutForm.setValue({
        S1Monday: this.workoutPlan.Monday[0],
        S1Tuesday: this.workoutPlan.Tuesday[0],
        S1Wednesday: this.workoutPlan.Wednesday[0],
        S1Thursday: this.workoutPlan.Thursday[0],
        S1Friday: this.workoutPlan.Friday[0],
        S1Saturday: this.workoutPlan.Saturday[0],
        S1Sunday: this.workoutPlan.Sunday[0],

        S2Monday: this.workoutPlan.Monday[1],
        S2Tuesday: this.workoutPlan.Tuesday[1],
        S2Wednesday: this.workoutPlan.Wednesday[1],
        S2Thursday: this.workoutPlan.Thursday[1],
        S2Friday: this.workoutPlan.Friday[1],
        S2Saturday: this.workoutPlan.Saturday[1],
        S2Sunday: this.workoutPlan.Sunday[1],
      });
    });
  }

  async EditWplan(nutriForm: NgForm) {
    let Monday: Array<string> = [
      this.workoutForm.value.S1Monday,
      this.workoutForm.value.S2Monday
    ];
    let Tuesday: Array<string> = [
      this.workoutForm.value.S1Tuesday,
      this.workoutForm.value.S2Tuesday,
      
    ];
    let Wednesday: Array<string> = [
      this.workoutForm.value.S1Wednesday,
      this.workoutForm.value.S2Wednesday
    ];
    let Thursday: Array<string> = [
      this.workoutForm.value.S1Thursday,
      this.workoutForm.value.S2Thursday
    ];
    let Friday: Array<string> = [
      this.workoutForm.value.S1Friday,
      this.workoutForm.value.S2Friday
    ];
    let Saturday: Array<string> = [
      this.workoutForm.value.S1Saturday,
      this.workoutForm.value.S2Saturday
    ];
    let Sunday: Array<string> = [
      this.workoutForm.value.S1Sunday,
      this.workoutForm.value.S2Sunday,
    ];

    let a = await this.plansService.editWplan(
      this.workoutPlan.pid,
      this.workoutPlan.memberId,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday
    );
    this.openDialog(a.message);

  }
  openDialog(msg: string){
      this.dialog.open(DialogMessageComponent, {data :{message :msg} });
  }
}
