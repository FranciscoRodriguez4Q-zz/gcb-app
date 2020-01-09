import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode, Tree, MenuItem, MessageService } from 'primeng/primeng';
import { HomeService } from './home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('expandingTree')
  expandingTree: Tree;

  treeData: TreeNode[];

  loading: boolean;

  private readonly TYPES = {
    PRODUCT_NAME: 'product_name',
    SERVICE_TYPE: 'service_type',
    VENDOR_BAN: 'vendor_ban',
    VENDOR_LE_NAME: 'vendor_le_name',
    VENDOR_CODE: 'vendor_code',
    BUYER_NAME: 'buyer_name'
  }

  private readonly TABS = {
    PRODUCT: 'Product',
    SERVICE_TYPE: 'ProductServiceType',
    VENDOR_LE: 'Vendor',
    VENDOR_CONFIG: 'VendorConfig',
    BUYER: 'Buyer',
    BAN: 'Ban'
  }

  data: any;
  menuItems: any;
  public screenFlag: boolean = false;

  constructor(
    private homeService: HomeService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.screenFlag = true;
    this.loading = true;
    this.treeData = [{}];
    const [ product, location, vendor, buyer ] = await this.homeService.getTreeViewData();
    this.treeData = [{
      "label": "Product",
      "data": "Product",
      "expandedIcon": "fa fa-folder-open",
      "collapsedIcon": "fa fa-folder",
      "children": product.children
    }, {
      "label": "Country",
      "data": "Country",
      "expandedIcon": "fa fa-folder-open",
      "collapsedIcon": "fa fa-folder",
      "children": location.children
    }, {
      "label": "Vendor",
      "data": "Vendor",
      "expandedIcon": "fa fa-folder-open",
      "collapsedIcon": "fa fa-folder",
      "children": vendor.children
    }, {
      "label": "Buyer",
      "data": "Buyer",
      "expandedIcon": "fa fa-folder-open",
      "collapsedIcon": "fa fa-folder",
      "children": buyer.children
    }]
    this.screenFlag = false;

    this.menuItems = [
      { label: 'Product', routerLink: ['Product'] },
      { label: 'Service Type', routerLink: ['ProductServiceType'] },
      { label: 'Vendor LE', routerLink: ['Vendor'] },
      { label: 'Vendor Config', routerLink: ['VendorConfig'] },
      { label: 'Buyer', routerLink: ['Buyer'] },
      { label: 'BAN', routerLink: ['Ban'] }
    ];

  }


  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  nodeSelect({ node }) {
    const navigation = this.navigateTo(node)
    if (navigation) {
      const { tab, data } = navigation;
      this.homeService.setState({ key: tab, data })
      this.router.navigate(['layout', 'home', tab]).catch(e => {
        console.log('Somehting went wrong')
        console.log('error', e)
      });
    }
  }

  navigateTo(node) {
    const { type } = node;
    switch(type) {
      case this.TYPES.PRODUCT_NAME:
        return { tab: this.TABS.PRODUCT, data: node };
      case this.TYPES.SERVICE_TYPE:
        return { tab: this.TABS.SERVICE_TYPE, data: node };
      case this.TYPES.VENDOR_BAN:
        return { tab: this.TABS.BAN, data: node };
      case this.TYPES.VENDOR_LE_NAME:
        return { tab: this.TABS.VENDOR_LE, data: node };
      case this.TYPES.VENDOR_CODE:
        return { tab: this.TABS.VENDOR_CONFIG, data: node };
      case this.TYPES.BUYER_NAME:
        return { tab: this.TABS.BUYER, data: node };
      default:
        return false;
    }
  }
  
}
