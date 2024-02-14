import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController, Platform, LoadingController, App } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { Storage } from "@ionic/storage";
import 'rxjs/add/operator/take';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginPage } from '../login/login';


/**
 * Generated class for the ProbasePayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-probase-pay',
  templateUrl: 'probase-pay.html',
})
export class ProbasePayPage {
	probasepayurl: any;
	ref_no: any;
	probasePayMerchant: any = 'XUYE';
	probasePayDeviceCode: any = 'XUYE';
	mobileNumber: any;
	payeeName: any;
	projectId: any;
	transaction: any;
	token: any;
	user: any;
	loading: any;
	type: any;
	fundAmount: any;
	withdrawAmount: any;
	title: any = 'Escrow Budget & Submit Project';
	
	
	constructor(public app: App, public sanitize: DomSanitizer, public platform: Platform, public storage: Storage, public loadingCtrl: LoadingController, public http: HttpClient, public toastCtrl: ToastController, public fb: FormBuilder, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
		this.probasepayurl = this.sanitize.bypassSecurityTrustResourceUrl('https://payments.probasepay.com/mobile/index');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProbasePayPage');
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
	
	ionViewDidEnter() {
		console.log(this.navParams);
		this.ref_no = this.navParams.get('ref_no');
		this.projectId = this.navParams.get('projectId');
		this.transaction = this.navParams.get('transaction');
		let project = this.navParams.get('project');
		this.probasePayMerchant = this.navParams.get('probasePayMerchant');
		this.probasePayDeviceCode = this.navParams.get('probasePayDeviceCode');
		this.mobileNumber = this.navParams.get('mobileNumber');
		this.payeeName = this.navParams.get('payeeName');
		this.type = this.navParams.get('type');
		this.withdrawAmount = this.navParams.get('withdrawAmount');
		this.fundAmount = this.navParams.get('fundAmount');
		let title = this.navParams.get('title');
		let vat = this.navParams.get('vat');
		let service_charge = this.navParams.get('service_charge');
		let extraBudget = this.navParams.get('extraBudget');
		if(title!=undefined && title!=null)
		{
			this.title = title;
		}
		console.log(this.title);
		console.log(this.projectId);
		console.log(this.transaction);
		
							
							
		if(this.type!=undefined && this.type!=null && this.type=='FUND WALLET')
		{
			let params1 = [];
			let params2 = [];
			params1.push(this.fundAmount);
			params2.push('Fund HandyMate Wallet');
			
			console.log(this.transaction.reference_no);
			console.log(this.probasePayMerchant);
			console.log(this.probasePayDeviceCode);
			console.log(this.mobileNumber);
			console.log(this.payeeName);
			
			
			this.probasepayurl = 'https://wallet.probasepay.com/mobile/process-fund-pay/' + encodeURI(this.transaction.reference_no) + '/' + 
				this.probasePayMerchant + '/' + this.probasePayDeviceCode + '/' + 
				this.mobileNumber + '/' + encodeURI(this.payeeName) + '/' + encodeURI(JSON.stringify(params2)) + '/' + encodeURI(JSON.stringify(params1)) + '/' + this.transaction.currency;
		}
		else if(this.type!=undefined && this.type!=null && this.type=='UPGRADE BUDGET')
		{
			let params1 = [];
			let params2 = [];
			params1.push(extraBudget);
			params1.push(vat);
			params1.push(service_charge);
			params2.push('Project Budget - Extra');
			params2.push('VAT(5%) - Extra');
			params2.push('Service Charge (5%) - Extra');
			this.probasepayurl = 'https://wallet.probasepay.com/mobile/process-pay/' + encodeURI(this.transaction.reference_no) + '/' + 
				this.probasePayMerchant + '/' + this.probasePayDeviceCode + '/' + 
				this.mobileNumber + '/' + encodeURI(this.payeeName) + '/' + encodeURI(JSON.stringify(params2)) + '/' + encodeURI(JSON.stringify(params1)) + '/' + this.transaction.currency;
		}
		else
		{
			let params1 = [];
			let params2 = [];
			params1.push(project.budget);
			params1.push(project.vat);
			params1.push(project.service_charge);
			params2.push('Project Budget');
			params2.push('VAT(5%)');
			params2.push('Service Charge (5%)');
			this.probasepayurl = 'https://wallet.probasepay.com/mobile/process-pay/' + encodeURI(this.transaction.reference_no) + '/' + 
				this.probasePayMerchant + '/' + this.probasePayDeviceCode + '/' + 
				this.mobileNumber + '/' + encodeURI(this.payeeName) + '/' + encodeURI(JSON.stringify(params2)) + '/' + encodeURI(JSON.stringify(params1)) + '/' + this.transaction.currency;
		}
		console.log(this.probasepayurl);
		
		
		
		
		
		this.probasepayurl = this.sanitize.bypassSecurityTrustResourceUrl(this.probasepayurl);
	}
	
	
	handleSelect(selectedCountry)
	{
		let data = {}
		this.viewCtrl.dismiss(data);
	}
	
	dismissModal() {
		let data = { };
		this.viewCtrl.dismiss(data);
		console.log(data);
		
		
		
		
		
		let header = new HttpHeaders();
		header = header.set('Content-Type', 'application/x-www-form-urlencoded');
		header = header.set('Accept-Language', 'en-US,en;q=0.5');
		this.storage.get('handy_mate_token').then((val2) => {
			this.token = val2;
			console.log(this.viewCtrl);
			header = header.set('Authorization', this.token);
			
			const httpOptions = {headers: header};
			let form_params = "";
				
			form_params = form_params + "&reference_no=" + encodeURI(this.transaction.reference_no);
			form_params = form_params + "&probasePayMerchant=" + encodeURI(this.probasePayMerchant);
			form_params = form_params + "&probasePayDeviceCode=" + encodeURI(this.probasePayDeviceCode);
			form_params = form_params + "&amount=" + encodeURI(this.transaction.total_amount);
			form_params = form_params + "&currency=" + encodeURI(this.transaction.currency);
			form_params = form_params + "&projectId=" + (this.projectId);
			form_params = form_params + "&transactionId=" + (this.transaction.id);
			console.log(form_params);
			
			this.loading = this.loadingCtrl.create({
				content: 'Please wait...'
			});
			this.loading.present();
			
			let parameter = form_params;
			let url = "https://handymateservices.com/api/validate-payment";
			this.http.post<GeneralReponse>(url, parameter, httpOptions).subscribe(
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
					else if(success===true)
					{
						
						this.presentToast({message: res.message}, 'toastSuccess');
						this.viewCtrl.dismiss(data);
					}
					else
					{
						console.log(-1);
						this.presentToast({message: res.message}, 'toastError');
						this.viewCtrl.dismiss({});
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
		this.app.getRootNav().setRoot(LoginPage);
		
	}

}




interface GeneralReponse{
	success: any;
	message: any;
}

