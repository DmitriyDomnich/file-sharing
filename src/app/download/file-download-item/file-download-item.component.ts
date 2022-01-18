import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FileToDownload } from 'src/app/models/file-to-download';
import { DownloadService } from '../services/download.service';

@Component({
  selector: 'file-download-item',
  templateUrl: './file-download-item.component.html',
  styleUrls: ['./file-download-item.component.scss']
})
export class FileDownloadItemComponent implements OnInit, OnDestroy {

  @Input() file: FileToDownload;
  @Input() private index: number;

  downloadProgress: number;
  fileDownloadProgressSub: Subscription;

  constructor(
    private downloadService: DownloadService
  ) { }


  onDownloadProgress(downloadProgress: number) {
    this.downloadProgress = downloadProgress;
  }

  ngOnInit(): void {
    this.fileDownloadProgressSub = this.downloadService.fileDownload.pipe(
      filter(fileDownloadProgress => fileDownloadProgress.index === this.index)
    ).subscribe({
      next: fileDownloadProgress => {
        this.downloadProgress = fileDownloadProgress.isUploaded ? 0 : fileDownloadProgress.progress;
      },
      complete: () => {
        console.log('completed');
      }
    });
  }
  ngOnDestroy(): void {
    this.fileDownloadProgressSub?.unsubscribe();
  }
}
