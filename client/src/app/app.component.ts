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
    Parse.initialize(environment.appId, environment.jsId);
    Parse.serverURL = environment.server;
  }
}
