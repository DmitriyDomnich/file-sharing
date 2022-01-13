import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadRoutingModule } from './upload-routing.module';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { UploadComponent } from './upload.component';
import { JoinDownloadModule } from './join-download/join-download.module';


@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    UploadRoutingModule,
    FileUploaderModule,
    JoinDownloadModule
  ]
})
export class UploadModule { }
