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
  private _server_event: Array<any> = [];
  private _client: Message = {
    gui: '',
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  private _otherSource: any = {};
  private _loginUser = { username: '', password: '' };
  private _currentUserdetail: any = {};
  private _otherMessage: any = {};
  private _subs: any = [];
  private _trans: any = [];

  /// WEBSOCKET LAUNCHING
  constructor(private websocketDataServiceService: WebsocketDataServiceService, private router: Router) {
    this.loadClient();
    this._subs.push(this.websocketDataServiceService.clientSource.subscribe(client => {
      // this._client = client;
      this.readClient(client);
    }));
    this._subs.push(this.websocketDataServiceService.newUserSource.subscribe(client => {
      this._newUser = client;
      // if (this._newUser !== undefined) {
      //   alert('new user update ' + this._newUser.data.user['message']);
      this.readNewUser(client);
      // }
    }));
    this._subs.push(this.websocketDataServiceService.eventSource.subscribe(events => {
      // this._server_event.push(events);
      this.readServerEvent(events);
      // this._server_event.lastIndexOf()
    }));
    this._subs.push(this.websocketDataServiceService.currentUserSource.retry().subscribe(user => {
      // console.log('user details is');
      // console.log(user);
      // this._currentUserdetail = user;
      // this._userDetailsStr = JSON.stringify(this._currentUserdetail);
      this.readCurrentUserDetail(user);
    }));

    this._subs.push(this.websocketDataServiceService.otherSource.subscribe(msg => {
      // this._otherMessage = msg;
      this.readOtherMessage(msg);
    }));

  }
  //// END WEBSOCKET LAUNCHING



  /// OTHER FUNCTIONS
  private clearJSONValue(u) {
    for (const key in u) {
      if (u.hasOwnProperty(key)) {
        u[key] = '';
      }
    }
  }

  //// END OTHER FUNCTIONS

  /// INIT FUNCTIONS
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

  }
  saveClient() {
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
  }
  loadClient() {
    sessionStorage.setItem('firstHandShake', '');
    sessionStorage.setItem('firstHeartBeat', '');
    if (!this._client.gui || this._client.gui === undefined) {
      this._client = this.websocketDataServiceService.getClient();
      console.log('client loaded');
    } else {
      // this.saveClient();
    }
  }
  /// INIT FUNCTIONS




  /// *************RECEIVING  */
  ab2str(arrayBuffer) {
    let
      binaryString = '';
    const
      bytes = new Uint8Array(arrayBuffer),
      length = bytes.length;
    for (let i = 0; i < length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return binaryString;
  }

  str2ab(str) {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  readClient(c): any {
    // this._client
    try {
      if (c !== undefined) {
        this._client = c;
        this.saveClient();
        switch (this._client.data['command']) {
          case 'heart-beat':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // this._client.data['user'] = u;
              console.log('heart beat ok');
            }
            break;
          case 'ping':
            console.log('ping OK');
            // // alert(this._client.data['message']);
            break;
          case 'upload':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              console.log(this._client.data['message']);
            }
            break;
          case 'get-upload':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              console.log(this._client.data['message']);
              const u = this._client.data.user;
              this.convertToDataURLviaCanvas('http://nonav.net:6688' + u.photo[0].arraybuffer, 'image/jpeg').then(base64Img => {
                // do whatever you need here, with the base64 data
                u.photo[0].arraybuffer = base64Img;
                u.photo[0].url = this.createSafeURL(u.photo[0].arraybuffer);
                this._currentUserdetail = u;
              });
            }
            break;
          case 'login':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              console.log('LOGIN OK');
              this.saveClient();
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
              // // console.log(this._client);
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
              this.saveClient();
            }
            break;
          case 'get-profile':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              console.log(this._client.data['user']);
              const u = JSON.parse(JSON.stringify(c.data['user']));
              this._userDetailsStr = JSON.stringify(u);
              this._currentUserdetail = u;
              console.log('get user details ok');
            }
            break;
          case 'change-password':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // // alert('change password OK');
              console.log('change password OK');
            }
            break;
          case 'get-transaction':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // // alert('change password OK');
              console.log('get transaction id ok');
            }
            break;
          case 'check-transaction':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // // alert('change password OK');
              console.log('check transaction id ok');
            }
            break;
          case 'check-forgot':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // // alert(this._client.data['message']);
              console.log('check forgot ok');
            }
            break;
          case 'reset-forgot':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              console.log('reset forgot ok');
            }
            break;
          case 'submit-forgot':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // // alert(this._client.data['message']);
              this._currentUserdetail = this._client.data['user'];
              console.log('submit forgot ok');
            }
            break;
          case 'get-user-gui':
            // console.log('here get user gui ');
            // // console.log(this._client);
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // // alert(this._client.data['user'].gui);
              console.log('get user gui ok');
            }
            break;
          case 'check-phonenumber':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              // // alert(this._client.data['user'].gui);
              this._newUser.data = this._client.data;
              console.log('check phonenumber ok');
            }
            break;
          case 'check-username':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              this._newUser.data = this._client.data;
              console.log('chek username ok');
            }
            break;
          case 'check-secret':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              this._newUser.data = this._client.data;
              console.log('check secret ok');
            }
            break;
          case 'get-secret':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              this._newUser.data = this._client.data;
              console.log('get secret  ok');
            }
            break;
          case 'register':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              this._newUser.data = this._client.data;
              console.log('register ok');
            }
            break;
          case 'send-confirm-phone-sms':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              this._currentUserdetail = this._client.data['user'];
              console.log('send confirm phone sms ok');
            }
            break;
          case 'check-confirm-phone-sms':
            if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
              console.log(this._client.data['message']);
            } else {
              this._currentUserdetail = this._client.data['user'];
              console.log('check confirm phone sms ok');
            }
            break;
          default:
            break;
        }
        // console.log(this.heartbeat_interval);
        // console.log(this._client);
        // if (evt.data != '.') $('#output').append('<p>'+evt.data+'</p>');
      } else {
        // alert('data empty');
        console.log('data is empty');
      }
    } catch (error) {
      console.log(error);
    }

  }
  readNewUser(n): any {
    // this._newUser;
    if (n !== undefined) {
      this._newUser.data = n.data;
    }
  }
  readServerEvent(event: any): any {
    if (event !== undefined) {
      const d = this._server_event[this._server_event.length - 1];
      if (d !== undefined) {
        // this._server_event.push(event);
        console.log('changed from server');
        // console.log(d);
        if (d['command'] !== undefined) {
          // console.log(d['command'] + d['command2']);
          switch (d['command']) {
            case 'notification-changed':
              console.log(d);
              if (d['client']['data']['command'] === 'send-sms') {
                console.log(d.client.data.message);
              }
              if (d['client']['data']['command'] === 'recieved-sms') {
                console.log(d.client.data.message);
                if (d['client']['data']['sms'] !== undefined) {
                  console.log('SMS');
                  console.log(d['client']['data']['res'].resultDesc);
                  console.log(d['client']['data']['res'].msisdn);
                }
              }
              if (d['client']['data']['command'] === 'send-topup') {
                console.log(d.client.data.message);
              }
              if (d['client']['data']['command'] === 'recieved-topup') {
                console.log(d.client.data.message);
                if (d['client']['data']['topup'] !== undefined) {
                  console.log('topup');
                  console.log(d['client']['data']['res'].resultDesc);
                  console.log(d['client']['data']['res'].msisdn);
                }
              }
              if (d['client']['data']['command'] === 'send-check-balance') {
                console.log(d.client.data.message);
              }
              if (d['client']['data']['command'] === 'recieved-check-balance') {
                console.log(d.client.data.message);
                if (d['client']['data']['checkbalance'] !== undefined) {
                  console.log('topup');
                  console.log(d['client']['data']['res'].resultDesc);
                  console.log(d['client']['data']['res'].msisdn);
                }
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
            case 'forgot-changed':
              console.log(d);
              break;
            case 'phone-changed':
              console.log(d);
              break;
            case 'secret-changed':
              console.log(d);
              break;
            case 'online-changed':
              console.log(d);
              break;
            case 'send-sms':
              console.log(d);
              break;
            case 'topup':
              console.log(d);
              break;
            case 'check-balance':
              console.log(d);
              break;
            default:
              break;
          }
          // // console.log(msg);
        }
      }
    }



  }
  readCurrentUserDetail(c: any): any {
    // this._currentUserDetail
    if (c !== undefined) {
      this._currentUserdetail = c;
    }
  }
  readOtherMessage(m: any): any {
    // this._message
    if (m !== undefined) {
      this._message = m;
    }
  }
  /// END RECEIVING




  //// SENDING
  showNewMessage() {
    this._client.data.message = 'changed from show message';
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.changeMessage(this._client);
  }
  setOtherMessage() {
    const msg = {
      title: '',
      data: {},
      other: {}, // ...
    };
    // msg.data['transaction'] = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.setOtherMessage(msg);
  }
  shakeHands() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.shakeHands();
    this.saveClient();
  }
  ping_test() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.ping_test();
    this._client.data.message += ' HERE in app component';
    console.log(this._client);
  }

  login() {
    // alert(JSON.stringify(this._loginUser));
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.login(this._loginUser); // return to this._client
    this.clearJSONValue(this._loginUser);
    // this.saveClient();
  }
  logout() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.logout();
    // this.saveClient();
  }
  getUserDetails() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.getUserDetails(this._client.data);
  }
  updateUserDetails() {
    // this._currentUserdetail = JSON.parse(this._userDetailsStr);
    // this._currentUserdetail.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.updateUserDetails(this._currentUserdetail); // should be _userDetails
  }
  get_user_gui() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.get_user_gui();
  }

  changepassword() {
    // this._currentUserdetail.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.changePassword(this._currentUserdetail);
    // this.clearJSONValue(this._currentUserdetail);
  }
  register() {
    // this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.register(this._newUser);
    // this.clearJSONValue(this._newUser);
  }
  getSecret() {
    // this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.getSecret(this._newUser);
  }
  checkSecret(event: any) {
    if (this._newUser.data['secret'] !== undefined) {
      if (this._newUser.data['secret'].length === 6) {
        this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
        this.websocketDataServiceService.checkSecret(this._newUser);
      }
    }
  }
  checkUsername() {
    // this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.checkUsername(this._newUser);
  }
  checkPhoneNumber() {
    // this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.checkPhoneNumber(this._newUser);
  }
  getSMSConfirm() {
    if (this._client.logintoken) {
      // this._currentUserdetail.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
      this.websocketDataServiceService.send_confirm_phone_sms(this._currentUserdetail);
    } else {
      console.log('login first');
    }
  }
  checkSMSConfirm($event: any) {
    if (this._client.logintoken) {
      if (this._newUser.data['secret'] !== undefined) {
        if (this._newUser.data['secret'].length === 6) {
          // this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
          this._newUser.data.user = this._currentUserdetail;
          this.websocketDataServiceService.check_confirm_phone_sms(this._newUser.data);
        }
      }
    } else {
      console.log('login first');
    }

  }
  changePhoneNumber() {
    if (this._client.logintoken) {
      if (this._newUser.data['secret'] !== undefined) {
        if (this._newUser.data['secret'].length === 6) {
          // this._newUser.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
          this._newUser.data.user = this._currentUserdetail;
          this.websocketDataServiceService.update_confirm_phone(this._newUser.data);
        }
      }
    } else {
      console.log('login first');
    }
  }
  goTo(com) {
    console.log(JSON.stringify(this._client));
    // if (!this._client.gui || this._client.gui === undefined) {
    //   this._client = this.websocketDataServiceService.getClient();
    // }
    this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
    this.router.navigate([com]).then(res => {
      // this.websocketDataServiceService.stopService();
      // alert(res);
    }).catch(err => {
      // alert(err);
    });
  }

  checkForgot(event: any) {
    let d: any;
    d = {};
    d.data = {};
    d.data.user = {};
    d.data.user.phonenumber = this._currentUserdetail.phonenumber;
    d.data.forgot = this._currentUserdetail.forgot;
    // d.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    if (d.data['forgot'] !== undefined) {
      if (d.data['forgot'].length === 6) {
        this.websocketDataServiceService.checkForgot(d);
      }
    }
  }
  resetPassword(event: any) {
    let d: any;
    d = {};
    d.data = {};
    d.data.user = {};
    d.data.user.phonenumber = this._currentUserdetail.phonenumber;
    d.data.forgot = this._currentUserdetail.forgot;
    // d.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    if (d.data['forgot'] !== undefined && d.data.user['phonenumber'] !== undefined) {
      if (d.data['forgot'].length === 6) {
        this.websocketDataServiceService.resetPassword(d);
      }
    }
  }
  getForgotKeys() {
    let d: any;
    d = {};
    d.data = {};
    d.data.user = {};
    d.data.user.phonenumber = this._currentUserdetail.phonenumber;
    d.data.forgot = this._currentUserdetail.forgot;

    // d.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    alert(JSON.stringify(d));
    // alert(JSON.stringify(this._currentUserdetail));
    if (d.data.user['phonenumber'] !== undefined) {
      this.websocketDataServiceService.getForgotKeys(d);

    } else { alert('forgot key is empty'); }
  }

  createTransaction() {
    let x;
    this._trans.push(x = this.websocketDataServiceService.createTransaction());
    return x;
  }
  getUpload() {
    console.log(this._currentUserdetail);
    this.websocketDataServiceService.getUpLoad(this._currentUserdetail);
  }
  uploadChange($event): void {
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    if (file === undefined) {
      return;
    }
    const photo = {
      arraybuffer: {},
      url: {},
      name: ((Math.random() * 1000000) + 1) + '_' + file.name,
      lastmodifieddate: file.lastModifiedDate,
      size: file.size,
      type: file.type,
    };
    if (this._currentUserdetail.photo === undefined) {
      this._currentUserdetail.photo = [];
    }
    // photo.url = this.file2imageurl(file);
    myReader.readAsDataURL(file);
    myReader.onloadend = (e) => {
      photo.arraybuffer = myReader.result;
      photo.url = myReader.result;
      this._currentUserdetail.photo.push(photo);
    };
  }
  convertToDataURLviaCanvas(url, outputFormat) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS');
        const ctx = canvas.getContext('2d');
        let dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }
  arraybuffer2imageurl(ab: ArrayBuffer, type: string) {
    return this.websocketDataServiceService.arraybuffer2imageurl(ab, type);
  }
  file2imageurl(ab: File) {
    return this.websocketDataServiceService.file2imageurl(ab);
  }
  clearObjectUrlBeforeUpload(array) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      for (const key in element) {
        if (key.toLowerCase().indexOf('url') > -1) {
          element[key] = '';
        }
      }
    }
  }
  createSafeURL(url) {
    return this.websocketDataServiceService.createSafeURL(url);
  }
  binary2blob(bin) {
    return this.websocketDataServiceService.binary2imageurl(bin);
  }
  upload() {
    // console.log(this._currentUserdetail);
    const d = {};
    d['data'] = {};
    d['data'].user = this._currentUserdetail;
    const d2 = JSON.parse(JSON.stringify(d));
    console.log(d['data'].user.photo);
    // d2['data'].user.photo[0].arraybuffer = Buffer.from(d2['data'].user.photo[0].arraybuffer);
    // d['data'].user.photo[0].arraybuffer = d['data'].user.photo[0].arraybuffer;
    this.clearObjectUrlBeforeUpload(d2['data'].user.photo);
    this.websocketDataServiceService.upload(d['data']);
    // this.websocketDataServiceService.getForgotKeys(d);
  }
  /////////////// END SENDING
}
