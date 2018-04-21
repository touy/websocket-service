import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WebsocketDataServiceService } from '../websocket-data-service.service';
import { ChatService, Message } from '../chat.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-comp1',
  templateUrl: './comp1.component.html',
  styleUrls: ['./comp1.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})
export class Comp1Component implements OnInit, OnDestroy {
  private _message: Message;
  private _newUser: any = {};
  private _userDetailsStr = '';
  private _server_event: any = [];
  private _client: Message = {
    gui: '',
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  private _otherSource: any = {};
  private _loginUser = { usrname: '', password: '' };
  private _currentUserdetail: any = {};
  private _otherMessage: any = {};
  private _subs: any = [];

  constructor(private websocketDataServiceService: WebsocketDataServiceService, private router: Router) {
    sessionStorage.setItem('firstHandShake', '');
    sessionStorage.setItem('firstHeartBeat', '');
    this._subs.push(this.websocketDataServiceService.clientSource.subscribe(client => {
      this._client = client;
      if (this._client.data['user'] !== undefined) {
        /// alert('client update ' + this._client.data.user['message']);
      }
    }));
    this._subs.push(this.websocketDataServiceService.newUserSource.subscribe(client => {
      this._newUser = client;
      if (this._newUser !== undefined) {
        alert('new user update ' + this._newUser.data.user['message']);
      }
    }));
    this._subs.push(this.websocketDataServiceService.eventSource.subscribe(events => {
      this._server_event = events;
    }));
    this._subs.push(this.websocketDataServiceService.currentUserSource.subscribe(user => {
      this._currentUserdetail = user;
      this._userDetailsStr = JSON.stringify(this._currentUserdetail);
    }));

    this._subs.push(this.websocketDataServiceService.otherSource.subscribe(msg => {
      this._otherMessage = msg;
    }));
  }

  ngOnInit() {
    this._client = this.websocketDataServiceService.getClient();
    alert('client comp1 is : ' + JSON.stringify(this._client));
    // setTimeout(() => {
    //   this.websocketDataServiceService.stopService();
    // }, 1000*3);
  }
  ngOnDestroy() {
    // this.websocketDataServiceService.stopService();
    // this.websocketDataServiceService.stopService();
    // this.websocketDataServiceService.clientSource.unsubscribe();
    // this.websocketDataServiceService.currentUserSource.unsubscribe();
    // this.websocketDataServiceService.eventSource.unsubscribe();
    // this.websocketDataServiceService.newUserSource.unsubscribe();
    // this.websocketDataServiceService.otherSource.unsubscribe();
  }

}
