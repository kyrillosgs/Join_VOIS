import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './features/home/home.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskComponent } from './features/task/task.component';
import { AddCandidateComponent } from './features/add-candidate/add-candidate.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TaskComponent,
    AddCandidateComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
