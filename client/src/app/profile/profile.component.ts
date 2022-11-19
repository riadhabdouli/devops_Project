import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { memberData } from "../models/member.model";
import { MemberService } from "../services/member.service";
import { TrainerService } from "../services/trainer.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  member: any;
  memberData: memberData[] = [];
  form1: any;
  form2: any;
  form3: any;
  prof: any;
  profession : any ;
  image : string ='' ;
  private memberId: any;
  imagePreview: string | ArrayBuffer | null = "";
  constructor(
    public route: ActivatedRoute,
    public authService: AuthService,
    public memberService: MemberService,
    public trainerService : TrainerService
  ) {}

  async ngOnInit() {
    this.form1 = new FormGroup({
      first_name: new FormControl(null, { validators: [] }),
      last_name: new FormControl(null, { validators: [] }),
      email: new FormControl(null, { validators: [] }),
      height: new FormControl(null, { validators: [] }),
      weight: new FormControl(null, { validators: [] }),
      intro: new FormControl(null, { validators: [] })
    });

    this.form2 = new FormGroup({
      old_pass: new FormControl(null, { validators: [] }),
      new_pass: new FormControl(null, { validators: [] }),
      renew_pass: new FormControl(null, { validators: [] }),
    });

    this.form3 = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    await this.route.paramMap.subscribe((paramMap: ParamMap) => {
      var al: string = "";
      this.profession = this.authService.getProfession();
     //this.memberId = this.authService.getUserId();
     this.memberId = localStorage.getItem("userId") || "";
     console.log(this.memberId);
     console.log(this.profession);
      if (this.profession=='member') {
         this.memberService.getMember(this.memberId).subscribe((memberData) => {
            this.member = {
              id: memberData._id,
              first_name: memberData.first_name,
              last_name: memberData.last_name,
              password: memberData.password,
              email: memberData.email,
              height: memberData.height,
              weight: memberData.weight,
              profile_image: memberData.profile_image,
              profession: memberData.profession,
            };
            this.image = memberData.profile_image;
            this.prof = memberData.profession;
            if (this.image != '') {
              this.getimg(this.image);
            }
            this.form1.setValue({
              first_name: this.member.first_name,
              last_name: this.member.last_name,
              email: this.member.email,
              height: this.member.height,
              weight: this.member.weight,
              intro : 'empty'
            });
          
        });
      }else {
        this.trainerService.getTrainer(this.memberId).subscribe(
          (memberData) => {
            this.member = {
              id: memberData._id,
              first_name: memberData.first_name,
              last_name: memberData.last_name,
              email: memberData.email,
              password: memberData.password,
              status: memberData.status,
              profile_image: memberData.profile_image,
              profession: memberData.profession,
              introduction:memberData.intro,
              members: memberData.members
            };
            this.image = memberData.profile_image;
            if (this.image != '') {
              this.getimg(this.image);
            }
            this.prof = memberData.profession;
            this.form1.setValue({
              first_name: this.member.first_name,
              last_name: this.member.last_name,
              email: this.member.email,
              height: '',
              weight: '',
              intro: this.member.introduction
            });
          }
        );
      }
    });
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
          this.form3.patchValue({ image: imageFile });
          this.form3.get("image").updateValueAndValidity();
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
  onUpdate(form1: NgForm) {
    if (this.form1.invalid) {
      return;
    } else {if(this.profession=='member'){
      this.memberService.updateMember(
        this.member.id,
        this.form1.value.first_name,
        this.form1.value.last_name,
        this.form1.value.email,
        this.member.password,
        this.form1.value.height,
        this.form1.value.weight,
        this.member.profile_image
      );
    }else {
      this.trainerService.updateTrainer(
        this.member.id,
        this.form1.value.first_name,
        this.form1.value.last_name,
        this.form1.value.email,
        this.member.password,
        this.member.status,
        this.member.members,
        this.form1.value.intro,
        this.member.profession,
        this.member.profile_image,

      );
    }
  }
  }

  onChangePass(form2: NgForm) {
    if (this.form2.invalid) {
      return;
    } else {
      this.memberService.changePass(
        this.member.id,
        this.form2.value.old_pass,
        this.form2.value.new_pass,
        this.form2.value.renew_pass
      );
    }
  }
  onImagePicked(event: Event) {
    let htmlFiles = (event.target as HTMLInputElement).files;
    let file: Blob = new Blob();
    if (htmlFiles != null) {
      file = htmlFiles[0];
      console.log(typeof file);
      //this.memberService.convertToBase64(htmlFiles[0]);
    }
    this.form3.patchValue({ image: file });
    this.form3.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  async onUpdateImage(form3: NgForm) {
    if (this.form3.invalid) {
      return;
    } else {
      await this.trainerService.updatePicture(
        this.member.id,
        this.member.first_name,
        this.form3.value.image
      );
    }
  }
}
