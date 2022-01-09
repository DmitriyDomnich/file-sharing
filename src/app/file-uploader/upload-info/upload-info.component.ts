import { Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { UploadProgress } from 'src/app/models/upload-progress';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'upload-info',
  templateUrl: './upload-info.component.html',
  styleUrls: ['./upload-info.component.scss'],
})
export class UploadInfoComponent implements OnInit, OnChanges {
  @Input() files: File[];
  @Input() maxFileSize: number;

  @Output() fileUploaded = new EventEmitter<number>();
  filesSize = 0;
  uploadProgress$: Observable<UploadProgress | null>;

  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {
    this.uploadProgress$ = this.fileUploadService.updateProgress
      .pipe(
        distinctUntilChanged((x, y) => x?.isUploaded && y?.isUploaded),
        tap(updateProgress => {
          if (updateProgress?.isUploaded) {
            this.fileUploaded.emit(updateProgress.index - 1);
          }
        }));
  }
  ngOnChanges(): void {
    this.filesSize = this._countFilesSize();
  }

  private _countFilesSize(): number {
    return this.files.reduce((acc, curr) => acc + curr.size, 0);
  }
}
