import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportTicketsPage } from './support-tickets';

@NgModule({
  declarations: [
    SupportTicketsPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportTicketsPage),
  ],
})
export class SupportTicketsPageModule {}
