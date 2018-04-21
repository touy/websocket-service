import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <<<< import it here
import { WebsocketDataServiceService } from './websocket-data-service.service';
import { ChatService, Message } from './chat.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})

export class AppComponent implements OnInit, OnDestroy {
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
  private clearJSONValue(u) {
    for (const key in u) {
      if (u.hasOwnProperty(key)) {
        u[key] = '';
      }
    }
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this._newUser = JSON.parse(JSON.stringify(this._client));
    this._newUser.data = {};
    this._newUser.data.user = {};
    this._message = JSON.parse(JSON.stringify(this._client));
    this._currentUserdetail = {};
    this._userDetailsStr = '';
    this._otherMessage = {};
  }
  ngOnDestroy() {
    console.log('STOP SERVICE');
    this.websocketDataServiceService.stopService();
    // this._subs.array.forEach(element => {
    //   element.unsubscribe();
    // });
    // this.websocketDataServiceService.clientSource.unsubscribe();
    // this.websocketDataServiceService.currentUserSource.unsubscribe();
    // this.websocketDataServiceService.eventSource.unsubscribe();
    // this.websocketDataServiceService.newUserSource.unsubscribe();
    // this.websocketDataServiceService.otherSource.unsubscribe();
  }

  showNewMessage() {
    this._client.data.message = 'changed from show message';
    this.websocketDataServiceService.changeMessage(this._client);
  }
  setOtherMessage() {
    const msg = {
      title: '',
      data: {},
      other: {}, // ...
    };
    this.websocketDataServiceService.setOtherMessage(msg);
  }
  ping_test() {
    this.websocketDataServiceService.ping_test();
    this._client.data.message += ' HERE in app component';
    console.log(this._client);
  }

  login() {
    this.websocketDataServiceService.login(this._loginUser);
    this.clearJSONValue(this._loginUser);
  }
  logout() {
    this.websocketDataServiceService.logout();
  }
  getUserDetails() {
    this.websocketDataServiceService.getUserDetails(this._client.data);
  }
  updateUserDetails() {
    this._currentUserdetail = JSON.parse(this._userDetailsStr);
    this.websocketDataServiceService.updateUserDetails(this._currentUserdetail); // should be _userDetails
  }
  get_user_gui() {
    this.websocketDataServiceService.get_user_gui();
  }

  changepassword() {
    this.websocketDataServiceService.changePassword(this._currentUserdetail);
    this.clearJSONValue(this._currentUserdetail);
  }
  register() {
    this.websocketDataServiceService.register(this._newUser);
    this.clearJSONValue(this._newUser);
  }
  getSecret() {
    this.websocketDataServiceService.getSecret(this._newUser);
  }
  checkSecret(event: any) {
    if (this._newUser.data['secret'] !== undefined) {
      if (this._newUser.data['secret'].length === 6) {
        this.websocketDataServiceService.checkSecret(this._newUser);
      }
    }
  }
  checkUsername() {
    this.websocketDataServiceService.checkUsername(this._newUser);
  }
  checkPhoneNumber() {
    this.websocketDataServiceService.checkPhoneNumber(this._newUser);
  }
  getSMSConfirm() {
    if (this._client.logintoken) {
      this.websocketDataServiceService.send_confirm_phone_sms(this._currentUserdetail);
    } else {
      alert('login first');
    }
  }
  checkSMSConfirm($event: any) {
    if (this._client.logintoken) {
      if (this._newUser.data['secret'] !== undefined) {
        if (this._newUser.data['secret'].length === 6) {
          this.websocketDataServiceService.check_confirm_phone_sms(this._newUser);
        }
      }
    } else {
      alert('login first');
    }

  }
  changePhoneNumber() {
    if (this._client.logintoken) {
      if (this._newUser.data['secret'] !== undefined) {
        if (this._newUser.data['secret'].length === 6) {
          this.websocketDataServiceService.update_confirm_phone(this._newUser.data);
        }
      }
    } else {
      alert('login first');
    }
  }
  goTo(com) {
    // console.log(JSON.stringify(this._client));
    if (!this._client.gui || this._client.gui === undefined) {
      this._client = this.websocketDataServiceService.getClient();
    }
    this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
    this.router.navigate([com]).then(res => {
      // this.websocketDataServiceService.stopService();
      // alert(res);
    }).catch(err => {
      // alert(err);
    });
  }

}
