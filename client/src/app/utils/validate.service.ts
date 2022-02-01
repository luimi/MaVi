import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(private alert: AlertService) { }
  public notEmpty(values:any[],messages:string[],callback){
    let result = true;
    for(let i = 0 ; i < values.length ; i++){
      if(!values[i] || values[i].trim()===''){
        result = false;
        this.alert.simple(messages[i]);
        break;
      }
    }
    if(result){
      callback();
    }
  }
  public array(values:any[],messages:string[],callback){
    let result = true;
    for(let i = 0 ; i < values.length ; i++){
      if(!values[i]){
        result = false;
        this.alert.simple(messages[i]);
        break;
      }
    }
    if(result){
      callback();
    }
  }
  public isEmail(text){
    let email = /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/;
    return email.test(text);
  }
  public isNotEmpty(text){
    return text && text.trim()!=='';
  }
  public isOnFields(fields,data){
    let status = true;
    fields.forEach(field => {
      if(field.required && !this.isNotEmpty(data[field.field])){
        status = false;
      }
    });
    return status;
  }
}
