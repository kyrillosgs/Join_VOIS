import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ChipModule } from 'primeng/chip';
import { SidebarModule } from 'primeng/sidebar';

import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { MenuComponent } from './core/menu/menu.component';
import { TaskComponent } from './features/task/task.component';
import { AddCandidateComponent } from './features/add-candidate/add-candidate.component';
import { ProfileComponent } from './features/profile/profile.component';
import { CandidateInfoComponent } from './features/profile/candidate-info/candidate-info.component';
import { CandidateStateComponent } from './features/profile/candidate-state/candidate-state.component';
import { DropdownModule } from 'primeng/dropdown';
import { KnobModule } from 'primeng/knob';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import {TabViewModule} from 'primeng/tabview';
import { TabPanelComponent } from './features/profile/tab-panel/tab-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TaskComponent,
    AddCandidateComponent,
    MenuComponent,
    ProfileComponent,
    CandidateInfoComponent,
    CandidateStateComponent,
    TabPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    DialogModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    HttpClientModule,
    PdfViewerModule,
    MenuModule,
    MenubarModule,
    ChipModule,
    SidebarModule,
    KnobModule,
    DropdownModule,
    TagModule,
    ConfirmPopupModule,
    TabViewModule
  ],
  providers: [ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
