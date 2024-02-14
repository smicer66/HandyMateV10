import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RaiseSupportTicketPage } from './raise-support-ticket';

@NgModule({
  declarations: [
    RaiseSupportTicketPage,
  ],
  imports: [
    IonicPageModule.forChild(RaiseSupportTicketPage),
  ],
})
export class RaiseSupportTicketPageModule {}
