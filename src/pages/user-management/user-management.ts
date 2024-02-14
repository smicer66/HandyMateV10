import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Platform, LoadingController, ViewController, ModalController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';
import { MyProfilePage } from '../my-profile/my-profile';
import { MySkillsPage } from '../my-skills/my-skills';
import { MyservicesPage } from '../myservices/myservices';

import { MyGuarantorPage } from '../my-guarantor/my-guarantor';
import { FundWalletPage } from '../fund-wallet/fund-wallet';
import { WithdrawFromWalletPage } from '../withdraw-from-wallet/withdraw-from-wallet';
import { NotificationsPage } from '../notifications/notifications';
import { SupportTicketsPage } from '../support-tickets/support-tickets';
import { ContactPage } from '../contact/contact';
import { TransactionsPage } from '../transactions/transactions';
import { ChangeMyPasswordPage } from '../change-my-password/change-my-password';






/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-user-management',
  templateUrl: 'user-management.html',
})
export class UserManagementPage {

	token: any;
	user: any;
	loading: any;
	
	constructor(public app: App, 
		public nativePageTransitions: NativePageTransitions, public modalCtrl: ModalController, public viewCtrl: ViewController, public platform: Platform, public http: HttpClient, 
		public storage: Storage, public loadingCtrl: LoadingController,
		public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) 
	{
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SettingsPage');
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
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
	
	viewProfilePix()
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(ProfilePixPage, { user: this.user });
		profileModal.onDidDismiss(data => {
			
		});
		profileModal.present();
	}
	
	
	editMyProfile()
	{
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(MyProfilePage);
	}
	
	
	changeMyPassword()
	{
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(ChangeMyPasswordPage);
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
	
	switchToClientMode()
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				var form_params = "";
				console.log(form_params);
				var parameter = form_params;
				this.loading = this.loadingCtrl.create({
					content: 'Switching...'
				});
				this.loading.present();
				this.http.post<SwitchModeResponse>("https://handymateservices.com/api/switch-to-other-mode", parameter, httpOptions).subscribe(
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
							this.presentToast({message: res.message}, 'toastSuccess');
							this.storage.set('handy_mate_loggedInUser', (res.user)).then((xx) => {
								this.user = res.user;
								if(res.showType!=undefined && res.showType!=null && res.showType=='SKILLS')
								{
									let options: NativeTransitionOptions = {
										direction: 'up',
										duration: 600
									};

									this.nativePageTransitions.flip(options);
									this.navCtrl.push(MySkillsPage, {from: 'SettingsPage'});
								}
								else if(res.showType!=undefined && res.showType!=null && res.showType=='GUARANTOR')
								{
									let options: NativeTransitionOptions = {
										direction: 'up',
										duration: 600
									};

									this.nativePageTransitions.flip(options);
									this.navCtrl.push(MyGuarantorPage, {from: 'SettingsPage'});
								}
							});

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
			});
		});
	}
	
	
	depositMoney()
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(FundWalletPage, {from: 'SettingsPage'});
	}
	
	
	withdrawalMoney()
	{
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(WithdrawFromWalletPage, {from: 'SettingsPage'});
	}
	
	goToGuarantorPage()
	{
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(MyGuarantorPage, {from: 'MyProfilePage'});
	}
	
	goToMySkills()
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(MySkillsPage, {from: 'MyProfilePage'});
	}
	
	
	goToMyServices()
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(MyservicesPage, {from: 'MyProfilePage'});
	}
	
	
	
	goToMyNotifications()
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(NotificationsPage, {from: 'SettingsPage'});
	}
	
	
	myTransactions()
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(TransactionsPage, {from: 'SettingsPage'});
	}
	
	supportTickets()
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(SupportTicketsPage, {from: 'SettingsPage'});
	}
	
	contact()
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(ContactPage, {from: 'SettingsPage'});
	}
}



interface SwitchModeResponse{
	user: any;
	success: any;
	message: any;
	showType: any;
}
