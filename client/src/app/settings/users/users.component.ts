import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Parse from 'parse';
import { AlertService } from 'src/app/utils/alert.service';
import { SignUpDataComponent } from './sign-up-data/sign-up-data.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  tab = 'active';
  searchText;
  users;
  constructor(private modalCtrl: ModalController, private alert: AlertService) { }

  ngOnInit() {
    this.getUsers();
  }
  async getUsers() {
    const query = new Parse.Query(Parse.User);
    query.equalTo('status', this.tab);
    if (this.searchText) {
      query.contains('name', this.searchText);
    }
    this.users = await query.find();
  }
  listChange(evt) {
    this.getUsers();
  }
  search() {
    this.getUsers();
  }
  ban(user) {
    this.updateUser(user,'Quieres bloquear este usuario?','banned');
  }
  accept(user) {
    this.updateUser(user,'Aceptar este usuario?','active');
  }
  unban(user){
    this.updateUser(user,'Quieres desbloquear este usuario?','active');
  }
  updateUser(user, message, status) {
    this.alert.confirm(message, async () => {
      user.set('status', status);
      await user.save();
      this.getUsers();
    });
  }
  async openProfile(user){
    /*const modal  = await this.modalCtrl.create({component:ModalProfileComponent,componentProps:{user}});
    modal.present();*/
  }
  async signUpFields(){
    const modal = await this.modalCtrl.create({component: SignUpDataComponent});
    modal.present();
  }
}
