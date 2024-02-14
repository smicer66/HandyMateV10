import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FundWalletPage } from './fund-wallet';

@NgModule({
  declarations: [
    FundWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(FundWalletPage),
  ],
})
export class FundWalletPageModule {}
