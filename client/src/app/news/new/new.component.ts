import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
import Parse from 'parse';
import { AlertService } from 'src/app/utils/alert.service';
@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  private newsPost:any ={};
  protected config = {
    toolbar:{
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote','code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'header': [1, 2, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['emoji'], 
      ],
    }
  }
  constructor(private modalCtrl: ModalController, private helper: ParseHelperService,private alert: AlertService) { }

  ngOnInit() {}
  async save(){
    const loading = await this.alert.loading("Publicando");
    const post = this.helper.getGeneric('NewsPost');
    post.set('title',this.newsPost.title);
    post.set('content',this.newsPost.content);
    if(this.newsPost.mainPicture){
      post.set('mainPicture',new Parse.File(Date.now()+'.image', { base64: this.newsPost.mainPicture}));
    }
    await post.save();
    loading.dismiss();
    this.newsPost = {};
    this.modalCtrl.dismiss(true);
  }
  loadMainPicture(result){
    let files = result.target.files;
    Array.from(files).forEach((file:any) => {
      if(file.type.includes('image')){
        let reader  = new FileReader();
        reader.addEventListener("load", () => {
          this.newsPost.mainPicture = reader.result;
        }, false);
        reader.readAsDataURL(file);
      }
    });
  }
  removeMainPicture(){
    this.alert.confirm('Quieres quitar esta imagen?',()=>{
      delete this.newsPost.mainPicture;
    });
    
  }
}
