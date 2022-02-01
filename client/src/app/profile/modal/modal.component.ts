import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.scss'],
})
export class ModalProfileComponent implements OnInit {
  user;
  fields;
  constructor(private h: ParseHelperService,private navParams:NavParams, private modalCtrl:ModalController) { }

  async ngOnInit() {
    this.user = this.navParams.get('user');
    const config = await this.h.getConfig();
    this.fields = config.get('userExtraParams');
    /* this.fields.forEach((field)=>{
      this.data[field.field] = this.user.get(field.field);
    }); */
  }
  

}
