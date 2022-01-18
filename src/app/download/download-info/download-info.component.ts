import { Component, Input, OnInit } from '@angular/core';
import { FileToDownload } from 'src/app/models/file-to-download';

@Component({
  selector: 'download-info',
  templateUrl: './download-info.component.html',
  styleUrls: ['./download-info.component.scss']
})
export class DownloadInfoComponent implements OnInit {

  @Input() files: FileToDownload[];
  info: { totalSize: number, length: number };

  constructor() { }

  ngOnInit(): void {
    this.info = {
      totalSize: this.files.reduce((all, curr) => all + curr.size, 0),
      length: this.files.length
    };
  }

}
