import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, Subscriber, Subscription } from "rxjs";
import { memberData } from "../models/member.model";
import { nutrtionPlan } from "./nutrition/nutrition.component";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { HeadService } from "../header/head.service";
import { nutritionData } from "./nutrition.model";

@Injectable({ providedIn: "root" })
export class plansService {
  private editResponse : any ;
  constructor(
    private http: HttpClient,
    private router: Router,
    private headService: HeadService
  ) {}

  CreateNutritionP() {
    let a = "test";
    return this.http
      .post("http://localhost:3000/plan/nutrition", a)
      .subscribe((Response) => {
        this.router.navigate(["/"]);
      });
  }

  getNPlan(id: string) {
    return this.http.get<{
      _id: string;
      memberId: Array<string>;
      Monday: Array<string>;
      Tuesday: Array<string>;
      Wednesday: Array<string>;
      Thursday: Array<string>;
      Friday: Array<string>;
      Saturday: Array<string>;
      Sunday: Array<string>;
    }>("http://localhost:3000/plan/nutrition/" + id);
  }

  getWPlan(id: string) {
    return this.http.get<{
      _id: string;
      memberId: string
      Monday: Array<string>;
      Tuesday: Array<string>;
      Wednesday: Array<string>;
      Thursday: Array<string>;
      Friday: Array<string>;
      Saturday: Array<string>;
      Sunday: Array<string>;
    }>("http://localhost:3000/plan/workout/" + id);
  }

  async editNplan(
    pid:string,
    memberId: string,
    Monday: Array<string>,
    Tuesday: Array<string>,
    Wednesday: Array<string>,
    Thursday: Array<string>,
    Friday: Array<string>,
    Saturday: Array<string>,
    Sunday: Array<string>
  ) {
     let nutriPlan  = {
       _id: pid,
      memberId: memberId,
      Monday: Monday,
      Tuesday: Tuesday,
      Wednesday: Wednesday,
      Thursday: Thursday,
      Friday: Friday,
      Saturday:Saturday,
      Sunday:Sunday
     };
     this.editResponse =  await this.http
     .put<{message: string}>("http://localhost:3000/plan/nutrition", nutriPlan)
     .toPromise();
     return this.editResponse;
  }

  async editWplan(
    pid:string,
    memberId: string,
    Monday: Array<string>,
    Tuesday: Array<string>,
    Wednesday: Array<string>,
    Thursday: Array<string>,
    Friday: Array<string>,
    Saturday: Array<string>,
    Sunday: Array<string>
  ) {
     let workPlan  = {
       _id: pid,
      memberId: memberId,
      Monday: Monday,
      Tuesday: Tuesday,
      Wednesday: Wednesday,
      Thursday: Thursday,
      Friday: Friday,
      Saturday:Saturday,
      Sunday:Sunday
     };
     this.editResponse = await this.http
     .put<{message : string }>("http://localhost:3000/plan/workout", workPlan)
     .toPromise();
     return this.editResponse;
  }

}
