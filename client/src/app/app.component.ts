import { Component } from '@angular/core';
import Parse from 'parse';
import {environment} from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    const env = import.meta.env
    Parse.initialize(env.NG_APP_APPID,env.NG_APP_JSKEY);
    Parse.serverURL = env.NG_APP_SERVER;
  }
}
