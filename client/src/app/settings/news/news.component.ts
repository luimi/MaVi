import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Parse from 'parse';
import { NewEditComponent } from './new-edit/new-edit.component';
import { AlertService } from 'src/app/utils/alert.service';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  news;
  searchText;
  constructor(private modalCtrl: ModalController, private alert: AlertService) { }

  ngOnInit() {
    this.getPosts();
  }
  async getPosts() {
    const query = new Parse.Query('NewsPost');
    query.descending('createdAt');
    if (this.searchText) {
      query.contains('title', this.searchText);
    }
    this.news = await query.find();
  }
  search() {
    this.getPosts();
  }
  async new() {
    const modal = await this.modalCtrl.create({ component: NewEditComponent });
    this.waitForModal(modal);
  }
  async edit(post) {
    const modal = await this.modalCtrl.create({ component: NewEditComponent, componentProps: { post } });
    this.waitForModal(modal);
  }
  async delete(post) {
    this.alert.confirm('Quieres borrar esta publicacion?', async () => {
      await post.destroy();
      this.getPosts();
    });
  }
  async waitForModal(modal){
    await modal.present();
    const resp = await modal.onDidDismiss();
    if(resp.data){
      this.getPosts();
    }
  }
}
