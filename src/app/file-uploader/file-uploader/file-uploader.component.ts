import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { FileWithDescription } from 'src/app/models/file-with-description';
import { FileItemComponent } from '../file-item/file-item.component';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('fileList') fileList: ElementRef<HTMLOListElement>;
  @ViewChildren(FileItemComponent) fileItemComponents: QueryList<FileItemComponent>;

  maxFileSize = 550;
  disabled$: Observable<File[]> = of([]).pipe(share());
  filesWithDescriptions: FileWithDescription[];
  presentFiles: File[] = [];

  fileInputSub: Subscription;

  fileUploaded(uploadedFileIndex: number) {
    this.fileList.nativeElement.children.item(uploadedFileIndex).scrollIntoView({
      behavior: 'smooth',
    });
    this.fileItemComponents.get(uploadedFileIndex).uploaded = true;
  }
  getFilesDescriptions(): void {
    this.filesWithDescriptions = this.fileItemComponents
      .toArray()
      .map((fileItemComponent) => ({
        file: fileItemComponent.file,
        description: fileItemComponent.description
      }));
  }
  fileIsBeingRenamed(renamingFile: File) {
    this.disabled$.subscribe((disabledFiles) => {
      const file = disabledFiles.find(disabledFile => renamingFile === disabledFile);

      if (file) {
        disabledFiles.splice(disabledFiles.indexOf(file), 1);
      } else {
        disabledFiles.push(renamingFile);
      }
    });
  }
  removeFile(removedFile: File) {
    this.fileUploadService.removeFile(this.presentFiles, removedFile);
  }

  constructor(private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.fileUploadService.updateFiles.subscribe(files => this.presentFiles = files);
  }
  ngAfterViewInit(): void {
    this.fileInputSub = fromEvent(this.fileInput.nativeElement, 'change').pipe(
      map((fileInputtedEvent: Event) => {
        return Array.from((((fileInputtedEvent.target) as HTMLInputElement).files)).filter((inputtedFile) => {
          if (!this.presentFiles.find((presentFile) => {
            if (this._checkCoincidingProperties(presentFile, inputtedFile)) {
              return true;
            }
            return false;
          })) {
            return true;
          }
          return false;
        })
      }),
      filter((newFiles: File[]) => newFiles.length && (this._countFilesSize(newFiles) / 1000000) < this.maxFileSize)
    ).subscribe((newFiles: File[]) => {
      this.fileUploadService.addFiles(this.presentFiles, newFiles);

      setTimeout(() =>
        this.fileList.nativeElement.children
          .item(this.fileList.nativeElement.children.length - 1)
          .scrollIntoView({
            behavior: 'smooth',
          })
      );
    });
  }
  ngOnDestroy(): void {
    this.fileInputSub.unsubscribe();
  }
  trackByName(index: number, file: File) {
    return file.name;
  }

  private _checkCoincidingProperties(presentFile: File, inputtedFile: File) {
    let sameKeys = 0;
    for (const key in presentFile) {
      if (
        typeof presentFile[key] !== 'function' &&
        inputtedFile[key].toString() === presentFile[key].toString()
      ) {
        sameKeys++;
      }
    }
    if (sameKeys === 6) {
      // if all props are the same
      return true;
    }
    return false;
  }
  private _countFilesSize(newFiles: File[]): number {
    return newFiles.reduce((acc, curr) => acc + curr.size, 0) + this.presentFiles.reduce((acc, curr) => acc + curr.size, 0);
  }
}
