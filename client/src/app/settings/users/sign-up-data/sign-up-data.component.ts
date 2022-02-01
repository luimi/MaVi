import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
import { ValidateService } from 'src/app/utils/validate.service';
import { AlertService } from 'src/app/utils/alert.service';
import Parse from 'parse';
@Component({
  selector: 'app-sign-up-data',
  templateUrl: './sign-up-data.component.html',
  styleUrls: ['./sign-up-data.component.scss'],
})
export class SignUpDataComponent implements OnInit {
  fields;
  constructor(private modalCtrl: ModalController, private h: ParseHelperService, private validator: ValidateService, private alert: AlertService) { }

  async ngOnInit() {
    const config = await this.h.getConfig();
    this.fields = config.get('userExtraParams');
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
  async save() {
    if (this.validate()) {

      const result = await Parse.Cloud.run("updateParam", { param: 'userExtraParams', data: this.fields });
      if (result) {
        this.alert.simple('Datos de registro guardados');
      }
    } else {
      this.alert.simple('Faltan campos por llenar')
    }
  }
  validate() {
    let status = true;
    this.fields.forEach(element => {
      const isHint = this.validator.isNotEmpty(element.hint);
      const isField = this.validator.isNotEmpty(element.field);
      const isType = this.validator.isNotEmpty(element.type);
      const isRadioSelect = element.type && (element.type === 'radio' || element.type === 'select');
      const isOptions = element.options.length > 0;
      if (isRadioSelect && !isOptions) {
        status = false;
      }
      if (isOptions) {
        element.options.forEach(option => {
          if (!this.validator.isNotEmpty(option)) {
            status = false;
          }
        });
      }

      if (!isHint || !isField || !isType) {
        status = false;
      }
    });
    return status;
  }
}
