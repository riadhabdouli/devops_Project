import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private authStatusSub: Subscription = new Subscription();
  checkField = true;
  isTrainer: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isTrainer = false;
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {});
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.isTrainer == false) {
      this.authService.createMember(
        form.value.firstname,
        form.value.lastname,
        form.value.email,
        form.value.password
      );
    }else {
		this.authService.createTrainer(
			form.value.firstname,
			form.value.lastname,
			form.value.email,
			form.value.password,
			form.value.intro
		  );
	}
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
  trainer() {
    return (this.isTrainer = true);
  }
  notTrainer() {
    return (this.isTrainer = false);
  }
}
