import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, LoadingController, ViewController, ModalController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { ViewMessagePage } from '../view-message/view-message';
import { ProfilePixPage } from '../profile-pix/profile-pix';


/**
 * Generated class for the LoansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface MessageThreadListRespInt{
	messageThreads: any;
	messageThreadDetails: any;
	success: any;
	message: any;
}


@Component({
  selector: 'page-all-messages',
  templateUrl: 'all-messages.html',
})
export class AllMessagesPage {

	user: any;
	project: any;
	message: any;
	//segmentSelected: string = "inbox";
	loading: any;
	token: any;
	messageThreads: any = [];
	messageThreadDetails: any = [];
	
	constructor(public app: App, public modalCtrl: ModalController, public viewCtrl: ViewController, public platform: Platform, public http: HttpClient, 
		public storage: Storage, public loadingCtrl: LoadingController, 
		public nativePageTransitions: NativePageTransitions, 
		public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams)
	{
		this.project = navParams.get('project');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoansPage');
		this.refreshMessageList();
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
	
	
	showMessage(messageThread, user)
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(ViewMessagePage, {messageThread: messageThread});
	}
  
	refreshMessageList()
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			if(this.message!=null)
			{
				this.presentToast({message: this.message}, 'toastInfo');
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
					
				if(this.project!=undefined && this.project!=null)
					form_params = form_params + "&projectId=" + encodeURI(this.project.id);
				
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/message-thread-list";
				this.http.post<MessageThreadListRespInt>(url, parameter, httpOptions).subscribe(
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
							this.messageThreads = res.messageThreads;
							this.messageThreadDetails = res.messageThreadDetails;
							console.log(this.messageThreads);
							console.log(this.messageThreadDetails);
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
			
			
			
			//this.storage.get('zambia_bank_customer_accounts').then((userStr) => {
		});
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
