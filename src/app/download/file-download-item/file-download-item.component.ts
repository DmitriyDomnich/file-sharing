import { Component, Input, OnInit } from '@angular/core';
import { FileToDownload } from 'src/app/models/file-to-download';


@Component({
  selector: 'file-download-item',
  templateUrl: './file-download-item.component.html',
  styleUrls: ['./file-download-item.component.scss']
})
export class FileDownloadItemComponent implements OnInit {

  @Input() file: FileToDownload;
  downloadProgress: number;


  constructor() { }

  ngOnInit(): void {
    console.log(this.file.type);

  }

  onDownloadProgress(downloadProgress: number) {
    this.downloadProgress = downloadProgress;
  }
}
