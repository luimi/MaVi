import { Component, OnInit } from '@angular/core';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
import { ModalController } from '@ionic/angular';
import Parse from 'parse';
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  modules;
  constructor(private helper: ParseHelperService, private modalCtrl: ModalController) { }

  async ngOnInit() {
    const config = await this.helper.getConfig();
    this.modules = config.get('modules');
  }
  async save(){
    await Parse.Cloud.run("updateParam", {param:'modules',data:this.modules});
  }

}
