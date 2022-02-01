import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Parse from 'parse';
import { AlertService } from '../utils/alert.service';
import { ValidateService } from '../utils/validate.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  auth: any = {};
  fields: any[] = [];
  constructor(private validate:ValidateService,private alert: AlertService, private router: Router) { }

  async ngOnInit() {
    const config = await Parse.Config.get();
    this.fields = config.get('userExtraParams');
  }
  async signup(){
    this.validate.array([
      this.validate.isNotEmpty(this.auth.name),
      this.validate.isNotEmpty(this.auth.email),
      this.validate.isEmail(this.auth.email),
      this.validate.isNotEmpty(this.auth.password),
      this.validate.isOnFields(this.fields,this.auth)
    ],[
      'No a ingresado su nombre',
      'No a ingresado su correo',
      'Correo invalido',
      'No a ingresado su contraseña',
      'Faltan campos por registrar'
    ],async ()=>{
      let user = new Parse.User();
      user.set("username", this.auth.email);
      user.set("password", this.auth.password);
      user.set("email", this.auth.email);
      user.set("name", this.auth.name);
      this.fields.forEach((field:any)=>{
        user.set(field.field,this.auth[field.field]);
      });
      const loading = await this.alert.loading('Registrando');
      try {
        await user.signUp();
        loading.dismiss();
        this.router.navigateByUrl('/');
      } catch (error) {
        loading.dismiss();
        this.alert.simple('Ya existe un usuario con ese mismo correo');
      }
    });
    
  }
}

