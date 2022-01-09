import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { combineLatest, from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
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

  share() {
    this.getFilesDescriptions.emit();
    const folderId = v4();

    setTimeout(() => {
      const sub = from(this.files).pipe(
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
            ).percentageChanges(),
            of(fileWithDescription)
          ]);
        })
      ).subscribe({
        next: fileUpload => {
          const [uploadPercentage, fileWithDescription] = fileUpload;

          this.fileUploadService.updateProgress.emit({
            fileName: fileWithDescription.file.name,
            index: fileWithDescription.index,
            progress: uploadPercentage,
            isUploaded: uploadPercentage === 100
          });
        },
        complete: () => {
          this.fileUploadService.updateProgress.emit(null);
          sub.unsubscribe();
        },
      });
    });
  }

  constructor(
    private storage: AngularFireStorage,
    private fileUploadService: FileUploadService) { }

  ngOnInit(): void { }
}
