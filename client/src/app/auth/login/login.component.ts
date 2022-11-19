import { Component, OnInit , Inject } from '@angular/core';
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | undefined;

  processing: Boolean = false;
  error: Boolean = false;
  private authStatusSub: Subscription = new Subscription;
  checkField  = true;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {}
    );
  }

  // checkRequiredClass(frmControl: string) {
  //   const t  = this.loginForm.get()
  //   return {
  //     'required' : false
  //   };
  // }

 

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  private handleLoginSuccess() {
    this.processing = false;
    this.error  = false;
    this.router.navigate(['/dashboard']);
  }

  private handleLoginError() {
    this.processing = false;
    this.error  = true;
  }

  private initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [ Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

}
