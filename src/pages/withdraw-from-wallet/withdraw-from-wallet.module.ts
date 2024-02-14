import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WithdrawFromWalletPage } from './withdraw-from-wallet';

@NgModule({
  declarations: [
    WithdrawFromWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(WithdrawFromWalletPage),
  ],
})
export class WithdrawFromWalletPageModule {}
