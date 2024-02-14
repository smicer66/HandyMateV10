import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ToastController, ViewController, Platform, App, LoadingController  } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LoginPage } from '../login/login';
import { ProfilePixPage } from '../profile-pix/profile-pix';
import { UploadAttachmentPage } from '../upload-attachment/upload-attachment';



@Component({
  selector: 'page-raise-support-ticket',
  templateUrl: 'raise-support-ticket.html'
})
export class RaiseSupportTicketPage {

	raiseSupportTicketForm : FormGroup;
    raiseSupportTicketData :any = { levelOfImportance: '', projectId: '', details: '', attach_image_url1: 'assets/imgs/attach_image.png', attach_image_url2: 'assets/imgs/attach_image.png', attach_image_url3: 'assets/imgs/attach_image.png'  };
    projectList : any = [];
    transactionList: any = [];
	levelOfImportance: AbstractControl;
	projectId: AbstractControl;
	details: AbstractControl;
	token: any;
	user: any;
	message: any;
	loading: any;
	replyMessage: any;

    constructor(public platform: Platform, public viewCtrl: ViewController, public modalCtrl: ModalController, public app: App, public storage: Storage, 
		public nativePageTransitions: NativePageTransitions, public loadingCtrl: LoadingController, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams) {
		this.raiseSupportTicketForm = this.fb.group({
			'levelOfImportance' : [null, Validators.compose([Validators.required])],
			'projectId': [null, Validators.compose([Validators.required])],
			'details': [null, Validators.compose([])]
		});

        this.levelOfImportance = this.raiseSupportTicketForm.controls['levelOfImportance'];
        this.projectId = this.raiseSupportTicketForm.controls['projectId'];
        this.details = this.raiseSupportTicketForm.controls['details'];
		this.raiseSupportTicketData.attach_image_url1 = 'assets/imgs/attach_image.png';
		this.raiseSupportTicketData.attach_image_url2 = 'assets/imgs/attach_image.png';
		this.raiseSupportTicketData.attach_image_url3 = 'assets/imgs/attach_image.png';
		
		this.replyMessage = navParams.get('replyMessage');
		console.log(this.replyMessage);
		let pid = navParams.get('projectId');
		if(pid!=undefined && pid!=null)
		{
			this.raiseSupportTicketData.projectId = pid;
		}
		if(this.replyMessage!=undefined && this.replyMessage!=null)
		{
			this.raiseSupportTicketData.levelOfImportance = '';
			this.raiseSupportTicketData.projectId = this.replyMessage.project_id;
			this.raiseSupportTicketData.details = '';
		}
		console.log(this.raiseSupportTicketData);
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
	
	ionViewDidLoad() 
	{
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
			if(this.message!=null)
			{
				this.presentToast({message: this.message}, 'toastSuccess');
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
				
				console.log(form_params);
				
				this.loading = this.loadingCtrl.create({
					content: 'Please wait...'
				});
				this.loading.present();
				
				let parameter = form_params;
				let url = "https://handymateservices.com/api/get-projects-and-transactions-for-user";
				this.http.post<MessageThreadListRespInt>(url, parameter, httpOptions).subscribe(
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
							this.projectList = res.projectList;
							console.log(this.projectList);
							this.transactionList = res.transactionList;
							console.log(this.transactionList);
						}
						else
						{
							console.log(-1);
							this.presentToast({message: res.message}, 'toastError');
							this.viewCtrl.dismiss();
						}
					},
					err => {
						this.loading.dismiss();
						console.log('Error occured');
					}
				);
			});
			
			
			
			//this.storage.get('zambia_bank_customer_accounts').then((userStr) => {
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
					this.raiseSupportTicketData.attach_image_url1 = base64ImageFromGallery;
				}
				else if(id==2)
				{
					this.raiseSupportTicketData.attach_image_url2 = base64ImageFromGallery;
				}
				else if(id==3)
				{
					this.raiseSupportTicketData.attach_image_url3 = base64ImageFromGallery;
				}
			}
		});
		profileModal.present();
	}


    sendSupportTicket(raiseSupportTicketData, message, user, replyMessage)
    {
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		
		this.storage.get('handy_mate_token').then((val2) => {
			this.token = val2;
			header = header.set('Authorization', this.token);
			
			const httpOptions = {headers: header};
			console.log(header);
			console.log(httpOptions);
			var form_params = "";
			form_params = form_params + "message=" + encodeURI(this.raiseSupportTicketData.details);
			if(replyMessage!=undefined && replyMessage!=null)
			{
				form_params = form_params + "&msgId=" + replyMessage.id;
			}
			if(this.raiseSupportTicketData.projectId!=null)
			{
				form_params = form_params + "&projectId=" + this.raiseSupportTicketData.projectId;
			}
			form_params = form_params + "&senderId=" + user.id;
			form_params = form_params + "&levelOfImportance=" + this.raiseSupportTicketData.levelOfImportance;
			if(this.raiseSupportTicketData.attach_image_url1!='assets/imgs/attach_image.png')
			{
				form_params = form_params + "&attach_image_url1=" + this.raiseSupportTicketData.attach_image_url1;
			}
			if(this.raiseSupportTicketData.attach_image_url2!='assets/imgs/attach_image.png')
			{
				form_params = form_params + "&attach_image_url2=" + this.raiseSupportTicketData.attach_image_url2;
			}
			if(this.raiseSupportTicketData.attach_image_url3!='assets/imgs/attach_image.png')
			{
				form_params = form_params + "&attach_image_url3=" + this.raiseSupportTicketData.attach_image_url3;
			}
			console.log(form_params);
			
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();
			
			
			let parameter = form_params;
			let url = "https://handymateservices.com/api/compose-support-message";
			this.http.post<MessageThreadListRespInt>(url, parameter, httpOptions).subscribe(
				res => {
					let success: any = null;
					success = res.success;
					console.log(res);
					console.log(res);
					//console.log(success);
					
					if(res.success==422)
					{
						this.logout();
					}
					else if(success===true)
					{
						this.loading.dismiss();
						this.presentToast({message: res.message}, 'toastSuccess');
						this.viewCtrl.dismiss({messageThreads: res.messageThreads, messageThreadDetails: res.messageThreadDetails});
						
					}
					else
					{
						this.loading.dismiss();
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


interface MessageThreadListRespInt{
	provinceList: any;
	districtList: any;
	countryList: any;
	success: any;
	projectList: any;
	transactionList: any;
	messageThreads: any; 
	messageThreadDetails: any;
	message: any;
}
