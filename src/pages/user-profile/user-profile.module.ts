import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfilePage } from './user-profile';
import { StarRatingModule } from 'ionic3-star-rating';

@NgModule({
  declarations: [
    UserProfilePage,
  ],
  imports: [
	StarRatingModule,
    IonicPageModule.forChild(UserProfilePage),
  ],
})
export class UserProfilePageModule {}
