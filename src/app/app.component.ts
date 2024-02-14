import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { Storage } from "@ionic/storage";
import { IntroPage } from '../pages/intro/intro';
import { TabsPage } from '../pages/tabs/tabs';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  nav: any;
  user: any;
  jsonData: any = {type:null, project: null, messageThread:null};

  constructor(public storage: Storage, public toastCtrl: ToastController, oneSignal: OneSignal, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
		// Okay, so the platform is ready and our plugins are available.
		// Here you can do any higher level native things you might need.
		console.log("Test");
		statusBar.styleDefault();
		splashScreen.hide();
		if (platform.is('cordova')) 
		{
			this.storage.get('handy_mate_loggedInUser').then((val2) => {
				this.user = val2;
				console.log(val2);
				if(this.user!=undefined && this.user!=null)
				{
					this.rootPage = TabsPage;
				}
				else
				{
					this.rootPage = IntroPage;
				}
			});
			window["plugins"].OneSignal
				.startInit("169debe1-ad21-4a23-abe9-3fcbf2430f9d", "337642962255")
				.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert)
				.handleNotificationOpened(jsonDat => {
					this.jsonData = jsonDat;
					console.log(jsonDat);
					
					this.storage.get('handy_mate_loggedInUser').then((val2) => {
						this.user = val2;
						console.log(val2);
						if(this.user!=undefined && this.user!=null)
						{
							this.storage.set('notificationActive', JSON.stringify(jsonDat));
							this.rootPage = TabsPage;
						}
						else
						{
							this.storage.set('notificationActive', JSON.stringify(jsonDat));
							this.rootPage = IntroPage;
						}
					});
				})
				.endInit();
		}
		else
		{
			console.log("Not cordova");
			this.rootPage = IntroPage;
		}
    });
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
}
