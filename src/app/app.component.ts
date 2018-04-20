import { Component, Inject, OnInit } from '@angular/core';
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

export class AppComponent {
  private _message: Message;
  private _newUser: any;
  private _userDetailsStr: string;
  private _server_event: any = [];
  _client: Message = {
    gui: '',
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  _loginUser = { usrname: '', password: '' };
  private _currentUserdetail: any;
  constructor(private websocketDataServiceService: WebsocketDataServiceService) {

  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.websocketDataServiceService.messageSource.subscribe(message => {
      this._client = message;
    });
    this.websocketDataServiceService.eventSource.subscribe(events => {
      this._server_event = events;
    });
    this.websocketDataServiceService.currentUserSource.subscribe(user => {
      this._currentUserdetail = user;
      this._userDetailsStr = JSON.stringify(this._currentUserdetail);
    });
    this._newUser = JSON.parse(JSON.stringify(this._client));
    this._message = JSON.parse(JSON.stringify(this._client));
    this._currentUserdetail = {};
  }
  showNewMessage() {
    this._client.data.message = 'changed from show message';
    this.websocketDataServiceService.changeMessage(this._client);
  }
  ping_test() {
    this.websocketDataServiceService.ping_test();
    this._client.data.message += ' HERE in app component';
    console.log(this._client);
  }
  private clearJSONValue(u) {
    for (const key in u) {
      if (u.hasOwnProperty(key)) {
        u[key] = '';
      }
    }
  }
  login() {
    this.websocketDataServiceService.login(this._loginUser);
    this.clearJSONValue(this._loginUser);
  }
  logout() {
    this.websocketDataServiceService.logout();
  }
  getUserDetails() {
    this.websocketDataServiceService.getUserDetails(this._client);
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


}
