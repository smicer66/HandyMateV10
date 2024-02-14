import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, NavController, ViewController, NavParams, ToastController, LoadingController, Platform, ModalController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewProjectPage } from '../view-project/view-project';
import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';



/**
 * Generated class for the OneBankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {


	currentNotificationList: any = [];
	user: any;
	loading: any;
	token: any;


	constructor(public app: App, public events2: Events, 
		public nativePageTransitions: NativePageTransitions, public viewCtrl: ViewController, public modalCtrl: ModalController, public platform: Platform, public loadingCtrl: LoadingController, public http: HttpClient, public storage: Storage, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NotificationsPage');
		//this.refreshNotificationList();
	}
	
	ionViewDidEnter() {
		console.log('ionViewDidLoad NotificationsPage');
		this.refreshNotificationList();
	}
	
	
	refreshNotificationList()
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/notification-list";
				this.http.post<NotificationResp>(url, parameter, httpOptions).subscribe(
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
							this.currentNotificationList = res.currentNotificationList;
							console.log(this.currentNotificationList);
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

	handleNotification(dt)
	{
		console.log(dt);
		console.log('--------------');
		let ntype = dt[0]['notification'].type;
		if(ntype=='NEW_PROJECT_PLACED' || ntype=='EDIT_PROJECT' || ntype=='BID_PLACED' || ntype=='EDIT_BID'
			 || ntype=='BID_WON' || ntype=='CLIENT_COMPLETION_CONFIRMATION' || ntype=='CLIENT_RELEASE_PAYMENT' || ntype=='NEW_SUPPORT_MESSAGE'
			 || ntype=='PAYMENT_RELEASE' || ntype=='PROJECT_ACCEPTANCE' || ntype=='NEW_MESSAGE' || ntype=='REOPEN_PROJECT'
			 || ntype=='WORKER_COMPLETION_CONFIRMATION' || ntype=='PROJECT_CANCELATION')
		{
			this.storage.get('handy_mate_loggedInUser').then((val2) => {
				this.user = val2;
				console.log(this.user);
				this.loading = this.loadingCtrl.create({
				  content: 'Getting project. Please wait...'
				});
				this.loading.present();
				this.storage.get('handy_mate_token').then((val) => {
					console.log(val);
					this.token = val;
					let header = new HttpHeaders();
					header = header.set('Content-Type', 'application/json; charset=utf-8');
					header = header.set('Accept', 'application/json');
					header = header.set('Authorization', this.token);
					console.log(header);
					const httpOptions = {headers: header};
					let parameter = JSON.stringify({ });

					this.http.post<ProjectListRespInt>("https://handymateservices.com/api/projects-list", parameter, httpOptions).subscribe(
						res1 => {
							this.loading.dismiss();
							let status: any = null;
							//test
							status = res1.success;
							console.log(res1);
							console.log(status);
							if(res1.success==422)
							{
								this.logout();
							}
							else if (res1.success === true) {
								let currentProjectList = res1.projects;
								console.log(currentProjectList);
								let project = null;
								for(var cpl=0; cpl<currentProjectList.length; cpl++)
								{
									if(currentProjectList[cpl].id == dt[0]['notification'].model_id)
									{
										project = currentProjectList[cpl];
									}
								}
								
								if(project==null)
								{
									this.presentToast({message: 'The project linked to the notification selected could not be found. It may have been closed by the project owner.'}, 'toastError');
								}
								else
								{
									let options: NativeTransitionOptions = {
										direction: 'up',
										duration: 600
									};

									this.nativePageTransitions.flip(options);
									this.navCtrl.push(ViewProjectPage, {fromWhere: 2, project: project});
								}
							} else 
							{
								this.presentToast({message: res1.message}, 'toastError');
							}
						},
						err => {
							this.loading.dismiss();
							console.log('Error occured');
							this.presentToast({message: 'Error occured'}, 'toastError');
						}
					);
				});
				//this.storage.get('zambia_bank_customer_accounts').then((userStr) => {
			});
			
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
	
	
	
	viewProfilePix()
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(ProfilePixPage, { user: this.user });
		profileModal.onDidDismiss(data => {
			
		});
		profileModal.present();
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
	
}


interface NotificationResp{
  success: any;
  currentNotificationList: any;
  message: any;
}

interface ProjectListRespInt{
  success: any;
  message: any;
  projects: any;
}