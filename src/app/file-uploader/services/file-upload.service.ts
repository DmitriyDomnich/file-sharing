import { Injectable, EventEmitter } from '@angular/core';
import { UploadProgress } from 'src/app/models/upload-progress';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  updateFiles = new EventEmitter<File[]>();
  updateProgress = new EventEmitter<UploadProgress | null>();

  addFiles(presentFiles: File[], newFiles: File[]) {
    presentFiles.push(...newFiles);
    this.updateFiles.emit(presentFiles.slice());
  }
  removeFile(presentFiles: File[], removedFile: File) {
    presentFiles.splice(presentFiles.findIndex(presentFile => presentFile === removedFile), 1);
    this.updateFiles.emit(presentFiles.slice());
  }
  updateFileUploadingProgress(fileUpload: UploadProgress) {
    this.updateProgress.emit(fileUpload);
  }
  constructor() { }

}
