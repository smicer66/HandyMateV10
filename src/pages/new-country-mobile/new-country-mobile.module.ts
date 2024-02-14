import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewCountryMobilePage } from './new-country-mobile';

@NgModule({
  declarations: [
    NewCountryMobilePage,
  ],
  imports: [
    IonicPageModule.forChild(NewCountryMobilePage),
  ],
})
export class NewCountryMobilePageModule {}
