import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadRoutingModule } from './download-routing.module';
import { DownloadComponent } from './download.component';
import { SharedModule } from '../shared/shared.module';
import { DownloadDirective } from './directives/download.directive';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { FileDownloadItemComponent } from './file-download-item/file-download-item.component';
import { DownloadInfoComponent } from './download-info/download-info.component';
import { DemoImageDirective } from './directives/demo-image.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [DownloadComponent, DownloadDirective,
    FileDownloadItemComponent, DownloadInfoComponent, DemoImageDirective],
  imports: [
    CommonModule,
    DownloadRoutingModule,
    SharedModule,
    ProgressbarModule,
    MatDialogModule,
    CollapseModule
  ]
})
export class DownloadModule { }
