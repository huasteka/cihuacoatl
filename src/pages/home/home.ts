import { Component } from '@angular/core';
import { DashboardPage } from '../dashboard/dashboard';
import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { ChangeNamePage } from '../user/change-name/change-name';
import { ChangePasswordPage } from '../user/change-password/change-password';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  dashboardPage = DashboardPage;
  changeNamePage = ChangeNamePage;
  changePasswordPage = ChangePasswordPage;
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
}
