import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Parse from 'parse';
import * as moment from 'moment';
import { ParseHelperService } from '../utils/parse-helper.service';
import { NewPostComponent } from './new-post/new-post.component';
import { CommentsComponent } from './comments/comments.component';
import { CarrouselComponent } from './carrousel/carrousel.component';
@Component({
  selector: 'app-wall',
  templateUrl: './wall.page.html',
  styleUrls: ['./wall.page.scss'],
})
export class WallPage implements OnInit {
  posts = [];
  newComments = [];
  comments = {};
  totalPosts;
  currentUser;
  constructor(private modalCtrl:ModalController,private h: ParseHelperService) { }

  async ngOnInit() {
    this.currentUser = Parse.User.current();
    await this.refresh();
    let postQuery = new Parse.Query('WallPostComment');
    let subscription = await postQuery.subscribe();
    subscription.on('create',(comment)=>{
      this.posts.forEach(async (post)=>{
        if(post.id === comment.get('post').id){
          await Parse.Object.fetchAllIfNeeded([comment.get('user')]);
          this.addTo('comments',post.id,comment);
        }
      })
    });
  }
  async newpost(){
    const modal = await this.modalCtrl.create({component: NewPostComponent});
    await modal.present();
    let response = await modal.onDidDismiss();
    if(response.data){
      this.posts.unshift(response.data);
    }
  }
  async sendComment(post,index){
    let comment = this.h.getGeneric('WallPostComment');
    comment.set('text',this.newComments[index]);
    comment.set('post',post);
    comment.set('user',Parse.User.current());
    let acl = await this.h.getACL();
    comment.setACL(acl);
    await comment.save();
    this.newComments[index]='';
  }
  async showComments(post){
    const modal = await this.modalCtrl.create({
      component: CommentsComponent,
      componentProps:{
        comments:this.comments[post.id],
        post:post
      }
    });
    await modal.present();
  }
  async showCarrousel(images,index){
    const modal = await this.modalCtrl.create({
      component: CarrouselComponent,
      componentProps:{
        images:images,
        index:index
      }
    });
    await modal.present();
  }
  async loadData(event?){
    let newPosts = await new Parse.Query(this.h.getWallPost()).skip(this.posts.length).limit(10).include('user').descending('updatedAt').find();
    this.posts = this.posts.concat(newPosts);
    let query = new Parse.Query('WallPostComment').containedIn('post',newPosts).include('user');
    this.getQuery(query,'comments');
    if(event){
      event.target.complete();
      if (this.posts.length === this.totalPosts) {
        event.target.disabled = true;
      }
    }
  }
  async refresh(event?){
    this.posts = [];
    this.comments = {};
    this.totalPosts = await new Parse.Query('Post').count();
    await this.loadData();
    if(event){
      event.target.complete();
    }
  }
  async getQuery(query,objName){
    let array = await query.find();
    array.forEach((item)=>{
      this.addTo(objName,item.get('post').id,item);
    });
  }
  addTo(objName,id,item){
    if(!this[objName][id]){
      this[objName][id] = [];
    }
    this[objName][id].unshift(item);
  }

}
