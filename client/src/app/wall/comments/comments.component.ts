import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
import Parse from 'parse';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() comments = [];
  newComment;
  @Input() post;
  subscription;
  constructor(navParams: NavParams, private helper: ParseHelperService, public modalCtrl: ModalController) {
  }

  async ngOnInit() {
    
  }
  async sendComment() {
    let comment = this.helper.getGeneric('WallPostComment');
    comment.set('text', this.newComment);
    comment.set('post', this.post);
    comment.set('user', Parse.User.current());
    let acl = await this.helper.getACL();
    comment.setACL(acl);
    await comment.save();
    this.newComment = '';
  }
}
