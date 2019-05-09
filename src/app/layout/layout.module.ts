import { NgModule, CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { PrimeModule } from '../prime';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FileDownloadComponent } from './file-download/file-download.component';
 
@NgModule({
  declarations: [LayoutComponent,
    FooterComponent,
    HeaderComponent,
    NavbarComponent,
    FileDownloadComponent
  ],
  imports: [
    CommonModule, TranslateModule,
    LayoutRoutingModule, PrimeModule, DashboardModule, FormsModule, ReactiveFormsModule,
        NgbDropdownModule.forRoot()

  ],
  providers: [],
  exports: [FileDownloadComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class LayoutModule { }
