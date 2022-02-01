import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import Parse from 'parse';
import { ParseHelperService } from '../utils/parse-helper.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{
  modules = [];
  constructor(private router:Router, private actionSheetCtrl: ActionSheetController, private helper: ParseHelperService) {}

  async ngOnInit() {
    const config = await Parse.Config.get();
    this.modules = config.get('modules').filter(module => module.status);
    this.modules.push({ "tab": "profile", "icon": "person", "title": "Perfil", "status": true });
    if(await this.helper.isAdmin()){
      this.modules.push({ "tab": "settings", "icon": "cog", "title": "Ajustes", "status": true });
    }
    this.router.navigateByUrl('/tabs/'+this.modules[0].tab);
  }
  async more() {
    const buttons = [];
    for (let i = 4; i < this.modules.length; i++) {
      const module = this.modules[i];
      buttons.push({
        text: module.title,
        icon: module.icon,
        handler: ()=> this.router.navigateByUrl('/tabs/'+module.tab)
      });
    }
    buttons.push({ text: 'Cancelar', icon: 'close', role: 'cancel' });
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Más',
      buttons: buttons
    });
    await actionSheet.present();
  }
}
