import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  @Output() menuToggleClicked = new EventEmitter<any>();
  @Input() showExpandIcon: boolean = false;
  userSub: Subscription;
  userDisplayName: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.userSubject.subscribe(user => {
      if (user){
        this.userDisplayName = user.email;
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onMenuToggleClick() {
    this.menuToggleClicked.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
