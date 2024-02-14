import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, ToastController, LoadingController, App} from 'ionic-angular';
import 'rxjs/add/operator/take';
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tabs, Events } from 'ionic-angular';

import { ProjectsPage } from '../projects/projects';
import { HomePage } from '../home/home';
import { MyProjectsPage } from '../my-projects/my-projects';
import { NewProjectStepThreePage } from '../new-project-step-three/new-project-step-three';
import { AllMessagesPage } from '../all-messages/all-messages';
import { ViewProjectPage } from '../view-project/view-project';
import { SettingsPage } from '../settings/settings';
import { UserManagementPage } from '../user-management/user-management';
import { ViewTicketPage } from '../view-ticket/view-ticket';
import { ViewMessagePage } from '../view-message/view-message';
import { LoginPage } from '../login/login';


interface ProjectRespInt{
	project: any;
	success: any;
	message: any;
}


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
	@ViewChild('myTabs') tabRef: Tabs;

	//tab1Root: any = ProjectsPage;
	tab1Root: any = HomePage;
	tab2Root: any = MyProjectsPage;
	tab3Root: any = NewProjectStepThreePage;
	tab4Root: any = AllMessagesPage;
	tab5Root: any = UserManagementPage;
	tab6Root: any = SettingsPage;
	loading: any;
	token: any;
	action: any;
	user: any = null;
	guarantor: any = null;
	artisan_skills: any = null;
	jsonData: any;
	
	
	
	
	constructor(public events: Events, public loadingCtrl: LoadingController, public toastCtrl: ToastController, 
		public http: HttpClient, public storage: Storage, public navParams: NavParams, public navCtrl: NavController, public app: App) {
		
		this.storage.get('handy_mate_loggedInUser').then((xx) => {
			this.user = xx;
			console.log(this.user);
		});
														
	}
	
	ionViewDidEnter(){
		
		this.storage.get('handy_mate_loggedInUser').then((xx) => {
			this.user = xx;
			console.log(this.user);
			this.storage.get('notificationActive').then((xx1) => {
				this.jsonData = xx1;
				this.jsonData = JSON.parse(this.jsonData);
				console.log(this.jsonData);
				
				this.action = this.navParams.get('action');
				console.log("this.action..." + this.action);
				if(this.action!=undefined && this.action!=null && this.action=='view-project')
				{
					//this.tab1Root = ViewProjectPage;
				}
				else if(this.action!=undefined && this.action!=null && this.action=='transferToWallet')
				{
					//this.tab2Root = SettingsPage;
					this.app.getRootNav().getActiveChildNav().select(5);
				}
				else if(this.action!=undefined && this.action!=null && this.action=='all-projects')
				{
					this.tab1Root = ProjectsPage;
					this.app.getRootNav().getActiveChildNav().select(0);
				}
				else if(this.action!=undefined && this.action!=null && this.action=='profile-management')
				{
					this.app.getRootNav().getActiveChildNav().select(1);
				}
				if(this.jsonData!=undefined && this.jsonData!=null && Object.keys(this.jsonData).length>0)
				{
					this.storage.remove('notificationActive');
					if(this.jsonData.message!=undefined && this.jsonData.message!=null)
					{
						this.presentToast({message: this.jsonData.message}, 'toastSuccess');
					}
					
					if(this.jsonData.type=='BID_PLACED' || this.jsonData.type=='BID_WON' || this.jsonData.type=='CLIENT_COMPLETION_CONFIRMATION' || this.jsonData.type=='CLIENT_RELEASE_PAYMENT' || 
						this.jsonData.type=='NEW_PROJECT_PLACED' || this.jsonData.type=='PAYMENT_RELEASE' || 
						this.jsonData.type=='PROJECT_ACCEPTANCE' || this.jsonData.type=='PROJECT_CANCELATION' || this.jsonData.type=='REOPEN_PROJECT' || this.jsonData.type=='WORKER_COMPLETION_CONFIRMATION')
					{
						this.presentToast({message: this.jsonData.msg_}, 'toastSuccess');
						this.getProjectById(this.jsonData.project);
					}
					else if(this.jsonData.type=='NEW_MESSAGE')
					{
						this.navCtrl.push(ViewMessagePage, {messageThread: this.jsonData.messageThread, fromWhere: 'notification'});
					}
					else if(this.jsonData.type=='NEW_SUPPORT_MESSAGE')
					{
						this.navCtrl.push(ViewTicketPage, {messageThread: this.jsonData.messageThread, fromWhere: 'notification'});
					}
					
				}
			});
		});
	}
	
	
	
	getProjectById(prjId)
	{
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		this.storage.get('handy_mate_token').then((val2) => {
			this.token = val2;
			header = header.set('Authorization', this.token);
			
			const httpOptions = {headers: header};
			let form_params = "";
			form_params = form_params + "&id=" + prjId;
			
			console.log(form_params);
			
			this.loading = this.loadingCtrl.create({
				content: 'Pls Wait. Getting Project Details...'
			});
			this.loading.present();
			
			let parameter = form_params;
			let url = "https://handymateservices.com/api/get-project-details";
			this.http.post<ProjectRespInt>(url, parameter, httpOptions).subscribe(
				res => {
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
						this.navCtrl.push(ViewProjectPage, {fromWhere: 'notification', project: res.project});
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
					this.presentToast({message: 'We experienced an error uploading your image'}, 'toastError');
				}
			);
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
		this.navCtrl.setRoot(LoginPage);
		
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

	onTabsChange() {
		/*console.log(this.tabRef);
		console.log(this.tabRef.getSelected());
		const previousTab = this.tabRef.previousTab(false);


		if(previousTab) {
			try {
				// Get the navCtrl and pop to the root page
				previousTab.getViews()[0].getNav().popToRoot();
			} catch(exception) {
				// Oops....
				console.error(exception);
			}
		}

		if(this.tabRef.getSelected().tabIcon=='document')
		{
			console.log('ekwacha clicked');
			this.events.publish('tab:clicked', 5, Date.now());
			this.tab1Root = HomePage;
		}
		else if(this.tabRef.getSelected().tabIcon=='folder-open')
		{
			console.log('one bank clicked');
			this.events.publish('tab:clicked', 1, Date.now());
			this.tab2Root = MyProjectsPage;
		}
		else if(this.tabRef.getSelected().tabIcon=='add')
		{
			console.log('one bank clicked');
			this.events.publish('tab:clicked', 0, Date.now());
			this.tab1Root = NewProjectStepThreePage;
		}*/
		
	}
}
