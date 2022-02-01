import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
import Parse from 'parse';
import { ValidateService } from 'src/app/utils/validate.service';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  messages = [];
  title="";
  chat;
  users;
  newMessage;
  opposite;
  avatar;
  subscription;
  constructor(private navParam: NavParams,public modalCtrl: ModalController, private helper:ParseHelperService, private validate: ValidateService) { }

  async ngOnInit() { 
    if(this.chat){
      let messagesQuery = new Parse.Query('ChatMessage').limit(10).equalTo('chat',this.chat).descending('createdAt')
      this.messages = await messagesQuery.find();
      this.subscription = await messagesQuery.subscribe();
      this.subscription.on('create', (message)=>{
        this.messages.unshift(message);
        message.relation('seenBy').add(Parse.User.current());
        message.save();
      });
    }
  }
  ionViewWillLeave(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
  dismiss(){
    this.modalCtrl.dismiss();
  }
  async send(){
    if(this.validate.isNotEmpty(this.newMessage)){
      let acl = await this.createPrivateACL();
      if(!this.chat){
        this.chat = await this.createChat(acl);
        await this.ngOnInit();
      }
      let message = this.helper.getGeneric('ChatMessage');
      message.set('from',Parse.User.current());
      message.set('text',this.newMessage);
      message.set('chat',this.chat);
      message.setACL(acl);
      await message.save();
      this.chat.set('lastMessage',this.newMessage);
      await this.chat.save();
      this.newMessage = undefined;
    }
  }
  async createChat(acl){
    let chat = this.helper.getGeneric('Chat');
    chat.set('name', 'common chat');
    chat.set('users',[Parse.User.current(),this.users[0]]);
    chat.setACL(acl);
    let chatObj = await chat.save();
    return chatObj;
    
  }
  async createPrivateACL(){
    let acl = await this.helper.getPrivateACL();
    this.users.forEach(user => {
      acl.setWriteAccess(user,true);
      acl.setReadAccess(user,true);
    });
    return acl;
  }

}
