import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public loadPicture(result) {
    return new Promise((resolve, reject) => {
      let files = result.target.files;
      Array.from(files).forEach((file: any) => {
        if (file.type.includes('image')) {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            resolve(reader.result);
          }, false);
          reader.readAsDataURL(file);
        }
      });
    });
  }
}
