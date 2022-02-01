import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.scss'],
})

export class CarrouselComponent implements OnInit {
  slideOpts = {
    zoom: true
  };
  index;
  images;
  @ViewChild('slider') slider;
  constructor(navParams: NavParams, public modalCtrl:ModalController) {
  }

  ngOnInit() {
    //this.slider.slideTo(this.index,0);
  }
  ionViewDidEnter(){
  }
}
