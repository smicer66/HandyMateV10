import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentInstructionsPage } from './payment-instructions';

@NgModule({
  declarations: [
    PaymentInstructionsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentInstructionsPage),
  ],
})
export class PaymentInstructionsPageModule {}
