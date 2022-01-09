import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadTask } from '@angular/fire/compat/storage/interfaces';
import { combineLatest, from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { v4 } from 'uuid';
import { FileWithDescription } from '../../models/file-with-description';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss'],
})
export class ShareButtonComponent implements OnInit {
  @Input() files: FileWithDescription[];
  @Input() disabled: boolean = false;
  @Output() getFilesDescriptions = new EventEmitter<void>();
  @Output() uploadEnded = new EventEmitter();
  filesUploading = false;
  currentUploadingFile: Observable<UploadTask>;

  share() {
    this.getFilesDescriptions.emit();
    const folderId = v4();

    this.filesUploading = true;
    this.currentUploadingFile = this.fileUploadService.uploadingFile;
    setTimeout(() => {
      from(this.files).pipe(
        concatMap((fileWithDescription, index) => {
          fileWithDescription.index = index + 1;
          return combineLatest([
            this.storage.upload(`${folderId}/${fileWithDescription.file.name}`,
              fileWithDescription.file,
              {
                customMetadata: {
                  description: fileWithDescription.description
                }
              }
            ).snapshotChanges(),
            of(fileWithDescription)
          ]);
        }),
        catchError(err => {
          this.fileUploadService.updateProgress.emit(null);
          return throwError(() => new Error('User stopped uploading.'));
        })
      ).subscribe({
        next: fileUpload => {
          if (fileUpload) {
            const [uploadTaskSnapshot, fileWithDescription] = fileUpload;
            const uploadProgress = (uploadTaskSnapshot.bytesTransferred / uploadTaskSnapshot.totalBytes) * 100;

            this.fileUploadService.updateProgress.emit({
              fileName: fileWithDescription.file.name,
              index: fileWithDescription.index,
              progress: uploadProgress,
              isUploaded: uploadProgress === 100
            });
            this.fileUploadService.uploadingFile.emit(uploadTaskSnapshot.task);
          }
        },
        error: err => {
          this.filesUploading = false;
          this.uploadEnded.emit();
          this.fileUploadService.updateProgress.emit(null);
        },
        complete: () => {
          this.filesUploading = false;
          this.uploadEnded.emit();
          this.fileUploadService.updateProgress.emit(null);
        }
      });
    });
  }

  constructor(
    private storage: AngularFireStorage,
    private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }
}
