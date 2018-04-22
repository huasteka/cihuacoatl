import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { HomePage } from '../pages/home/home';
import { SignInPage } from '../pages/sign-in/sign-in';
import { AuthService } from '../services/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {
  rootPage: any;
  private subscription: Subscription;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.subscription = authService.authenticated.subscribe((isAuthenticated: boolean) => {
      this.rootPage = isAuthenticated ? HomePage : SignInPage;
    });
  }

  ngOnInit() {
    this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
