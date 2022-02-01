import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
import { ParseHelperService } from '../utils/parse-helper.service';
import { ModalController } from '@ionic/angular';
import { NewComponent } from './new/new.component';
@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  posts = [];
  isAdmin = false;
  constructor(private h: ParseHelperService, private modalCtrl:ModalController) { }

  async ngOnInit() {
    this.getNews();
    this.isAdmin = await this.h.isAdmin();
  }
  async new(){
    let modal = await this.modalCtrl.create({component: NewComponent});
    await modal.present();
    const resp = await modal.onDidDismiss();
    if(resp.data){
      this.getNews();
    }
    
  }
  async getNews(){
    this.posts = await new Parse.Query(this.h.getNewsPost()).descending('createdAt').find();
  }
}
