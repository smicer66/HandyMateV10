import { Component } from '@angular/core';
import { ModalController, NavController, ViewController, NavParams, ToastController, Platform, LoadingController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';

/**
 * Generated class for the WithdrawFromWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 



interface MyBalance{
	myBalance: any;
	myBalanceCurrency: any;
	success: any;
	message: any;
	user: any;
}

@Component({
  selector: 'page-withdraw-from-wallet',
  templateUrl: 'withdraw-from-wallet.html',
})
export class WithdrawFromWalletPage {

	ftToOtherBanksFormData = { probaseWalletAmount: '', bank: '', bankAccountName: '', bankAccountNumber: '', probaseWalletNarration: '', probaseWalletBalance: 0.00, mobileMoneyAmount:0.00, mobileMoneyNarration: '', mobileMoneyBalance:0.00, mobileMoneyNumber: '' };
	ftToOtherBanksForm : FormGroup;
	probaseWalletAmount: AbstractControl;
	probaseWalletNarration: AbstractControl;
	probaseWalletBalance: AbstractControl;
	mobileMoneyAmount: AbstractControl;
	mobileMoneyNarration: AbstractControl;
	mobileMoneyBalance: AbstractControl;
	mobileMoneyNumber: AbstractControl;
	bank: AbstractControl;
	bankAccountName: AbstractControl;
	bankAccountNumber: AbstractControl;
	
	token: any;
	loading: any;
	loading1: any;
	user: any;
	segmentSelected: string = "probaseWallet";
	myBalance: any = 0.00;
	myBalanceCurrency: any = 'ZMW'
	banks = [];
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public app: App, public modalCtrl: ModalController,  public viewCtrl: ViewController, public storage: Storage, public loadingCtrl: LoadingController, 
		public nativePageTransitions: NativePageTransitions, public http: HttpClient, public platform: Platform, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		
		
		this.ftToOtherBanksForm = this.fb.group({
			'probaseWalletAmount': [null, Validators.compose([])],
			'probaseWalletNarration': [null, Validators.compose([])],
			'mobileMoneyAmount': [null, Validators.compose([])],
			'mobileMoneyNarration': [null, Validators.compose([])],
			'probaseWalletBalance': [null, Validators.compose([])],
			'mobileMoneyBalance': [null, Validators.compose([])],
			'mobileMoneyNumber': [null, Validators.compose([])],
			'bank': [null, Validators.compose([])],
			'bankAccountName': [null, Validators.compose([])],
			'bankAccountNumber': [null, Validators.compose([])]
		});

		this.probaseWalletAmount = this.ftToOtherBanksForm.controls['probaseWalletAmount'];
		this.probaseWalletNarration = this.ftToOtherBanksForm.controls['probaseWalletNarration'];
		this.mobileMoneyAmount = this.ftToOtherBanksForm.controls['mobileMoneyAmount'];
		this.mobileMoneyNarration = this.ftToOtherBanksForm.controls['mobileMoneyNarration'];

		this.probaseWalletBalance = this.ftToOtherBanksForm.controls['probaseWalletBalance'];
		this.mobileMoneyBalance = this.ftToOtherBanksForm.controls['mobileMoneyBalance'];
		this.mobileMoneyNumber = this.ftToOtherBanksForm.controls['mobileMoneyNumber'];

		this.bank = this.ftToOtherBanksForm.controls['bank'];
		this.bankAccountName = this.ftToOtherBanksForm.controls['bankAccountName'];
		this.bankAccountNumber = this.ftToOtherBanksForm.controls['bankAccountNumber'];
		
		
		this.storage.get('handy_mate_banks').then((val2) => {
			console.log(val2);
			this.banks = val2;
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuypayUtilityDataPage');
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			console.log(val2);
			this.user = val2;
			this.ftToOtherBanksFormData.mobileMoneyNumber = this.user.username;
		});
	}
	
	ionViewDidEnter() {
		console.log('ionViewDidLoad LoansPage');
		this.getMyBalance();
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
							this.myBalance = res.myBalance;
							this.myBalanceCurrency = res.myBalanceCurrency;
							console.log(this.myBalance);
							console.log(this.myBalanceCurrency);
							
						}
						else
						{
							console.log(-1);
							this.presentToast({message: res.message}, 'toastError');
							this.navCtrl.pop();
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
	
	verifyAccountNo(recAccountNo)
	{
		
	}
	
	
	
	
	verifyWalletNo(recWalletNo)
	{
		
	}
	
	
	
	doFundsTransfer(withdrawType, ftToOtherBanksFormData)
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
				if(this.segmentSelected=='probaseWallet')
				{
					form_params = form_params + "&amount=" + encodeURI(ftToOtherBanksFormData.probaseWalletAmount);
					form_params = form_params + "&narration=" + encodeURI(ftToOtherBanksFormData.probaseWalletNarration);
					form_params = form_params + "&bank=" + encodeURI(ftToOtherBanksFormData.bank);
					form_params = form_params + "&bankAccountName=" + encodeURI(ftToOtherBanksFormData.bankAccountName);
					form_params = form_params + "&bankAccountNumber=" + encodeURI(ftToOtherBanksFormData.bankAccountNumber);
				}
				else if(this.segmentSelected=='mobileMoney')
				{
					form_params = form_params + "&amount=" + encodeURI(ftToOtherBanksFormData.mobileMoneyAmount);
					form_params = form_params + "&narration=" + encodeURI(ftToOtherBanksFormData.mobileMoneyNarration);
					form_params = form_params + "&mobileMoneyNumber=" + encodeURI(ftToOtherBanksFormData.mobileMoneyNumber);
				}
				form_params = form_params + "&withdrawType=" + this.segmentSelected;
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/withdraw-funds";
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
						else if(success===true)
						{
							this.storage.set('handy_mate_loggedInUser', (res.user)).then((xx) => {
								this.presentToast({message: res.message}, 'toastSuccess');
							});
							this.navCtrl.pop();
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



interface NewProjectReponse{
	success: any;
	transaction: any;
	probasePayMerchant: any;
	probasePayDeviceCode: any;
	message: any;
	user: any;
}