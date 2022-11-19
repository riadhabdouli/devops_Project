import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Subject } from "rxjs";
import { Router } from "@angular/router";


@Injectable({ providedIn: "root" })
export class HeadService {
public email : any;
	constructor(private http: HttpClient, private router: Router) { }
  
	updatePro(email : string) {
	//console.log(email)
	this.router.navigate(['profile', email]);
	}
}