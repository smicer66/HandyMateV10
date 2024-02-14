import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ToastController, Platform, LoadingController, App } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';

import { ProfilePixPage } from '../profile-pix/profile-pix';

/**
 * Generated class for the ContentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */




@Component({
  selector: 'page-content',
  templateUrl: 'content.html',
})
export class ContentPage {

	requestChequeBookData = { cheque_leaves: '', collection_point: '', account: '', narration: '', pin: '' };
	requestChequeBookForm : FormGroup;
	cheque_leaves: AbstractControl;
	collection_point: AbstractControl;
	account: AbstractControl;
	narration: AbstractControl;
	pin: AbstractControl;
	
	agentlist: any = [];
	accountlist: any = [];
	token: any;
	
	loading: any;
	type: any;
	user: any;
	

	
	//, public camera: Camera, public file: File, public filePath: FilePath,public loadingProvider: LoadingProvider
	constructor(public app: App, public modalCtrl: ModalController,  public platform: Platform, public storage: Storage, 
		public nativePageTransitions: NativePageTransitions , public loadingCtrl: LoadingController, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public navCtrl: NavController, public navParams: NavParams){
		this.requestChequeBookForm = this.fb.group({
			'cheque_leaves' : [null, Validators.compose([Validators.required])],
			'collection_point': [null, Validators.compose([Validators.required])],
			'account':  [null, Validators.compose([Validators.required])],
			'narration':  [null, Validators.compose([Validators.required])],
			'pin':  [null, Validators.compose([Validators.required])]
		});

        this.cheque_leaves = this.requestChequeBookForm.controls['cheque_leaves'];
        this.collection_point = this.requestChequeBookForm.controls['collection_point'];
		this.account = this.requestChequeBookForm.controls['account'];
        this.narration = this.requestChequeBookForm.controls['narration'];
		this.pin = this.requestChequeBookForm.controls['pin'];
		
		this.type= navParams.get('type');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ContentPage');
		this.storage.get('handy_mate_loggedInUser').then((val2) => {
			this.user = val2;
			console.log(this.user);
		});
	}
  
	doRequestChequeBook(requestChequeBookData){
		//this.navCtrl.setRoot(ContentPage);
		
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
			content: 'Please wait...'
		});
		loading.present();
		this.storage.remove('zambia_bank_customer_token');
		this.storage.remove('zambia_bank_loggedInUser');
		this.token = null;
		loading.dismiss();
		//this.navCtrl.setRoot(LoginPage);
		
		let options: NativeTransitionOptions = {
			direction: 'up',
			duration: 600
		};

		this.nativePageTransitions.flip(options);
		this.app.getRootNav().setRoot(LoginPage);
		
	}

}
