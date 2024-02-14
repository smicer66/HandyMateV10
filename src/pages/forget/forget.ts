import { Component } from '@angular/core';
import { NavController, NavParams , ToastController, ModalController, LoadingController,  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from "@ionic/storage";

import { LoginPage } from '../login/login';
import { NewCountryMobilePage } from '../new-country-mobile/new-country-mobile';


@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {

	forgetData:any= {username : ''}
	forgotForm : FormGroup;
	username: AbstractControl;
	countryCode: any = '+260';
	countryFlag: any = 'zm.png';
	loading: any;
	modalDismissData: any;
	token: any;
	
	
	
	
	constructor(public http: HttpClient, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, 
		public nativePageTransitions: NativePageTransitions, public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder, public toast : ToastController) {
		this.forgotForm = this.fb.group({
			'username' : [null, Validators.compose([Validators.required])],
		});
		this.username = this.forgotForm.controls['username'];

		

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ForgetPage');
	}
  
  
  
	doRecoverPassword(forgotFormData){
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		header = header.set('Access-Control-Allow-Origin', '*');

		const httpOptions = {headers: header};
		let phoneprefix = this.countryCode.substring(1);
		let username=this.forgetData.username;
		var form_params = "";
		form_params = form_params + "&username=" + username + "&prefix=" + phoneprefix;
		console.log(form_params);
		var parameter = form_params;
		this.loading = this.loadingCtrl.create({
			content: 'Generating a password for you...'
		});
		this.loading.present();
		this.http.post<AccountVerify>("https://handymateservices.com/api/forgot-password", parameter, httpOptions).subscribe(
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
					
					this.presentToast({message: res.message}, 'toastInfo');
					this.navCtrl.setRoot(LoginPage);

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
  
  
	dismiss(){
		console.log('back pressed');
		this.navCtrl.setRoot(LoginPage);
	}
  
  
	moveToLogin(){
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
	
	
	openMobileNumberModal()
	{
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
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.setRoot(LoginPage);
		
	}
}


interface AccountVerify {
	success: any;
	message: any;
	userId: any;
}