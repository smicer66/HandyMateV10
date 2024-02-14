import { Component } from '@angular/core';
import {  NavController, NavParams, ToastController, ActionSheetController, Platform, LoadingController, ViewController, ModalController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from "@ionic/storage";
import { ProjectsPage } from '../projects/projects';
import { NewContextMenuPage } from '../new-context-menu/new-context-menu';
import { BidProjectPage } from '../bid-project/bid-project';
import { ComposeMessagePage } from '../compose-message/compose-message';
import { NewProjectPage } from '../new-project/new-project';
import { AllMessagesPage } from '../all-messages/all-messages';
import { ProfilePixPage } from '../profile-pix/profile-pix';
import { UserProfilePage } from '../user-profile/user-profile';
import { LoginPage } from '../login/login';
import { RateProjectPage } from '../rate-project/rate-project';
import { RaiseSupportTicketPage } from '../raise-support-ticket/raise-support-ticket';
import { ProbasePayPage } from '../probase-pay/probase-pay';
import { TabsPage } from '../tabs/tabs';
import { PaymentInstructionsPage } from '../payment-instructions/payment-instructions';


/**
 * Generated class for the ViewProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-view-project',
  templateUrl: 'view-project.html',
})
export class ViewProjectPage {
	addBankAccountData = { bank: '', accountName: '', accountNumber: '' };
	//account_number_val: any = '';
	//reg_code: any = '';
	addBankAccountPageForm : FormGroup;
	bank: AbstractControl;
	accountName: AbstractControl;
	accountNumber: AbstractControl;
	loading: any;
	bankList: any;
	token: any;
	fromWhere: any;
	project: any = {};
	user: any = null;
	

	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public app: App, public modalCtrl: ModalController, public viewCtrl: ViewController, public platform: Platform, public http: HttpClient, 
		public nativePageTransitions: NativePageTransitions, public storage: Storage, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, 
		public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.addBankAccountPageForm = this.fb.group({
			'bank' : [null, Validators.compose([Validators.required])],
			'accountName': [null, Validators.compose([Validators.required])],
			'accountNumber': [null, Validators.compose([Validators.required])]
		});

        this.bank = this.addBankAccountPageForm.controls['bank'];
        this.accountName = this.addBankAccountPageForm.controls['accountName'];
        this.accountNumber = this.addBankAccountPageForm.controls['accountNumber'];
		this.fromWhere = navParams.get('fromWhere');
		//this.project = navParams.data.project;
		this.project = navParams.get('project');
		console.log(navParams);
		//console.log(navParams.data.project);
		//console.log(navParams.data.project);
		console.log(this.project);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddBankAccountPage');
		
	}
	
	ionViewDidEnter() {
		this.project = this.navParams.get('project');
		console.log(this.project);
		console.log('ionViewDidLoad AddBankAccountPage');
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			this.storage.get('zambia_bank_list').then((val) => {
				this.bankList = JSON.parse(val);
				console.log(this.bankList);
				
			});	
		});
		
		this.fromWhere = this.navParams.get('fromWhere');
		if(this.fromWhere!=undefined && this.fromWhere!=null)
		{
			if(this.fromWhere=='notification')
			{
				this.storage.remove('notificationActive');
			}
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
	
	dismiss()
	{
		if(this.fromWhere==0)
		{
			let options: NativeTransitionOptions = {
				direction: 'up',
				duration: 600
			};

			this.nativePageTransitions.flip(options);
			this.navCtrl.setRoot(ProjectsPage);
		}
		else
		{
			let options: NativeTransitionOptions = {
				direction: 'up',
				duration: 600
			};

			this.nativePageTransitions.flip(options);
			this.navCtrl.setRoot(ProjectsPage);
		}
	}
	
	
	viewUserProfile(usr)
	{
		console.log(3330);
		const userProfileModal = this.modalCtrl.create(UserProfilePage, { user: usr });
		userProfileModal.onDidDismiss(data => {
			
		});
		userProfileModal.present();
	}
	
	
	showBidMenus(bid, project, user)
	{
		var menuDetails = [];
		console.log(project);
		switch(project.status)
		{
			case "OPEN":
				menuDetails= this.handleOpenProjectStatusForBids(bid, project, user);
				break;
			case "ASSIGNED":
				menuDetails = this.handleAssignedProjectStatusForBids(bid, project, user);
				break;
			case "IN PROGRESS":
				menuDetails = this.handleInProgressProjectStatusForBids(bid, project, user);
				break;
		}
			
		if(menuDetails!=null && menuDetails!=undefined && menuDetails.length>0)
		{			
			const profileModal = this.modalCtrl.create(NewContextMenuPage, { menuDetails: menuDetails, project: project, bid: bid, user:user });
			
			profileModal.onDidDismiss(data => {
				console.log(data);
				if(data!=null)
				{
					if(data.selectedCommand.key=='BID_PROJECT')
					{
						const bidModal = this.modalCtrl.create(BidProjectPage, { projectDetails: data.selectedCommand.project, bid: data.selectedCommand.bid, user:  data.selectedCommand.user, project:  data.selectedCommand.project});
						bidModal.onDidDismiss(data => {
							console.log(data);
							if(data!=null && data.project!=undefined && data.project!=null)
							{
								this.project = data.project;
							}
						});
						bidModal.present();
					}
					else if(data.selectedCommand.key=='CANCEL_BID')
					{
						this.project = data.project;
						this.presentToast({message: 'Your selected bid has been canceled.'}, 'toastSuccess');
					}
					else if(data.selectedCommand.key=='WIN_BID')
					{
						if(data.extraBudget!=undefined && data.extraVat!=undefined && data.extraServiceCharge!=undefined && data.balanceToPay!=undefined && 
							data.extraBudget!=null && data.extraVat!=null && data.extraServiceCharge!=null && data.balanceToPay!=null)
						{
							this.loading = this.loadingCtrl.create({
								content: 'Loading Payment View...'
							});
							this.loading.present();
							


							const probasePayModal = this.modalCtrl.create(ProbasePayPage, 
								{
									projectId: this.project.id, transaction: data.transaction, probasePayMerchant: data.probasePayMerchant, 
									probasePayDeviceCode: data.probasePayDeviceCode, mobileNumber: data.mobileNumber, payeeName: data.payeeName, 
									budget: data.balanceToPay, vat: data.extraVat, service_charge: data.extraServiceCharge, extraBudget: data.extraBudget,
									project: data.project, type: 'UPGRADE BUDGET'
								}
							);
							this.loading.dismiss();
							probasePayModal.onDidDismiss(data => {
								console.log(data);
								this.updateProjectBudget(this.project, data.transaction);
								//this.navCtrl.setRoot(ProjectsPage);
								//this.navCtrl.setRoot(TabsPage, {action: 'view-project'});
								
								
								let options: NativeTransitionOptions = {
									direction: 'up',
									duration: 600
								};

								this.nativePageTransitions.flip(options);
								this.navCtrl.setRoot(TabsPage, {action: 'view-project'});
							});
							probasePayModal.present();
						}
						else
						{
							this.project = data.project;
							this.presentToast({message: 'Your selected bid has been assigned as the winning bid. We have sent the bidder a message to accept the bid.'}, 'toastSuccess');
						}
					}
					else if(data.selectedCommand.key=='REASSIGN_PROJECT_BID')
					{
						this.project = data.project;
						this.presentToast({message: 'Your selected bid has been removed as the winning bid. You can now select any bid as the winning bid.'}, 'toastSuccess');
					}
					else if(data.selectedCommand.key=='VIEW_MESSAGES')
					{
						console.log(this.project);
						let options: NativeTransitionOptions = {
							direction: 'up',
							duration: 600
						};

						this.nativePageTransitions.flip(options);
						this.navCtrl.push(AllMessagesPage, {project: this.project});
					}
					else if(data.selectedCommand.key=='MESSAGE')
					{
						const composeModal = this.modalCtrl.create(ComposeMessagePage, { projectDetails: project, user:  user, project:  project, bid: bid});
						composeModal.onDidDismiss(data => {
							console.log(data);
							if(data!=null)
							{
								this.project = data.project;
							}
							else
							{
								this.project = project;
							}
						});
						composeModal.present();
					}
					else if(data.selectedCommand.key=='COMPLAIN')
					{
						let options: NativeTransitionOptions = {
							direction: 'up',
							duration: 600
						};

						this.nativePageTransitions.flip(options);
						this.navCtrl.push(RaiseSupportTicketPage, {projectId: project.id});
					}
					else if(data.selectedCommand.key=='ACCEPT_PROJECT')
					{
						console.log(data);
						if(data.project!=undefined && data.project!=null)
						{
							this.project = data.project;
							this.presentToast({message: 'Thank you for accepting to handle this project. Please when you have completed the project, come back to this project to indicate its been completed'}, 'toastSuccess');
						}
						else
						{
							this.presentToast({message: data.message!=undefined && data.message!=null ? data.message : 'We could not confirm your acceptance to handle this project. Confirm this project has not been assigned to someone else'}, 'toastError');
						}
					}
					//this.modalDismissData = JSON.stringify(data);
					//this.countryCode = data.selectedCountry.code;
					//this.countryFlag = data.selectedCountry.flag;
				}
			});
			profileModal.present();
		}
		else
		{
			this.presentToast({message: 'You can not carry out any actions on this project'}, 'toastError');
		}
	}
	
	
	
	
	updateProjectBudget(project, transaction)
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
						else if(success===true)
						{
							
							this.presentToast({message: res.message}, 'toastSuccess');
							//this.navCtrl.setRoot(ViewProjectPage, {project: res.project});
							this.project = res.project;
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
	}
	
	
	handleOpenProjectStatusForBids(bid, project, user)
	{
		var menuDetails = [];
		console.log(user);
		console.log(bid);
		console.log(project);
		if(project.status=='OPEN')
		{
			if(bid.status=='VALID')
			{
				if(user!=null && user.role_type=='Artisan')
				{
					if(user.id==bid.bid_by_user_id)
					{
						menuDetails.push({id:bid.id, title:'Update Bid', key: 'BID_PROJECT', bid: bid, user: user, project: project});
						menuDetails.push({id:bid.id, title:'Cancel Bid', key: 'CANCEL_BID', bid: bid, user: user, project: project});
					}
				}
				else if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
				{
					if(project.created_by_user_id == user.id)
					{
						menuDetails.push({id:bid.id, title:'Select As Winner', key: 'WIN_BID', bid: bid, user: user, project: project});
						menuDetails.push({id:bid.id, title:'Message Bidder', key: 'MESSAGE', bid: bid, user: user, project: project});
					}
				}
				
			}
		}
		
		return menuDetails;
	}
	
	
	handleAssignedProjectStatusForBids(bid, project, user)
	{
		var menuDetails = [];
		if(project.status=='ASSIGNED')
		{
			if(bid.status=='WON')
			{
				if(user!=null && user.role_type=='Artisan')
				{
					if(user.id==bid.bid_by_user_id)
					{
						menuDetails.push({id:project.id, title:'Accept Project', key: 'ACCEPT_PROJECT', bid: bid, user: user, project: project});
					}
				}
				else if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
				{
					if(project.created_by_user_id == user.id)
					{
						menuDetails.push({id:project.id, title:'Reassign Project', key: 'REASSIGN_PROJECT_BID', bid: bid, user: user, project: project});
						menuDetails.push({id:bid.id, title:'Message Bidder', key: 'MESSAGE', bid: bid, user: user, project: project});
					}
				}
			}
		}
		
		return menuDetails;
	}
	
	
	handleInProgressProjectStatusForBids(bid, project, user)
	{
		var menuDetails = [];
		if(project.status=='IN PROGRESS')
		{
			if(bid.status=='WON')
			{
				if(user!=null && user.role_type=='Artisan')
				{
					if(user.id==bid.bid_by_user_id)
					{
					}
				}
				else if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
				{
					if(project.created_by_user_id == user.id)
					{
						//menuDetails.push({id:bid.id, title:'Complain About Artisan', key: 'COMPLAIN', bid: bid, user: user, project: project});
						menuDetails.push({id:bid.id, title:'Message Bidder', key: 'MESSAGE', bid: bid, user: user, project: project});
					}
				}
			}
		}
		
		return menuDetails;
	}
	
	
	
	
	
			
			
	handleOpenProjectStatusForProjects(project, user)
	{
		console.log(project);
		console.log(user);
		var menuDetails = [];
		if(project.status=='OPEN')
		{
			if(user!=null && user.role_type=='Artisan')
			{
				menuDetails.push({id:project.id, title:'Bid On Project', key: 'BID_PROJECT', user: user, project: project});
				menuDetails.push({id:project.id, title:'Send A Message', key: 'COMPOSE_MESSAGE', user: user, project: project});
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
	
	
	
	handleAssignedProjectStatusForProjects(project, user)
	{
		var menuDetails = [];
		if(project.status=='ASSIGNED')
		{
			if(user!=null && user.role_type=='Artisan')
			{
				if(user.id==project.assigned_bidder_id)
				{
					menuDetails.push({id:project.id, title:'Send A Message', key: 'COMPOSE_MESSAGE', user: user, project: project});
				}
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
					menuDetails.push({id:project.id, title:'Send Mate A Message', key: 'COMPOSE_MESSAGE', user: user, project: project});
					menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
					menuDetails.push({id:project.id, title:'Reassign Project', key: 'REASSIGN_PROJECT', user: user, project: project});
				}
			}
		}
		
		return menuDetails;
	}
	
			
	
	handleInProgressProjectStatusForProjects(project, user)
	{
		var menuDetails = [];
		if(project.status=='IN PROGRESS')
		{
			if(user!=null && user.role_type=='Artisan')
			{
				if(user.id==project.assigned_bidder_id)
				{
					menuDetails.push({id:project.id, title:'Send A Message', key: 'COMPOSE_MESSAGE', user: user, project: project});
				}
				menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
				if(user.id==project.assigned_bidder_id && project.completed_by_worker!=1)
				{
					menuDetails.push({id:project.id, title:'Mark As Completed', key: 'MARK_COMPLETED', user: user, project: project});
				}
			}
			else if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
			{
				if(project.created_by_user_id == user.id)
				{
					
					menuDetails.push({id:project.id, title:'Send Artisan A Message', key: 'COMPOSE_MESSAGE', user: user, project: project});
					menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
					if(project.completed_by_worker==1)
					{
						menuDetails.push({id:project.id, title:'Mark As Completed', key: 'MARK_COMPLETED', user: user, project: project});
					}
					//menuDetails.push({id:project.id, title:'Complain About Artisan', key: 'COMPLAIN', user: user, project: project});
				}
			}
		}
		
		return menuDetails;
	}
	

	
	
	handlePendingProjectStatusForProjects(project, user)
	{
		var menuDetails = [];
		if(project.status=='PENDING')
		{
			menuDetails.push({id:project.id, title:'View Messages', key: 'VIEW_MESSAGES', user: user, project: project});
			if(user!=null && (user.role_type=='Private Client' || user.role_type=='Corporate Client'))
			{
				if(project.created_by_user_id == user.id)
				{
					menuDetails.push({id:project.id, title:'Pay For Project', key: 'PAYMENT_INSTRUCTIONS', user: user, project: project});
				}
			}
		}
		
		return menuDetails;
	}
	
	
	
	
	bidOnProject(project, bidId)
	{
		const bidModal = this.modalCtrl.create(BidProjectPage, { projectDetails: project });
		bidModal.onDidDismiss(data => {
			console.log(data);
			if(data!=null && data.project!=undefined && data.project!=null)
			{
				this.project = data.project;
			}
		});
		bidModal.present();
	}
	
	
	showProjectMenu(project, user)
	{
		var menuDetails = [];
		
		console.log(project.status);
		switch(project.status)
		{
			case "OPEN":
				menuDetails= this.handleOpenProjectStatusForProjects(project, user);
				break;
			case "ASSIGNED":
				menuDetails = this.handleAssignedProjectStatusForProjects(project, user);
				break;
			case "IN PROGRESS":
				menuDetails = this.handleInProgressProjectStatusForProjects(project, user);
				break;
			case "PENDING":
				menuDetails = this.handlePendingProjectStatusForProjects(project, user);
				break;
		}
		
		if(menuDetails!=null && menuDetails.length>0)
		{
			const profileModal = this.modalCtrl.create(NewContextMenuPage, { menuDetails: menuDetails });
			
			profileModal.onDidDismiss(data => {
				console.log(data);
				if(data!=null && data.selectedCommand!=undefined && data.selectedCommand!=null)
				{
					if(data.selectedCommand.key=='EDIT_PROJECT')
					{
						//console.log(this.currentProjectList[data.selectedCommand.id]);
						let options: NativeTransitionOptions = {
							direction: 'up',
							duration: 600
						};

						this.nativePageTransitions.flip(options);
						this.navCtrl.push(NewProjectPage, {project: data.project});
					}
					else if(data.selectedCommand.key=='COMPOSE_MESSAGE')
					{
						const composeModal = this.modalCtrl.create(ComposeMessagePage, { projectDetails: project, user:  user, project:  project});
						composeModal.onDidDismiss(data => {
							console.log(data);
							if(data!=null)
							{
								this.project = data.project;
							}
							else
							{
								this.project = project;
							}
						});
						composeModal.present();
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
					else if(data.selectedCommand.key=='COMPLAIN')
					{
						let options: NativeTransitionOptions = {
							direction: 'up',
							duration: 600
						};

						this.nativePageTransitions.flip(options);
						this.navCtrl.push(RaiseSupportTicketPage, {projectId: project.id});
					}
					else if(data.selectedCommand.key=='MESSAGE')
					{
						
					}
					else if(data.selectedCommand.key=='CANCEL_PROJECT')
					{
						console.log(data);
						this.project = data.project;
					}
					else if(data.selectedCommand.key=='ACCEPT_PROJECT')
					{
						if(data.project!=undefined && data.project!=null)
						{
							this.project = data.project;
						}
						else
						{
							this.presentToast({message: data.message!=undefined && data.message!=null ? data.message : 'We could not confirm your acceptance to handle this project. Confirm this project has not been assigned to someone else'}, 'toastError');
						}
					}
					else if(data.selectedCommand.key=='REASSIGN_PROJECT')
					{
						console.log(data);
						this.project = data.project;
					}
					else if(data.selectedCommand.key=='MARK_COMPLETED')
					{
						console.log(data);
						//this.navCtrl.push(RateProjectPage, {project:data.selectedCommand.project, user: data.selectedCommand.user});
						const rateModal = this.modalCtrl.create(RateProjectPage, { projectDetails: data.selectedCommand.project, project:data.selectedCommand.project, user: data.selectedCommand.user});
						rateModal.onDidDismiss(data1 => {
							console.log(data1);
							if(data1!=null)
							{
								console.log(data1);
								this.project = data1.project;
								if(user.role_type=='Artisan')
									this.presentToast({message: 'Thank you for informing us about the completion of this project. We have sent a message to the project owner to confirm completion of the project and release your funds.'}, 'toastSuccess');
								else
									this.presentToast({message: 'Thank you for confirming the completion of your project. The escrowed funds for payment of the bidder has been released to the bidder.'}, 'toastSuccess');
							}
						});
						rateModal.present();
					}
					else if(data.selectedCommand.key=='BID_PROJECT')
					{
						let bidExisting = null;
						for(var i1=0; i1<project.bids.length; i1++)
						{
							console.log(project.bids[i1]);
							if(project.bids[i1].bid_by_user_id==user.id)
							{
								bidExisting = project.bids[i1];
							}
						}
						const bidModal = this.modalCtrl.create(BidProjectPage, { projectDetails: project, user:  user, project:  project, bid: bidExisting});
						bidModal.onDidDismiss(data => {
							console.log(data);
							if(data!=null && data.project!=undefined && data.project!=null)
							{
								this.project = data.project;
							}
						});
						bidModal.present();
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
					//this.modalDismissData = JSON.stringify(data);
					//this.countryCode = data.selectedCountry.code;
					//this.countryFlag = data.selectedCountry.flag;
				}
			});
			profileModal.present();
		}
		else
		{
			this.presentToast({message: 'You can not carry out any actions on this project'}, 'toastError');
		}
	}
	
	viewTransactions(project)
	{
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.navCtrl.push(RaiseSupportTicketPage, {projectId: project.id});
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
							this.project = res.project;
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

interface NewProjectReponse{
	project: any;
	success: any;
	message: any;
}