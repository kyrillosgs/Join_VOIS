import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';

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
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { LoginComponent } from './core/auth/login/login.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { windowFactory } from './core/token/window-factory';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeadersService } from './interceptors/Headers.service';
import { ErrorhandlerService } from './interceptors/global-error-handler/errorhandler.service';

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
    LoginComponent,
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
    NgxPermissionsModule.forRoot(),
    RxReactiveFormsModule,
    FontAwesomeModule,
    InputTextareaModule,
    ToastModule,
    MultiSelectModule,
  ],
  providers: [
    ConfirmationService,
    { provide: Window, useFactory: windowFactory },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersService,
      multi: true,
    } /*,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorhandlerService,
      multi: true,
    }*/,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
