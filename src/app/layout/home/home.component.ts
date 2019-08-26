import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode, Tree, MenuItem, MessageService } from 'primeng/primeng';
import { HomeService } from './home.service';

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

  files: any ={
};

  constructor(private homeService: HomeService) { }

  ngOnInit() {
      this.loading = true;
      
      // this.homeService.getTreeViewData().subscribe(files => {
      //     this.treeData = [{
      //         label: 'Root',
      //         children: files
      //     }];
      // });


      this.treeData =   this.files = [
            {
                "label": "Product",
                "data": "Product Folder",
                "expandedIcon": "fa fa-folder-open",
                "collapsedIcon": "fa fa-folder",
                "children": [{
                        "label": "Gotems",
                        "data": "Work Folder",
                        "expandedIcon": "fa fa-folder-open",
                        "collapsedIcon": "fa fa-folder",
                        "children": [{"label": "Audio Conferencing", "icon": "fa fa-file-text-o", "data": "Audio Conferencing"},
                                     {"label": "Cloud Services", "icon": "fa fa-file-text-o", "data": "Cloud Services"}]
                    },
                    {
                        "label": "Telecom",
                        "data": "Home Folder",
                        "expandedIcon": "fa fa-folder-open",
                        "collapsedIcon": "fa fa-folder",
                        "children": [{"label": "COMMERCIAL - CREDIT - ADJUSTMENT", "icon": "fa fa-file-text-o", "data": "COMMERCIAL - CREDIT - ADJUSTMENT"}]
                    }]
            },
            {
                "label": "Vendor",
                "data": "Vendor",
                "expandedIcon": "fa fa-folder-open",
                "collapsedIcon": "fa fa-folder",
                "children": [
                    {"label": "AT&T", "icon": "fa fa-file-image-o", "data": "Barcelona Photo"},
                    {"label": "Vodafone", "icon": "fa fa-file-image-o", "data": "PrimeFaces Logo"},
                    {"label": "CISCO", "icon": "fa fa-file-image-o", "data": "PrimeUI Logo"}]
            },
            {
                "label": "Country",
                "data": "Country",
                "expandedIcon": "fa fa-folder-open",
                "collapsedIcon": "fa fa-folder",
                "children": [{
                        "label": "India",
                        "data": "India",
                        "children": [{"label": "Karnataka", "icon": "fa fa-file-video-o", "data": "Karnataka"}, 
                         {"label": "Maharashtra", "icon": "fa fa-file-video-o", "data": "Maharashtra"}]
                    },
                    {
                        "label": "USA",
                        "data": "USA",
                        "children": [{"label": "Ohio", "icon": "fa fa-file-video-o", "data": "Ohio"}, 
                        {"label": "New York", "icon": "fa fa-file-video-o", "data": "New York"}]
                    }]
            }
        ];

    }


  private expandRecursive(node:TreeNode, isExpand:boolean){
      node.expanded = isExpand;
      if(node.children){
          node.children.forEach( childNode => {
              this.expandRecursive(childNode, isExpand);
          } );
      }
  }

}
