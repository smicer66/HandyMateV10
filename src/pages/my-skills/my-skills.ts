import { Component } from '@angular/core';
import { NavController, ModalController, Tabs, NavParams, ToastController, Platform, App, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MyGuarantorPage } from '../my-guarantor/my-guarantor';
import { MyservicesPage } from '../myservices/myservices';

import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';


/**
 * Generated class for the MySkillsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-skills',
  templateUrl: 'my-skills.html',
})
export class MySkillsPage {
	newProjectDataThree = { skills: [], search: '' };
	newProjectDataThreeForm : FormGroup;
	skills: AbstractControl;
	search: AbstractControl;
	token: any;
	loading: any;
	skillsList: any = [];
	supremeSkillsList: any = [];
	checked: any = [];
	checkedItems: any = [];
	user: any = {};
	userSkills: any = [];
	from: any;
	
	
	constructor(public platform: Platform, public modalCtrl: ModalController, public app: App, public storage: Storage, public loadingCtrl: LoadingController, 
		public nativePageTransitions: NativePageTransitions, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.newProjectDataThreeForm = this.fb.group({
			'skills' : [null, Validators.compose([Validators.required])],
			'search' : [null, Validators.compose([Validators.required])]
		});
		console.log('1');
        this.skills = this.newProjectDataThreeForm.controls['skills'];
		this.search = this.newProjectDataThreeForm.controls['search'];
		
		
		this.from = navParams.get('from');
		
		
		
		
	}

	ionViewDidEnter() {
		this.storage.get('handy_mate_skills').then((val3) => {
			console.log(val3);
			var all_skills = val3;
			
			this.supremeSkillsList = all_skills;
			this.skillsList = this.supremeSkillsList;
		});
		console.log(this.skillsList);
	}
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad BuyTrain3Page');
		
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
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
				let url = "https://handymateservices.com/api/get-user-skills";
				this.http.post<NewProjectReponse>(url, parameter, httpOptions).subscribe(
					res => {
						this.loading.dismiss();
						let success: any = null;
						success = res.success;
						console.log(res);
						console.log(success);
						
						this.userSkills = [];
						if(success==422)
						{
							this.logout();
						}
						else if(success==true)
						{
							console.log('true');
							console.log(this.skillsList);
							
							for(var i5=0; i5<res.artisanSkills.length; i5++)
							{
								this.userSkills.push(res.artisanSkills[i5].skill_id);
							}
							for(var i51=0; i51<this.skillsList.length; i51++)
							{
								this.skillsList[i51].isChecked = false;
							}
						}
						for(var i56=0; i56<this.skillsList.length; i56++)
						{
							if(this.userSkills.includes(this.skillsList[i56].id))
							{
								this.skillsList[i56].isChecked = true;
							}
							else
							{
								this.skillsList[i56].isChecked = false;
							}
						}
						console.log(this.userSkills);
						
					},
					err => {
						this.loading.dismiss();
						console.log('Error occured');
					}
				);
			});
		});
	}
	
	
	filterList(selectedValue: any)
	{
		let tempSkills: any = {};
		if(this.newProjectDataThree.search.trim().length>0)
		{
			tempSkills = this.supremeSkillsList;
			//console.log(tempSkills);
			tempSkills = tempSkills.filter(currentSkill => {
				//console.log(currentSkill);
				//console.log(this.newProjectDataThree.search);
				if (currentSkill.skill_name && this.newProjectDataThree.search) {
					var strpos = currentSkill.skill_name.toLowerCase().indexOf(this.newProjectDataThree.search.toLowerCase());
					//console.log("strpos..." + strpos);
					return (strpos > -1);
				}
			});
			this.skillsList = tempSkills;
		}
		else
		{
			this.skillsList = this.supremeSkillsList;
		}
		console.log(tempSkills);
	}
	
	
	updateMySkills(newProjectDataThree)
	{
		this.checkedItems =  this.skillsList.filter(value => {
		   return value.isChecked;
		});
		console.log(this.checkedItems);
		console.log(newProjectDataThree);
		
		if(this.checkedItems.length >0)
		{
			let header = new HttpHeaders();
			header = header.set('Content-Type', 'application/x-www-form-urlencoded');
			header = header.set('Accept-Language', 'en-US,en;q=0.5');
			this.storage.get('handy_mate_token').then((val2) => {
				this.token = val2;
				header = header.set('Authorization', this.token);
				
				const httpOptions = {headers: header};
				var form_params = "";
				form_params = form_params + "&skill=" + encodeURI(JSON.stringify(this.checkedItems));
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/post-user-skills";
				this.http.post<NewProjectReponse>(url, parameter, httpOptions).subscribe(
					res => {
						this.loading.dismiss();
						let success: any = null;
						success = res.success;
						console.log(res);
						//console.log(success);
						if(success==422)
						{
							this.logout();
						}
						else if(success==true)
						{
							this.storage.set('handy_mate_artisan_skills', (res.artisanSkills)).then((xx) => {
								
								this.presentToast({message: res.message}, 'toastSuccess');
								
								if(this.from!=undefined && this.from!=null)
								{
									if(this.from=='LoginPage')
									{
										
										
										let options: NativeTransitionOptions = {
											direction: 'up',
											duration: 600
										};

										this.nativePageTransitions.flip(options);
										this.navCtrl.setRoot(MyservicesPage, {'from': 'LoginPage'});
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
							});
							
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
		}
		else
		{
			this.presentToast({message: 'You must select at least one or maximum of 12 skills'}, 'toastError');
		}
	}
	
	
	
	addCheckbox(event, checkboxVal : any) {
		console.log(event);
		console.log(checkboxVal);
		if ( event.target.checked ) {
			this.checked.push(checkboxVal);
		} else {
			let index = this.removeCheckedFromArray(checkboxVal);
			this.checked.splice(index,1);
		}
		console.log(this.checked);
	}

	//Removes checkbox from array when you uncheck it
	removeCheckedFromArray(checkboxVal : any) {
		let tempChecked = [];
		for(var a=0; a<this.checked.length; a++)
		{
			if(this.checked[a]!=checkboxVal)
			{
				tempChecked.push(checkboxVal);
			}
		}
		
		this.checked = tempChecked;
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
	
	
	viewProfilePix()
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(ProfilePixPage, { user: this.user });
		profileModal.onDidDismiss(data => {
			
		});
		profileModal.present();
	}
	
	
	dismiss()
	{
		this.navCtrl.pop();
	}

}



interface NewProjectReponse{
	success: any;
	message: any;
	skills: any;
	userDetails: any;
	artisanSkills: any;
}
