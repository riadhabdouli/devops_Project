import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { nutritionData } from "../nutrition.model";
import { MemberService } from "src/app/services/member.service";
import { AuthService } from "src/app/auth/auth.service";
import { plansService } from "../plans.service";
import { TrainerService } from "src/app/services/trainer.service";
import {MatDialog} from '@angular/material/dialog';
import { DialogMessageComponent } from "src/app/dialog-message/dialog-message.component";


export interface DialogData {
  title: string;
  message: string;
}
@Component({
  selector: "app-nplan",
  templateUrl: "./nutrition.component.html",
  styleUrls: ["./nutrition.component.css"],
})
export class nutrtionPlan implements OnInit {
  nutriForm: any;
  memberId: any;
  nutriPlan: any;
  nutriData: nutritionData[] = [];
  profession: any;
  trainer: any;
  public members: any;
  selectedMember: any;

  constructor(
    public route: ActivatedRoute,
    public authService: AuthService,
    public memberService: MemberService,
    public plansService: plansService,
    public trainerService: TrainerService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.nutriForm = new FormGroup({
      Breakfast1: new FormControl(null, { validators: [] }),
      Breakfast2: new FormControl(null, { validators: [] }),
      Breakfast3: new FormControl(null, { validators: [] }),
      Breakfast4: new FormControl(null, { validators: [] }),
      Breakfast5: new FormControl(null, { validators: [] }),
      Breakfast6: new FormControl(null, { validators: [] }),
      Breakfast7: new FormControl(null, { validators: [] }),
      Lunch1: new FormControl(null, { validators: [] }),
      Lunch2: new FormControl(null, { validators: [] }),
      Lunch3: new FormControl(null, { validators: [] }),
      Lunch4: new FormControl(null, { validators: [] }),
      Lunch5: new FormControl(null, { validators: [] }),
      Lunch6: new FormControl(null, { validators: [] }),
      Lunch7: new FormControl(null, { validators: [] }),
      Dinner1: new FormControl(null, { validators: [] }),
      Dinner2: new FormControl(null, { validators: [] }),
      Dinner3: new FormControl(null, { validators: [] }),
      Dinner4: new FormControl(null, { validators: [] }),
      Dinner5: new FormControl(null, { validators: [] }),
      Dinner6: new FormControl(null, { validators: [] }),
      Dinner7: new FormControl(null, { validators: [] }),
    });

    this.profession = this.authService.getProfession();
    this.memberId = localStorage.getItem("userId") || "";
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (this.profession == "member") {
        // change to local storage management
        this.authService.getMember(this.memberId).subscribe((memberData) => {
          this.profession = memberData.profession;
          this.plansService.getNPlan(this.memberId).subscribe((nutriData) => {
            this.nutriPlan = {
              Monday: nutriData.Monday,
              Tuesday: nutriData.Tuesday,
              Wednesday: nutriData.Wednesday,
              Thursday: nutriData.Thursday,
              Friday: nutriData.Friday,
              Saturday: nutriData.Saturday,
              Sunday: nutriData.Sunday,
            };
            this.nutriForm.setValue({
              Breakfast1: this.nutriPlan.Monday[0],
              Breakfast2: this.nutriPlan.Tuesday[0],
              Breakfast3: this.nutriPlan.Wednesday[0],
              Breakfast4: this.nutriPlan.Thursday[0],
              Breakfast5: this.nutriPlan.Friday[0],
              Breakfast6: this.nutriPlan.Saturday[0],
              Breakfast7: this.nutriPlan.Sunday[0],
              Lunch1: this.nutriPlan.Monday[1],
              Lunch2: this.nutriPlan.Tuesday[1],
              Lunch3: this.nutriPlan.Wednesday[1],
              Lunch4: this.nutriPlan.Thursday[1],
              Lunch5: this.nutriPlan.Friday[1],
              Lunch6: this.nutriPlan.Saturday[1],
              Lunch7: this.nutriPlan.Sunday[1],
              Dinner1: this.nutriPlan.Monday[2],
              Dinner2: this.nutriPlan.Tuesday[2],
              Dinner3: this.nutriPlan.Wednesday[2],
              Dinner4: this.nutriPlan.Thursday[2],
              Dinner5: this.nutriPlan.Friday[2],
              Dinner6: this.nutriPlan.Saturday[2],
              Dinner7: this.nutriPlan.Sunday[2],
            });
          });
        });
      } else {
        this.trainerService
          .getTrainer(this.memberId)
          .subscribe(async (TrainerData) => {
            this.trainer = {
              id: TrainerData._id,
              first_name: TrainerData.first_name,
              last_name: TrainerData.last_name,
              email: TrainerData.email,
              profile_image: TrainerData.profile_image,
              profession: TrainerData.profession,
              members: TrainerData.members,
            };
            this.members = await this.trainer.members;
          });
      }
    });
  }

  viewPlan(name: any) {
    console.log(name.value);
    this.plansService.getNPlan(name.value).subscribe((nutriData) => {
      this.nutriPlan = {
        pid: nutriData._id,
        memberId: nutriData.memberId,
        Monday: nutriData.Monday,
        Tuesday: nutriData.Tuesday,
        Wednesday: nutriData.Wednesday,
        Thursday: nutriData.Thursday,
        Friday: nutriData.Friday,
        Saturday: nutriData.Saturday,
        Sunday: nutriData.Sunday,
      };
      console.log(nutriData._id);
      this.nutriForm.setValue({
        Breakfast1: this.nutriPlan.Monday[0],
        Breakfast2: this.nutriPlan.Tuesday[0],
        Breakfast3: this.nutriPlan.Wednesday[0],
        Breakfast4: this.nutriPlan.Thursday[0],
        Breakfast5: this.nutriPlan.Friday[0],
        Breakfast6: this.nutriPlan.Saturday[0],
        Breakfast7: this.nutriPlan.Sunday[0],
        Lunch1: this.nutriPlan.Monday[1],
        Lunch2: this.nutriPlan.Tuesday[1],
        Lunch3: this.nutriPlan.Wednesday[1],
        Lunch4: this.nutriPlan.Thursday[1],
        Lunch5: this.nutriPlan.Friday[1],
        Lunch6: this.nutriPlan.Saturday[1],
        Lunch7: this.nutriPlan.Sunday[1],
        Dinner1: this.nutriPlan.Monday[2],
        Dinner2: this.nutriPlan.Tuesday[2],
        Dinner3: this.nutriPlan.Wednesday[2],
        Dinner4: this.nutriPlan.Thursday[2],
        Dinner5: this.nutriPlan.Friday[2],
        Dinner6: this.nutriPlan.Saturday[2],
        Dinner7: this.nutriPlan.Sunday[2],
      });
    });
  }

  async EditNplan(nutriForm: NgForm) {
    let Monday: Array<string> = [
      this.nutriForm.value.Breakfast1,
      this.nutriForm.value.Lunch1,
      this.nutriForm.value.Dinner1,
    ];
    let Tuesday: Array<string> = [
      this.nutriForm.value.Breakfast2,
      this.nutriForm.value.Lunch2,
      this.nutriForm.value.Dinner2,
    ];
    let Wednesday: Array<string> = [
      this.nutriForm.value.Breakfast3,
      this.nutriForm.value.Lunch3,
      this.nutriForm.value.Dinner3,
    ];
    let Thursday: Array<string> = [
      this.nutriForm.value.Breakfast4,
      this.nutriForm.value.Lunch4,
      this.nutriForm.value.Dinner4,
    ];
    let Friday: Array<string> = [
      this.nutriForm.value.Breakfast5,
      this.nutriForm.value.Lunch5,
      this.nutriForm.value.Dinner5,
    ];
    let Saturday: Array<string> = [
      this.nutriForm.value.Breakfast6,
      this.nutriForm.value.Lunch6,
      this.nutriForm.value.Dinner6,
    ];
    let Sunday: Array<string> = [
      this.nutriForm.value.Breakfast7,
      this.nutriForm.value.Lunch7,
      this.nutriForm.value.Dinner7,
    ];

    let a = await this.plansService.editNplan(
      this.nutriPlan.pid,
      this.nutriPlan.memberId,
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
