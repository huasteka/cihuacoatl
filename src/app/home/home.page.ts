import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as md5 from 'crypto-js/md5';

import { User } from 'src/models/auth/user';
import { AuthService } from 'src/services/auth/auth';
import { UserService } from 'src/services/auth/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private user: User;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private userService: UserService
  ) { }

  public ionViewWillEnter() {
    this.userService.findUserProfile().then((user: User) => this.user = user);
  }

  public handleSignOut(): void {
    this.authService.signOut().then(() => this.navCtrl.navigateRoot('/auth/login'));
  }

  public getUserName(): string {
    if (this.user) {
      return this.user.name ? this.user.name : this.user.email;
    }
    return '';
  }

  public getUserAvatar(): string {
    const userEmail = this.user ? this.user.email : '';
    const avatarHash = md5(userEmail);
    return `https://gravatar.com/avatar/${avatarHash}?d=identicon`;
  }

}
