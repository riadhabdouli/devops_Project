import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, Subscriber, Subscription } from "rxjs";
import { memberData } from "../models/member.model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { HeadService } from "../header/head.service";
import { TrainerData } from "../models/trainer.model";
import { hireData } from "../models/hire.model";

@Injectable({ providedIn: "root" })
export class TrainerService {
  private trainers: memberData[] = [];
  trainer: any;
  imageD: string = "";
  editResponse: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private headService: HeadService
  ) {}

  getTrainer(userId: string) {
    return this.http.get<{
      _id: string;
      intro: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      profile_image: string;
      profession: string;
      status: string;
      members: Array<string>;
    }>("http://localhost:3000/auth/trainer/profile/" + userId);
  }

  async updatePicture(id: string, username: string, image: File) {
    await this.convertToBase64(image);
    let a = new FormData();
    a.append("image", this.imageD);
    this.http
      .post("http://localhost:3000/auth/trainer/profileimg/" + id, a)
      .subscribe((Response) => {
        this.router.navigate(["/home"]);
      });
  }

  async convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    this.imageD = await observable.toPromise();
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

  getImage(img: string) {
    return this.http.get<{ content: string }>(
      "http://localhost:3000/auth/trainer/profileimg/" + img
    );
  }

  updateTrainer(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    status: string,
    members: Array<string>,
    introduction: string,
    profession: string,
    profile_image: string
  ) {
    let trainerData: TrainerData;
    trainerData = {
      id: id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      status: status,
      profile_image: profile_image,
      profession: profession,
      introduction: introduction,
      members: members,
    };
    this.http
      .put("http://localhost:3000/trainer/profile/update/" + id, trainerData)
      .subscribe((Response) => {
        this.router.navigate(["/home"]);
      });
  }

  async hireTrainer(
    trainerId: string,
    memberId: string,
    memberName: string,
    height: string,
    weight: string
  ) {
    let hireData = {
      trainerId: trainerId,
      memberId: memberId,
      memberName: memberName,
      height: height,
      weight: weight,
    };
    //console.log(hireData);
    this.editResponse = await this.http
      .post<{ message: string }>("http://localhost:3000/user/hire", hireData)
      .toPromise();
    return this.editResponse;
  }

  getHireRequest() {
    let a = localStorage.getItem("userId") || String;
    return this.http.get<{
      memberId: string;
      memberName: string;
      height: string;
      weight: string;
    }>("http://localhost:3000/user/hire/" + a);
  }

async onAcceptReq(trainerid: string, memberId: string, memberName: string,hiresId:string){
    let data = {
      memberName: memberName,
      memberId: memberId,
      hireId: hiresId
    };
  let a = await this.http.put<{ message : string}>("http://localhost:3000/trainer/profile/addmember/" + trainerid,data).toPromise();
  return a ;
}
async onRejectReq(hiresId:string){
let data = {
    hireId: hiresId
  };
let a = await this.http.post<{ message : string}>("http://localhost:3000/trainer/profile/deletemember/",data).toPromise();
return a ;
}

}
