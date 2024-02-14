import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams, ToastController, ActionSheetController, Platform, AlertController, LoadingController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NgZone } from '@angular/core';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { RegisterPage } from '../register/register';
import { LoginPage } from '../login/login';

/**
 * Generated class for the RegisterStepTwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@Component({
  selector: 'page-register-step-two',
  templateUrl: 'register-step-two.html',
})
export class RegisterStepTwoPage {
	
	registerStepTwoData = { otp1: '', otp2: '', otp3: '', otp4: '' };
	registerStepTwoPageForm : FormGroup;
	otp1: AbstractControl;
	otp2: AbstractControl;
	otp3: AbstractControl;
	otp4: AbstractControl;
	loading: any;
	otp_1: any;
	otp_2: any;
	otp_3: any;
	otp_4: any;
	advice: any;
	user: any;
	userId: any;
	username: any;
	password: any;
	tempOtp: any = "";
	token: any;

	
	
	constructor(public app: App, public zone: NgZone, public storage: Storage, public platform: Platform, public http: HttpClient, public loadingCtrl: LoadingController, 
		public nativePageTransitions: NativePageTransitions, public alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, 
		public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.registerStepTwoPageForm = this.fb.group({
			'otp1' : [null, Validators.compose([Validators.required])],
			'otp2': [null, Validators.compose([Validators.required])],
			'otp3': [null, Validators.compose([Validators.required])],
			'otp4': [null, Validators.compose([Validators.required])]
		});

        this.otp1 = this.registerStepTwoPageForm.controls['otp1'];
        this.otp2 = this.registerStepTwoPageForm.controls['otp2'];
        this.otp3 = this.registerStepTwoPageForm.controls['otp3'];
        this.otp4 = this.registerStepTwoPageForm.controls['otp4'];
		
		this.userId = navParams.get('userId');
		this.username = navParams.get('username');
		this.password = navParams.get('password');
		this.tempOtp = navParams.get('otp') + "";
		this.registerStepTwoData.otp1 = (this.tempOtp[0]);
		this.registerStepTwoData.otp2 = (this.tempOtp[1]);
		this.registerStepTwoData.otp3 = (this.tempOtp[2]);
		this.registerStepTwoData.otp4 = (this.tempOtp[3]);
		console.log(this.registerStepTwoData);
		
		console.log(navParams);
		this.advice = 'Enter the last 4 digit OTP sent to your mobile phone';
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterStepTwoPage');
		this.advice = 'Enter the last 4 digit OTP sent to your mobile phone';
	}
	
	ionViewDidEnter() {
		console.log('ionViewDidLoad RegisterStepTwoPage111');
		this.advice = 'Enter the last 4 digit OTP sent to your mobile phone';
	}
	
	
	finishFunction()
	{
		if(this.registerStepTwoData.otp1.length>0 && this.registerStepTwoData.otp2.length>0 && this.registerStepTwoData.otp3.length>0 && this.registerStepTwoData.otp4.length>0)
		{
			this.advice = 'Awesome! Now press the confirm button';
		}
	}
	
	gotoNextField(nextElement)
	{
		nextElement.setFocus();
    }
	
	resendOTP()
	{
	
	}
	
  
	doRegisterStepTwo(registerStepTwoData){
		console.log(registerStepTwoData);
		if(this.registerStepTwoData.otp1.trim().length==0 || this.registerStepTwoData.otp2.trim().length==0 || this.registerStepTwoData.otp3.trim().length==0 || this.registerStepTwoData.otp4.trim().length==0){
		  
			this.presentToast({message: 'Hey, your otp must be provided to confirm your mobile number'}, 'toastError');
			
		}else {
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			header = header.set('Access-Control-Allow-Origin', '*');

			const httpOptions = {headers: header};
			
			var form_params = "";
			let otpStr = this.registerStepTwoData.otp1 + "" + this.registerStepTwoData.otp2 + "" + this.registerStepTwoData.otp3 + "" + this.registerStepTwoData.otp4;
			form_params = form_params + "&otp=" + otpStr + "&userId=" + this.userId + "&username=" + this.username + "&password=" + this.password;
			console.log(form_params);
			var parameter = form_params;
			this.loading = this.loadingCtrl.create({
				content: 'Confirming your number...'
			});
			this.loading.present();
			this.http.post<VerifyUserRespInt>("https://handymateservices.com/api/verify-mobile-number", parameter, httpOptions).subscribe(
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
						if(res.token)
						{
							this.storage.set('handy_mate_token', res.token).then((xx) => {
								this.storage.set('handy_mate_loggedInUser', (res.user)).then((xx) => {
									this.storage.set('handy_mate_countries', (res.countries)).then((xx) => {
										this.storage.set('handy_mate_provinces', (res.provinces)).then((xx) => {
											this.storage.set('handy_mate_districts', (res.districts)).then((xx) => {
												this.storage.set('handy_mate_skills', (res.skills)).then((xx) => {
													this.storage.set('handy_mate_banks', (res.banks)).then((xx) => {
														this.zone.run(() => {
															this.presentToast({message: res.message}, 'toastSuccess');
															this.storage.remove('handy_mate_token');
															this.storage.remove('handy_mate_loggedInUser');
															this.storage.remove('handy_mate_countries');
															this.storage.remove('handy_mate_provinces');
															this.storage.remove('handy_mate_districts');
															this.storage.remove('handy_mate_skills');
															this.token = null;
															let options: NativeTransitionOptions = {
																direction: 'up',
																duration: 600
															};

															this.nativePageTransitions.flip(options);
															this.navCtrl.setRoot(LoginPage, {welcome: 1});
														});
													});
												});
											});
										});
									});
								});
							});

						}
						else
						{
							this.presentToast({message: res.message}, 'toastError');
							let options: NativeTransitionOptions = {
								direction: 'up',
								duration: 600
							};

							this.nativePageTransitions.flip(options);
							this.navCtrl.setRoot(LoginPage);
						}
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
	}
	
	doCancelRegisterStepTwo()
	{
	
	
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
		this.navCtrl.setRoot(LoginPage);
		
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
		console.log('dismiss clicked');
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.setRoot(RegisterPage);
	}
}

interface VerifyUserRespInt {
	success: any;
	message: any;
	token: any;
	user: any;
	countries: any;
	districts: any;
	provinces: any;
	skills: any;
	banks: any;
}