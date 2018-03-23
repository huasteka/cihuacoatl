import { Component, OnInit } from '@angular/core';
import { DashboardPage } from '../dashboard/dashboard';
import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { ChangeNamePage } from '../user/change-name/change-name';
import { ChangePasswordPage } from '../user/change-password/change-password';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  dashboardPage = DashboardPage;
  changeNamePage = ChangeNamePage;
  changePasswordPage = ChangePasswordPage;
  user: User;

  constructor(private userService: UserService) {
  }

  ionViewWillEnter() {
    this.userService.findUserProfile().subscribe((user: User) => {
      this.user = user;
    });
  }

  getProperUserName() {
    if (this.user) {
      return this.user.name ? this.user.name : this.user.email;
    }
    return '';
  }
}
