import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, LoadingController, ViewController, ModalController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder} from '@angular/forms';
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { ComposeMessagePage } from '../compose-message/compose-message';
import { ProfilePixPage } from '../profile-pix/profile-pix';


/**
 * Generated class for the LoansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface MessageListRespInt{
	messages: any;
	project: any;
	success: any;
	message: any;
}


@Component({
  selector: 'page-view-message',
  templateUrl: 'view-message.html',
})
export class ViewMessagePage {

	user: any;
	project: any;
	messageThread: any;
	messageList: any;
	loading: any;
	token: any;
	message: any;
	fromWhere: any;
	
	constructor(public app: App, 
		public nativePageTransitions: NativePageTransitions, public modalCtrl: ModalController, public viewCtrl: ViewController, public platform: Platform, public http: HttpClient, 
		public storage: Storage, public loadingCtrl: LoadingController, 
		public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams)
	{
		this.messageThread = navParams.get('messageThread');
		console.log(this.messageThread);
		this.fromWhere = this.navParams.get('fromWhere');
	}

	ionViewDidEnter() {
		console.log('ionViewDidLoad ViewMessagePage');
		this.getMessageList();
		this.fromWhere = this.navParams.get('fromWhere');
		if(this.fromWhere!=undefined && this.fromWhere!=null)
		{
			if(this.fromWhere=='notification')
			{
				this.storage.remove('notificationActive');
			}
		}
	}
  
	presentToast(err, cssClass) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom',
			cssClass: cssClass
		});

		toast.present();
	}
  
	getMessageList()
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			if(this.messageThread==null)
			{
				//this.presentToast({message: this.messageThread});
			}
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				form_params = form_params + "&messageThreadId=" + encodeURI(this.messageThread.threadId);
				
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/view-thread-messages";
				this.http.post<MessageListRespInt>(url, parameter, httpOptions).subscribe(
					res => {
						console.log(this.viewCtrl);
						this.loading.dismiss();
						let success: any = null;
						success = res.success;
						console.log(res);
						console.log(success);
						if(success==422)
						{
							this.logout();
						}
						else if(success==true)
						{
							this.messageList = res.messages;
							this.project = res.project;
							console.log(this.messageList);
						}
						else
						{
							console.log(-1);
							this.presentToast({message: res.message}, 'toastError');
							this.viewCtrl.dismiss({});
						}
					},
					err => {
						this.loading.dismiss();
						console.log('Error occured');
					}
				);
			});
		});
	}
	
	
	replyMessage(message, user, project)
	{
		const composeModal = this.modalCtrl.create(ComposeMessagePage, { message: message, projectDetails: project, user:  user, project:  project});
		composeModal.onDidDismiss(data => {
			console.log(data);
			this.getMessageList();
			if(data!=null)
			{
				//this.project = data.project;
			}
		});
		composeModal.present();
	}
	
	logout()
	{
		let loading = this.loadingCtrl.create({
			content: 'Logging you out...'
		});
		loading.present();
		this.storage.remove('handy_mate_token');
		this.storage.remove('handy_mate_loggedInUser');
		this.storage.remove('handy_mate_countries');
		this.storage.remove('handy_mate_provinces');
		this.storage.remove('handy_mate_districts');
		this.storage.remove('handy_mate_skills');
		loading.dismiss();
		this.token = null;
		//this.navCtrl.setRoot(LoginPage);
		
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.app.getRootNav().setRoot(LoginPage);
		
	}
	
	
	viewProfilePix()
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(ProfilePixPage, { user: this.user });
		profileModal.onDidDismiss(data => {
			
		});
		profileModal.present();
	}


}
