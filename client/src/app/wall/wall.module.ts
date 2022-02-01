import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WallPageRoutingModule } from './wall-routing.module';

import { WallPage } from './wall.page';
import { CommentsComponent } from './comments/comments.component';
import { CarrouselComponent } from './carrousel/carrousel.component';
import { NewPostComponent } from './new-post/new-post.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WallPageRoutingModule
  ],
  declarations: [WallPage,CommentsComponent, CarrouselComponent, NewPostComponent]
})
export class WallPageModule {}
