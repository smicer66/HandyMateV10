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
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploadAttachmentPage } from '../upload-attachment/upload-attachment';
import { TabsPage } from '../tabs/tabs';



/**
 * Generated class for the BookBusTicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

	bookBusTicketData = { profile: '', district_id: '', province_id: '', country_id: '', first_name: '', last_name: '', other_name: '', 
		tin_id: '', company_name: '', email_address: '', city: '', home_address: '', gender: '' };	//national_id: '', 
	bookBusTicketForm : FormGroup;
	profile: AbstractControl;
	district_id: AbstractControl;
	province_id: AbstractControl;
	country_id: AbstractControl;
	first_name: AbstractControl;
	last_name: AbstractControl;
	other_name: AbstractControl;
	//national_id: AbstractControl;
	tin_id: AbstractControl;
	company_name: AbstractControl;
	email_address: AbstractControl;
	home_address: AbstractControl;
	gender: AbstractControl;
	city: AbstractControl;
	user: any = {};
	userData: any = {};
	messageThread: any;
	
	token: any;
	
	provinceList: any = [];
	districtList: any = [];
	countryList: any = [];
	districtSourceList = [];
	provinceSourceList = [];
	loading: any;
	from: any = null;
	
	options: CameraOptions = {
		sourceType: 1,
		encodingType: this.camera.EncodingType.JPEG,
		destinationType: 0, // USE THIS TO RETURN BASE64 STRING
		correctOrientation: true,
		targetWidth:1024,
		targetHeight:1024,
	}
	base64Image: any = null;
	base64ImageFromGallery: any;
	attach_image_url1: any = 'assets/imgs/attach_image.png';
	attach_image_url2: any = 'assets/imgs/attach_image.png';
	attach_image_url3: any = 'assets/imgs/attach_image.png';
	
	//, public file: File, public filePath: FilePath, public loadingProvider: LoadingProvider
	constructor(public camera: Camera, 
		public nativePageTransitions: NativePageTransitions, public app: App, public modalCtrl: ModalController, public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
		this.bookBusTicketForm = this.fb.group({
			'profile' : [null, Validators.compose([Validators.required])],
			'district_id': [null, Validators.compose([Validators.required])],
			'province_id': [null, Validators.compose([Validators.required])],
			'country_id': [null, Validators.compose([])],
			'first_name': [null, Validators.compose([Validators.required])],
			'last_name': [null, Validators.compose([Validators.required])],
			'other_name': [null, Validators.compose([])],
			//'national_id': [null, Validators.compose([Validators.required])],
			'tin_id': [null, Validators.compose([])],
			'company_name': [null, Validators.compose([])],
			'email_address': [null, Validators.compose([Validators.required])],
			'home_address': [null, Validators.compose([])],
			'gender': [null, Validators.compose([])],
			'city': [null, Validators.compose([Validators.required])]
		});

        this.profile = this.bookBusTicketForm.controls['profile'];
        this.district_id = this.bookBusTicketForm.controls['district_id'];
        this.province_id = this.bookBusTicketForm.controls['province_id'];
        this.country_id = this.bookBusTicketForm.controls['country_id'];
		this.first_name = this.bookBusTicketForm.controls['first_name'];
        this.last_name = this.bookBusTicketForm.controls['last_name'];
        this.other_name = this.bookBusTicketForm.controls['other_name'];
        //this.national_id = this.bookBusTicketForm.controls['national_id'];
		this.tin_id = this.bookBusTicketForm.controls['tin_id'];
		this.company_name = this.bookBusTicketForm.controls['company_name'];
		
		this.email_address = this.bookBusTicketForm.controls['email_address'];
        this.home_address = this.bookBusTicketForm.controls['home_address'];
		this.gender = this.bookBusTicketForm.controls['gender'];
        this.city = this.bookBusTicketForm.controls['city'];
		
		this.from = this.navParams.get('from');
		console.log(this.from);
		console.log(this.navParams);
		
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
					this.getUserData();
				});
			});
		});
		
	}
	
	snapAndUpload(user)
	{
		
		this.camera.getPicture(this.options).then((imageData) => {
			// imageData is either a base64 encoded string or a file URI
			// If it's base64 (DATA_URL):
			console.log(imageData);
			this.base64Image = 'data:image/jpeg;base64,' + imageData;
		}, (err) => {
			// Handle error
			console.log(err);
		});
	}
	
	selectImage(id)
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(UploadAttachmentPage, { id: id });
		profileModal.onDidDismiss(data => {
			console.log(data);
			if(data!=null && data!=undefined && data.base64ImageFromGallery!=undefined && data.base64ImageFromGallery!=null)
			{
				
				let base64ImageFromGallery = data.base64ImageFromGallery;
				if(id==1)
				{
					this.attach_image_url1 = base64ImageFromGallery;
				}
				if(id==2)
				{
					this.attach_image_url2 = base64ImageFromGallery;
				}
				if(id==3)
				{
					this.attach_image_url3 = base64ImageFromGallery;
				}
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
	
	
	getUserData()
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
					
				//form_params = form_params + "&userCode=" + encodeURI(this.user.user_code);
				
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/get-user-details-by-code";
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
							this.storage.get('handy_mate_countries').then((val1) => {
								console.log(val1);
								this.countryList = (val1);
								this.bookBusTicketData.country_id = this.userData.country_id;
								this.storage.get('handy_mate_provinces').then((val2) => {
									console.log(val2);
									this.provinceSourceList = (val2);
									this.provinceList = this.provinceSourceList; 
									
									let holder = [];
									for(var k4=0; k4<this.provinceSourceList.length; k4++)
									{
										let obj = this.provinceSourceList[k4].country_id;
										console.log(obj);
										let con = this.userData.country_id;
										if(obj==con)
										{
											holder.push(this.provinceSourceList[k4]);
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
										
										this.bookBusTicketData.province_id = tempstateid;
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
							this.userData = res.userDetails;
							console.log(this.userData);
							
							this.bookBusTicketData.profile = this.userData.profile;
							this.bookBusTicketData.district_id = this.userData.district_id;
							this.bookBusTicketData.first_name = this.userData.first_name;
							this.bookBusTicketData.last_name = this.userData.last_name;
							this.bookBusTicketData.other_name = this.userData.other_name;
							//this.bookBusTicketData.national_id = this.userData.national_id;
							this.bookBusTicketData.tin_id = this.userData.tin_id;
							this.bookBusTicketData.company_name = this.userData.company!=undefined && this.userData.company!=null ? this.userData.company.company_name : '';
							this.bookBusTicketData.email_address = this.userData.email_address;
							this.bookBusTicketData.city = this.userData.city;
							this.bookBusTicketData.home_address = this.userData.home_address;
							this.bookBusTicketData.gender = this.userData.gender;
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
		});
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
	
	
	doRegisterStepOne(newProjectData, user)
	{
		console.log(user);
		// && (this.bookBusTicketData.national_id+"").trim().length>0 
		if(
			(this.bookBusTicketData.district_id+"").length>0 && (this.bookBusTicketData.country_id+"").length>0
			&& (this.bookBusTicketData.first_name+"").trim().length>0 && (this.bookBusTicketData.last_name+"").trim().length>0
			&& (this.bookBusTicketData.email_address+"").trim().length>0
			&& (this.bookBusTicketData.city+"").trim().length>0 && (this.bookBusTicketData.home_address+"").trim().length>0
			&& (this.bookBusTicketData.gender+"").length>0
		)
		{
			let pcd = true;
			if(user.role_type=='Corporate Client' || user.role_type=='Corporate Artisan')
			{
				if((this.bookBusTicketData.tin_id+"").trim().length>0 && (this.bookBusTicketData.company_name+"").trim().length>0)
				{
				}
				else
				{
					pcd = false;
				}
			}
			
			
			if(pcd===true)
			{
				if(this.messageThread!=null)
				{
					this.presentToast({message: this.messageThread}, 'toastInfo');
				}
				
				let header = new HttpHeaders();
				header = header.set('Content-Type', 'application/x-www-form-urlencoded');
				header = header.set('Accept-Language', 'en-US,en;q=0.5');
				this.storage.get('handy_mate_token').then((val2) => {
					this.token = val2;
					console.log(this.viewCtrl);
					header = header.set('Authorization', this.token);
					
					const httpOptions = {headers: header};
					let form_params = "";
						
					//form_params = form_params + "&userCode=" + encodeURI(this.user.user_code);
					form_params = form_params + "&profile=" + encodeURI(this.bookBusTicketData.profile);
					form_params = form_params + "&district_id=" + encodeURI(this.bookBusTicketData.district_id);
					form_params = form_params + "&first_name=" + encodeURI(this.bookBusTicketData.first_name);
					form_params = form_params + "&last_name=" + encodeURI(this.bookBusTicketData.last_name);
					form_params = form_params + "&other_name=" + encodeURI(this.bookBusTicketData.other_name);
					//form_params = form_params + "&national_id=" + encodeURI(this.bookBusTicketData.national_id);
					
					if(user.role_type=='Corporate Client' || user.role_type=='Corporate Artisan')
					{
						form_params = form_params + "&tin_id=" + encodeURI(this.bookBusTicketData.tin_id);
						form_params = form_params + "&company_name=" + encodeURI(this.bookBusTicketData.company_name);
					}
					form_params = form_params + "&email_address=" + encodeURI(this.bookBusTicketData.email_address);
					form_params = form_params + "&city=" + encodeURI(this.bookBusTicketData.city);
					form_params = form_params + "&home_address=" + encodeURI(this.bookBusTicketData.home_address);
					form_params = form_params + "&gender=" + encodeURI(this.bookBusTicketData.gender);
					form_params = form_params + "&country_id=" + encodeURI(this.bookBusTicketData.country_id);
					if(this.base64Image!=null)
					{
						form_params = form_params + "&image=" + this.base64Image;
					}
					if(this.attach_image_url1!='assets/imgs/attach_image.png')
					{
						form_params = form_params + "&nrc_passport=" + this.attach_image_url1;
					}
					if(this.attach_image_url2!='assets/imgs/attach_image.png')
					{
						form_params = form_params + "&zra_cert=" + this.attach_image_url2;
					}
					if(this.attach_image_url3!='assets/imgs/attach_image.png')
					{
						form_params = form_params + "&pacra_cert=" + this.attach_image_url3;
					}
					
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
					let url = "https://handymateservices.com/api/update-user-details";
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
								this.storage.set('handy_mate_loggedInUser', (res.userDetails)).then((xx) => {
									this.presentToast({message: res.message}, 'toastSuccess');
									//this.viewCtrl.dismiss();
									
									if(user.role_type=='Private Client' || user.role_type=='Artisan')
									{
										if(this.from!=null && this.from=='LoginPage')
										{
											
											let options: NativeTransitionOptions = {
												direction: 'up',
												duration: 600
											};

											if(user.role_type=='Artisan')
											{
												this.nativePageTransitions.flip(options);
												this.navCtrl.setRoot(MySkillsPage, {'from': 'LoginPage'});
											}
											else
											{
												this.navCtrl.setRoot(TabsPage);
											}
										}
										else
										{
											this.navCtrl.pop();
										}
									}
									else if(user.role_type=='Corporate Client' || user.role_type=='Corporate Artisan')
									{
										if(this.from!=null && this.from=='LoginPage')
										{
											
											let options: NativeTransitionOptions = {
												direction: 'up',
												duration: 600
											};

											this.nativePageTransitions.flip(options);
											this.navCtrl.setRoot(MyGuarantorPage, {'from': 'LoginPage'});
										}
										else
										{
											this.navCtrl.pop();
										}
									}
								});
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
			for(var k42=0; k42<this.districtSourceList.length; k42++)
			{
				let obj = this.districtSourceList[k42].state_id;
				let con = selectedValue.split("###");
				if(obj==con[0])
				{
					holder.push(this.districtSourceList[k42]);
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
}
 
interface UserDataRespInt{
	success: any;
	userDetails: any;
	message: any;
}