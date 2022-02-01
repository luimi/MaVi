import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import Parse from 'parse';
import { AlertService } from 'src/app/utils/alert.service';
import { ParseHelperService } from 'src/app/utils/parse-helper.service';
@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit {
  scheduledArea = [];
  area;
  options: any[] = [];
  selectedTime;
  selectedDate;
  currentUser;
  constructor(private navParams: NavParams, public modalCtrl: ModalController,private alert: AlertService, private h: ParseHelperService) {
    this.currentUser = Parse.User.current();
  }

  ngOnInit() {
    
  }
  dateChanged(date){
    this.selectedDate = date;
    this.loadScheduled();
  }
  register(){
    if(this.isScheduled(this.selectedTime)){
      this.alert.simple('Ya este horario esta ocupado');
      return;
    }
    this.alert.confirm('Deseas realizar esta reserva?',async ()=>{
      let loading = await this.alert.loading('Guardando');
      let schedule: any = this.h.getSocialAreaSchedule();
      schedule.set('area',this.area);
      schedule.set('user',Parse.User.current());
      schedule.set('date',this.getDate("12:00"));
      schedule.set('time',this.selectedTime);
      let acl = await this.h.getACL();
      schedule.setACL(acl);
      await schedule.save();
      await this.loadScheduled();
      loading.dismiss();
    });
  }
  async loadScheduled(){
    this.scheduledArea = await new Parse.Query(this.h.getSocialAreaSchedule()).equalTo('area',this.area).greaterThan('date',this.getDate('0:00')).lessThan('date',this.getDate('23:00')).include('user').find();
    this.updateOptions();
  }
  deleteScheduled(schedule){
    this.alert.confirm('Quieres borrar esta reserva?',async ()=>{
      let loading = await this.alert.loading('Borrando...');
      await schedule.destroy();
      await this.loadScheduled();
      loading.dismiss();
    });
  }
  getDate(time){
    return new Date(this.selectedDate + ' ' + time);
  }
  updateOptions(){
    this.options = [];
    this.area.get('schedules').forEach(time => {
      if(!this.isScheduled(time)){
        this.options.push(time);
      }
    });
    this.selectedTime = this.options[0]?this.options[0]:undefined;
  }
  isScheduled(time){
    for(let i = 0 ; i < this.scheduledArea.length; i++){
      if(this.scheduledArea[i].get('time') === time){
        return true;
      }
    }
    return false;
  }
}
