import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SocialAreasPageRoutingModule } from './social-areas-routing.module';

import { SocialAreasPage } from './social-areas.page';
import { CalendarComponent } from './calendar/calendar.component';
import { SchedulerComponent } from './scheduler/scheduler.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SocialAreasPageRoutingModule
  ],
  declarations: [SocialAreasPage, CalendarComponent, SchedulerComponent]
})
export class SocialAreasPageModule {}
