import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Parse from 'parse';
import { AlertService } from '../utils/alert.service';
import { ValidateService } from '../utils/validate.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  auth: any = {};
  constructor(private validate: ValidateService, private router: Router, private alert: AlertService) { }

  ngOnInit() {
    if(Parse.User.current()){
      this.goToMain();
    }
  }
  async login(){
    this.validate.array([
      this.validate.isNotEmpty(this.auth.email),
      this.validate.isEmail(this.auth.email) || this.auth.email === 'admin',
      this.validate.isNotEmpty(this.auth.password)
    ],[
      'No a ingresado su correo',
      'Correo invalido',
      'No a ingresado su contraseña'
    ],async ()=>{
      try{
        await Parse.User.logIn(this.auth.email, this.auth.password);
        this.goToMain();
      }catch(error){
        this.alert.simple("Usuario y/o contraseña invalidos");
      }
    });
  }
  goToMain(){
    this.router.navigateByUrl('/');
  }
}
