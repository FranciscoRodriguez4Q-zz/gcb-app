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
          label: 'Add New',
          icon: 'pi pi-fw pi-pencil',
          items:  [
            {label: 'Chargeback', icon: 'fa fa-plus', url: 'http://www.primefaces.org/primeng'},
            {label: 'Vendor Service Country', icon: 'fa fa-plus', routerLink: ['/pagename']},
            {label: 'Service Type', icon: 'fa fa-plus', routerLink: ['sampleEx']},
            {label: 'Sample Ex', icon: 'fa fa-plus', routerLink: ['dashboard']}
       ]
},
{
  label: 'Reports',
  icon: 'pi pi-fw pi-pencil',
  items: [
      {label: 'Chargeback', icon: 'fa fa-plus'},
      {label: 'Products', icon: 'fa fa-plus'}
  ]
},
{
label: 'About',
icon: 'pi pi-fw pi-pencil',
items: [
    {label: 'Documents', icon: 'fa fa-plus'},
    {label: 'Help', icon: 'fa fa-plus'}
]
}
 
];
  }}
