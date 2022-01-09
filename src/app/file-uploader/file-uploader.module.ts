import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { FileItemComponent } from './file-item/file-item.component';
import { ShareButtonComponent } from './share-button/share-button.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { UploadInfoComponent } from './upload-info/upload-info.component';
import { SizePipe } from './size.pipe';

@NgModule({
  declarations: [
    FileUploaderComponent,
    FileItemComponent,
    ShareButtonComponent,
    UploadInfoComponent,
    SizePipe,
  ],
  imports: [
    CommonModule,
    TooltipModule,
    FormsModule,
    CollapseModule,
    ProgressbarModule,
  ],
  exports: [FileUploaderComponent],
})
export class FileUploaderModule {}
