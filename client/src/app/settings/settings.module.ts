import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { GeneralComponent } from './general/general.component';
import { NewsComponent } from './news/news.component';
import { SocialAreaComponent } from './social-area/social-area.component';
import { UsersComponent } from './users/users.component';
import { NewEditComponent } from './news/new-edit/new-edit.component';
import { NewEditSocialAreaComponent } from './social-area/new-edit-social-area/new-edit-social-area.component';
import { SignUpDataComponent } from './users/sign-up-data/sign-up-data.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    QuillModule.forRoot()
  ],
  declarations: [SettingsPage, GeneralComponent, NewsComponent, SocialAreaComponent, UsersComponent, NewEditComponent, NewEditSocialAreaComponent, SignUpDataComponent]
})
export class SettingsPageModule {}
