import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UploadTask } from '@angular/fire/compat/storage/interfaces';
import { combineLatest, from, Observable, of, throwError, timer } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { v4 } from 'uuid';
import { FileWithDescription } from 'src/app/models/file-with-description';
import { FileUploadService } from '../services/file-upload.service';
import { UploadState } from "src/app/models/upload-state";
import { Clipboard } from '@angular/cdk/clipboard';
import { PopoverDirective } from 'ngx-bootstrap/popover';

@Component({
  selector: 'share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss'],
})
export class ShareButtonComponent implements OnInit {
  @Input() files: FileWithDescription[];
  @Input() disabled: boolean;
  @Output() getFilesDescriptions = new EventEmitter<void>();
  @Output() uploadEnded = new EventEmitter<void>();

  @ViewChild(PopoverDirective) popover: PopoverDirective;

  state: UploadState = 'waiting';
  currentUploadingFile$: Observable<UploadTask>;
  filesLink: string;
  copy() {
    this.clipboard.copy(this.filesLink);
    timer(800).subscribe({
      next: _ => {
        this.popover.hide();
        this.state = 'waiting';
      }
    })
  }
  share() {
    this.getFilesDescriptions.emit();
    this.filesLink = v4().slice(0, 25);

    this.state = 'uploading';
    this.currentUploadingFile$ = this.fileUploadService.uploadingFile;
    setTimeout(() => {
      from(this.files).pipe(
        concatMap((fileWithDescription, index) => {
          fileWithDescription.index = index + 1;
          return combineLatest([
            this.storage.upload(`${this.filesLink}/${fileWithDescription.file.name}`,
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
          return throwError(() => new Error('User stopped uploading.'));
        })
      ).subscribe({
        next: fileUpload => {
          if (fileUpload) {
            const [uploadTaskSnapshot, fileWithDescription] = fileUpload;
            const uploadProgress = uploadTaskSnapshot.bytesTransferred / uploadTaskSnapshot.totalBytes * 100;

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
          this.state = 'waiting';
          this.uploadEnded.emit();
          this.fileUploadService.updateProgress.emit(null);
        },
        complete: () => {
          this.state = 'uploaded';
          this.uploadEnded.emit();
          this.fileUploadService.updateProgress.emit(null);
        }
      });
    });
  }

  constructor(
    private storage: AngularFireStorage,
    private fileUploadService: FileUploadService,
    private clipboard: Clipboard) { }

  ngOnInit(): void {
  }
}
