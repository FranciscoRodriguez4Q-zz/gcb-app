import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrimeModule } from './prime';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SampleFormComponent } from './layout/components/sample-form/sample-form.component';
import { FieldErrorsComponent } from './shared/modules/field-errors/field-errors.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../environments/environment'
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { SharedState } from './shared/state/shared.state'
import { ProductState } from './layout/product/state/product.state';
import { BanState } from './layout/ban/state/ban.state';
import { ProductServiceTypeState } from 'src/app/layout/product-service-type/state/product-service-type.state';
import { VendorConfigState } from 'src/app/layout/vendor-config/state/vendor-config.state';
import { BuyerState } from 'src/app/layout/buyer/state/buyer.state';
import { VendorState } from 'src/app/layout/vendor/state/vendor.state';

export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};
@NgModule({
  declarations: [
    AppComponent
    , SampleFormComponent, FieldErrorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule, HttpClientModule,
    PrimeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxsModule.forRoot([ 
      SharedState, 
      ProductState,
      ProductServiceTypeState,
      VendorState,
      VendorConfigState, 
      BuyerState,
      BanState
    ], { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production })
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
