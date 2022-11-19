import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { MemberService } from "../services/member.service";
import { TrainerData } from "../models/trainer.model";
import { TrainerService } from "../services/trainer.service";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import {MatDialog} from '@angular/material/dialog';
import { DialogMessageComponent } from "src/app/dialog-message/dialog-message.component"
import { mimeType } from "../profile/mime-type.validator";


export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: "app-trainer-view",
  templateUrl: "./trainer-view.component.html",
  styleUrls: ["./trainer-view.component.css"],
})
export class TrainerViewComponent implements OnInit {
  trainer: any;
  TrainerData: TrainerData[] = [];
  details: any;
  form : any ;
  image: any;
  member: any;
  hires : any;
  imagePreview:string | ArrayBuffer | null = "";
  profession: any;
  private TrainerId: any;

  constructor(
    public route: ActivatedRoute,
    public trainerService: TrainerService,
    public memberService: MemberService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.profession = localStorage.getItem("profession");
    this.getTrainer();
    this.trainerService.getHireRequest().subscribe(hires=>{
      this.hires = hires
    console.log(this.hires.length);
})
  }

  getTrainer() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.TrainerId = paramMap.get("id");
        this.trainerService.getTrainer(this.TrainerId).subscribe((data) => {
          this.trainer = {
            id: data._id,
            first_name: data.first_name,
            last_name: data.last_name,
            profile_image: data.profile_image,
            introduction: data.intro,
            members: data.members
          };
          if (this.trainer.profile_image != '') {
            this.getimg(this.trainer.profile_image);
          }
        });
      }
    });
  }

  async onHireTrainer() {
    let trainerH = await this.TrainerId;
    let a = localStorage.getItem("userId") || "";
    this.member = await this.memberService.getMember(a).toPromise();
      let result = await this.trainerService.hireTrainer(
        trainerH,
        this.member._id,
        this.member.first_name,
        this.member.height,
        this.member.weight
      );
     // console.log(this.member);
      this.openDialog(result.message);
  }
  openDialog(msg: string){
    this.dialog.open(DialogMessageComponent, {data :{message :msg} });
}

getimg(img :string){
  var al: string = "";
    //console.log(memberData.profile_image);
    // var image = new image();
    //console.log(this.image);
    this.trainerService
      .getImage(img)
      .subscribe((data) => {
        al = data.toString();
        const imageName = "name.png";
        const imageBlob = this.dataURItoBlob(al);
        const imageFile = new File([imageBlob], imageName, {
          type: "image/png",
        });
        //console.log(typeof (imageFile));
        this.form.patchValue({ image: imageFile });
        this.form.get("image").updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(imageFile);
      });
  
}
//converts string to blob
dataURItoBlob(dataURI: string) {
  const byteString = window.atob(dataURI);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([int8Array], { type: "image/png" });
  return blob;
}
}
