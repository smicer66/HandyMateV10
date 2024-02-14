import { Component } from '@angular/core';
import { App, NavController, ModalController, ViewController, Tabs, NavParams, ToastController, Platform, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';
import { MySkillsPage } from '../my-skills/my-skills';
import { TabsPage } from '../tabs/tabs';


//import { LoadingProvider } from '../../providers/loading/loading';

/**
 * Generated class for the MyGuarantorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-guarantor',
  templateUrl: 'my-guarantor.html',
})
export class MyGuarantorPage {

	myGuarantorData = { district_id: '', province_id: '', country_id: '', first_name: '', last_name: '', other_name: '', 
		mobile_number: '', city: '', home_address: '' };
	myGuarantorForm : FormGroup;
	district_id: AbstractControl;
	province_id: AbstractControl;
	country_id: AbstractControl;
	first_name: AbstractControl;
	last_name: AbstractControl;
	other_name: AbstractControl;
	mobile_number: AbstractControl;
	home_address: AbstractControl;
	city: AbstractControl;
	user: any = {};
	userData: any = {};
	from: any;
	
	token: any;
	
	provinceList: any = [];
	districtList: any = [];
	countryList: any = [];
	districtSourceList = [];
	provinceSourceList = [];
	loading: any;
	
	//, public camera: Camera, public file: File, public filePath: FilePath, public loadingProvider: LoadingProvider
	constructor(public app: App, 
		public nativePageTransitions: NativePageTransitions, public modalCtrl: ModalController, public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
		this.myGuarantorForm = this.fb.group({
			'district_id': [null, Validators.compose([Validators.required])],
			'province_id': [null, Validators.compose([Validators.required])],
			'country_id': [null, Validators.compose([])],
			'first_name': [null, Validators.compose([Validators.required])],
			'last_name': [null, Validators.compose([Validators.required])],
			'other_name': [null, Validators.compose([])],
			'mobile_number': [null, Validators.compose([Validators.required])],
			'home_address': [null, Validators.compose([])],
			'city': [null, Validators.compose([Validators.required])]
		});

        this.district_id = this.myGuarantorForm.controls['district_id'];
        this.province_id = this.myGuarantorForm.controls['province_id'];
        this.country_id = this.myGuarantorForm.controls['country_id'];
		this.first_name = this.myGuarantorForm.controls['first_name'];
        this.last_name = this.myGuarantorForm.controls['last_name'];
        this.other_name = this.myGuarantorForm.controls['other_name'];
        this.mobile_number = this.myGuarantorForm.controls['mobile_number'];
        this.home_address = this.myGuarantorForm.controls['home_address'];
        this.city = this.myGuarantorForm.controls['city'];
		
		this.from = navParams.get('from');
		
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad bookBusTicketPage');
		this.storage.get('handy_mate_countries').then((val1) => {
			console.log(val1);
			this.countryList = (val1);
			this.storage.get('handy_mate_provinces').then((val2) => {
				console.log(val2);
				this.provinceSourceList = (val2);
				this.provinceList = this.provinceSourceList; 
				this.storage.get('handy_mate_districts').then((val3) => {
					console.log(val3);
					this.districtSourceList = (val3);
					this.districtList = this.districtSourceList;
					this.getUserGuarantorData();
				});
			});
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
	
	
	getUserGuarantorData()
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				
				
				
				if(this.from!=undefined && this.from!=null && this.from=='LoginPage')
				{
				
				}
				else
				{
					console.log(this.viewCtrl);
					header = header.set('Authorization', this.token);
					
					const httpOptions = {headers: header};
					let form_params = "";
						
					//form_params = form_params + "&userCode=" + encodeURI(this.user.user_code);
					
					console.log(form_params);
					
					this.loading = this.loadingCtrl.create({
						content: 'Please wait...'
					});
					this.loading.present();
					let parameter = form_params;
					let url = "https://handymateservices.com/api/get-user-guarantor";
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
								this.userData = res.guarantor;
								this.storage.get('handy_mate_countries').then((val1) => {
									console.log(val1);
									this.countryList = (val1);
									this.myGuarantorData.country_id = this.userData.country_id;
									this.storage.get('handy_mate_provinces').then((val2) => {
										console.log(val2);
										this.provinceSourceList = (val2);
										this.provinceList = this.provinceSourceList; 
										
										let holder = [];
										for(var k41=0; k41<this.provinceSourceList.length; k41++)
										{
											let obj = this.provinceSourceList[k41].country_id;
											console.log(obj);
											let con = this.userData.country_id;
											if(obj==con)
											{
												holder.push(this.provinceSourceList[k41]);
											}
										}
										this.provinceList = holder;
										
										this.storage.get('handy_mate_districts').then((val3) => {
											console.log(val3);
											this.districtSourceList = (val3);
											
											let holder1 = [];
											let tempstateid = null;
											for(var k4=0; k4<this.districtSourceList.length; k4++)
											{
												let obj = this.districtSourceList[k4].id;
												let con = this.userData.district_id;
												if(obj==con)
												{
													tempstateid = this.districtSourceList[k4].state_id;
												}
											}
											
											this.myGuarantorData.province_id = tempstateid;
											console.log(tempstateid);
											holder1 = [];
											for(var k41=0; k41<this.districtSourceList.length; k41++)
											{
												let obj = this.districtSourceList[k41].state_id;
												if(obj==tempstateid)
												{
													holder1.push(this.districtSourceList[k41]);
												}
											}
											this.districtList = holder1;
										});
									});
								});
								console.log(this.userData);
								
								this.myGuarantorData.district_id = this.userData.district_id;
								this.myGuarantorData.first_name = this.userData.first_name;
								this.myGuarantorData.last_name = this.userData.last_name;
								this.myGuarantorData.other_name = this.userData.other_name;
								this.myGuarantorData.mobile_number = this.userData.mobile_number;
								this.myGuarantorData.city = this.userData.city;
								this.myGuarantorData.home_address = this.userData.address;
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
				}
			});
		});
	}
	
	
	
	doRegisterStepOne(newProjectData, user)
	{
		console.log(user);
		if(
			(this.myGuarantorData.district_id+"").length>0 && (this.myGuarantorData.country_id+"").length>0
			&& (this.myGuarantorData.first_name+"").trim().length>0 && (this.myGuarantorData.last_name+"").trim().length>0
			&& (this.myGuarantorData.mobile_number+"").trim().length>0 
			&& (this.myGuarantorData.city+"").trim().length>0 && (this.myGuarantorData.home_address+"").trim().length>0
		)
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
				
					
				form_params = form_params + "&province_id=" + encodeURI(this.myGuarantorData.province_id);	
				form_params = form_params + "&district_id=" + encodeURI(this.myGuarantorData.district_id);
				form_params = form_params + "&first_name=" + encodeURI(this.myGuarantorData.first_name);
				form_params = form_params + "&last_name=" + encodeURI(this.myGuarantorData.last_name);
				form_params = form_params + "&other_name=" + encodeURI(this.myGuarantorData.other_name);
				form_params = form_params + "&mobile_number=" + encodeURI(this.myGuarantorData.mobile_number);
				form_params = form_params + "&city=" + encodeURI(this.myGuarantorData.city);
				form_params = form_params + "&home_address=" + encodeURI(this.myGuarantorData.home_address);
				form_params = form_params + "&country_id=" + encodeURI(this.myGuarantorData.country_id);
				if(user!=undefined && user!=null)
				{
					form_params = form_params + "&userId=" + (user.id);
				}
							
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/post-user-guarantor";
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
							
							if(this.from!=undefined && this.from!=null)
							{
								if(this.from=='LoginPage')
								{
									this.storage.get('handy_mate_artisan_skills').then((x12) => {
										if(x12!=undefined && x12!=null)
										{
											
											let options: NativeTransitionOptions = {
												direction: 'up',
												duration: 600
											};

											this.nativePageTransitions.flip(options);
											this.navCtrl.setRoot(TabsPage);
										}
										else
										{
											let options: NativeTransitionOptions = {
												direction: 'up',
												duration: 600
											};

											this.nativePageTransitions.flip(options);
											this.navCtrl.push(MySkillsPage, {from: 'LoginPage'});
										}
									});
								}
								else
								{
									this.navCtrl.pop();
								}
							}
							else
							{
								const tabsNav = this.app.getNavByIdOrName('myTabs') as Tabs;
								tabsNav.select(4);
							}
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
		else
		{
			this.presentToast({message: 'Provide all required information before submitting'}, 'toastError');
		}
		
	
	}
	
	
	
	
	onSourceChange(selectedValue: any, type:any) {
		console.log('Selected', selectedValue);
		if(type==0)
		{
			//const httpOptions = {headers: header};
			//var parameter = JSON.stringify({});
			let holder = [];
			for(var k4=0; k4<this.provinceSourceList.length; k4++)
			{
				let obj = this.provinceSourceList[k4].country_id;
				console.log(obj);
				let con = selectedValue.split("###");
				if(obj==con[0])
				{
					holder.push(this.provinceSourceList[k4]);
				}
			}
			this.provinceList = holder;
			this.districtList = [];
			console.log(this.provinceList);	
		}
		else if(type==1)
		{
			let holder = [];
			for(var k41=0; k41<this.districtSourceList.length; k41++)
			{
				let obj = this.districtSourceList[k41].state_id;
				let con = selectedValue.split("###");
				if(obj==con[0])
				{
					holder.push(this.districtSourceList[k41]);
				}
			}
			this.districtList = holder;
			console.log(this.districtList);	
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
	
	
	
	goToMySkills(user)
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(MySkillsPage);
	}
	
	
	
	goToMyGuarantor(user)
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.setRoot(LoginPage);
	}
}
 
interface UserDataRespInt{
	success: any;
	userDetails: any;
	message: any;
	guarantor: any;
}