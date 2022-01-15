import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadRoutingModule } from './download-routing.module';
import { DownloadComponent } from './download.component';
import { SharedModule } from '../shared/shared.module';
import { SafePipe } from './safe.pipe';
import { DownloadDirective } from './directives/download.directive';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { FileDownloadItemComponent } from './file-download-item/file-download-item.component';


@NgModule({
  declarations: [DownloadComponent, SafePipe, DownloadDirective, FileDownloadItemComponent],
  imports: [
    CommonModule,
    DownloadRoutingModule,
    SharedModule,
    ProgressbarModule
  ]
})
export class DownloadModule { }
