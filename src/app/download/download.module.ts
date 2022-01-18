import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadRoutingModule } from './download-routing.module';
import { DownloadComponent } from './download.component';
import { SharedModule } from '../shared/shared.module';
import { SafePipe } from './safe.pipe';
import { DownloadDirective } from './directives/download.directive';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { FileDownloadItemComponent } from './file-download-item/file-download-item.component';
import { DownloadInfoComponent } from './download-info/download-info.component';
import { DemoImageDirective } from './directives/demo-image.directive';


@NgModule({
  declarations: [DownloadComponent, SafePipe, DownloadDirective, FileDownloadItemComponent, DownloadInfoComponent, DemoImageDirective],
  imports: [
    CommonModule,
    DownloadRoutingModule,
    SharedModule,
    ProgressbarModule
  ]
})
export class DownloadModule { }
