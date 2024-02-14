import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, ViewController, ToastController, Platform, LoadingController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { Rave, RavePayment, Misc } from 'rave-ionic3';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginPage } from '../login/login';
import { ProbasePayPage } from '../probase-pay/probase-pay';
import { ProfilePixPage } from '../profile-pix/profile-pix';

/**
 * Generated class for the FundWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 


@Component({
  selector: 'page-fund-wallet',
  templateUrl: 'fund-wallet.html',
})
export class FundWalletPage {

	intlFundsTransferData = { amount: 1000,  narration: ''};
		
	intlFundsTransferForm : FormGroup;
	amount: AbstractControl;
	narration: AbstractControl;
	token: any;
	loading: any;
	loading1: any;
	user: any;
	segmentSelected: string = "probaseWallet";
	myBalance: any;
	myBalanceCurrency: any;
	mobilemoneyurl: any;
	mobileMoneyIframeLoaded: any = 0;
	
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public app: App, public rave: Rave, public ravePayment: RavePayment, public misc: Misc, public sanitize: DomSanitizer, 
		public modalCtrl: ModalController,  public storage: Storage, public loadingCtrl: LoadingController, public viewCtrl: ViewController, 
		public http: HttpClient, public platform: Platform, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, 
		public nativePageTransitions: NativePageTransitions, public navParams: NavParams) {
		this.intlFundsTransferForm = this.fb.group({
			'amount' : [null, Validators.compose([Validators.required])],
			'narration': [null, Validators.compose([])]
		});

		this.amount = this.intlFundsTransferForm.controls['amount'];
        this.narration = this.intlFundsTransferForm.controls['narration'];
		this.mobilemoneyurl = this.sanitize.bypassSecurityTrustResourceUrl('http://handymateservices.com/mobile/payment-index');
	}

	ionViewDidLoad() {
		
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			console.log(val2);
			this.user = val2;
		});
	}
	
	
	loadMobileMoneyPay(intlFundsTransferData)
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => 
		{
			this.user = val2;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				var form_params = "";			
				form_params = form_params + "&amount=" + encodeURI(intlFundsTransferData.amount);
				form_params = form_params + "&narration=" + encodeURI(intlFundsTransferData.narration);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/fund-wallet";
				this.http.post<FundWalletResp>(url, parameter, httpOptions).subscribe(
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
						else if(success===true)
						{
							if(res.transaction!=undefined && res.transaction!=null)
							{
								this.loading1 = this.loadingCtrl.create({
									content: 'Loading Payment View...'
								});
								this.loading1.present();
								
	
								const PRODUCTION_FLAG = false;
								const YOUR_PUBLIC_KEY = 'FLWPUBK-8dbdab6375ea89adb96bb2e5efb77617-X';
								this.rave.init(PRODUCTION_FLAG, YOUR_PUBLIC_KEY).then(_ => {
									var paymentObject = this.ravePayment.create({
										customer_email: this.user.email_address,
										amount: (intlFundsTransferData.amount),
										customer_phone: this.user.mobile_number,
										currency: "ZMW",
										txref: res.transaction.reference_no,
										redirect_url: "http://handymateservices.com/mobile/process-pay-redirect",
										meta: [{
										  metaname: "flightID",
										  metavalue: "AP1234"
										}]
									})
									this.rave.preRender(paymentObject).then(secure_link => {
										secure_link = secure_link +" ";
										console.log(secure_link);
										this.mobileMoneyIframeLoaded = 1;
										this.mobilemoneyurl = secure_link;
										this.mobilemoneyurl = this.sanitize.bypassSecurityTrustResourceUrl(this.mobilemoneyurl);
									}).catch(error => {
										// Error or invalid paymentObject passed in
									})
								});
								
								this.loading1.dismiss();
							}
							else
							{
								this.presentToast({message: res.message}, 'toastError');
							}
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
		});
		
	}
	
	
	doFundsTransfer(intlFundsTransferData)
	{
		console.log(intlFundsTransferData);
		this.storage.get('handy_mate_loggedInUser').then((val2) => 
		{
			this.user = val2;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				var form_params = "";			
				form_params = form_params + "&amount=" + encodeURI(intlFundsTransferData.amount);
				form_params = form_params + "&narration=" + encodeURI(intlFundsTransferData.narration);
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/fund-wallet";
				this.http.post<FundWalletResp>(url, parameter, httpOptions).subscribe(
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
						else if(success===true)
						{
							if(res.transaction!=undefined && res.transaction!=null)
							{
								this.loading1 = this.loadingCtrl.create({
									content: 'Loading Payment View...'
								});
								this.loading1.present();
								
	
	
								const probasePayModal = this.modalCtrl.create(ProbasePayPage, 
									{
										type: 'FUND WALLET', transaction: res.transaction, probasePayMerchant: res.probasePayMerchant, 
										probasePayDeviceCode: res.probasePayDeviceCode, mobileNumber: this.user.mobile_number, payeeName: this.user.first_name + ' ' + this.user.last_name, 
										fundAmount: intlFundsTransferData.amount, title: 'Fund Wallet'
									}
								);
								this.loading1.dismiss();
								probasePayModal.onDidDismiss(data => {
									console.log(data);
									this.getMyBalance();
								});
								probasePayModal.present();
							}
							else
							{
								this.presentToast({message: res.message}, 'toastError');
							}
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
		});
	}
	
	
	
	getMyBalance()
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
				let url = "https://handymateservices.com/api/getMyBalance";
				this.http.post<MyBalance>(url, parameter, httpOptions).subscribe(
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
							this.storage.set('handy_mate_loggedInUser', (res.user)).then((xx) => {
								this.myBalance = res.myBalance;
								this.myBalanceCurrency = res.myBalanceCurrency;
								console.log(this.myBalance);
								console.log(this.myBalanceCurrency);
							});
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
			content: 'Please wait...'
		});
		loading.present();
		this.storage.remove('zambia_bank_customer_token');
		this.storage.remove('zambia_bank_loggedInUser');
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

	
	viewProfilePix()
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(ProfilePixPage, { user: this.user });
		profileModal.onDidDismiss(data => {
			
		});
		profileModal.present();
	}
}

interface MyBalance{
	myBalance: any;
	myBalanceCurrency: any;
	success: any;
	message: any;
	user: any;
}

interface FundWalletResp{
	success: any;
	message: any;
	transaction: any;
	probasePayMerchant: any;
	probasePayDeviceCode: any;
}