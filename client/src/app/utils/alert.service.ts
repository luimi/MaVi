import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertCtrl:AlertController, private loadingCtrl: LoadingController) { }
  public async simple(message){
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  public async confirm(message,callback){
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Si',
          handler: () => {
            callback();
          }
        }
      ]
    });

    await alert.present();
  }
  public async loading(message){
    const loading = await this.loadingCtrl.create({
      message: message
    });
    await loading.present();
    return loading;
  }
}
