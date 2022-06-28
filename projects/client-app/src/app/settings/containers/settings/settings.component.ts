import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  preloadPanel: string;
  fragmentSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.fragmentSubscription = this.activatedRoute.fragment.subscribe(data => {
      this.preloadPanel = data;
    });
  }

  ngOnDestroy() {
    this.fragmentSubscription.unsubscribe();
  }
}
