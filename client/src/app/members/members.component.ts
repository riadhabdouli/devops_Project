import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { MemberService } from "../services/member.service";
import { Router } from "@angular/router";
import { TrainerService } from "../services/trainer.service";
import {MatDialog} from '@angular/material/dialog';
import { DialogMessageComponent } from "src/app/dialog-message/dialog-message.component";

export interface DialogData {
    title: string;
    message: string;
  }
@Component({
    selector: "app-members",
    templateUrl: "./members.component.html",
    styleUrls: ["./members.component.css"],
  })
  export class membersComponent implements OnInit {
    hires: any = [];
    msg : any;
    constructor(
        public route: ActivatedRoute,
        public authService: AuthService,
        public memberService: MemberService,
        public trainerService: TrainerService,
        public dialog: MatDialog
      ) {}


   ngOnInit(){
        this.trainerService.getHireRequest().subscribe(hires=>{
               this.hires = hires
             console.log(this.hires.length);
        })
    }
    
async onAccept(trainerId:string,memberName:string,memberId: string,hiresId:string ){
   this.msg = await this.trainerService.onAcceptReq(trainerId,memberId,memberName,hiresId);
   console.log(this.msg);
   this.openDialog(this.msg.message);
   
  }

  
  openDialog(msg: string){
    let dial = this.dialog.open(DialogMessageComponent, {data :{message :msg} });
     dial.afterClosed().subscribe(result =>{
        window.location.reload();
    })
}
async onReject(id :string){
  this.msg = await this.trainerService.onRejectReq(id);
  console.log(this.msg);
  this.openDialog(this.msg.message);
}

  }