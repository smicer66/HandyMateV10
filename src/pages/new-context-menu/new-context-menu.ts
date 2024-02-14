import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController, Platform, LoadingController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';


/**
 * Generated class for the NewContextMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-new-context-menu',
  templateUrl: 'new-context-menu.html',
})
export class NewContextMenuPage {
	selectedCommand: any = {selectedCommand: {id:'', extraBudget: null, extraVat : null, extraServiceCharge: null, balanceToPay: null, transaction:null, project: null, payeeName:null, probasePayMerchant:null, probasePayDeviceCode:null, mobileNumber:null}, project:null, message: null};
	menuDetails: any;
	token: any;
	loading: any;
	project: any;
	bid: any;
	user: any;
	
	
	constructor(public app: App, public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, 
		public nativePageTransitions: NativePageTransitions, public toastCtrl: ToastController, public fb: FormBuilder, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
		console.log(navParams);
		this.menuDetails = navParams.get('menuDetails');
		this.project = navParams.get('project');
		this.bid = navParams.get('bid');
		this.user = navParams.get('user');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewContextMenuPage');
	}
	//export ANDROID_HOME=/path/to/android/studio
	//export PATH=$PATH:$ANDROID_HOME/bin
	
	handleSelect(selectedCommand)
	{
		console.log(selectedCommand);
		this.selectedCommand = selectedCommand;
		let data = this.selectedCommand==null ? {selectedCommand: {id:''}, project:null, extraBudget: null, extraVat : null, extraServiceCharge: null, balanceToPay: null, transaction:null, payeeName:null, probasePayMerchant:null, probasePayDeviceCode:null, mobileNumber:null} : { 'selectedCommand': this.selectedCommand, project: null, extraBudget: null, extraVat : null, extraServiceCharge: null, balanceToPay: null, transaction:null, payeeName:null, probasePayMerchant:null, probasePayDeviceCode:null, mobileNumber:null };
		console.log(data);
		//console.log(this.viewCtrl);
		if(selectedCommand.key=='BID_PROJECT')
		{
			this.viewCtrl.dismiss(data);
		}
		else if(selectedCommand.key=='VIEW_PROJECT')
		{
			this.viewCtrl.dismiss(data);
		}
		else if(selectedCommand.key=='CANCEL_BID')
		{
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				form_params = form_params + "&bidId=" + encodeURI(this.bid.id);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/delete-project-bid";
				this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
							
							data.project = res.project;
							console.log(data.project);
							this.viewCtrl.dismiss(data);
						}
						else
						{
							console.log(-1);
							this.viewCtrl.dismiss({});
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
		else if(selectedCommand.key=='EDIT_PROJECT')
		{
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				form_params = form_params + "&id=" + encodeURI(data.selectedCommand.id);
				form_params = form_params + "&editTrue=1";
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/get-project";
				this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
							
							data.project = res.project;
							console.log(data.project);
							console.log(data.project);
							this.viewCtrl.dismiss(data);
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
			
		}	
		else if(data.selectedCommand.key=='VIEW_MESSAGES')
		{
			data.project = selectedCommand.project;
			this.viewCtrl.dismiss(data);
		}
		else if(data.selectedCommand.key=='COMPLAIN')
		{
			
			this.viewCtrl.dismiss(data);
		}
		else if(data.selectedCommand.key=='MESSAGE')
		{
			this.viewCtrl.dismiss(data);
		}
		else if(data.selectedCommand.key=='COMPOSE_MESSAGE')
		{
			this.viewCtrl.dismiss(data);
		}
		else if(data.selectedCommand.key=='CANCEL_PROJECT')
		{
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				form_params = form_params + "&projectId=" + encodeURI(data.selectedCommand.id);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/cancel-project";
				this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
							
							data.project = res.project;
							console.log(data.project);
							this.viewCtrl.dismiss(data);
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
		}
		else if(data.selectedCommand.key=='ACCEPT_PROJECT')
		{
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				form_params = form_params + "&projectId=" + encodeURI(data.selectedCommand.id);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/accept-project-assignment";
				this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
							
							data.project = res.project;
							console.log(data.project);
							this.viewCtrl.dismiss(data);
						}
						else
						{
							console.log(-1);
							this.presentToast({message: res.message}, 'toastError');
							this.viewCtrl.dismiss({message: res.message!=undefined && res.message!=null ? res.message : 'We could not confirm your acceptance to handle this project. Confirm this project has not been assigned to someone else'});
						}
					},
					err => {
						this.loading.dismiss();
						console.log('Error occured');
					}
				);
			});
		}
		else if(data.selectedCommand.key=='REASSIGN_PROJECT')
		{
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				form_params = form_params + "&projectId=" + encodeURI(data.selectedCommand.id);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/cancel-project-assignment";
				this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
							
							data.project = res.project;
							console.log(data.project);
							this.viewCtrl.dismiss(data);
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
		}
		else if(data.selectedCommand.key=='REASSIGN_PROJECT_BID')
		{
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				form_params = form_params + "&projectId=" + encodeURI(data.selectedCommand.id);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/cancel-project-bid-assignment";
				this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
							
							data.project = res.project;
							console.log(data.project);
							this.viewCtrl.dismiss(data);
						}
						else
						{
							console.log(-1);
							this.presentToast({message: res.message}, 'toastError');
							this.viewCtrl.dismiss(null);
						}
					},
					err => {
						this.loading.dismiss();
						console.log('Error occured');
					}
				);
			});
		}
		else if(data.selectedCommand.key=='MARK_COMPLETED')
		{
			console.log(data);
			this.viewCtrl.dismiss(data);
		}
		else if(data.selectedCommand.key=='PAYMENT_INSTRUCTIONS')
		{
			console.log(data);
			this.viewCtrl.dismiss(data);
		}
		else if(data.selectedCommand.key=='WIN_BID')
		{
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				console.log(this.viewCtrl);
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				let form_params = "";
					
				form_params = form_params + "&bidId=" + encodeURI(this.bid.id);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/assign-bid-win";
				this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
							
							data.project = res.project;
							console.log(data.project);
							this.viewCtrl.dismiss(data);
						}
						else if(success==111)
						{
							data.extraBudget = res.budget;
							data.extraVat = res.vat;
							data.extraServiceCharge = res.service_charge;
							data.balanceToPay = res.balanceToPay;
							data.transaction = res.transaction;
							data.project = res.project;
							data.probasePayMerchant = res.probasePayMerchant;
							data.probasePayDeviceCode = res.probasePayDeviceCode;
							data.mobileNumber = res.mobileNumber;
							data.payeeName = res.payeeName;
							this.presentToast({message: res.message}, 'toastInfo');
							this.viewCtrl.dismiss(data);
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
		}

	
	}
	
	dismissModal() {
		//let data = { 'selectedCommand': this.selectedCommand };
		//this.viewCtrl.dismiss(data);
		this.viewCtrl.dismiss(null);
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
	
	presentToast(err, cssClass) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom',
			cssClass: cssClass
		});

		toast.present();
	}

}


interface GeneralReponse{
	project: any;
	success: any;
	message: any;
	budget: any;
	vat: any;
	service_charge: any;
	balanceToPay: any;
	probasePayDeviceCode: any;
	probasePayMerchant: any;
	mobileNumber: any;
	payeeName:any;
	transaction: any;
	extraBudget: any;
	
	
}

