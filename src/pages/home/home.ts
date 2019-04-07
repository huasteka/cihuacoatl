import { Component } from '@angular/core';
import md5 from 'md5';

import { DashboardPage } from '../dashboard/dashboard';
import { UserService } from '../../services/auth/user';
import { User } from '../../models/user';
import { ChangeNamePage } from '../user/change-name/change-name';
import { ChangePasswordPage } from '../user/change-password/change-password';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth';
import { EntryPage } from '../finance/entry/entry';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  dashboardPage = DashboardPage;
  changeNamePage = ChangeNamePage;
  changePasswordPage = ChangePasswordPage;
  entryPage = EntryPage;
  user: User;

  constructor(private userService: UserService,
              private authService: AuthService,
              private navCtrl: NavController) {
  }

  ionViewWillEnter() {
    this.userService.findUserProfile().subscribe((user: User) => {
      this.user = user;
    });
  }

  onSignOut() {
    this.authService.signOut().then(() => {
      this.navCtrl.popToRoot();
    });
  }

  getProperUserName() {
    if (this.user) {
      return this.user.name ? this.user.name : this.user.email;
    }
    return '';
  }

  getProperUserAvatar() {
    const userEmail = this.user ? this.user.email : '';
    const avatarHash = md5(userEmail);
    return `https://www.gravatar.com/avatar/${avatarHash}.jpg`;
  }
}
