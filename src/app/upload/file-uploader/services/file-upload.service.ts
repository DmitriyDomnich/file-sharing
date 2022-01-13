import { Injectable, EventEmitter } from '@angular/core';
import { UploadTask } from '@angular/fire/compat/storage/interfaces';
import { UploadProgress } from 'src/app/models/upload-progress';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  updateFiles = new EventEmitter<File[]>();
  updateProgress = new EventEmitter<UploadProgress>();
  uploadingFile = new EventEmitter<UploadTask>();

  addFiles(presentFiles: File[], newFiles: File[]) {
    presentFiles.push(...newFiles);
    this.updateFiles.emit(presentFiles.slice());
  }
  removeFile(presentFiles: File[], removedFile: File) {
    presentFiles.splice(presentFiles.findIndex(presentFile => presentFile === removedFile), 1);
    this.updateFiles.emit(presentFiles.slice());
  }
  constructor() { }

}
