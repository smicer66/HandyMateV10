import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ToastController, Platform, App, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';

import { LoginPage } from '../login/login';
import { NewProjectPage } from '../new-project/new-project';
import { ProfilePixPage } from '../profile-pix/profile-pix';

/**
 * Generated class for the NewProjectStepFourPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-new-project-step-four',
  templateUrl: 'new-project-step-four.html',
})
export class NewProjectStepFourPage {
	token: any;
	loading: any;
	loading1: any;
	sub_skills: any = [];
	supreme_sub_skills: any = [];
	newProjectDataThree: any = {};
	project: any = null;
	checkedItems: any = [];
	project_sub_skills: any = [];
	user: any = {};
	
	
	constructor(public platform: Platform, 
		public nativePageTransitions: NativePageTransitions, public modalCtrl: ModalController, public app: App, public storage: Storage, public loadingCtrl: LoadingController, 
		public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		
		this.newProjectDataThree = navParams.get('newProjectDataThree');
		console.log(this.newProjectDataThree);
		if(this.newProjectDataThree!=undefined && this.newProjectDataThree!=null)
		{
		}
		else
		{
			this.navCtrl.pop();
		}
		this.project = navParams.get('project');
		console.log(this.project);
		
		this.storage.get('handy_mate_sub_skills').then((val3) => {
			this.supreme_sub_skills = val3;
			for(var i11=0; i11<this.newProjectDataThree.length; i11++)
			{
				let sub_skill_found = this.supreme_sub_skills.filter(function(el){
					return el.skill_id==this.newProjectDataThree[i11].id
				});
				console.log(sub_skill_found);
				this.sub_skills.concat(sub_skill_found);
				console.log(this.sub_skills);
			}
			
			
			if(this.project!=undefined && this.project!=null)
			{
				let project_sub_skills_ = this.project.sub_skills;
				this.project_sub_skills = [];
				for(var i1=0; i1<project_sub_skills_.length; i1++)
				{
					if(this.sub_skills.indexOf(project_sub_skills_[i1])!=-1)
					{
						this.project_sub_skills.push({id:project_sub_skills_[i1].id, name:project_sub_skills_[i1].sub_skill_name, key: ('newProjectDataThree.sub_skills'+project_sub_skills_[i1].id), isChecked:true});
					}
					else
					{
						this.project_sub_skills.push({id:project_sub_skills_[i1].id, name:project_sub_skills_[i1].sub_skill_name, key: ('newProjectDataThree.sub_skills'+project_sub_skills_[i1].id), isChecked:false});
					}
				}
			}
			else
			{
				for(var i112=0; i112<this.sub_skills.length; i112++)
				{
					this.project_sub_skills.push({id:this.sub_skills[i112].id, name:this.sub_skills[i112].skill_name, key: ('newProjectDataThree.skills'+this.sub_skills[i112].id), isChecked:false});
				}
			}
		});
		
		
		
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuyTrain3Page');
		
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
		});
	}
	
	
	selectImage(id)
	{
		console.log(3330);
		if(this.project_sub_skills.indexOf(id)!=-1)
		{
			this.checkedItems.pop(id);
		}
		else
		{
			this.checkedItems.push(id);
		}
		console.log(this.checkedItems);
		for(var i11=0; i11<this.project_sub_skills.length; i11++)
		{
			if(this.project_sub_skills[i11].id==id)
			{
				this.project_sub_skills.push({id:this.project_sub_skills[i11].id, name:this.project_sub_skills[i11].skill_name, key: ('newProjectDataThree.skills'+this.project_sub_skills[i11].id), isChecked:true});
			}
			else
			{
				this.project_sub_skills.push({id:this.project_sub_skills[i11].id, name:this.project_sub_skills[i11].skill_name, key: ('newProjectDataThree.skills'+this.project_sub_skills[i11].id), isChecked:false});
			}
		}
	}
	
	
	
	
	createProjectStepFour(newProjectDataThree)
	{
		this.checkedItems =  this.project_sub_skills.filter(value => {
		   return value.isChecked;
		});
		console.log(this.checkedItems);
		console.log(newProjectDataThree);
		
		
		if(this.checkedItems.length >0)
		{
			
			let options: NativeTransitionOptions = {
				direction: 'up',
				duration: 600
			};

			this.nativePageTransitions.flip(options);
			this.navCtrl.setRoot(NewProjectPage, {newProjectDataThree: this.newProjectDataThree});
		}
		else
		{
			this.presentToast({message: 'You must select at least task/job you want to be handled for you'}, 'toastError');
		}
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

}