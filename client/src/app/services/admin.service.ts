import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor( private http: HttpClient,
    private router: Router,) { }


  getAllTrainers(){
    return this.http.get<{
      _id: string;
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      profile_image: string;
      status: string;
    }>("http://localhost:3000/admin/home");
    
  }


}
