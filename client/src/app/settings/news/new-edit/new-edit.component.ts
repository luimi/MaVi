import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
import { AlertService } from 'src/app/utils/alert.service';
import Parse from 'parse';

@Component({
  selector: 'app-new-edit',
  templateUrl: './new-edit.component.html',
  styleUrls: ['./new-edit.component.scss'],
})
export class NewEditComponent implements OnInit {
  private newsPost: any = {};
  private post;
  protected config = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'header': [1, 2, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['emoji'],
      ],
    }
  }
  constructor(private modalCtrl: ModalController, private helper: ParseHelperService, private alert: AlertService, private navParams: NavParams) { }

  ngOnInit() {
    if (this.navParams.get('post')) {
      this.post = this.navParams.get('post');
      this.newsPost.title = this.post.get('title');
      this.newsPost.content = this.post.get('content');
      if (this.post.get('mainPicture')) {
        this.newsPost.mainPicture = this.post.get('mainPicture');
      }
    }
  }
  async save() {
    const loading = await this.alert.loading("Publicando");
    let post;
    const isNewPost = this.post === undefined;
    if (!isNewPost) {
      post = this.post;
      post.set('editedBy',Parse.User.current());
    } else {
      post = this.helper.getGeneric('NewsPost');
      post.setACL(await this.helper.getACL());
      post.set('author',Parse.User.current());
    }
    post.set('title', this.newsPost.title);
    post.set('content', this.newsPost.content);
    if ((isNewPost && this.newsPost.mainPicture) || (!isNewPost && this.newsPost.mainPicture && this.post.get('mainPicture') !== this.newsPost.mainPicture)) {
      post.set('mainPicture', this.newsPost.mainPicture );
    } else if (!isNewPost && !this.newsPost.mainPicture) {
      post.unset('mainPicture');
    }
    await post.save();
    loading.dismiss();
    this.newsPost = {};
    this.modalCtrl.dismiss(true);
  }
  loadMainPicture(result) {
    let files = result.target.files;
    Array.from(files).forEach((file: any) => {
      if (file.type.includes('image')) {
        let reader = new FileReader();
        reader.addEventListener("load", async () => {
          let response = await Parse.Cloud.run("uploadImage", {image: reader.result});
          if(response.success){
            this.newsPost.mainPicture = response.url;
          }
        }, false);
        reader.readAsDataURL(file);
      }
    });
  }
  removeMainPicture() {
    this.alert.confirm('Quieres quitar esta imagen?', () => {
      delete this.newsPost.mainPicture;
    });

  }
}
