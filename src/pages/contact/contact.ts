import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ToastController, ViewController, Platform, App, LoadingController  } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ProfilePixPage } from '../profile-pix/profile-pix';
import { LoginPage } from '../login/login';



@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

	contactUsForm : FormGroup;
    contactUsData :any = { details: ''  };
    projectList : any = [];
    transactionList: any = [];
	details: AbstractControl;
	token: any;
	loading: any;
	user: any;

    constructor(public platform: Platform, 
		public nativePageTransitions: NativePageTransitions, public modalCtrl: ModalController, public viewCtrl: ViewController, public app: App, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.contactUsForm = this.fb.group({
			'details': [null, Validators.compose([])]
		});

        this.details = this.contactUsForm.controls['details'];

		console.log(this.contactUsData);
	}
	
	viewProfilePix()
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(ProfilePixPage, { user: this.user });
		profileModal.onDidDismiss(data => {
			
		});
		profileModal.present();
	}


	ionViewDidLoad() {
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
		});
	}
		


    sendContactMessage(contactUsData, user)
    {
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		
		this.storage.get('handy_mate_token').then((val2) => {
			this.token = val2;
			header = header.set('Authorization', this.token);
			
			const httpOptions = {headers: header};
			console.log(header);
			console.log(httpOptions);
			var form_params = "";
			form_params = form_params + "message=" + encodeURI(contactUsData.details);
			console.log(form_params);
			
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();
			
			
			let parameter = form_params;
			let url = "https://handymateservices.com/api/compose-contact-message";
			this.http.post<ContactUsResponse>(url, parameter, httpOptions).subscribe(
				res => {
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
						this.loading.dismiss();
						this.presentToast({message: res.message}, 'toastSuccess');
						this.viewCtrl.dismiss();
						
					}
					else
					{
						this.loading.dismiss();
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


interface ContactUsResponse{
	message: any;
	success: any;
}
