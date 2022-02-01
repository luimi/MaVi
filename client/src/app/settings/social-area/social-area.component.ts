import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
import { ModalController } from '@ionic/angular';
import { NewEditSocialAreaComponent } from './new-edit-social-area/new-edit-social-area.component';
import { AlertService } from 'src/app/utils/alert.service';
@Component({
  selector: 'app-social-area',
  templateUrl: './social-area.component.html',
  styleUrls: ['./social-area.component.scss'],
})
export class SocialAreaComponent implements OnInit {
  areas;
  searchText;
  constructor(private modalCtrl: ModalController,private alert: AlertService) { }

  ngOnInit() {
    this.getAreas();
  }
  search(){
    this.getAreas();
  }
  async getAreas(){
    const query = await new Parse.Query('SocialArea');
    query.ascending('name');
    if(this.searchText){
      query.contains('name',this.searchText);
    }
    this.areas = await query.find();
  }
  async new(){
    const modal = await this.modalCtrl.create({component:NewEditSocialAreaComponent});
    this.waitForModal(modal);
  }
  async edit(area){
    const modal = await this.modalCtrl.create({component:NewEditSocialAreaComponent,componentProps:{area}});
    this.waitForModal(modal);
  }
  async delete(area){
    this.alert.confirm('Quieres eliminar esta area?',async ()=>{
      await area.destroy();
      this.getAreas();
    });
  }
  async waitForModal(modal){
    await modal.present();
    const resp = await modal.onDidDismiss();
    if(resp.data){
      this.getAreas();
    }
  }
}
