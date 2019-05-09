import { NgModule } from "@angular/core";
import { VendorServiceCountryComponent } from "./vendor-service-country.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { VendorServiceCountryRoutingModule } from "./vendor-service-country-routing.module";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { MessageModule } from "primeng/message";

@NgModule ({
    declarations: [VendorServiceCountryComponent],
    imports: [
      CommonModule,
      FormsModule,
      VendorServiceCountryRoutingModule,
      ButtonModule,DropdownModule,TableModule,CheckboxModule,RadioButtonModule,MessagesModule,MessageModule,ToastModule
    ]

}) 
export class VendorServiceCountryModule
{


}

