import { Component } from '@angular/core';
import { NavController, ModalController, ViewController, NavParams, ToastController, Platform, LoadingController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';
import { MyGuarantorPage } from '../my-guarantor/my-guarantor';
import { MySkillsPage } from '../my-skills/my-skills';
import { UploadAttachmentPage } from '../upload-attachment/upload-attachment';




/**
 * Generated class for the BookBusTicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-change-my-password',
  templateUrl: 'change-my-password.html',
})
export class ChangeMyPasswordPage {

	changePasswordData = { current_password: '', new_password: '', rnew_password: '' };	//national_id: '', 
	changePasswordForm : FormGroup;
	current_password: AbstractControl;
	new_password: AbstractControl;
	rnew_password: AbstractControl;
	user: any = {};
	userData: any = {};
	token: any;
	
	loading: any;
	
	//, public file: File, public filePath: FilePath, public loadingProvider: LoadingProvider
	constructor(
		public nativePageTransitions: NativePageTransitions, public app: App, public modalCtrl: ModalController, public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
		this.changePasswordForm = this.fb.group({
			'current_password' : [null, Validators.compose([Validators.required])],
			'new_password': [null, Validators.compose([Validators.required])],
			'rnew_password': [null, Validators.compose([Validators.required])]
		});

        this.current_password = this.changePasswordForm.controls['current_password'];
        this.new_password = this.changePasswordForm.controls['new_password'];
        this.rnew_password = this.changePasswordForm.controls['rnew_password'];
		
		console.log(this.navParams);
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad');
		
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
	
	
	
	doChangePassword(changePasswordData, user)
	{
		console.log(user);
		// && (this.changePasswordData.national_id+"").trim().length>0 
		if(
			(this.changePasswordData.current_password.trim()+"").length>7 && (this.changePasswordData.new_password.trim()+"").length>7
			&& (this.changePasswordData.rnew_password.trim()+"").length>7
		)
		{
			let pcd = true;
			if(this.changePasswordData.rnew_password.trim()==this.changePasswordData.new_password.trim())
			{
				if(this.changePasswordData.rnew_password.trim()==this.changePasswordData.current_password.trim())
				{
					this.presentToast({message: 'Your new password must be different from the current password'}, 'toastError');
				}
				else
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
							
						form_params = form_params + "&pwd=" + encodeURI(this.changePasswordData.current_password);
						form_params = form_params + "&rpwd=" + encodeURI(this.changePasswordData.rnew_password);
						form_params = form_params + "&npwd=" + encodeURI(this.changePasswordData.new_password);
									
						console.log(form_params);
						
						this.loading = this.loadingCtrl.create({
							content: 'Please wait...'
						});
						this.loading.present();
						
						let parameter = form_params;
						let url = "https://handymateservices.com/api/change-password";
						this.http.post<UserDataRespInt>(url, parameter, httpOptions).subscribe(
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
									this.presentToast({message: res.message}, 'toastSuccess');
									this.logout();
								}
								else
								{
									console.log(-1);
									this.presentToast({message: res.message}, 'toastError');
									//this.viewCtrl.dismiss({});
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
			else
			{
				this.presentToast({message: 'New Passwords must match'}, 'toastError');
			}
					 
		}
		else
		{
			this.presentToast({message: 'Provide all required information before submitting. Minimum length of your password should be 8 characters'}, 'toastError');
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
}
 
interface UserDataRespInt{
	success: any;
	userDetails: any;
	message: any;
}