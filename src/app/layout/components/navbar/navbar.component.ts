import { Component, OnInit } from '@angular/core';
import { PrimeModule} from '../../../prime';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public items: MenuItem[];
  constructor() { }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',routerLink: ['home']
         }  
,      
//       {
//           label: 'Create/Modify',
//           items:  [
//              {label: 'Chargeback',  routerLink: ['Chargeback']},
//              {label: 'Service Type', routerLink: ['ServiceType']}, 
//              {label: 'Vendor Service Country',  routerLink: ['VendorServiceCountry']}, 
//        ] 
// }
];
  }}
