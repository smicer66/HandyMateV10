import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams, ToastController, ActionSheetController, LoadingController, Platform, ModalController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/take';
import { Storage } from "@ionic/storage";
import { Slides } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ViewProjectPage } from '../view-project/view-project';
import { LoginPage } from '../login/login';
import { NewContextMenuPage } from '../new-context-menu/new-context-menu';
import { RateProjectPage } from '../rate-project/rate-project';
import { NewProjectPage } from '../new-project/new-project';
import { PaymentInstructionsPage } from '../payment-instructions/payment-instructions';
import { AllMessagesPage } from '../all-messages/all-messages';
import { ProfilePixPage } from '../profile-pix/profile-pix';


/**
 * Generated class for the ProjectsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {
	@ViewChild('slideWithNav') slideWithNav: Slides;
	
	currentProjectList: any = [];
	supremeCurrentProjectList: any = [];
	user: any;
	message: any;
	segmentSelected: string = "all";
	loading: any;
	token: any;
	categoryId: any;
	categoryName: any;
	


	constructor(public app: App, 
		public nativePageTransitions: NativePageTransitions, public events2: Events, public modalCtrl: ModalController, public platform: Platform, public loadingCtrl: LoadingController, public http: HttpClient, public storage: Storage, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.message = navParams.get('message');
		console.log(this.message);
		this.events2.subscribe('tab:clicked', (data) =>{
			console.log(data);
			if(data==5)
			{
			}
		});
		
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad OneBankPage');
		//this.refreshProjectList();

	}
	
	ionViewDidEnter()
	{
		this.refreshProjectList();
		let refreshYes = this.navParams.get('refresh');
		this.categoryId = this.navParams.get('skill_id');
		this.categoryName = this.navParams.get('skill_name');
		if(refreshYes===true)
		{
			//this.refreshProjectList();
		}
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
		});
	}
	
	
	onSegmentChanged(ev: any)
	{
		console.log('Segment changed', ev);
		console.log(this.segmentSelected);
		if(this.segmentSelected=='all')
		{
			this.currentProjectList = this.supremeCurrentProjectList;
		}
		else if(this.segmentSelected=='open')
		{
			this.currentProjectList = this.supremeCurrentProjectList.filter(function (el) {
				return el.status=='OPEN';
			});
		}
		if(this.segmentSelected=='completed')
		{
			this.currentProjectList = this.supremeCurrentProjectList.filter(function (el) {
				return el.status=='COMPLETED';
			});
		}
	}
	
	
	seeAll()
	{
		this.categoryId = null;
		this.categoryName = null;
		this.refreshProjectList();
	}
	
	
	refreshProjectList()
	{
		this.segmentSelected='all';
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			if(this.message!=null)
			{
				this.presentToast({message: this.message}, 'toastInfo');
			}
			this.loading = this.loadingCtrl.create({
			  content: 'Loading Projects. Please wait...'
			});
			this.loading.present();
			this.storage.get('handy_mate_token').then((val) => {
				console.log(val);
				this.token = val;
				let header = new HttpHeaders();
				header = header.set('Content-Type', 'application/json; charset=utf-8');
				header = header.set('Accept', 'application/json');
				header = header.set('Authorization', this.token);
				console.log(header);
				const httpOptions = {headers: header};
				let parameter = JSON.stringify({ });

				let projectsListUrl = "https://handymateservices.com/api/projects-list";
				if(this.categoryId!=undefined && this.categoryId!=null)
				{
					projectsListUrl = projectsListUrl + "/" + this.categoryId;
				}
				this.http.post<ProjectListRespInt>(projectsListUrl, parameter, httpOptions).subscribe(
					res1 => {
						this.loading.dismiss();
						let status: any = null;
						//test
						status = res1.success;
						console.log(res1);
						console.log(status);
						if(res1.success==422)
						{
							this.logout();
						}
						else if (res1.success === true) {
							this.currentProjectList = res1.projects;
							this.supremeCurrentProjectList = this.currentProjectList;
							console.log(this.currentProjectList);
						} else 
						{
							this.presentToast({message: res1.message}, 'toastError');
						}
					},
					err => {
						this.loading.dismiss();
						console.log('Error occured');
						this.presentToast({message: 'Error occured'}, 'toastError');
					}
				);
			});
			//this.storage.get('zambia_bank_customer_accounts').then((userStr) => {
		});
	}

	addBankAccount()
	{
		console.log('--------------');
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.setRoot(ViewProjectPage, {fromWhere: 0});
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
	
	
	viewSingeProject(project, user)
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(ViewProjectPage, {project: project});
	}
	
	showProjectMenu(project, user)
	{
		var menuDetails = [];
		console.log(project.status);
		switch(project.status)
		{
			case "PENDING":
				menuDetails= this.handlePendingProjectStatusForProjectList(project, user);
				break;
			case "CANCELED":
				menuDetails= this.handleCanceledProjectStatusForProjectList(project, user);
				break;
			case "COMPLETED":
				menuDetails= this.handleCompletedProjectStatusForProjectList(project, user);
				break;
			case "OPEN":
				menuDetails= this.handleOpenProjectStatusForProjectList(project, user);
				break;
			case "ASSIGNED":
				menuDetails = this.handleAssignedProjectStatusForProjectList(project, user);
				break;
			case "IN PROGRESS":
				menuDetails = this.handleInProgressProjectStatusForProjectList(project, user);
				break;
		}
		
		
		
		
		const profileModal = this.modalCtrl.create(NewContextMenuPage, { menuDetails: menuDetails });
		
		profileModal.onDidDismiss(data => {
			console.log(data);
			if(data!=null)
			{
				if(data.selectedCommand.key=='VIEW_PROJECT')
				{
					//this.navCtrl.setRoot(TabsPage, {action: 'view-project'});
					console.log(this.currentProjectList[data.selectedCommand.id]);
					let projectSelected = this.currentProjectList.filter(currentProject => {
						return (currentProject.id==data.selectedCommand.id);
					});
					console.log(projectSelected);
					let options: NativeTransitionOptions = {
						direction: 'up',
						duration: 600
					};

					this.nativePageTransitions.flip(options);
					this.navCtrl.push(ViewProjectPage, {project: projectSelected[0]});
				}
				else if(data.selectedCommand.key=='CANCEL_PROJECT')
				{
					let tempList = [];
					for(var i2=0; i2<this.currentProjectList.length; i2++)
					{
						if(this.currentProjectList[i2].id==data.project.id)
						{
							tempList.push(data.project);
						}
						else
						{
							tempList.push(this.currentProjectList[i2]);
						}
					}
					this.currentProjectList = tempList;
				}
				else if(data.selectedCommand.key=='EDIT_PROJECT')
				{
					//this.navCtrl.setRoot(TabsPage, {action: 'view-project'});
					console.log(this.currentProjectList[data.selectedCommand.id]);
					let options: NativeTransitionOptions = {
						direction: 'up',
						duration: 600
					};

					this.nativePageTransitions.flip(options);
					this.navCtrl.push(NewProjectPage, {project: data.project});
				}
				else if(data.selectedCommand.key=='PAYMENT_INSTRUCTIONS')
				{
					const paymentInstructionModal = this.modalCtrl.create(PaymentInstructionsPage, { user: data.selectedCommand.user, projectDetails: data.selectedCommand.project });
					paymentInstructionModal.onDidDismiss(data => {
						console.log(data);
						this.updateProjectStatusByOrder(data.selectedCommand.project, data.transaction);
					});
					paymentInstructionModal.present();
				}
				else if(data.selectedCommand.key=='REASSIGN_PROJECT')
				{
					console.log(data);
					let tempList = [];
					for(var i21=0; i21<this.currentProjectList.length; i21++)
					{
						if(this.currentProjectList[i21].id==data.selectedCommand.id)
						{
							tempList.push(data.project);
						}
						else
						{
							tempList.push(this.currentProjectList[i21]);
						}
					}
					this.currentProjectList = tempList;
				}
				else if(data.selectedCommand.key=='ACCEPT_PROJECT')
				{
					console.log(data);
					let tempList = [];
					if(data.project!=undefined && data.project!=null)
					{
						for(var i22=0; i22<this.currentProjectList.length; i22++)
						{
							if(this.currentProjectList[i22].id==data.selectedCommand.id)
							{
								tempList.push(data.project);
							}
							else
							{
								tempList.push(this.currentProjectList[i22]);
							}
						}
						this.currentProjectList = tempList;
					}
					else
					{
						this.presentToast({message: data.message!=undefined && data.message!=null ? data.message : 'We could not confirm your acceptance to handle this project. Confirm this project has not been assigned to someone else'}, 'toastError');
					}
				}
				else if(data.selectedCommand.key=='VIEW_MESSAGES')
				{
					console.log(data.project);
					let options: NativeTransitionOptions = {
						direction: 'up',
						duration: 600
					};

					this.nativePageTransitions.flip(options);
					this.navCtrl.push(AllMessagesPage, {project: data.project});
				}
				else if(data.selectedCommand.key=='MARK_COMPLETED')
				{
					const rateModal = this.modalCtrl.create(RateProjectPage, { projectDetails: data.projectDetails, user:  data.selectedCommand.user, project:  data.selectedCommand.project});
					rateModal.onDidDismiss(data1 => {
						console.log(data1);
						if(data1!=null)
						{
							console.log(data1);
							let tempList = [];
							for(var i23=0; i23<this.currentProjectList.length; i23++)
							{
								if(this.currentProjectList[i23].id==data1.project.id)
								{
									tempList.push(data1.project);
								}
								else
								{
									tempList.push(this.currentProjectList[i23]);
								}
							}
							this.currentProjectList = tempList;
						}
					});
					rateModal.present();
				}
				else
				{
					
				}
				//this.modalDismissData = JSON.stringify(data);
				//this.countryCode = data.selectedCountry.code;
				//this.countryFlag = data.selectedCountry.flag;
			}
		});
		profileModal.present();
	}
	
	
	
	updateProjectStatusByOrder(project, transaction)
	{
		if(project!=undefined && project!=null && transaction!=undefined && transaction!=null)
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
				form_params = form_params + "&transactionId=" + encodeURI(transaction.id);
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
			this.presentToast({message: 'We could not confirm your payment'}, 'toastError');
		}
	}
	
	
	handlePendingProjectStatusForProjectList(project, user)
	{
		console.log(project);
		console.log(user);
		var menuDetails = [];
		if(project.status=='PENDING')
		{
			menuDetails.push({id:project.id, title:'View Project', key: 'VIEW_PROJECT', user: user, project: project});
			if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
			{
				if(project.created_by_user_id == user.id)
				{
					menuDetails.push({id:project.id, title:'Escrow Project Budget', key: 'PAYMENT_INSTRUCTIONS', user: user, project: project});
				}
			}
		}
		
		return menuDetails;
	}
	
	
	handleAssignedProjectStatusForProjectListOld(project, user)
	{
		var menuDetails = [];
		if(project.status=='ASSIGNED')
		{
			menuDetails.push({id:project.id, title:'View Project', key: 'VIEW_PROJECT', user: user, project: project});
			if(user!=null && user.role_type=='Artisan')
			{
				menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
				if(user.id==project.assigned_bidder_id)
				{
					menuDetails.push({id:project.id, title:'Accept Project', key: 'ACCEPT_PROJECT', user: user, project: project});
				}
			}
			else if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
			{
				if(project.created_by_user_id == user.id)
				{
					menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
					menuDetails.push({id:project.id, title:'Reassign Project', key: 'REASSIGN_PROJECT', user: user, project: project});
				}
			}
		}
		
		return menuDetails;
	}
	
	
	
	handleCanceledProjectStatusForProjectList(project, user)
	{
		console.log(project);
		console.log(user);
		var menuDetails = [];
		if(project.status=='PENDING')
		{
			menuDetails.push({id:project.id, title:'View Project', key: 'VIEW_PROJECT', user: user, project: project});
		}
		
		return menuDetails;
	}
	
	
	handleCompletedProjectStatusForProjectList(project, user)
	{
		console.log(project);
		console.log(user);
		var menuDetails = [];
		if(project.status=='COMPLETED')
		{
			menuDetails.push({id:project.id, title:'View Project', key: 'VIEW_PROJECT', user: user, project: project});
		}
		
		return menuDetails;
	}
	
	
	handleOpenProjectStatusForProjectList(project, user)
	{
		console.log(project);
		console.log(user);
		var menuDetails = [];
		if(project.status=='OPEN')
		{
			menuDetails.push({id:project.id, title:'View Project', key: 'VIEW_PROJECT', user: user, project: project});
			if(user!=null && user.role_type=='Artisan')
			{
				//menuDetails.push({id:project.id, title:'Bid On Project', key: 'BID_PROJECT', user: user, project: project});
				menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
				//menuDetails.push({id:project.id, title:'Complain About Project', key: 'COMPLAIN', user: user, project: project});
			}
			else if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
			{
				if(project.created_by_user_id == user.id)
				{
					menuDetails.push({id:project.id, title:'Edit Project', key: 'EDIT_PROJECT', user: user, project: project});
					menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
					menuDetails.push({id:project.id, title:'Cancel Project', key: 'CANCEL_PROJECT', user: user, project: project});
				}
			}
		}
		
		return menuDetails;
	}
	
	
	
	handleAssignedProjectStatusForProjectList(project, user)
	{
		var menuDetails = [];
		if(project.status=='ASSIGNED')
		{
			menuDetails.push({id:project.id, title:'View Project', key: 'VIEW_PROJECT', user: user, project: project});
			if(user!=null && user.role_type=='Artisan')
			{
				menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
				if(user.id==project.assigned_bidder_id)
				{
					menuDetails.push({id:project.id, title:'Accept Project', key: 'ACCEPT_PROJECT', user: user, project: project});
				}
			}
			else if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
			{
				if(project.created_by_user_id == user.id)
				{
					menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
					menuDetails.push({id:project.id, title:'Reassign Project', key: 'REASSIGN_PROJECT', user: user, project: project});
				}
			}
		}
		
		return menuDetails;
	}
	
			
	
	handleInProgressProjectStatusForProjectList(project, user)
	{
		var menuDetails = [];
		if(project.status=='IN PROGRESS')
		{
			menuDetails.push({id:project.id, title:'View Project', key: 'VIEW_PROJECT', user: user, project: project});
			if(user!=null && user.role_type=='Artisan')
			{
				menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
				if(user.id==project.assigned_bidder_id)
				{
					if(project.completed_by_worker!=undefined && project.completed_by_worker!=null && project.completed_by_worker==1)
					{
						
					}
					else
					{
						menuDetails.push({id:project.id, title:'Mark As Completed', key: 'MARK_COMPLETED', user: user, project: project});
					}
				}
			}
			else if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
			{
				if(project.created_by_user_id == user.id)
				{
					menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
					if(project.completed_by_worker!=undefined && project.completed_by_worker!=null && project.completed_by_worker==1)
					{
						menuDetails.push({id:project.id, title:'Mark As Completed', key: 'MARK_COMPLETED', user: user, project: project});
					}
					//menuDetails.push({id:project.id, title:'Complain About Artisan', key: 'COMPLAIN', user: user, project: project});
				}
			}
		}
		
		console.log(menuDetails);
		return menuDetails;
	}
	

	
	
	
	viewProfilePix()
	{
		console.log(3330);
		const profileModal = this.modalCtrl.create(ProfilePixPage, { user: this.user });
		profileModal.onDidDismiss(data => {
			
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
	
}


interface ProjectListRespInt{
  success: any;
  message: any;
  projects: any;
}

interface NewProjectReponse{
	success: any;
	message: any;
	project: any;
}