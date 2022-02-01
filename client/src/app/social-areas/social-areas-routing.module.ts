import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocialAreasPage } from './social-areas.page';

const routes: Routes = [
  {
    path: '',
    component: SocialAreasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialAreasPageRoutingModule {}
