import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchComponent } from './search/search.component';
import { MessagesComponent } from './messages/messages.component';
import Parse from 'parse';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chats = [];
  currentOpen;
  constructor(private modalCtrl: ModalController) {
  }

  async ngOnInit() {
    const user = Parse.User.current();
    this.chats=[];
    // CHAT Obtener todos chats activos del usuario, Q:1
    let chatQuery =  new Parse.Query('Chat').ascending('updatedAt').include('users');
    let chats = await chatQuery.find();
    // TODO, podria mejorar usando una clase
    chats.forEach(async (chat)=>{
      this.process(chat);
    });
    // CHAT Subscribirse a los eventos de los chats del usuario
    let chatSub = await chatQuery.subscribe();
    chatSub.on('create', (chat) => {
      this.process(chat);
    });
    chatSub.on('update', (chat) => {
      this.sortChats();
    });
    // CHAT Contar por individual los mensajes no leidos por chat, Q:1
    let newMessages = {};
    let messagesQuery = new Parse.Query('ChatMessage').notEqualTo('seenBy',user).notEqualTo('from',user).select('chat');
    let messages = await messagesQuery.find();
    messages.forEach((message)=>{
      let id = message.get('chat').id;
      if(!newMessages[id]){
        newMessages[id] = [];
      }
      newMessages[id].push(message);
    });
    this.chats.forEach((chat)=>{
      if(newMessages[chat.chat.id]){
        chat.newMessages=newMessages[chat.chat.id];
      }
    });
    // CHAT Subscribirse a los mensajes que lleguen
    let messageSub = await messagesQuery.subscribe();
    messageSub.on('create',(message)=>{
      if(message.get('chat').id!==this.currentOpen){
        this.chats.forEach((chat)=>{
          if(chat.chat.id === message.get('chat').id){
            if(!chat.newMessages){
              chat.newMessages = [];
            }
            chat.newMessages.push(message);
          }
        });
      }
    });
  }
  async newChat(){
    // CHAT, Seleccionar de la lista de usuarios
    let modal = await this.modalCtrl.create({component: SearchComponent});
    await modal.present();
    let response = await modal.onDidDismiss();
    if(response.data){
      // CHAT, Buscar si ya hay un chat abierto con ese usuario
      let chatFound = false;
      for(let i = 0; i < this.chats.length; i++){
        let users = this.chats[i].chat.get('users');
        if(users.length === 2 && (users[0].id === response.data.id || users[1].id === response.data.id)){
          chatFound = true;
          this.openChat(this.chats[i]);
          break;
        }
      }
      // CHAT Abrir un nuevo chat
      if(!chatFound){
        let oppositeUser = response.data;
        this.openChat({
          users:[oppositeUser],
          title:oppositeUser.get('name'),
          avatar:oppositeUser.get('avatar')?oppositeUser.get('avatar'):'assets/user.png'
        });
      }
    }
  }
  async openChat(params){
    // CHAT, registro de mensajes vistos, Q:1
    if(params.newMessages && params.newMessages.length>0){
      params.newMessages.forEach((message)=>{
        message.relation('seenBy').add(Parse.User.current());
      });
      await Parse.Object.saveAll(params.newMessages);
      params.newMessages = [];
    }
    // CHAT, abrir el modal
    if(params.chat){
      this.currentOpen = params.chat.id;
    }
    let modal = await this.modalCtrl.create({
      component: MessagesComponent,
      componentProps: params
    });
    await modal.present();
    await modal.onDidDismiss();
    this.currentOpen = undefined;
  }
  async process(chat){
    let users = await Parse.Object.fetchAllIfNeeded(chat.get('users'));
    let isGroup = users.length>2;
    let title ;
    let image;
    if(isGroup){
      title = chat.get('name');
      image = 'assets/user.png';
    } else {
      let oppositeUser = users[0].id === Parse.User.current().id?users[1]:users[0];
      title = oppositeUser.get('name');
      image = oppositeUser.get('avatar')?oppositeUser.get('avatar'):'assets/user.png';
    }
    this.chats.unshift({
      lastMessage:chat.get('lastMessage'),
      title:title,
      avatar:image,
      chat:chat,
      users:users
    });
  }
  sortChats(){
    this.chats.sort((a,b) => {
      console.log('a',a.chat.get('updatedAt'),new Date(a.chat.get('updatedAt')).getTime(),'b',b.chat.get('updatedAt'),new Date(b.chat.get('updatedAt')).getTime());
      return new Date(a.chat.get('updatedAt')).getTime()<new Date(b.chat.get('updatedAt')).getTime()?1:-1;
    });
  }
}
