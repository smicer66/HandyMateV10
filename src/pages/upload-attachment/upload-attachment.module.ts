import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadAttachmentPage } from './upload-attachment';

@NgModule({
  declarations: [
    UploadAttachmentPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadAttachmentPage),
  ],
})
export class UploadAttachmentPageModule {}
