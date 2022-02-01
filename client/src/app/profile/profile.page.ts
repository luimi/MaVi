import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
import { Router } from '@angular/router';
//import { OneSignalService } from '../utils/one-signal.service';
import { ParseHelperService } from '../utils/parse-helper.service';
import { AlertService } from '../utils/alert.service';
import { UtilsService } from '../utils/utils.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  protected user;
  protected fields;
  protected data = {};
  constructor(private router:Router, private h:ParseHelperService,private alert: AlertService, private utils: UtilsService) { 
    
  }
  ionViewDidEnter(){
    
  }
  async ngOnInit() {
    this.user = Parse.User.current();
    const config = await this.h.getConfig();
    this.fields = config.get('userExtraParams');
    this.fields.forEach((field)=>{
      this.data[field.field] = this.user.get(field.field);
    });
  }
  async save(){
    const loading = await this.alert.loading('Guardando');
    this.fields.forEach((field)=>{
      if(field.editable){
        this.user.set(field.field,this.data[field.field]);
      }
    });
    await this.user.save();
    loading.dismiss();
  }
  async load(result){
    let image = await this.utils.loadPicture(result);
    let response = await Parse.Cloud.run("uploadImage", {image: image});
    if(response.success){
      this.user.set('avatar', response.url);
      this.user.save();
    }
    
  }
  logOut(){
    Parse.User.logOut().then(() => {
      this.h.clearIsAdmin();
      this.router.navigateByUrl('login',{replaceUrl: true});
    });
  }
}
