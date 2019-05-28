import { Component, OnInit } from '@angular/core';
import { AppComponentService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
 
  userInfo :any;

  constructor(private appComponentService: AppComponentService)
 {}

  ngOnInit() {

    this.appComponentService.getUserData().subscribe(
      refData => {
        this.userInfo = refData;
        console.log('user details captured:',this.userInfo);
      },
      error => {
      });

  }
  title = 'gcb-ui';

  
}

