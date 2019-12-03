import { Component, OnInit } from '@angular/core';
import { AppComponentService } from './app.service';
import { Globals } from '../app/shared/constants/globals';
import { SharedState } from './shared/state/shared.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SharedActions } from './shared/state/shared.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  userInfo: any;

  @Select(SharedState.getUserDetails) userDetails$: Observable<{
    role: string,
    roleNM: string,
    sso: string,
    firstName: string,
    lastName: string
  }>

  constructor(
    private appComponentService: AppComponentService,
    private globals: Globals,
    private store: Store
  ) { }

  ngOnInit() {
    this.store.dispatch(new SharedActions.FetchUserDetails())
  }
  title = 'gcb-ui';


}

