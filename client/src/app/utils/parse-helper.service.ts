import { Injectable } from '@angular/core';
import Parse from 'parse';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ParseHelperService {

  private adminRole;
  private imAdmin;
  private config;
  constructor() { 
    moment.updateLocale('en', {
      relativeTime : {
          future: "en %s",
          past:   "Hace %s",
          s  : 'algunos segundos',
          ss : '%d segundos',
          m:  "un minuto",
          mm: "%d minutos",
          h:  "una hora",
          hh: "%d horas",
          d:  "un dia",
          dd: "%d dias",
          M:  "un mes",
          MM: "%d meses",
          y:  "un año",
          yy: "%d años"
        }
      });
      Parse.Object.registerSubclass('WallPost', WallPost);
      Parse.Object.registerSubclass('NewsPost', NewsPost);
      Parse.Object.registerSubclass('SocialAreaSchedule',SocialAreaSchedule);
  }
  public async getACL(){
    let acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setWriteAccess(Parse.User.current(),true);
    let admin = await this.getAdminRole();
    acl.setWriteAccess(admin,true);
    return(acl);
  }
  public async getPrivateACL(){
    let acl = new Parse.ACL();
    acl.setPublicReadAccess(false);
    acl.setReadAccess(Parse.User.current(),true);
    acl.setWriteAccess(Parse.User.current(),true);
    return(acl);
  }
  public getGeneric(name){
    let Generic = Parse.Object.extend(name);
    let generic = new Generic();
    return generic;
  }
  public getWallPost(){
    return new WallPost();
  }
  public getNewsPost(){
    return new NewsPost();
  }
  public getSocialAreaSchedule(){
    return new SocialAreaSchedule();
  }
  private async getAdminRole(){
    if(!this.adminRole){
      this.adminRole = await new Parse.Query(Parse.Role).equalTo('name','Admin').include('users').first();
    }
    return this.adminRole;
  }

  public async isAdmin(){
    if(!this.imAdmin){
      this.imAdmin = await new Parse.Query(Parse.Role).equalTo('name','Admin')
      .equalTo('users',Parse.User.current()).first();
    }
    return this.imAdmin;
  }
  public async clearIsAdmin(){
    delete this.imAdmin;
  }
  public async getConfig(){
    if(!this.config){
      this.config = await Parse.Config.get();
    }
    return this.config;
  }
  
}
class GenericObject extends Parse.Object{
  dateFromNow;
  time;
  constructor(name){
    super(name);
  }
  public getDateFromNow(field){
    if(!this.dateFromNow){
      this.dateFromNow = moment(super.get(field)).fromNow();
    }
    return this.dateFromNow;
  }
  public getTimeFrom(field){
    if(!this.time){
      this.time = moment(super.get(field)).format('HH:mm');
    }
    return this.time;
  }
  public get(name){
    return super.get(name);
  }
}
class WallPost extends GenericObject{
  constructor(){
    super('WallPost');
  }
}
class NewsPost extends GenericObject{
  constructor(){
    super('NewsPost');
  }
}
class SocialAreaSchedule extends GenericObject{
  constructor(){
    super('SocialAreaSchedule');
  }
  public getUserAvatarUrl(){
    if(super.get('user') && super.get('user').get('avatar')){
      return super.get('user').get('avatar');
    }
    return 'assets/user.png';
  }
}
