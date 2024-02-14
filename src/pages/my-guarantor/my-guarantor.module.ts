import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyGuarantorPage } from './my-guarantor';

@NgModule({
  declarations: [
    MyGuarantorPage,
  ],
  imports: [
    IonicPageModule.forChild(MyGuarantorPage),
  ],
})
export class MyGuarantorPageModule {}
