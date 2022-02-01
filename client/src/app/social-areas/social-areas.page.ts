import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
import { ModalController } from '@ionic/angular';
import { SchedulerComponent } from './scheduler/scheduler.component';
@Component({
  selector: 'app-social-areas',
  templateUrl: './social-areas.page.html',
  styleUrls: ['./social-areas.page.scss'],
})
export class SocialAreasPage implements OnInit {
  areas=[];
  constructor(private modalCtrl: ModalController) { }

  async ngOnInit() {
    this.areas = await new Parse.Query('SocialArea').find();
  }
  async open(area){
    const modal = await this.modalCtrl.create({
      component: SchedulerComponent,
      componentProps:{
        area:area
      }
    });
    await modal.present();
  }
}
