import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, Subscriber, Subscription } from 'rxjs'
import { memberData } from "../models/member.model";
import {TrainerData} from "../models/trainer.model"
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { HeadService } from "../header/head.service";

@Injectable({ providedIn: 'root' })
export class MemberService {
  private trainers: TrainerData[] = [];
  private members: memberData[] = [];
  member: any;
  trainer: any;
  imageD: string = "";
  constructor(
    private http: HttpClient,
    private router: Router,
    private headService: HeadService) { }


getMember(userId: string) {
    return  this.http.get<{
       _id: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      height: string;
      weight: string;
      profile_image: string;
      profession: string;
    }>("http://localhost:3000/auth/profile/" + userId);
  };

  getTrainer(userId: string){
    return this.http.get<{
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      profile_image: string;
      profession: string;
      members: Array<string>;
    }>("http://localhost:3000/auth/profile/" + userId);
  }
  updateMember(id: string, first_name: string, last_name: string, email: string, password: string, height: string, weight: string, profile_image:string) {
    let memberData: memberData;
    memberData = {
      id: id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      height: height,
      weight: weight,
      profile_image: profile_image
    };
    this.http.put("http://localhost:3000/auth/profile/" + id, memberData)
      .subscribe(Response => {
        this.router.navigate(["/home"]);
      })
  };

  changePass(id: string, old_pass: string, new_pass: string, renew_pass: string) {
    let passData: any;
    passData = {
      old_password: old_pass,
      new_password: new_pass,
      confirm_password: renew_pass
    };
    this.http.post("http://localhost:3000/auth/change-password/" + id, passData)
      .subscribe(Response => {
        this.router.navigate(["/home"]);
      })
  }

  async updatePicture(id: string, username: string, image: File) {
    await this.convertToBase64(image);
    let a = new FormData();
    a.append("image", this.imageD);
    this.http.post("http://localhost:3000/auth/profileimg/" + id, a)
      .subscribe(Response => {
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

  getImage(img:string){
    return this.http.get<{ content: string }>("http://localhost:3000/auth/profileimg/" + img);
  }

  

  
  getAllTrainers(){
    return this.http.get<{
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      profile_image: string;
      introduction :string;
    }>("http://localhost:3000/user/user-list");

  }

  async asMember(userId: string) {
   this.http.get<{
       _id: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      height: string;
      weight: string;
      profile_image: string;
      profession: string;
    }>("http://localhost:3000/auth/profile/" + userId).subscribe(memberData => {
      this.member = {
        _id: memberData._id,
        first_name: memberData.first_name,
        height: memberData.height,
        weight: memberData.weight
      };
    });
    return await this.member ;
  }

 
}