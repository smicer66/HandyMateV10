import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController, Platform, LoadingController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder} from '@angular/forms';
import { Storage } from "@ionic/storage";
import { Rave, RavePayment, Misc } from 'rave-ionic3';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginPage } from '../login/login';

/**
 * Generated class for the PaymentInstructionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-payment-instructions',
  templateUrl: 'payment-instructions.html',
})
export class PaymentInstructionsPage {
	selectedCommand: any = {selectedCommand: {id:''}, project:null};
	token: any;
	loading: any;
	project: any;
	bid: any;
	user: any;
	transaction: any = {};
	messageThread: any;
	transactionUpdate: any;
	segmentSelected: string = "mobilemoney";
	
	
	//probasepayurl: any;
	mobilemoneyurl: any;
	probasepayurl: any;
	probasePayMerchant: any = 'XUYE';
	probasePayDeviceCode: any = 'XUYE';
	mobileNumber: any;
	payeeName: any;
	projectId: any;
	transactionId: any;
	transactionUpdateOrderRef: any;
	paymentOptions: any = [];
	
	constructor(public app: App, public rave: Rave, public ravePayment: RavePayment, public misc: Misc, public sanitize: DomSanitizer, 
		public nativePageTransitions: NativePageTransitions, public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
		console.log(navParams);
		this.project = this.navParams.get('projectDetails');
		this.transactionId = this.navParams.get('transactionId');
		this.transactionUpdate = this.navParams.get('transactionUpdate');
		this.transactionUpdateOrderRef = this.navParams.get('transactionUpdateOrderRef');
		this.user = this.navParams.get('user');
		//this.probasepayurl = this.sanitize.bypassSecurityTrustResourceUrl('https://payments.probasepay.com/mobile/index');
		this.mobilemoneyurl = this.sanitize.bypassSecurityTrustResourceUrl('http://handymateservices.com/mobile/payment-index');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PaymentInstructionsPage');
		
	}
	
	
	
	ionViewDidEnter() {
		this.project = this.navParams.get('projectDetails');
		this.transactionId = this.navParams.get('transactionId');
		this.transactionUpdate = this.navParams.get('transactionUpdate');
		this.probasePayMerchant = this.navParams.get('probasePayMerchant');
		this.probasePayDeviceCode = this.navParams.get('probasePayDeviceCode');
		console.log(this.projectId);
		console.log(this.project);
		
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		this.storage.get('handy_mate_token').then((val2) => {
			this.token = val2;
			header = header.set('Authorization', this.token);
			
			const httpOptions = {headers: header};
			var form_params = "";
			console.log(form_params);
			
			this.loading = this.loadingCtrl.create({
				content: 'Loading Payment Options...'
			});
			this.loading.present();
			
			let parameter = form_params;
			let url = "https://handymateservices.com/api/get-payment-options";
			this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
						this.paymentOptions = res.paymentOptions;
						if(res.paymentOptions!=undefined && res.paymentOptions!=null && res.paymentOptions['FLUTTERWAVE']!=undefined && res.paymentOptions['FLUTTERWAVE']!=null && res.paymentOptions['FLUTTERWAVE']==1)
						{
							new Promise(resolve => {
								if(this.transactionUpdate!=undefined && this.transactionUpdate!=null)
								{
									this.storage.get('handy_mate_loggedInUser').then((val2) => {
										this.user = val2;
										console.log(this.user);
										if(this.messageThread!=null)
										{
											this.presentToast({message: this.messageThread}, 'toastInfo');
										}
										
										
										this.storage.get('handy_mate_token').then((val2) => {
											this.token = val2;
											console.log(this.viewCtrl);
											console.log(this.transaction);
											console.log(this.project);
											
											this.selectedCommand.project = this.project;
											console.log(this.transaction);
											
											let params1 = [];
											let params2 = [];
											if(this.transactionUpdate!=undefined && this.transactionUpdate!=null)
											{
												params1.push(this.transactionUpdate.budget);
												params1.push(this.transactionUpdate.vat);
												params1.push(this.transactionUpdate.service_charge);
												params2.push('Project Budget Updated');
												params2.push('VAT(5%)');
												params2.push('Service Charge (5%)');
											}
											else
											{
												params1.push(this.project.budget);
												params1.push(this.project.vat);
												params1.push(this.project.service_charge);
												params2.push('Project Budget');
												params2.push('VAT(5%)');
												params2.push('Service Charge (5%)');
											}
											
											//console.log(this.probasepayurl);
											console.log(this.mobilemoneyurl);
											//this.probasepayurl = this.sanitize.bypassSecurityTrustResourceUrl(this.probasepayurl);
											//this.mobilemoneyurl = this.sanitize.bypassSecurityTrustResourceUrl(this.mobilemoneyurl);
											
											const PRODUCTION_FLAG = true;
											//const YOUR_PUBLIC_KEY = 'FLWPUBK-8dbdab6375ea89adb96bb2e5efb77617-X';
											const YOUR_PUBLIC_KEY = 'FLWPUBK-8dbdab6375ea89adb96bb2e5efb77617-X';
											let payableAmt = 0.00;
											if(this.transactionUpdate!=undefined && this.transactionUpdate!=null && 
												this.transactionUpdate.budget!=undefined && this.transactionUpdate.budget!=null && 
												this.transactionUpdate.vat!=undefined && this.transactionUpdate.vat!=null && 
												this.transactionUpdate.service_charge!=undefined && this.transactionUpdate.service_charge!=null)
											{
												payableAmt = this.transactionUpdate.budget + this.transactionUpdate.vat + this.transactionUpdate.service_charge;
												console.log(payableAmt);
											}
											else
											{
												payableAmt = this.project.budget + this.project.vat + this.project.service_charge;
												console.log(payableAmt);
											}
											
											console.log(this.transactionUpdate);
											this.rave.init(PRODUCTION_FLAG, YOUR_PUBLIC_KEY).then(_ => {
												console.log(this.transactionUpdateOrderRef);
												var paymentObject = this.ravePayment.create({
													customer_email: this.user.email_address,
													amount: (payableAmt),
													customer_phone: this.user.mobile_number,
													currency: "ZMW",
													txref: this.transactionUpdateOrderRef,
													redirect_url: "http://handymateservices.com/mobile/process-pay-redirect",
													meta: [{
													  metaname: "flightID",
													  metavalue: "AP1234"
													}]
												})
												console.log(paymentObject);
												this.rave.preRender(paymentObject).then(secure_link => {
													secure_link = secure_link +" ";
													console.log(secure_link);
													this.mobilemoneyurl = secure_link;
													this.mobilemoneyurl = this.sanitize.bypassSecurityTrustResourceUrl(this.mobilemoneyurl);
												}).catch(error => {
													// Error or invalid paymentObject passed in
													console.log(error);
												})
											});
										});
									});
								}
								else
								{
									this.storage.get('handy_mate_loggedInUser').then((val2) => {
										this.user = val2;
										console.log(this.user);
										if(this.messageThread!=null)
										{
											this.presentToast({message: this.messageThread}, 'toastInfo');
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
												
											form_params = form_params + "&projectId=" + encodeURI(this.project.id);
											if(this.transactionId!=undefined && this.transactionId!=null)
											{
												form_params = form_params + "&transactionId=" + encodeURI(this.transactionId);
											}
											
											console.log(form_params);
											
											this.loading = this.loadingCtrl.create({
												content: 'Please wait...'
											});
											this.loading.present();
											
											let parameter = form_params;
											let url = "https://handymateservices.com/api/get-project-payment-details";
											this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
												res => {
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
														this.loading.dismiss();
														this.transaction = res.transaction;
														this.project = res.project;
														this.selectedCommand.project = res.project;
														this.probasePayDeviceCode = res.probasePayDeviceCode;
														this.probasePayMerchant = res.probasePayMerchant;
														console.log(this.transaction);
														
														let params1 = [];
														let params2 = [];
														if(this.transactionUpdate!=undefined && this.transactionUpdate!=null)
														{
															params1.push(this.transactionUpdate.budget);
															params1.push(this.transactionUpdate.vat);
															params1.push(this.transactionUpdate.service_charge);
															params2.push('Project Budget Updated');
															params2.push('VAT(5%)');
															params2.push('Service Charge (5%)');
														}
														else
														{
															params1.push(this.project.budget);
															params1.push(this.project.vat);
															params1.push(this.project.service_charge);
															params2.push('Project Budget');
															params2.push('VAT(5%)');
															params2.push('Service Charge (5%)');
														}
																			
														/*this.probasepayurl = 'https://wallet.probasepay.com/mobile/process-pay/' + encodeURI(this.transaction.reference_no) + '/' + 
															this.probasePayDeviceCode + '/' + this.probasePayMerchant + '/' + 
															this.user.mobile_number + '/' + encodeURI(this.user.first_name + ' ' + this.user.last_name) + '/' + encodeURI(JSON.stringify(params2)) + '/' + 
															encodeURI(JSON.stringify(params1)) + '/' + this.transaction.currency;*/
														/*this.mobilemoneyurl = 'http://handymateservices.com/mobile/process-pay/' + encodeURI(this.transaction.reference_no) + '/' + 
															this.user.email_address + '/' + this.user.mobile_number + '/' + encodeURI(this.user.first_name + ' ' + this.user.last_name) + '/' + encodeURI(JSON.stringify(params2)) + '/' + 
															encodeURI(JSON.stringify(params1)) + '/' + this.transaction.currency;*/
														//console.log(this.probasepayurl);
														console.log(this.mobilemoneyurl);
														//this.probasepayurl = this.sanitize.bypassSecurityTrustResourceUrl(this.probasepayurl);
														//this.mobilemoneyurl = this.sanitize.bypassSecurityTrustResourceUrl(this.mobilemoneyurl);
														
														const PRODUCTION_FLAG = true;
														const YOUR_PUBLIC_KEY = 'FLWPUBK-8dbdab6375ea89adb96bb2e5efb77617-X';
														let payableAmt = 0.00;
														if(this.transactionUpdate!=undefined && this.transactionUpdate!=null && 
															this.transactionUpdate.budget!=undefined && this.transactionUpdate.budget!=null && 
															this.transactionUpdate.vat!=undefined && this.transactionUpdate.vat!=null && 
															this.transactionUpdate.service_charge!=undefined && this.transactionUpdate.service_charge!=null)
														{
															payableAmt = this.transactionUpdate.budget + this.transactionUpdate.vat + this.transactionUpdate.service_charge;
														}
														else
														{
															payableAmt = this.project.budget + this.project.vat + this.project.service_charge;
														}
														this.rave.init(PRODUCTION_FLAG, YOUR_PUBLIC_KEY).then(_ => {
															var paymentObject = this.ravePayment.create({
																customer_email: this.user.email_address,
																amount: (payableAmt),
																customer_phone: this.user.mobile_number,
																currency: "ZMW",
																txref: this.transaction.reference_no,
																redirect_url: "http://handymateservices.com/mobile/process-pay-redirect",
																meta: [{
																  metaname: "flightID",
																  metavalue: "AP1234"
																}]
															})
															this.rave.preRender(paymentObject).then(secure_link => {
																secure_link = secure_link +" ";
																console.log(secure_link);
																this.mobilemoneyurl = secure_link;
																this.mobilemoneyurl = this.sanitize.bypassSecurityTrustResourceUrl(this.mobilemoneyurl);
															}).catch(error => {
																// Error or invalid paymentObject passed in
															})
														});
													}
													else
													{
													
														this.loading.dismiss();
														console.log(-1);
														this.presentToast({message: res.message}, 'toastError');
														this.dismissModal();
													}
												},
												err => {
													this.loading.dismiss();
													console.log('Error occured');
													this.dismissModal();
												}
											);
										});
									});
								}
							});
						}
						if(res.paymentOptions!=undefined && res.paymentOptions!=null && res.paymentOptions['BEVURAPAY']!=undefined && res.paymentOptions['BEVURAPAY']!=null && res.paymentOptions['BEVURAPAY']==1)
						{
							new Promise(resolve => {
								if(this.transactionUpdate!=undefined && this.transactionUpdate!=null)
								{
									this.storage.get('handy_mate_loggedInUser').then((val2) => {
										this.user = val2;
										console.log(this.user);
										if(this.messageThread!=null)
										{
											this.presentToast({message: this.messageThread}, 'toastInfo');
										}
										
										
										this.storage.get('handy_mate_token').then((val2) => {
											this.token = val2;
											console.log(this.viewCtrl);
											header = header.set('Authorization', this.token);
											
											const httpOptions = {headers: header};
											let form_params = "";
												
											form_params = form_params + "&projectId=" + encodeURI(this.project.id);
											if(this.transactionId!=undefined && this.transactionId!=null)
											{
												form_params = form_params + "&transactionId=" + encodeURI(this.transactionId);
											}
											
											console.log(form_params);
											
											let loading1 = this.loadingCtrl.create({
												content: 'Please wait...'
											});
											loading1.present();
											
											let parameter = form_params;
											let url = "https://handymateservices.com/api/get-project-payment-details";
											this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
												res => {
													let success: any = null;
													success = res.success;
													console.log(res);
													console.log(success);
													loading1.dismiss();
													if(success==422)
													{
														this.logout();
													}
													else if(success==true)
													{
														this.loading.dismiss();
														this.transaction = res.transaction;
														this.project = res.project;
														this.selectedCommand.project = res.project;
														this.probasePayDeviceCode = res.probasePayDeviceCode;
														this.probasePayMerchant = res.probasePayMerchant;
														console.log(this.transaction);
														
														this.probasepayurl = res.probasepayurl + '/' + encodeURI((this.token));
														//'https://handymateservices.com/api/initiate-bevura-payment/' + encodeURI(this.transactionId) + '/' + 
														//	encodeURI(this.transaction.reference_no) + '/' + this.project.id + '/' + encodeURI((this.token));
														this.probasepayurl = this.sanitize.bypassSecurityTrustResourceUrl(this.probasepayurl);
														console.log(this.probasepayurl);
													}
													else
													{
														console.log(-1);
														this.presentToast({message: res.message}, 'toastError');
														this.dismissModal();
													}
												},
												err => {
													loading1.dismiss();
													console.log('Error occured');
													this.dismissModal();
												}
											);
										});
									});
								}
								else
								{
									this.storage.get('handy_mate_loggedInUser').then((val2) => {
										this.user = val2;
										console.log(this.user);
										if(this.messageThread!=null)
										{
											this.presentToast({message: this.messageThread}, 'toastInfo');
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
												
											form_params = form_params + "&projectId=" + encodeURI(this.project.id);
											if(this.transactionId!=undefined && this.transactionId!=null)
											{
												form_params = form_params + "&transactionId=" + encodeURI(this.transactionId);
											}
											
											console.log(form_params);
											
											let loading1 = this.loadingCtrl.create({
												content: 'Please wait...'
											});
											loading1.present();
											
											let parameter = form_params;
											let url = "https://handymateservices.com/api/get-project-payment-details";
											this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
												res => {
													let success: any = null;
													success = res.success;
													console.log(res);
													console.log(success);
													loading1.dismiss();
													if(success==422)
													{
														this.logout();
													}
													else if(success==true)
													{
														this.loading.dismiss();
														this.transaction = res.transaction;
														this.project = res.project;
														this.selectedCommand.project = res.project;
														this.probasePayDeviceCode = res.probasePayDeviceCode;
														this.probasePayMerchant = res.probasePayMerchant;
														console.log(this.transaction);
														
														this.probasepayurl = res.probasepayurl + '/' + encodeURI((this.token));
														//'https://handymateservices.com/api/initiate-bevura-payment/' + encodeURI(this.transactionId) + '/' + 
														//	encodeURI(this.transaction.reference_no) + '/' + this.project.id + '/' + encodeURI((this.token));
														this.probasepayurl = this.sanitize.bypassSecurityTrustResourceUrl(this.probasepayurl);
														console.log(this.probasepayurl);
													}
													else
													{
														console.log(-1);
														this.presentToast({message: res.message}, 'toastError');
														this.dismissModal();
													}
												},
												err => {
													loading1.dismiss();
													console.log('Error occured');
													this.dismissModal();
												}
											);
										});
									});
								}
							});
						}
						
					}
				},
				err => {
					this.loading.dismiss();
					console.log('Error occured');
				}
			);
		});
	}
	//export ANDROID_HOME=/path/to/android/studio
	//export PATH=$PATH:$ANDROID_HOME/bin
	

	
	onSegmentChanged(ev: any)
	{
		console.log('Segment changed', ev);
	}
	
	dismissModal() {
	
		let data = {};
		if(this.transactionUpdate!=undefined && this.transactionUpdate!=null)
			data = {'selectedCommand': this.selectedCommand, transaction: this.transactionUpdate };
		else
			data = {'selectedCommand': this.selectedCommand, transaction: this.transaction };
		this.viewCtrl.dismiss(data);
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


interface GeneralReponse{
	project: any;
	success: any;
	message: any;
	transaction: any;
	probasePayDeviceCode: any;
	probasePayMerchant: any;
	transactionUpdate: any;
	paymentOptions: any;
	probasepayurl: any;
}

