import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events, NavController, ViewController, NavParams, ToastController, LoadingController, Platform, ModalController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';



/**
 * Generated class for the OneBankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@Component({
  selector: 'page-transactions',
  templateUrl: 'transactions.html',
})
export class TransactionsPage {


	currentTransactionList: any = [];
	user: any;
	loading: any;
	token: any;


	constructor(public app: App, public events2: Events, 
		public nativePageTransitions: NativePageTransitions, public viewCtrl: ViewController, public modalCtrl: ModalController, public platform: Platform, public loadingCtrl: LoadingController, public http: HttpClient, public storage: Storage, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad TransactionsPage');
		//this.refreshTransactionList();
	}
	
	ionViewDidEnter() {
		console.log('ionViewDidLoad TransactionsPage');
		this.refreshTransactionList();
	}
	
	
	refreshTransactionList()
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
				let url = "https://handymateservices.com/api/transaction-list-v1";
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
							this.currentTransactionList = res.currentTransactionList;
							console.log(this.currentTransactionList);
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

	

	presentToast(err, cssClass) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom',
			cssClass: cssClass
		});

		toast.present();
	}
	
	
	
	verifyPayment(transaction)
	{
		let project = transaction.project;
		
		if(project!=undefined && project!=null)
		{
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				var form_params = "";
				form_params = form_params + "&projectId=" + encodeURI(project.id);
				form_params = form_params + "&transactionId=" + encodeURI(transaction.id);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Few seconds...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/verify-payment";
				this.http.post<NewProjectReponse>(url, parameter, httpOptions).subscribe(
					res => {
						this.loading.dismiss();
						let success: any = null;
						success = res.success;
						console.log(res);
						console.log(res);
						//console.log(success);
						if(success==422)
						{
							this.logout();
						}
						else if(success==true)
						{
							this.presentToast({message: res.message}, 'toastSuccess');
							this.refreshTransactionList();
						}
						else
						{
							console.log(-1);
							this.presentToast({message: res.message}, 'toastError');
						}
					},
					err => {
						this.loading.dismiss();
						console.log('Error occured');
					}
				);
			});
		}
		else
		{
			this.presentToast({message: 'We could not confirm your payment'}, 'toastError');
		}
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
  currentTransactionList: any;
  message: any;
}


interface NewProjectReponse{
	project: any;
	success: any;
	message: any;
}