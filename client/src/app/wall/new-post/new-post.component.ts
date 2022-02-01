import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/utils/validate.service';
import { AlertService } from 'src/app/utils/alert.service';
import Parse from 'parse';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent implements OnInit {
  imagesToUpload = [];
  comment: string;
  currentUser;
  constructor(private validate: ValidateService, private alert: AlertService, private helper:ParseHelperService, private modalCtrl: ModalController) { 
    this.currentUser = Parse.User.current();
  }

  ngOnInit() {}
  load(result){
    let files = result.target.files;
    Array.from(files).forEach((file:any) => {
      if(file.type.includes('image')){
        let reader  = new FileReader();
        reader.addEventListener("load", () => {
          this.imagesToUpload.push(reader.result);
        }, false);
        reader.readAsDataURL(file);
      }
    });
  }
  async publish(){
    let isComment = this.validate.isNotEmpty(this.comment);
    if(isComment || this.imagesToUpload.length>0){
      let post = this.helper.getGeneric('WallPost');
      if(isComment)
        post.set('comment',this.comment);
      post.set('user', Parse.User.current());
      let admin = await this.helper.getACL();
      post.set('replies',0);
      post.setACL(admin);
      post.set('images', []);
      const loading = await this.alert.loading('Guardando');
      if(this.imagesToUpload.length>0){
        // todo metodo para guardar imagenes en parse
        let images = [];
        for (let i = 0 ; i < this.imagesToUpload.length ; i++) {
          let response = await Parse.Cloud.run("uploadImage", {image: this.imagesToUpload[i]});
          if(response.success){
            images.push(response.url);
          }
        }
        post.set('images', images);
      }
      
      const postObject = await post.save();
      loading.dismiss();
      this.modalCtrl.dismiss(postObject);
    }else{
      this.alert.simple('Debes agregar algun comentario o subir alguna imagen para poder publicar');
    }
  }
  cancel(){
    this.modalCtrl.dismiss();
  }
  remove(index){
    this.alert.confirm('Quieres quitar esta foto?',()=>{
      this.imagesToUpload.splice(index,1);
    });
  }
}
