import { Component, OnInit } from '@angular/core';
import { GeneralComponent } from './general/general.component';
import { UsersComponent } from './users/users.component';
import { SocialAreaComponent } from './social-area/social-area.component';
import { ModalController } from '@ionic/angular';
import { NewsComponent } from './news/news.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  pages = [
    {title:'General',component:GeneralComponent},
    {title:'Noticias',component:NewsComponent},
    {title:'Usuarios',component:UsersComponent},
    {title:'Areas Sociales',component:SocialAreaComponent},
  ];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  async open(page){
    const modal = await this.modalCtrl.create({component: page.component});
    modal.present();
  }
}
