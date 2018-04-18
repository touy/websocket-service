import { Component, Inject, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';  // <<<< import it here
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebsocketService, ChatService]
})

export class AppComponent {
  _title = 'Websocket test';
  _url: string;
  _currentUserdetail = '';
  _client = {
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  _server_event: any = [];
  heartbeat_interval = setInterval(() => {
    console.log('heartbeat');
    this._client.data = {};
    this._client.data['user'] = {};
    this._client.data['command'] = 'heart-beat';
    this.sendMsg();
  }, 1000 * 30);
  private message = this._client;
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // if (!this._client.data['user'] || this._client.data['user'] === undefined) {
    //   this._client.data['user'] = {};
    // }

  }
  constructor(private chatService: ChatService) {
    // console.log(this._url);
    // if (this._client.data['user']===undefined) {
    //   this._client.data['user'] = {};
    // }
    chatService.messages.subscribe(msg => {
      const d = msg;
      // alert(d);
      if (d !== undefined) {
        if (d['command'] !== undefined) {
          console.log('changed from server');
          switch (d['command']) {
            case 'notification-changed':
              this._server_event.push(d);
              // console.log(this._client.data['message']);
              if (d['client']['data']['sms'] !== undefined) {
                console.log('SMS');
                console.log(d['client']['data']['res'].resultDesc);
                console.log(d['client']['data']['res'].msisdn);
              }
              if (d['client']['data']['topup'] !== undefined) {
                console.log('topup');
                console.log(d['client']['data']['res'].resultDesc);
                console.log(d['client']['data']['res'].msisdn);
              }
              if (d['client']['data']['checkbalance'] !== undefined) {
                console.log('check balance');
                console.log(d['client']['data']['res'].resultDesc);
                console.log(d['client']['data']['res'].msisdn);

              }
              break;
            case 'error-changed':
              console.log(d['client']['data']['message']);
              break;
            case 'login-changed':
              console.log(d['client']['logintoken'] + '   -   ' + d['client']['logintime']);
              break;
            case 'message-changed':
              console.log(d['client']['data']['message']);
              break;
            case 'usergui-changed':
              console.log(d['gui']);
              break;
            default:
              break;
          }
          console.log(msg);
        } else {
          this._client = msg;
          console.log('return from server');
          switch (this._client.data['command']) {
            case 'ping':
              console.log('ping');
              alert(this._client.data['message']);
              break;
            case 'login':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                console.log('LOGIN OK');
              }
              break;
            case 'get-client':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                console.log('get-client OK');
              }
              break;
            case 'shake-hands':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                console.log('shake hands ok');
              }
              break;
            case 'logout':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                console.log('LOGOUT OK');
              }
              break;
            case 'get-profile':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                console.log(this._client.data['user']);
                this._currentUserdetail = JSON.stringify(this._client.data['user']);
              }
              break;
            case 'change-password':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                alert('change password OK');
              }
              break;
            case 'check-forgot':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                alert(this._client.data['message']);
              }
              break;
            case 'submit-forgot':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                alert(this._client.data['message']);
              }
              break;
            case 'get-user-gui':
              console.log('here get user gui ');
              console.log(this._client);
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                alert(this._client.data['user'].gui);
              }
              break;
            case 'check-phonenumber':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                alert(this._client.data['user'].gui);
              }
              break;
            case 'check-username':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                alert(this._client.data['user'].gui);
              }
              break;
            default:
              break;
          }
          console.log(this._client);
          // if (evt.data != '.') $('#output').append('<p>'+evt.data+'</p>');
        }
      } else {
        alert('data empty');
      }
      // console.log('current client');
    });
  }

  sendMsg() {
    // this.message.data['command'] = 'ping';
    this.message = JSON.parse(JSON.stringify(this._client));
    console.log('new message from client to websocket: ', JSON.stringify(this.message));
    if (this.message['gui'] || this.message.data['command'] === 'shake-hands' || this.message.data['command'] === 'ping') {
      this.chatService.messages.next(this.message);
    }
  }
  ping_test() {
    // this._client.data = {};
    // this._client.data['user'] = {};
    console.log('test ping');
    this._client.data['user'] = {};
    this._client.data['command'] = 'ping';
    this.sendMsg();
  }
  get_user_gui() {
    this._client.data = {};
    this._client.data['user'] = {};
    this._client.data['command'] = 'get-user-gui';
    if (this._client.logintoken) {
      this.sendMsg();
    } else { return alert('login first'); }
  }
  shakeHands() {
    this._client.data = {};
    this._client.data['user'] = {};
    this._client.data['command'] = 'shake-hands';
    this.sendMsg();
    // alert('shake handds');
  }
  getClient() {
    this._client.data = {};
    this._client.data['user'] = {};
    this._client.data['command'] = 'get-client';
    this.sendMsg();
  }





  login() {
    // this._client.data = {};
    // this._client.data['user'] = {};
    this._client.data['command'] = 'login';
    // this._client.data['user'].username = username;
    // this._client.data['user'].password = password;
    this.sendMsg();
  }

  logout() {
    this._client.data['user'] = {};
    this._client.data['command'] = 'logout';
    if (this._client.logintoken) {
      this.sendMsg();
    } else { return alert('login first'); }
  }

  getUserDetails() {
    this._client.data = {};
    this._client.data['user'] = {};
    this._client.data['command'] = 'get-profile';
    if (this._client.logintoken) {
      this.sendMsg();
    } else { return alert('login first'); }
  }

   updateUserDetails() {
    this._client.data = {};
    this._client.data['user'] = JSON.parse(this._currentUserdetail);
    this._client.data['command'] = 'edit-profile';
    if (this._client.logintoken) {
      this.sendMsg();
    } else { return alert('login first'); }
  }

  //  changePassword() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   this._client.data['command'] = 'change-password';
  //   this._client.data['user'].username = this._client.username;
  //   this._client.data['user'].oldpassword = $("#oldPassword").val();
  //   this._client.data['user'].newpassword = $("#newPassword").val();
  //   this._client.data['user'].confirmpassword = $("#confirmPassword").val();
  //   this._client.data['user'].phonenumber = $("#phone").val();
  //   alert(JSON.stringify(this._client));
  //   this.sendMsg();
  // }

  //  register() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   this._client.data['command'] = 'register';
  //   this._client.data['user'].username = $("#username").val();
  //   this._client.data['user'].phonenumber = $("#phonenumber").val();
  //   this._client.data['secret'] = $("#secret").val();
  //   this._client.data['user'].password = $("#rpassword").val();
  //   this._client.data['user'].confirmpassword = $("#rconfirmpassword").val();

  //   console.log('before sending register');
  //   alert(JSON.stringify(this._client));
  //   this.sendMsg();
  // }

  //  checkUsername() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   this._client.data['command'] = 'check-username';
  //   this._client.data['user'].username = $("#username").val();

  //   //alert(JSON.stringify(this._client));
  //   this.sendMsg();
  // }

  //  checkPassword() {

  // }

  //  confirmPassword() {

  // }

  //  checkPhoneNumber() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   this._client.data['command'] = 'check-phonenumber';
  //   this._client.data['user'].phonenumber = $("#phonenumber").val();

  //   //alert(JSON.stringify(this._client));
  //   this.sendMsg();
  // }

  //  updateUserInfo() {
  //   let txt = $("#eUserInfo").val();
  //   txt = JSON.parse(txt);
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   this._client.data['command'] = 'edit-profile';
  //   this._client.data['user'] = txt;
  //   console.log(this._client.data['user']);
  //   this.sendMsg();
  // }

  //  send_confirm_phone_sms(phone) {
  //   phonesize = phone.length;
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   console.log(phone.indexOf('205'));
  //   LTC = phone.indexOf('205');
  //   UNI = phone.indexOf('209');
  //   if (phonesize < 10 || phonesize > 10)
  //     return alert('phone must start with 205 or 209 and 10 digit in total');
  //   if (LTC < 0 && UNI < 0)
  //     return alert('we support only LAOTEL and UNITEL number only');
  //   this._client.data['command'] = 'send-confirm-phone-sms';
  //   this._client.data['user'].phonenumber = phone;
  //   this.sendMsg();
  // }

  //  check_confirm_phone_sms() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   this._client.data['command'] = 'check-confirm-phone-sms';
  //   this._client.data['user'].phonenumber = $('#cPhoneNumber').val();
  //   this._client.data['secret'] = $('#csecret').val();
  //   //this._client.data['user'].phonenumber=phone;
  //   this.sendMsg();
  // }

  //  checkForgot() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   this._client.data['command'] = 'check-forgot';
  //   this._client.data['user'].phonenumber = $('#fPhoneNumber').val();
  //   this._client.data.forgot = $('#forgotKey').val();
  //   //this._client.data['user'].phonenumber=phone;
  //   this.sendMsg();
  // }

  //  getSecret(phone) {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   phonesize = phone.length;
  //   console.log(phone.indexOf('205'));
  //   LTC = phone.indexOf('205');
  //   UNI = phone.indexOf('209');
  //   if (phonesize < 10 || phonesize > 10)
  //     return alert('phone must start with 205 or 209 and 10 digit in total');
  //   if (LTC < 0 && UNI < 0)
  //     return alert('we support only LAOTEL and UNITEL number only');
  //   this._client.data['command'] = 'get-secret';
  //   this._client.data['user'].phonenumber = phone;
  //   this.sendMsg();
  // }

  //  getForgotKeys(phone) {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   phonesize = phone.length;
  //   console.log(phone.indexOf('205'));
  //   LTC = phone.indexOf('205');
  //   UNI = phone.indexOf('209');
  //   if (phonesize < 10 || phonesize > 10)
  //     return alert('phone must start with 205 or 209 and 10 digit in total');
  //   if (LTC < 0 && UNI < 0)
  //     return alert('we support only LAOTEL and UNITEL number only');
  //   this._client.data['command'] = 'submit-forgot';
  //   this._client.data['user'].phonenumber = phone;
  //   this.sendMsg();
  // }

  //  checkSecret() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   this._client.data['command'] = 'check-secret';
  //   this._client.data['secret'] = $('#secret').val();
  //   this.sendMsg();
  // }

  //  uploadPhoto() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   var socketServerUrl = 'ws://localhost:6688/';
  //   var files = [];
  //   $('input[type=file]').change( (event) {
  //     files = event.target.files;
  //     if (files.length == 0) {
  //       alert('select files first !');
  //       return false;
  //     }
  //     for (var i = 0; i < files.length; i++) {

  //       var $transfer = $('<div />').addClass('transfer');
  //       var $progress = $('<div />').addClass('progress')
  //       var $progressBar = $('<div />').addClass('progressBar');
  //       $progressBar.append($progress);

  //       $transfer.append($progressBar);

  //       $('#progresses').append($transfer);

  //       // Creates the transfer
  //       var transfer = new WebSocketFileTransfer({
  //         url: socketServerUrl,
  //         file: files[i],
  //         blockSize: 1024,
  //         type: WebSocketFileTransfer.binarySupported() ? 'binary' : 'base64',
  //         $progress: $progress,
  //         progress:  (event) {
  //           this.$progress.css('width', event.percentage + '%');
  //         },
  //         success:  (event) {
  //           this.$progress.addClass('finished');
  //         }
  //       });

  //       // Starts the transfer
  //       transfer.start();

  //     }

  //     return false;
  //   });
  // }


}
