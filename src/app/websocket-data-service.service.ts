import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Observable } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';
import { ChatService, Message } from './chat.service';
@Injectable()
export class WebsocketDataServiceService implements OnInit {

  private _title = 'Websocket test';
  private _url: string;
  private _message: any;
  private _newUser: any;
  private _loginUser = { usrname: '', password: '' };
  private _currentUserdetail: any;
  private _server_event: any = [];
  private _client: Message = {
    gui: '',
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  public messageSource = new BehaviorSubject<Message>(this._client);
  public currentUserSource = new BehaviorSubject<any>(this._currentUserdetail);
  public eventSource = new BehaviorSubject<any>(this._server_event);

  private currentMessage = this.messageSource.asObservable();
  private serverEvent = this.eventSource.asObservable();
  heartbeat_interval = setInterval(() => {
    console.log('heartbeat');
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = {};
    this._message.data['user'] = {};
    this._message.data['command'] = 'heart-beat';
    this.sendMsg();
  }, 1000 * 30);
  timeOut_runner = setTimeout(() => {
    this.shakeHands();
  }, 1000 * 3);
  public refreshClient() {
    this.messageSource.next(this._client);
  }
  public refreshServerEvent() {
    this.messageSource.next(this._client);
  }
  public refreshUserDetails() {
    this.currentUserSource.next(this._currentUserdetail);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    console.log('init');
    if (!this._client.data['user'] || this._client.data['user'] === undefined) {
      this._client.data['user'] = {};
    }
    this._message = JSON.parse(JSON.stringify(this._client));
  }
  constructor(private chatService: ChatService) {
    chatService.messages.subscribe(msg => {
      const d = msg;
      // alert(d);
      if (d !== undefined) {
        if (d['command'] !== undefined) {
          console.log('changed from server');
          switch (d['command']) {
            case 'notification-changed':
              this._server_event.push(d);
              this.refreshServerEvent();
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
          const u = JSON.parse(JSON.stringify(msg.data['user']));
          this._client = msg;
          this.refreshClient();
          console.log('return from server');
          console.log(msg);
          switch (this._client.data['command']) {
            case 'heart-beat':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                console.log(this._client.data['message']);
              } else {
                // this._client.data['user'] = u;
              }
              break;
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
                console.log(this._client);
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
                this._currentUserdetail = u;
                console.log('refesh user details');
                this.refreshUserDetails();
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
  changeMessage(message: Message) {
    console.log(message.data.message);
    this.messageSource.next(message);
  }
  sendMsg() {
    // this._message.data['command'] = 'ping';
    // this._message = JSON.parse(JSON.stringify(this._client));
    console.log('new message from client to websocket: ', JSON.stringify(this._message));
    if (this._message['gui'] || this._message.data['command'] === 'shake-hands' || this._message.data['command'] === 'ping') {
      this.chatService.messages.next(this._message);
    }
  }
  ping_test() {
    // this._client.data = {};
    // this._client.data['user'] = {};
    console.log('test ping');
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data['user'] = {};
    this._message.data['command'] = 'ping';
    this.sendMsg();
  }
  get_user_gui() {
    this._message = JSON.parse(JSON.stringify(this._client));
    if (this._message.logintoken) {
      this._message.data = {};
      this._message.data['user'] = {};
      this._message.data['command'] = 'get-user-gui';
      this.sendMsg();
    } else { return alert('login first'); }
  }
  shakeHands() {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = {};
    this._message.data['user'] = {};
    this._message.data['command'] = 'shake-hands';
    this.sendMsg();
    // alert('shake handds');
  }

  login(loginuser) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data['command'] = 'login';
    this._message.data.user = loginuser;
    this.sendMsg();
  }

  logout() {
    this._message = JSON.parse(JSON.stringify(this._client));
    if (this._message.logintoken) {
      this._message.data['user'] = {};
      this._message.data['command'] = 'logout';
      this.sendMsg();
    } else { return alert('login first'); }
  }

  getUserDetails(client) {
    this._message = JSON.parse(JSON.stringify(client));
    if (this._message.logintoken) {
      this._message.data = {};
      this._message.data['user'] = {};
      this._message.data['command'] = 'get-profile';
      this.sendMsg();
    } else { return alert('login first'); }
  }

  updateUserDetails(updateUserDetails) {
    this._message = JSON.parse(JSON.stringify(this._client));
    if (this._message.logintoken) {
      this._message.data = {};
      this._message.data['user'] = updateUserDetails;
      this._message.data['command'] = 'edit-profile';
      this.sendMsg();
    } else { return alert('login first'); }
  }

  changePassword(u) {
    // this._client.data['user'] = {};
    this._message = JSON.parse(JSON.stringify(this._client));
    alert('before change==> ' + JSON.stringify(u));
    if (this._message.logintoken) {
      this._message.data['command'] = 'change-password';
      this._message.data['user'] = u;
      this._message.data['user'].username = this._message.username;

      this.sendMsg();
    } else { return alert('login first'); }
  }

  register() {
    this._message = JSON.parse(JSON.stringify(this._client));
    console.log('before sending register');
    this._message.data = {};
    this._message.data['user'] = {};
    this._message.data['command'] = 'register';
    this._message.data = this._newUser.data;
    this.sendMsg();
  }

  checkUsername() {
    this._client.data = {};
    this._client.data['user'] = {};
    // this._client.data['command'] = 'check-username';
    // this._client.data['user'].username = $("#username").val();
    if (this._client.data['user'] !== undefined) {
      this._newUser.data['command'] = 'get-secret';
      this._client.data = this._newUser.data;
      alert(JSON.stringify(this._client));
      this._message = JSON.parse(JSON.stringify(this._client));
      this.sendMsg();
    } else { alert('User is undefined'); }
  }

  //  checkPassword() {

  // }

  //  confirmPassword() {

  // }

  checkPhoneNumber() {
    this._client.data = {};
    this._client.data['user'] = {};
    // this._client.data['command'] = 'check-phonenumber';
    if (this._client.data['user'] !== undefined) {
      this._newUser.data['command'] = 'get-secret';
      this._client.data = this._newUser.data;
      alert(JSON.stringify(this._client));
      this._message = JSON.parse(JSON.stringify(this._client));
      this.sendMsg();
    } else { alert('User is undefined'); }
  }

  getSecret() {
    this._client.data = {};
    this._client.data['user'] = {};
    if (this._client.data['user'] !== undefined) {
      const phonesize = this._newUser.data.user.phonenumber.length;
      console.log(this._newUser.data.user.phonenumber.indexOf('205'));
      const LTC = this._newUser.data.user.phonenumber.indexOf('205');
      const UNI = this._newUser.data.user.phonenumber.indexOf('209');
      if (phonesize < 10 || phonesize > 10) {
        return alert('phone must start with 205 or 209 and 10 digit in total');
      }
      if (LTC < 0 && UNI < 0) {
        return alert('we support only LAOTEL and UNITEL number only');
      }
      this._newUser.data['command'] = 'get-secret';
      this._client.data = this._newUser.data;
      alert(JSON.stringify(this._client));
      this._message = JSON.parse(JSON.stringify(this._client));
      this.sendMsg();
    } else { alert('User is undefined'); }
  }
  checkSecret(event: any) {
    // this._client.data = {};
    // this._client.data['user'] = {};
    // this._client.data['command'] = 'check-secret';
    // this._client.data['secret'] = $('#secret').val();
    if (this._newUser.data['secret'] !== undefined) {
      if (this._newUser.data['secret'].length === 6) {
        this._newUser.data['command'] = 'check-secret';
        this._client.data = this._newUser.data;
        this.sendMsg();
      }
    }
  }

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
