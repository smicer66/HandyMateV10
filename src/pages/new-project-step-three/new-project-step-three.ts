import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ToastController, Platform, App, LoadingController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient } from '@angular/common/http';

import { LoginPage } from '../login/login';
import { NewProjectPage } from '../new-project/new-project';
import { ProfilePixPage } from '../profile-pix/profile-pix';

/**
 * Generated class for the NewProjectStepThreePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-new-project-step-three',
  templateUrl: 'new-project-step-three.html',
})
export class NewProjectStepThreePage {
	newProjectDataThree = { skill_selected: '', checkedItems: [] };
	newProjectDataThreeForm : FormGroup;
	//skills: AbstractControl;
	skill_selected: AbstractControl;
	token: any;
	loading: any;
	loading1: any;
	skillsList: any = [];
	supremeSkillsList: any = [];
	checked: any = [];
	//newProjectDataOne: any = {};
	//newProjectDataTwo: any = {};
	project: any = null;
	user: any = {};
	sub_skills: any = [];
	supreme_sub_skills: any = [];
	checkedItems: any = [];
	project_sub_skills: any = [];
	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public modalCtrl: ModalController, public app: App, public storage: Storage, public loadingCtrl: LoadingController, 
		public nativePageTransitions: NativePageTransitions, 
		public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.newProjectDataThreeForm = this.fb.group({
			'skill_selected' : [null, Validators.compose([Validators.required])]
		});
		console.log('1');
        this.skill_selected = this.newProjectDataThreeForm.controls['skill_selected'];
		//this.newProjectDataOne = navParams.get('newProjectDataOne');
		//this.newProjectDataTwo = navParams.get('newProjectDataTwo');
		//console.log(this.newProjectDataOne);
		//console.log(this.newProjectDataTwo);
		/*if(this.newProjectDataOne!=undefined && this.newProjectDataOne!=null && 
			this.newProjectDataTwo!=undefined && this.newProjectDataTwo!=null)
		{
		}
		else
		{
			this.navCtrl.pop();
		}*/
		this.project = navParams.get('project');
		console.log(this.project);
		
		this.storage.get('handy_mate_skills').then((val3) => {
			var all_skills = [];
			
			this.supremeSkillsList = all_skills;
			this.skillsList = this.supremeSkillsList;
			if(this.project!=undefined && this.project!=null)
			{
				let skills_ = this.project.skills;
				let skills_1 = [];
				for(var i0=0; i0<skills_.length; i0++)
				{
					skills_1.push(skills_[i0].skill_id);
				}
				for(var i1=0; i1<val3.length; i1++)
				{
					if(skills_1.indexOf(val3[i1].id)!=-1)
					{
						all_skills.push({id:val3[i1].id, name:val3[i1].skill_name, key: ('newProjectDataThree.skills'+val3[i1].id), isChecked:true});
					}
					else
					{
						all_skills.push({id:val3[i1].id, name:val3[i1].skill_name, key: ('newProjectDataThree.skills'+val3[i1].id), isChecked:false});
					}
				}
			}
			else
			{
				for(var i11=0; i11<val3.length; i11++)
				{
					all_skills.push({id:val3[i11].id, name:val3[i11].skill_name, key: ('newProjectDataThree.skills'+val3[i11].id), isChecked:false});
				}
			}
			
			
			this.storage.get('handy_mate_sub_skills').then((val3) => {
				this.supreme_sub_skills = val3;
				console.log(this.supreme_sub_skills);
			});
		});
		
		
		
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BuyTrain3Page');
		
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
		});
	}
	
	
	ionViewDidEnter()
	{
		console.log(this.navParams);
		let skill_id_ = this.navParams.get('skill_id');
		if(skill_id_!=undefined && skill_id_!=null)
		{
			this.newProjectDataThree.skill_selected = skill_id_;
			let holder = [];
			this.checkedItems = [];
			for(var k4=0; k4<this.supreme_sub_skills.length; k4++)
			{
				let obj = this.supreme_sub_skills[k4].skill_id;
				console.log(obj);
				if(obj==skill_id_)
				{
					holder.push(this.supreme_sub_skills[k4]);
				}
			}
			this.sub_skills = holder;
			console.log(this.sub_skills);
		}
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
		});
	}
	
	
	
	
	
	/*filterList(selectedValue: any)
	{
		let tempSkills: any = {};
		if(this.newProjectDataThree.search.trim().length>0)
		{
			tempSkills = this.supremeSkillsList;
			tempSkills = tempSkills.filter(currentSkill => {
				if (currentSkill.name && this.newProjectDataThree.search) {
				  return (currentSkill.name.toLowerCase().indexOf(this.newProjectDataThree.search.toLowerCase()) > -1);
				}
			});
			this.skillsList = tempSkills;
		}
		else
		{
			this.skillsList = this.supremeSkillsList;
		}
		console.log(tempSkills);
	}*/
	
	
	createProjectStepThree(newProjectDataThree)
	{
		if(this.checkedItems.length >0)
		{
			this.newProjectDataThree.checkedItems = this.checkedItems;
			
			let options: NativeTransitionOptions = {
				direction: 'up',
				duration: 600
			};

			this.nativePageTransitions.flip(options);
			this.navCtrl.setRoot(NewProjectPage, {newProjectDataThree: this.newProjectDataThree, project:this.project});
		}
		else
		{
			this.presentToast({message: 'You must select at least a task/job you want to be handled for you'}, 'toastError');
		}
	}
	
	selectImage(id)
	{
		console.log(3330);
		if(this.checkedItems.indexOf(id)!=-1)
		{
			let pptemp = [];
			for(var i11=0; i11<this.checkedItems.length; i11++)
			{
				if(this.checkedItems[i11]!=id)
				{
					pptemp.push(this.checkedItems[i11]);
				}
			}
			this.checkedItems = pptemp;
		}
		else
		{
			this.checkedItems.push(id);
		}
		console.log(this.checkedItems);
		/*for(var i11=0; i11<this.project_sub_skills.length; i11++)
		{
			if(this.project_sub_skills[i11].id==id)
			{
				this.project_sub_skills.push({id:this.project_sub_skills[i11].id, name:this.project_sub_skills[i11].skill_name, key: ('newProjectDataFour.skills'+this.project_sub_skills[i11].id), isChecked:true});
			}
			else
			{
				this.project_sub_skills.push({id:this.project_sub_skills[i11].id, name:this.project_sub_skills[i11].skill_name, key: ('newProjectDataFour.skills'+this.project_sub_skills[i11].id), isChecked:false});
			}
		}*/
	}
	
	
	
	
	
	onSourceChange(selectedValue: any) {
		console.log('Selected', selectedValue);
		let holder = [];
		this.checkedItems = [];
		for(var k4=0; k4<this.supreme_sub_skills.length; k4++)
		{
			let obj = this.supreme_sub_skills[k4].skill_id;
			console.log(obj);
			let con = selectedValue.split("###");
			if(obj==con[0])
			{
				holder.push(this.supreme_sub_skills[k4]);
			}
		}
		this.sub_skills = holder;
		console.log(this.sub_skills);	
		
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

}




