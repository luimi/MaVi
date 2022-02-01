import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  users = [];
  filter = [];
  constructor(public modalCtrl: ModalController) { }

  async ngOnInit() {
    this.users = await new Parse.Query('_User').ascending('name').notEqualTo('objectId',Parse.User.current().id).find();
    this.filter = this.users;
  }
  select(user){
    this.modalCtrl.dismiss(user);
  }
  search(event){
    let temp = [];
    this.users.forEach((user)=>{
      if(user.get('name').toLowerCase().includes(event.detail.srcElement.value.toLowerCase())){
        temp.push(user);
      }
    });
    this.filter = temp;
  }
}
