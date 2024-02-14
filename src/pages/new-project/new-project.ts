import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ToastController, Platform, App, LoadingController  } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient } from '@angular/common/http';

import { NewProjectStepTwoPage } from '../new-project-step-two/new-project-step-two';
import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';


/**
 * Generated class for the NewProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-project',
  templateUrl: 'new-project.html',
})
export class NewProjectPage {

	newProjectData = { title: '', startDate: '', endDate: '', deliveryPeriod: '', description: ''  };//biddingPeriodType: '', 
	newProjectDataForm : FormGroup;
	title: AbstractControl;
	startDate: AbstractControl;
	endDate: AbstractControl;
	deliveryPeriod: AbstractControl;
	//biddingPeriodType: AbstractControl;
	description: AbstractControl;
	user: any = {};
	prjStartMinDate: any;
	prjCompletionMinDate: any;
	bidEndMinDate: any;
	prjStartMaxDate: any;
	prjCompletionMaxDate: any;
	bidEndMaxDate: any;
	
	provinceList: any = [];
	districtList: any = [];
	countryList: any = [];
	districtSourceList = [];
	provinceSourceList = [];
	
	loading: any;
	project: any;
	newProjectDataThree: any;
	months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	token: any;
	//, public filePath: FilePath, public camera: Camera, public file: File,public loadingProvider: LoadingProvider
	constructor(public platform: Platform, public modalCtrl: ModalController, public app: App, public storage: Storage, public loadingCtrl: LoadingController, 
		public nativePageTransitions: NativePageTransitions, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.newProjectDataForm = this.fb.group({
			'title' : [null, Validators.compose([Validators.required])],
			'startDate': [null, Validators.compose([Validators.required])],
			'endDate': [null, Validators.compose([Validators.required])],
			'deliveryPeriod': [null, Validators.compose([Validators.required])],
			//'biddingPeriodType': [null, Validators.compose([Validators.required])],
			'description': [null, Validators.compose([Validators.required])]
		});

        this.title = this.newProjectDataForm.controls['title'];
        this.startDate = this.newProjectDataForm.controls['startDate'];
        this.endDate = this.newProjectDataForm.controls['endDate'];
        this.deliveryPeriod = this.newProjectDataForm.controls['deliveryPeriod'];
        //this.biddingPeriodType = this.newProjectDataForm.controls['biddingPeriodType'];
        console.log(44);
        this.description = this.newProjectDataForm.controls['description'];
		this.project = navParams.get('project');
		this.newProjectDataThree = navParams.get('newProjectDataThree');
		console.log(this.project);
		if(this.project!=undefined && this.project!=null)
		{
			this.newProjectData.title = this.project.title;
			this.newProjectData.startDate = this.project.expected_start_date.split(' ')[0];
			this.newProjectData.endDate = this.project.expected_completion_date.split(' ')[0];
			this.newProjectData.deliveryPeriod = this.project.bid_end_date.split(' ')[0];
			//this.newProjectData.biddingPeriodType = this.project.bidding_period_type + "";
			this.newProjectData.description = this.project.description;
		}
		console.log(this.newProjectData);
		//1994-12-15T13:47:20Z
		this.prjStartMinDate = new Date();
		let psdm = (this.prjStartMinDate.getMonth() + 1);
		psdm = psdm < 10 ? ('0'+psdm) : psdm;
		let psdd = this.prjStartMinDate.getDate();
		psdd = psdd<10 ? ('0'+psdd) : psdd;
		let psdy = (this.prjStartMinDate.getFullYear() + "");
		let psdy1 = ((this.prjStartMinDate.getFullYear() + 1) + "");
		this.prjStartMinDate = psdy + "-" + psdm + "-" + psdd + "T00:00:00Z";
		this.prjCompletionMinDate = psdy + "-" + psdm + "-" + psdd + "T00:00:00Z";
		this.bidEndMinDate = psdy + "-" + psdm + "-" + psdd + "T00:00:00Z";
		this.prjStartMaxDate = psdy1 + "-" + psdm + "-" + '01' + "T00:00:00Z";
		this.prjCompletionMaxDate = psdy1 + "-" + psdm + "-" + '01' + "T00:00:00Z";
		this.bidEndMaxDate = psdy1 + "-" + psdm + "-" + '01' + "T00:00:00Z";
		console.log(this.prjStartMinDate);
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad NewProject Step One');
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

	
	
	createProjectStepOne(newProjectData)
	{
		console.log(newProjectData);
		//this.navCtrl.pop();
		// && newProjectData.biddingPeriodType.length >0 
		if(newProjectData.title.length >0 && newProjectData.startDate.length >0 && newProjectData.endDate.length >0 
			&& newProjectData.deliveryPeriod.length >0 && newProjectData.description.length >0)
		{
			if(this.project!=undefined && this.project!=null)
			{
				
				
				let options: NativeTransitionOptions = {
					direction: 'up',
					duration: 600
				};

				this.nativePageTransitions.flip(options);
				this.navCtrl.push(NewProjectStepTwoPage, {newProjectDataOne: newProjectData, project: this.project, newProjectDataThree: this.newProjectDataThree});
			}
			else
			{
				
				
				let options: NativeTransitionOptions = {
					direction: 'up',
					duration: 600
				};

				this.nativePageTransitions.flip(options);
				this.navCtrl.push(NewProjectStepTwoPage, {newProjectDataOne: newProjectData, newProjectDataThree: this.newProjectDataThree});
			}
		}
		else
		{
			let x = '';
			x = newProjectData.title.length + ' - ' + newProjectData.startDate.length + ' - ' + newProjectData.endDate.length + ' - ' +  
				newProjectData.deliveryPeriod.length + ' - ' + newProjectData.description.length;
			x = x + '(' + newProjectData.title + ' - ' + newProjectData.startDate + ' - ' + newProjectData.endDate + ' - ' +  
				newProjectData.deliveryPeriod + ' - ' + newProjectData.description + ')';
			this.presentToast({message: 'Provide all required information. Project start and completion dates must be after the bid end date. Start date must be before completion date'}, 'toastError');
			//this.presentToast({message: x}, 'toastError');
		}
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
	
	
	viewProfilePix()
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(ProfilePixPage, { user: this.user });
		profileModal.onDidDismiss(data => {
			
		});
		profileModal.present();
	}

	
	handleBidStartChange()
	{
		if(this.newProjectData.startDate!=undefined && this.newProjectData.startDate!=null && this.newProjectData.startDate.length>0)
		{
			let sd = new Date(this.newProjectData.startDate);
			if(this.newProjectData.endDate!=undefined && this.newProjectData.endDate!=null && this.newProjectData.endDate.length>0)
			{
				let ed = new Date(this.newProjectData.endDate);
				if(sd.getTime() > ed.getTime())
				{
					this.newProjectData.endDate = "";
					
					let psdm:any = (sd.getMonth() + 1);
					psdm = psdm < 10 ? ('0'+psdm) : psdm;
					let psdd_:any = sd.getDate();
					let psdd:any = psdd_<10 ? ('0'+psdd_) : psdd_;
					let psdy:any = (sd.getFullYear() + "");
					let psdy1:any = ((sd.getFullYear() + 1) + "");
					this.prjCompletionMinDate = psdy + "-" + psdm + "-" + psdd + "T00:00:00Z";
					this.prjCompletionMaxDate = psdy1 + "-" + psdm + "-" + '01' + "T00:00:00Z";
				}
			}
			
			if(this.newProjectData.deliveryPeriod!=undefined && this.newProjectData.deliveryPeriod!=null && this.newProjectData.deliveryPeriod.length>0)
			{
				let dp = new Date(this.newProjectData.deliveryPeriod);
				if(sd.getTime() < dp.getTime())
				{
					this.newProjectData.deliveryPeriod = "";
					
					let psdm:any = (dp.getMonth() + 1);
					psdm = psdm < 10 ? ('0'+psdm) : psdm;
					let psdd_:any = sd.getDate();
					let psdd:any = psdd_<10 ? ('0'+psdd_) : psdd_;
					let psdy:any = (dp.getFullYear() + "");
					let psdy1:any = ((dp.getFullYear() + 1) + "");
					this.prjCompletionMinDate = psdy + "-" + psdm + "-" + psdd + "T00:00:00Z";
					this.prjCompletionMaxDate = psdy1 + "-" + psdm + "-" + '01' + "T00:00:00Z";
				}
			}
		}
	}
	
	handleProjectEndChange()
	{
		if(this.newProjectData.endDate!=undefined && this.newProjectData.endDate!=null && this.newProjectData.endDate.length>0)
		{
			let ed = new Date(this.newProjectData.endDate);
			if(this.newProjectData.deliveryPeriod!=undefined && this.newProjectData.deliveryPeriod!=null && this.newProjectData.deliveryPeriod.length>0)
			{
				let dp = new Date(this.newProjectData.deliveryPeriod);
				if(ed.getTime() > dp.getTime())
				{
					this.newProjectData.deliveryPeriod = "";
					
					let psdm:any = (dp.getMonth() + 1);
					psdm = psdm < 10 ? ('0'+psdm) : psdm;
					let psdd_:any = ed.getDate();
					let psdd:any = psdd_<10 ? ('0'+psdd_) : psdd_;
					let psdy:any = (dp.getFullYear() + "");
					let psdy1:any = ((dp.getFullYear() + 1) + "");
					this.bidEndMinDate = psdy + "-" + psdm + "-" + psdd + "T00:00:00Z";
					this.bidEndMaxDate = psdy1 + "-" + psdm + "-" + '01' + "T00:00:00Z";
				}
			}
			
		}
	}
	
	handleProjectStartChange()
	{
	
	}
	
}


