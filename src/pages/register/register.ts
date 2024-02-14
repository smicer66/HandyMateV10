import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController, ViewController, ModalController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from "@ionic/storage";

import { LoginPage } from '../login/login';
import { RegisterStepTwoPage } from '../register-step-two/register-step-two';
import { NewCountryMobilePage } from '../new-country-mobile/new-country-mobile';


//declare var cordova: any;

/*@IonicPage()*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})


export class RegisterPage {

	regData = { username: '' , password: '', confirm_password: '', role_type: ''};
	authForm : FormGroup;
	username: AbstractControl;
	confirm_password: AbstractControl;
	password: AbstractControl;
	role_type: AbstractControl;
	loading: any;
	countryCode: any = '+260';
	countryFlag: any = 'zm.png';
	modalDismissData: any;
	token: any;
	
	
	
	constructor(public app: App, public storage: Storage, public viewCtrl: ViewController, public modalCtrl: ModalController, public platform: Platform, 
		public nativePageTransitions: NativePageTransitions, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public http: HttpClient, 
		public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.authForm = this.fb.group({
			'username' : [null, Validators.compose([Validators.required])],
			'confirm_password' : [null, Validators.compose([Validators.required])],
			'password' : [null, Validators.compose([Validators.required])],
			'role_type' : [null, Validators.compose([Validators.required])],
		});
		console.log('1');
        this.username = this.authForm.controls['username'];
		this.confirm_password = this.authForm.controls['confirm_password'];
		this.password = this.authForm.controls['password'];
		this.role_type = this.authForm.controls['role_type'];
		console.log('2');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}

	doRegisterStepOne(regData){
		//this.navCtrl.setRoot(RegisterStepTwoPage, {});
		if(regData.role_type.trim().length==0 || regData.username.trim().length==0 || regData.confirm_password.trim().length==0){
		  
			this.presentToast({message: 'Hello, provide all required information!'}, 'toastError');
			
		}else {
			//this.presentToast({message: 'You are fine to go'});
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('Access-Control-Allow-Origin', '*');

			const httpOptions = {headers: header};
			let phoneprefix = this.countryCode.substring(1);
			let username=this.regData.username;
			let password=this.regData.password;
			let role_type=this.regData.role_type;
			var form_params = "";
			form_params = form_params + "&username=" + (username) + "&password=" + password + "&role_type=" + role_type + "&prefix=" + phoneprefix;
			console.log(form_params);
			var parameter = form_params;
			this.loading = this.loadingCtrl.create({
				content: 'Confirming your number...'
			});
			this.loading.present();
			this.http.post<AccountVerify>("https://handymateservices.com/api/register-user", parameter, httpOptions).subscribe(
				res => {
					this.loading.dismiss();
					let status: any = null;
					status = res.success;
					console.log(res);
					console.log(status);
					if(res.success==422)
					{
						this.logout();
					}
					else if(res.success===true)
					{
						
						let userId = res.userId;
						this.presentToast({message: res.message}, 'toastSuccess');
						
						let options: NativeTransitionOptions = {
							direction: 'up',
							duration: 600
						};

						this.nativePageTransitions.flip(options);
						this.navCtrl.setRoot(RegisterStepTwoPage, {userId: userId, username: (phoneprefix+''+username), password: password, otp: res.otp});
					}
					else
					{
						this.presentToast({message: res.message}, 'toastError');
					}
				},
				err => {
					this.loading.dismiss();
					console.log('Error occured');
					this.presentToast({message: 'Error occured'}, 'toastError');
				}
			);
			
		}
		//
		console.log(regData);
		/*var headers = new Headers();
		headers.append("Accept", 'application/json');
		headers.append('Content-Type', 'application/json' );
		let options = new RequestOptions({ headers: headers });*/
		/*var parameter = JSON.stringify({account_number:regData.account_number});
		console.log(parameter);
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/json; charset=utf-8');
		header = header.set('Accept', 'application/json');
		
		const httpOptions = {headers: header};
		
		this.loading = this.loadingCtrl.create({
			content: 'Loading View. Please wait...'
		});
		this.loading.present();
		this.http.post<AccountVerify>("http://bankmobileapp.syncstatenigeria.com/api/v1/auth/register-step-one", parameter, httpOptions).subscribe(
			res => {
				this.loading.dismiss();
				let status: any = null;
				status = res.status;
				if(status==422)
				{
					this.logout();
				}
				else if(status==1)
				{
					let account_number = res.account_number;
					console.log(account_number);
					
					let options: NativeTransitionOptions = {
						direction: 'up',
						duration: 600
					};

					this.nativePageTransitions.flip(options);
					this.navCtrl.setRoot(RegisterStepTwoPage, {account_number_: account_number, reg_code_: res.reg_code});
				}
				else
				{
					let alert = this.alertCtrl.create({
						title: 'Account Verification',
						subTitle: res.response_msg,
						buttons: ['Dismiss']
					});
					alert.present();
				}
			},
			err => {
				this.loading.dismiss();
				console.log('Error occured');
			}
		);*/
		
	}

	moveToLogin(){
		
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.setRoot(LoginPage);
	}
	
	managePassword() {
    
	}
 
	managecnfPassword() {
    
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
	
	
	dismiss(){
		console.log('back pressed');
		
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.setRoot(LoginPage);
	}
	
	openMobileNumberModal()
	{
		console.log(222);
		this.loading = this.loadingCtrl.create({
			content: 'Loading View. Please wait...'
		});
		this.loading.present();
		const profileModal = this.modalCtrl.create(NewCountryMobilePage, {  });
		this.loading.dismiss();
		profileModal.onDidDismiss(data => {
			console.log(data);
			if(data!=null && data.selectedCountry!=undefined && data.selectedCountry!=null && data.selectedCountry.code!=undefined && data.selectedCountry.code!=null )
			{
				this.modalDismissData = JSON.stringify(data);
				this.countryCode = data.selectedCountry.code;
				this.countryFlag = data.selectedCountry.flag;
			}
		});
		profileModal.present();
	}
}

interface AccountVerify{
	success: any;
	message: string;
	user: any;
	otp: any;
	userId: any;
}
