import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
import { AlertService } from 'src/app/utils/alert.service';
import Parse from 'parse';
import { UtilsService } from 'src/app/utils/utils.service';

@Component({
  selector: 'app-new-edit-social-area',
  templateUrl: './new-edit-social-area.component.html',
  styleUrls: ['./new-edit-social-area.component.scss'],
})
export class NewEditSocialAreaComponent implements OnInit {
  newSocialArea:any = {schedules:[]};
  socialArea;
  constructor(private modalCtrl: ModalController,private utils: UtilsService, private helper: ParseHelperService, private alert: AlertService, private navParams: NavParams) { }

  ngOnInit() {
    if (this.navParams.get('area')) {
      this.socialArea = this.navParams.get('area');
      this.newSocialArea.name = this.socialArea.get('name');
      this.newSocialArea.schedules = this.socialArea.get('schedules');
      this.newSocialArea.image = this.socialArea.get('image');
    }
  }
  async loadImage(result){
    let image =  await this.utils.loadPicture(result);
    let response = await Parse.Cloud.run("uploadImage", {image: image});
    if(response.success){
      this.newSocialArea.image = response.url;
    }
    
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
  async save(){
    const loading = await this.alert.loading('Guardando');
    const isNew = this.socialArea === undefined;
    let socialArea;
    if(isNew){
      socialArea = this.helper.getGeneric('SocialArea');
    }else{
      socialArea = this.socialArea;
    }
    socialArea.set('name',this.newSocialArea.name);
    if (isNew || (!isNew && this.socialArea.get('image') !== this.newSocialArea.image)) {
      socialArea.set('image', this.newSocialArea.image );
    }
    socialArea.set('schedules',this.newSocialArea.schedules);
    socialArea.setACL(await this.helper.getACL());
    await socialArea.save();
    loading.dismiss();
    this.modalCtrl.dismiss(true);
  }
}
