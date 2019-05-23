import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MenuModule, PanelModule, ChartModule, InputTextModule, InputMaskModule,
  InputTextareaModule, EditorModule, CalendarModule, RadioButtonModule, FieldsetModule,
  DropdownModule, MultiSelectModule, ListboxModule, SpinnerModule, SliderModule, RatingModule,
  DataTableModule, ContextMenuModule, TabViewModule, DialogModule, StepsModule,
  ScheduleModule, TreeModule, GMapModule,
  DataGridModule, TooltipModule, ConfirmationService, ConfirmDialogModule, GrowlModule, DragDropModule,
  GalleriaModule
} from 'primeng/primeng';
import {ProgressSpinnerModule} from 'primeng/progressspinner';


import {AccordionModule} from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';

@NgModule({

  imports: [ButtonModule, CardModule, NgbModule
    , MenubarModule,
    MenuModule,
    PanelModule,
    ChartModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    InputTextareaModule,
    EditorModule,
    CalendarModule,
    RadioButtonModule,
    FieldsetModule,
    DropdownModule,
    MultiSelectModule,
    ListboxModule,
    SpinnerModule,
    SliderModule,
    RatingModule,
    DataTableModule,
    ContextMenuModule,
    TabViewModule,
    DialogModule,
    StepsModule,
    ScheduleModule,
    TreeModule,
    GMapModule,
    DataGridModule,
    TooltipModule,
    ConfirmDialogModule,
    GrowlModule,
    DragDropModule, TableModule,
    CheckboxModule,
    MessagesModule
    , MessageModule
    , ToastModule,
    MenubarModule,
    CardModule,
    GalleriaModule,AccordionModule,ProgressSpinnerModule
  ],
  exports: [ButtonModule, MenubarModule, CardModule
    , NgbModule,
    MenuModule,
    PanelModule,
    ChartModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    InputTextareaModule,
    EditorModule,
    CalendarModule,
    RadioButtonModule,
    FieldsetModule,
    DropdownModule,
    MultiSelectModule,
    ListboxModule,
    SpinnerModule,
    SliderModule,
    RatingModule,
    DataTableModule,
    ContextMenuModule,
    TabViewModule,
    DialogModule,
    StepsModule,
    ScheduleModule,
    TreeModule,
    GMapModule,
    DataGridModule,
    TooltipModule,
    ConfirmDialogModule,
    GrowlModule,
    DragDropModule, TableModule,
    CheckboxModule,
    MessagesModule
    , MessageModule
    , ToastModule,
    MenubarModule,
    CardModule,
    GalleriaModule,AccordionModule,ProgressSpinnerModule
  ],


})
export class PrimeModule { }
