import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { MemberService } from "../services/member.service";
import { Router } from "@angular/router";
import { TrainerService } from "../services/trainer.service";
import { mimeType } from "../profile/mime-type.validator";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  trainers: any = [];
  userIsAuthenticated = false;
  image : string ='' ;
  form: any;
  b : any;
  notActivated : boolean = true ;
  imagePreview : string | ArrayBuffer | null = "";
  private authListenerSubs: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private memberService: MemberService,
    private router: Router,
    private trainerService : TrainerService,
    private sanitizer : DomSanitizer
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });

    let a = localStorage.getItem("status");
    let b = localStorage.getItem("profession");
    console.log(a,b);
    if((b == 'trainer' ) && (a =='NA')){
       this.notActivated = false ;
       console.log("activated");
    }else{
    this.readListTrainers();
  }
  }

 readListTrainers() {
    this.memberService.getAllTrainers().subscribe( async (data) => {
      this.trainers =  data;
    for(const trainer of this.trainers){
      if(trainer.profile_image != ''){
      const base64Img = await this.trainerService.getImage(trainer.profile_image).toPromise();
      const ext = trainer.profile_image.split(".").pop(); 
      trainer.dataSource =  this.sanitizer.bypassSecurityTrustUrl('data:image/'+ ext + ';charset=utf-8;base64, ' + base64Img );
    }
  }
       //this.getimg(this.trainers[0].profile_image);
       
    });
  }
 getimg(data: any){
    var al: string = "";
    //console.log(memberData.profile_image);
    // var image = new image();
      al = data.toString();
      const imageName = "name.png";
      const imageBlob = this.dataURItoBlob(al);
      const imageFile = new File([imageBlob], imageName, {
        type: "image/png",
      });
      this.form.patchValue({ image: imageFile });
      this.form.get("image").updateValueAndValidity();
      const reader = new FileReader();
     reader.onload = () => {
        this.imagePreview = reader.result;
     };
      //console.log(imageFile);
      reader.readAsDataURL(imageFile);
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

  send(id: string) {
    this.router.navigate(["trainerview", id]);
  }
  print(id: any) {
    console.log(id);
  }
}
