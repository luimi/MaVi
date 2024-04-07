import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Parse from 'parse';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService  {

  constructor(private router: Router) { }

  canActivate(){
    if(Parse.User.current()) return true;
    this.router.navigateByUrl('login');
    return false;
  }
}
