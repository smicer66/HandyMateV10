import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewContextMenuPage } from './new-context-menu';

@NgModule({
  declarations: [
    NewContextMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(NewContextMenuPage),
  ],
})
export class NewContextMenuPageModule {}
