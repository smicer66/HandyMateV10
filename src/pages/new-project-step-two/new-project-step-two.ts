import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ToastController, Platform, LoadingController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';
import { UploadAttachmentPage } from '../upload-attachment/upload-attachment';
import { ViewProjectPage } from '../view-project/view-project';
import { PaymentInstructionsPage } from '../payment-instructions/payment-instructions';
import { ProjectsPage } from '../projects/projects';

/**
 * Generated class for the NewProjectStepTwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-new-project-step-two',
  templateUrl: 'new-project-step-two.html',
})
export class NewProjectStepTwoPage {
	newProjectDataTwo = { address: '', city: '', country: '', province: '', district: '', currency: '', budget: '' };
	newProjectDataTwoForm : FormGroup;
	address: AbstractControl;
	city: AbstractControl;
	country: AbstractControl;
	province: AbstractControl;
	district: AbstractControl;
	currency: AbstractControl;
	budget: AbstractControl;
	newProjectDataOne: any = {};
	newProjectDataThree: any = {};
	
	provinceList: any = [];
	districtList: any = [];
	countryList: any = [];
	districtSourceList = [];
	provinceSourceList = [];
	
	loading: any;
	loading1: any;
	project: any;
	
	token: any;
	user: any = {};
	base64ImageFromGallery: any;
	attach_image_url1: any = 'assets/imgs/attach_image.png';
	attach_image_url2: any = 'assets/imgs/attach_image.png';
	attach_image_url3: any = 'assets/imgs/attach_image.png';
	

	constructor(public app: App, public platform: Platform, public modalCtrl: ModalController, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, 
		public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams, 
		public nativePageTransitions: NativePageTransitions) 
	{
		this.newProjectDataTwoForm = this.fb.group({
			'address': [null, Validators.compose([Validators.required])],
			'city': [null, Validators.compose([Validators.required])],
			'country': [null, Validators.compose([Validators.required])],
			'province': [null, Validators.compose([Validators.required])],
			'district': [null, Validators.compose([Validators.required])],
			'currency': [null, Validators.compose([])],
			'budget': [null, Validators.compose([Validators.required])]
		});

        this.address = this.newProjectDataTwoForm.controls['address'];
        this.city = this.newProjectDataTwoForm.controls['city'];
        this.country = this.newProjectDataTwoForm.controls['country'];
        this.province = this.newProjectDataTwoForm.controls['province'];
        this.district = this.newProjectDataTwoForm.controls['district'];
        this.currency = this.newProjectDataTwoForm.controls['currency'];
        this.budget = this.newProjectDataTwoForm.controls['budget'];
		console.log(44);
		this.project = navParams.get('project');
		this.newProjectDataOne = navParams.get('newProjectDataOne');
		this.newProjectDataThree = navParams.get('newProjectDataThree');
		
		if(this.project!=undefined && this.project!=null)
		{
			if(this.newProjectDataOne!=undefined && this.newProjectDataOne!=null)
			{
			}
			else
			{
				this.presentToast({message: 'You seem to have skipped a step'}, 'toastWarning');
				this.navCtrl.pop();
			}
		}
		else
		{
			if(this.newProjectDataOne!=undefined && this.newProjectDataOne!=null && this.newProjectDataThree!=undefined && this.newProjectDataThree!=null)
			{
			}
			else
			{
				this.presentToast({message: 'You seem to have skipped a step'}, 'toastWarning');
				this.navCtrl.pop();
			}
		}
		
		this.storage.get('handy_mate_countries').then((val1) => {
			console.log(val1);
			this.countryList = (val1);
			this.storage.get('handy_mate_provinces').then((val2) => {
				console.log(val2);
				this.provinceSourceList = (val2);
				this.storage.get('handy_mate_districts').then((val3) => {
					console.log(val3);
					this.districtSourceList = (val3);
					
					if(this.project!=undefined && this.project!=null)
					{
						this.newProjectDataTwo.country = this.project.country_located_id + "";
						
						//Load Provinces
						let holder = [];
						for(var k4=0; k4<this.provinceSourceList.length; k4++)
						{
							let obj = this.provinceSourceList[k4].country_id;
							console.log(obj);
							let con = this.project.country_located_id;
							if(obj==con)
							{
								holder.push(this.provinceSourceList[k4]);
							}
						}
						this.provinceList = holder;
						this.districtList = [];
						console.log(this.provinceList);
						
						
						//LOAD DISTRICTS
						holder = [];
						for(var k41=0; k41<this.districtSourceList.length; k41++)
						{
							let obj = this.districtSourceList[k41].state_id;
							let con = this.project.province_located_id;
							if(obj==con)
							{
								holder.push(this.districtSourceList[k41]);
							}
						}
						this.districtList = holder;
						console.log(this.districtList);	
						
						
						this.newProjectDataTwo.province = this.project.province_located_id + "";
						this.newProjectDataTwo.district = this.project.district_located_id + "";
					}
				});
			});
		});
		
		if(this.project!=undefined && this.project!=null)
		{
			this.newProjectDataTwo.address = this.project.project_location;
			this.newProjectDataTwo.city = this.project.city;
			this.newProjectDataTwo.currency = this.project.project_currency;
			this.newProjectDataTwo.budget = this.project.budget;
		}
		console.log(this.project);
		console.log(this.newProjectDataOne);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewProjectStepTwoPage');
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
		});
	}
	
	
	
	ionViewDidEnter()
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
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
				else if(id==2)
				{
					this.attach_image_url2 = base64ImageFromGallery;
				}
				else if(id==3)
				{
					this.attach_image_url3 = base64ImageFromGallery;
				}
			}
		});
		profileModal.present();
		
	}
	
	
	createProjectStepTwo(newProjectDataTwo)
	{
		console.log(newProjectDataTwo);
		
		if(newProjectDataTwo.address.length >0 && newProjectDataTwo.city.length >0 && newProjectDataTwo.country.length >0 
			&& newProjectDataTwo.province.length >0 && newProjectDataTwo.district.length >0 && newProjectDataTwo.budget >0 && newProjectDataTwo.currency.length >0)
		{
			//this.navCtrl.push(NewProjectStepThreePage, {newProjectDataOne: this.newProjectDataOne, newProjectDataTwo: newProjectDataTwo, project: this.project});
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
					if(this.project!=undefined && this.project!=null)
					{
						form_params = form_params + "&projectId=" + encodeURI(this.project.id);
					}
					else
					{
						form_params = form_params + "&skill=" + encodeURI(JSON.stringify(this.newProjectDataThree.skill_selected));
						form_params = form_params + "&subSkill=" + encodeURI(JSON.stringify(this.newProjectDataThree.checkedItems));
					}
					form_params = form_params + "&title=" + encodeURI(this.newProjectDataOne.title.trim());
					form_params = form_params + "&startDate=" + encodeURI(this.newProjectDataOne.startDate.trim());
					form_params = form_params + "&endDate=" + encodeURI(this.newProjectDataOne.endDate.trim());
					form_params = form_params + "&deliveryPeriod=" + encodeURI(this.newProjectDataOne.deliveryPeriod);
					//form_params = form_params + "&biddingPeriodType=" + encodeURI(this.newProjectDataOne.biddingPeriodType.trim());
					form_params = form_params + "&description=" + encodeURI(this.newProjectDataOne.description.trim());
					form_params = form_params + "&address=" + encodeURI(this.newProjectDataTwo.address.trim());
					form_params = form_params + "&city=" + encodeURI(this.newProjectDataTwo.city.trim());
					form_params = form_params + "&country=" + encodeURI(this.newProjectDataTwo.country.trim());
					form_params = form_params + "&province=" + encodeURI(this.newProjectDataTwo.province.trim());
					form_params = form_params + "&district=" + encodeURI(this.newProjectDataTwo.district.trim());
					form_params = form_params + "&budget=" + encodeURI(this.newProjectDataTwo.budget);
					form_params = form_params + "&currency=" + encodeURI(this.newProjectDataTwo.currency.trim());
					if(this.attach_image_url1!='assets/imgs/attach_image.png')
					{
						form_params = form_params + "&attach_image_url1=" + this.attach_image_url1;
					}
					if(this.attach_image_url2!='assets/imgs/attach_image.png')
					{
						form_params = form_params + "&attach_image_url2=" + this.attach_image_url2;
					}
					if(this.attach_image_url3!='assets/imgs/attach_image.png')
					{
						form_params = form_params + "&attach_image_url3=" + this.attach_image_url3;
					}
					console.log(form_params);
					
					this.loading = this.loadingCtrl.create({
						content: 'Please wait...'
					});
					this.loading.present();
					
					let parameter = form_params;
					let url = "https://handymateservices.com/api/create-new-project";
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
								
								
								
								console.log(this.project);
								if(this.project!=undefined && this.project!=null)
								{
									console.log(11);
									if(res.transaction!=undefined && res.transaction!=null)
									{
										this.loading1 = this.loadingCtrl.create({
											content: 'Loading Payment View...'
										});
										this.loading1.present();
										
			
			
										
										console.log(this.user);
										console.log(res.project);
										const paymentInstructionModal = this.modalCtrl.create(PaymentInstructionsPage, { user: this.user, projectDetails: res.project, transactionUpdate:res.transactionUpdate, transactionId: res.transaction.id, transactionUpdateOrderRef: res.transaction.reference_no });
										this.loading1.dismiss();
										paymentInstructionModal.onDidDismiss(data => {
											console.log(data);
											this.updateProjectStatusByOrder(data.selectedCommand.project, data.transaction.transactionId);
										});
										paymentInstructionModal.present();
									}
									else
									{
										if(res.doNotPay!=undefined && res.doNotPay==1)
										{
											this.presentToast({message: res.message}, 'toastSuccess');
											let options: NativeTransitionOptions = {
												direction: 'up',
												duration: 600
											};

											this.nativePageTransitions.flip(options);
											this.navCtrl.setRoot(ViewProjectPage, {project: res.project});
										}
										else
										{
											this.presentToast({message: res.message}, 'toastError');
											let options: NativeTransitionOptions = {
												direction: 'up',
												duration: 600
											};

											this.nativePageTransitions.flip(options);
											this.navCtrl.setRoot(ViewProjectPage, {project: res.project});
										}
									}
								}
								else
								{
									console.log(12);
									this.loading1 = this.loadingCtrl.create({
										content: 'Loading Payment View...'
									});
									this.loading1.present();
									
									
									
									
									console.log(this.user);
									console.log(res.project);
									const paymentInstructionModal = this.modalCtrl.create(PaymentInstructionsPage, { user: this.user, projectDetails: res.project });
									this.loading1.dismiss();
									paymentInstructionModal.onDidDismiss(data => {
										console.log(data);
										this.updateProjectStatusByOrder(data.selectedCommand.project, data.transaction.transactionId);
									});
									paymentInstructionModal.present();
								}
								
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
		else
		{
			this.presentToast({message: 'Provide all required information'}, 'toastError');
		}
	}
	
	
	updateProjectStatusByOrder(project, transactionId)
	{
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		this.storage.get('handy_mate_token').then((val2) => {
			this.token = val2;
			header = header.set('Authorization', this.token);
			
			const httpOptions = {headers: header};
			var form_params = "";
			form_params = form_params + "&projectId=" + encodeURI(project.id);
			form_params = form_params + "&transactionId=" + encodeURI(transactionId);
			console.log(form_params);
			
			this.loading = this.loadingCtrl.create({
				content: 'Few seconds...'
			});
			this.loading.present();
			
			let parameter = form_params;
			let url = "https://handymateservices.com/api/verify-payment";
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
					else if(success==true)
					{
						
						this.presentToast({message: res.message}, 'toastSuccess');
						let options: NativeTransitionOptions = {
							direction: 'up',
							duration: 600
						};

						this.nativePageTransitions.flip(options);
						this.navCtrl.setRoot(ViewProjectPage, {project: res.project});
						
					}
					else
					{
						console.log(-1);
						this.presentToast({message: res.message}, 'toastError');
						let options: NativeTransitionOptions = {
							direction: 'up',
							duration: 600
						};

						this.nativePageTransitions.flip(options);
						this.navCtrl.setRoot(ProjectsPage, {refresh: true});
					}
				},
				err => {
					this.loading.dismiss();
					console.log('Error occured');
				}
			);
		});
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
	
	
	presentToast(err, cssClass) {
		const toast = this.toastCtrl.create({
			message: err.message,
			duration: 3000,
			position: 'bottom',
			cssClass: cssClass
		});

		toast.present();
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

}


interface NewProjectReponse{
	project: any;
	success: any;
	message: any;
	doNotPay: any;
	transaction: any;
	probasePayMerchant: any;
	probasePayDeviceCode: any;
	mobileNumber: any;
	payeeName: any;
	amount: any;
	vat: any;
	service_charge: any;
	transactionUpdate: any;
}