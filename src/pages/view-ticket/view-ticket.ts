import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, LoadingController, ViewController, ModalController, App } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';
import { RaiseSupportTicketPage } from '../raise-support-ticket/raise-support-ticket';


/**
 * Generated class for the LoansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface ticketMessageListRespInt{
	messages: any;
	project: any;
	success: any;
	message: any;
	messageThreads: any;
	messageThreadDetails: any;
}


@IonicPage()
@Component({
  selector: 'page-view-ticket',
  templateUrl: 'view-ticket.html',
})
export class ViewTicketPage {

	user: any;
	project: any;
	messageThread: any;
	ticketMessageList: any;
	loading: any;
	token: any;
	ticket: any;
	fromWhere: any;
	
	constructor(public app: App, public modalCtrl: ModalController, public viewCtrl: ViewController, public platform: Platform, public http: HttpClient, 
		public nativePageTransitions: NativePageTransitions, public storage: Storage, public loadingCtrl: LoadingController, public toastCtrl: ToastController, 
		public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams)
	{
		this.messageThread = navParams.get('messageThread');
		console.log(this.messageThread);
		this.fromWhere = this.navParams.get('fromWhere');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ViewMessagePage');
		this.getticketMessageList();
	}
	
	ionViewDidEnter() {
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
  
	getticketMessageList()
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			if(this.messageThread!=undefined && this.messageThread!=null)
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
					
				if(this.messageThread!=undefined && this.messageThread!=null)
				{
					form_params = form_params + "&messageThreadId=" + encodeURI(this.messageThread.threadId);
				
					console.log(form_params);
					
					this.loading = this.loadingCtrl.create({
						content: 'Please wait...'
					});
					this.loading.present();
					
					let parameter = form_params;
					let url = "https://handymateservices.com/api/view-support-thread-messages";
					this.http.post<ticketMessageListRespInt>(url, parameter, httpOptions).subscribe(
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
							else if(success===true)
							{
								this.ticketMessageList = res.messages;
								console.log(this.ticketMessageList);
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
				}
			});
		});
	}
	
	
	replyMessage(message, user)
	{
		//this.navCtrl.push(RaiseSupportTicketPage, {replyMessage: message, user: user});
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(RaiseSupportTicketPage, {replyMessage: message, user: user});
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
	
	
	closeTicket()
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			if(this.messageThread!=undefined && this.messageThread!=null)
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
					
				if(this.messageThread!=undefined && this.messageThread!=null)
				{
					form_params = form_params + "&messageThreadId=" + encodeURI(this.messageThread.threadId);
				
					console.log(form_params);
					
					this.loading = this.loadingCtrl.create({
						content: 'Please wait...'
					});
					this.loading.present();
					
					let parameter = form_params;
					let url = "https://handymateservices.com/api/close-support-ticket";
					this.http.post<ticketMessageListRespInt>(url, parameter, httpOptions).subscribe(
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
							else if(success===true)
							{
								this.presentToast({message: res.message}, 'toastSuccess');
								this.viewCtrl.dismiss({messageThreads: res.messageThreads, messageThreadDetails: res.messageThreadDetails});
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
				}
			});
		});
	}


}
