import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { StarRatingModule } from 'ionic3-star-rating';
import { OneSignal } from '@ionic-native/onesignal';
import { Rave, RavePayment, Misc } from 'rave-ionic3';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { MyApp } from './app.component';
import { NewCountryMobilePageModule } from '../pages/new-country-mobile/new-country-mobile.module';
import { NewContextMenuPageModule } from '../pages/new-context-menu/new-context-menu.module';
import { ProbasePayPageModule } from '../pages/probase-pay/probase-pay.module';
import { ProfilePixPageModule } from '../pages/profile-pix/profile-pix.module';
import { UserProfilePageModule } from '../pages/user-profile/user-profile.module';
import { UploadAttachmentPageModule } from '../pages/upload-attachment/upload-attachment.module';
import { PaymentInstructionsPageModule } from '../pages/payment-instructions/payment-instructions.module';
import { BidProjectPageModule } from '../pages/bid-project/bid-project.module';
import { RateProjectPageModule } from '../pages/rate-project/rate-project.module';
import { ComposeMessagePageModule } from '../pages/compose-message/compose-message.module';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { ForgetPage } from '../pages/forget/forget';
import { ProjectsPage } from '../pages/projects/projects';
import { NewProjectPage } from '../pages/new-project/new-project';
import { NewProjectStepTwoPage } from '../pages/new-project-step-two/new-project-step-two';
import { NewProjectStepThreePage } from '../pages/new-project-step-three/new-project-step-three';

import { ViewProjectPage } from '../pages/view-project/view-project';
import { MyProjectsPage } from '../pages/my-projects/my-projects';
import { MyGuarantorPage } from '../pages/my-guarantor/my-guarantor';
import { MySkillsPage } from '../pages/my-skills/my-skills';
import { MyservicesPage } from '../pages/myservices/myservices';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { SettingsPage } from '../pages/settings/settings';
import { UserManagementPage } from '../pages/user-management/user-management';
import { SupportTicketsPage } from '../pages/support-tickets/support-tickets';
import { ViewTicketPage } from '../pages/view-ticket/view-ticket';
import { RegisterStepTwoPage } from '../pages/register-step-two/register-step-two';
import { AllMessagesPage } from '../pages/all-messages/all-messages';
import { NotificationsPage } from '../pages/notifications/notifications';
import { FundWalletPage } from '../pages/fund-wallet/fund-wallet';
import { WithdrawFromWalletPage } from '../pages/withdraw-from-wallet/withdraw-from-wallet';
import { ContentPage } from '../pages/content/content';
import { TransactionsPage } from '../pages/transactions/transactions';
import { ChangeMyPasswordPage } from '../pages/change-my-password/change-my-password';



import { ViewMessagePage } from '../pages/view-message/view-message';
import { RaiseSupportTicketPage } from '../pages/raise-support-ticket/raise-support-ticket';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    IntroPage,
    LoginPage,
	ForgetPage,
	RegisterPage,
	RegisterStepTwoPage,
	ProjectsPage,
	NewProjectPage,
	NewProjectStepTwoPage,
	NewProjectStepThreePage,
	AllMessagesPage,
	NotificationsPage,
	ViewMessagePage,
	RaiseSupportTicketPage,
	ViewProjectPage,
	MyProjectsPage,
	MyGuarantorPage,
	MySkillsPage,
	MyservicesPage,
	MyProfilePage,
	SettingsPage,
	UserManagementPage,
	SupportTicketsPage,
	ViewTicketPage,
	WithdrawFromWalletPage,
	FundWalletPage,
	ContentPage,
	TransactionsPage,
	ChangeMyPasswordPage
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    IonicModule.forRoot(MyApp),
	IonicStorageModule.forRoot({
      name: '_zambiabank_v1',
      driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
	StarRatingModule,
	NewCountryMobilePageModule,
	NewContextMenuPageModule,
	ProbasePayPageModule,
	ProfilePixPageModule,
	UserProfilePageModule,
	UploadAttachmentPageModule,
	PaymentInstructionsPageModule,
	BidProjectPageModule,
	RateProjectPageModule,
	ComposeMessagePageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    IntroPage,
    LoginPage,
	ForgetPage,
	RegisterPage,
	RegisterStepTwoPage,
	ProjectsPage,
	NewProjectPage,
	NewProjectStepTwoPage,
	NewProjectStepThreePage,
	AllMessagesPage,
	ViewMessagePage,
	NotificationsPage,
	RaiseSupportTicketPage,
	ViewProjectPage,
	MyProjectsPage,
	MyGuarantorPage,
	MySkillsPage,
	MyservicesPage,
	MyProfilePage,
	SettingsPage,
	UserManagementPage,
	SupportTicketsPage,
	ViewTicketPage,
	WithdrawFromWalletPage,
	FundWalletPage,
	ContentPage,
	TransactionsPage,
	ChangeMyPasswordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	Camera,
	OneSignal,
	Rave,
	RavePayment,
	Misc,
    NativePageTransitions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
