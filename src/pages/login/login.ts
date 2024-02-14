import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, NavController, NavParams, ToastController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NgZone } from '@angular/core';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OneSignal } from '@ionic-native/onesignal';

import { RegisterPage } from '../register/register';
import { ForgetPage } from '../forget/forget';
import { NewCountryMobilePage } from '../new-country-mobile/new-country-mobile';
import { TabsPage } from '../tabs/tabs';
import { MyProfilePage } from '../my-profile/my-profile';
import { MySkillsPage } from '../my-skills/my-skills';
import { MyservicesPage } from '../myservices/myservices';

import { MyGuarantorPage } from '../my-guarantor/my-guarantor';
import { RegisterStepTwoPage } from '../register-step-two/register-step-two';

							

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/*@IonicPage()*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  userData:any;
	loginData = { username:'', password:'' };
	authForm : FormGroup;
	username: AbstractControl;
	password: AbstractControl;
	passwordtype:string='password';
	passeye:string ='SHOW';
	loading: any;
	message: any;
	countryCode: any = '+260';
	countryFlag: any = 'zm.png';
	modalDismissData: any;
	jsonData: any;
	tags: any;

	//,public loadingProvider: LoadingProvider
	constructor(public zone: NgZone, public platform: Platform, public modalCtrl: ModalController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public _OneSignal: OneSignal, 
		public http: HttpClient, public alertCtrl: AlertController, public storage: Storage, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, 
		public nativePageTransitions: NativePageTransitions) {
		this.authForm = this.fb.group({
			'username' : [null, Validators.compose([Validators.required])],
			'password': [null, Validators.compose([Validators.required])],
		});

        this.username = this.authForm.controls['username'];
		this.password = this.authForm.controls['password'];
		this.message = navParams.get('message');
		this.countryFlag = 'zm.png';
		this.countryCode = '+260';
		console.log('this.message...' + this.message);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
		//console.log(this.cryptoJS.HmacSHA256("Message"));
		//console.log(CryptoJS.PBKDF2('aaabb', "XX").toString());
		if(this.message!=null)
		{
			this.presentToast({message: this.message}, 'toastInfo');
		}
	}
	
	
	
	
	ionViewDidEnter(){
		let welcome = this.navParams.get('welcome');
		if(welcome!=undefined && welcome!=null && welcome==1)
		{
			this.presentToast({message: 'Login to start using our services'}, 'toastSuccess');
		}
			
		this.storage.get('notificationActive').then((val2) => {
			console.log(val2);
			if(val2!=undefined && val2!=null)
			{
				this.jsonData = JSON.parse(val2);
				console.log(this.jsonData);
			}
		});
	}



	login(loginData) {
	
		this.storage.remove('handy_mate_token');
		this.storage.remove('handy_mate_loggedInUser');
		this.storage.remove('handy_mate_countries');
		this.storage.remove('handy_mate_provinces');
		this.storage.remove('handy_mate_districts');
		this.storage.remove('handy_mate_skills');
		this.storage.remove('handy_mate_sub_skills');
		
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		header = header.set('Access-Control-Allow-Origin', '*');

		const httpOptions = {headers: header};
		let phoneprefix = this.countryCode.substring(1);
		let username=loginData.username;
		let password=loginData.password;
		var form_params = "";
		form_params = form_params + "&prefix=" + encodeURI(phoneprefix.trim()) + "&username=" + encodeURI(username.trim()) + "&password=" + encodeURI(password.trim());
		let cordCheck = false;
		
		console.log(form_params);
		var parameter = form_params;
		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		//this.navCtrl.setRoot(TabsPage);
		//this.navCtrl.setRoot(AddBankAccountPage);
		//this.navCtrl.setRoot(ApplyLoanPage);
		/*
		export ANDROID_HOME=/home/xkalibaer/snap/androidsdk/29/AndroidSDK
		*/
		this.loading.present();
		this.http.post<VerifyUserRespInt>("https://handymateservices.com/api/auth/login", parameter, httpOptions).subscribe(
			res => {
				this.loading.dismiss();
				let status: any = null;
				status = res.success;
				console.log(res);
				console.log(status);
				
				if(res.success===true)
				{
					
					if(res.token)
					{
						if (this.platform.is('cordova'))
						{
							window["plugins"].OneSignal.getIds(ids => {
								this.tags = ids;
								console.log(ids);
								var form_params1 = "";
								form_params1 = form_params1 + "&prefix=" + encodeURI(phoneprefix.trim()) + "&username=" + encodeURI(username.trim());
								form_params1 = form_params1 + "&signalId=" + encodeURI(this.tags.userId);
								form_params1 = form_params1 + "&platform=Android";
								form_params1 = form_params1 + "&platform_version=1.03";
								var parameter1 = form_params1;
								
								let header = new HttpHeaders();
								header = header.set('Content-Type', 'application/x-www-form-urlencoded');
								header = header.set('Accept-Language', 'en-US,en;q=0.5');
								header = header.set('Access-Control-Allow-Origin', '*');
								header = header.set('Authorization', res.token);
								console.log(header);
								const httpOptions = {headers: header};
								let parameter = form_params1;

								this.http.post<VerifyUserRespInt>("https://handymateservices.com/api/update-user-signal", parameter, httpOptions).subscribe(
									res => {
										console.log(res);
										if(res.success===true)
										{
											console.log(res)
											let onesignalIdCheck = 'handy_mate_one_signal';
											this.storage.set(onesignalIdCheck, res.user.id);
										}
									},
									err => {
										
									}
								);
									
							});
							cordCheck = true;
						}
		
						this.storage.set('handy_mate_token', res.token).then((xx) => {
							this.storage.set('handy_mate_loggedInUser', (res.user)).then((xx) => {
								this.storage.set('handy_mate_countries', (res.countries)).then((xx) => {
									this.storage.set('handy_mate_provinces', (res.provinces)).then((xx) => {
										this.storage.set('handy_mate_districts', (res.districts)).then((xx) => {
											this.storage.set('handy_mate_skills', (res.skills)).then((xx) => {
												this.storage.set('handy_mate_sub_skills', (res.sub_skills)).then((xx) => {
													this.zone.run(() => {
														
														
														//this.navCtrl.setRoot(TabsPage);
														
														if(res.user.otp!=undefined && res.user.otp!=null)
														{
															this.navCtrl.setRoot(RegisterStepTwoPage, {username: username, password: password, userId: res.user.id});
														}
														else
														{
															if(res.user.role_type=='Artisan')
															{
																if(res.user.validated!=undefined && res.user.validated!=null && res.user.validated==1)
																{
																	this.navCtrl.setRoot(TabsPage);
																}
																else
																{
																	if(res.user.profile_provided!=undefined && res.user.profile_provided!=null && res.user.profile_provided==1)
																	{
																		if(res.artisan_skills!=undefined && res.artisan_skills!=null && res.artisan_skills.length > 0)
																		{
																			if(res.artisan_sub_skills!=undefined && res.artisan_sub_skills!=null && res.artisan_sub_skills.length > 0)
																			{
																				this.storage.set('handy_mate_artisan_skills', (res.artisan_skills)).then((xx) => {
																					
																				});
																				if(res.guarantor!=undefined && res.guarantor!=null)
																				{
																					this.storage.set('handy_mate_guarantor', (res.guarantor)).then((xx) => {
																						this.navCtrl.setRoot(TabsPage);
																					});
																				}
																				else
																				{
																					this.navCtrl.setRoot(MyGuarantorPage, {'from': 'LoginPage'});
																				}
																			}
																			else
																			{
																				this.navCtrl.setRoot(MyservicesPage, {'from': 'LoginPage', 'artisan_sub_skills': res.artisan_sub_skills});
																			}
																		}
																		else
																		{
																			this.navCtrl.setRoot(MySkillsPage, {'from': 'LoginPage'});
																		}
																	}
																	else
																	{
																		this.navCtrl.setRoot(MyProfilePage, {'from': 'LoginPage'});
																	}
																}
															}
															else
															{
																if(res.user.validated!=undefined && res.user.validated!=null && res.user.validated==1)
																{
																	this.navCtrl.setRoot(TabsPage);
																}
																else
																{
																	if(res.user.profile_provided!=undefined && res.user.profile_provided!=null && res.user.profile_provided==1)
																	{
																		/*if(res.guarantor!=undefined && res.guarantor!=null)
																			this.navCtrl.setRoot(TabsPage);
																		else
																			this.navCtrl.setRoot(MyGuarantorPage, {'from': 'LoginPage'});*/
																		this.navCtrl.setRoot(TabsPage);
																	}
																	else
																	{
																		this.navCtrl.setRoot(MyProfilePage, {'from': 'LoginPage'});
																	}
																}
															}
														}
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
						this.presentToast({message: 'Logging In Failed. Ensure you provide your valid password to login'}, 'toastError');
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
				this.presentToast({message: 'Invalid username & password combination. Please provide your valid username and password'}, 'toastError');
			}
		);

	}

	// Move to register page
	moveToRegister(){
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.setRoot(RegisterPage);
	}
	
	userLogin(loginData){
	}
	
	moveToForgotPassword()
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(ForgetPage);
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


	managePassword() {
		if(this.passwordtype == 'password')
		{
			this.passwordtype='text';
			this.passeye='HIDE';
		}else
		{
			this.passwordtype='password';
			this.passeye = 'SHOW';
		}
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


interface VerifyUserRespInt {
	success: any;
	message: any;
	token: any;
	user: any;
	countries: any;
	districts: any;
	provinces: any;
	skills: any;
	validated: any;
	profileProvided: any;
	artisan_skills: any;
	guarantor: any;
	artisan_sub_skills: any;
	sub_skills: any;
}
