import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from 'src/environments/environment';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FileItemComponent } from './file-item/file-item.component';
import { FormsModule } from '@angular/forms';
import { ShareButtonComponent } from './share-button/share-button.component';

@NgModule({
  declarations: [
    AppComponent,
    FileItemComponent,
    ShareButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    BrowserAnimationsModule,
    TooltipModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
