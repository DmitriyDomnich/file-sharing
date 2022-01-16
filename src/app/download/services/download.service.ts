import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UploadProgress } from 'src/app/models/upload-progress';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  public fileDownload = new Subject<UploadProgress>();

  constructor() { }


}
