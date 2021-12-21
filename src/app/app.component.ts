import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { combineLatest, fromEvent, Observable, of, Subscription } from 'rxjs';
import { map, share } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('fileList') fileList: ElementRef<HTMLOListElement>;

  disabled$: Observable<File[]> = of([]).pipe(share());
  inputFiles$: Observable<File[]> = of([]).pipe(share());
  filesSize = 0;


  fileInputSub: Subscription;

  fileIsBeingRenamed(renamingFile: File) {
    this.disabled$.subscribe(disableFiles => {

      const file = disableFiles.find(file => renamingFile === file);

      if (file) {
        disableFiles.splice(disableFiles.indexOf(file), 1)
      } else {
        disableFiles.push(renamingFile);
      }
    })
  }
  removeFile(removedFile: File) {
    this.inputFiles$.subscribe(files => {
      const removedFileIndex = files.findIndex(presentFile => presentFile === removedFile);
      files.splice(removedFileIndex, 1);
      this.filesSize -= removedFile.size;
    });
  }

  constructor(private storage: AngularFireStorage) { }

  ngAfterViewInit(): void {
    this.fileInputSub = combineLatest([fromEvent(this.fileInput.nativeElement, 'change'), this.inputFiles$]).pipe(
      map((val: [Event, File[]]) => {
        return [Array.from((val[0].target as HTMLInputElement).files).filter(inputtedFile => {
          if (!val[1].find(presentFile => { // если не все ключи в файлах совпадают
            if (this._checkCoincidingProperties(presentFile, inputtedFile)) {
              return true;
            }
            return false;
          })) {
            return true;
          }
          return false;
        }), val[1]];
      })
    ).subscribe((value: [File[], File[]]) => {
      const [newFiles, presentFiles] = value;
      presentFiles.push(...newFiles);
      this.filesSize = this._countFilesSize(newFiles);
      setTimeout(() => this.fileList.nativeElement.children.item(this.fileList.nativeElement.children.length - 1).scrollIntoView({
        behavior: 'smooth'
      }));
    });
  }
  ngOnDestroy(): void {
    this.fileInputSub.unsubscribe();
  }

  private _countFilesSize(files: File[]): number {
    return files.reduce((acc, curr) => acc + curr.size, 0) + this.filesSize;
  }
  private _checkCoincidingProperties(presentFile: File, inputtedFile: File) {
    let sameKeys = 0;
    for (const key in presentFile) {
      if (typeof (presentFile[key]) !== 'function' && inputtedFile[key].toString() === presentFile[key].toString()) {
        sameKeys++;
      }
    }
    if (sameKeys === 6) { // if all props are the same
      return true;
    }
    return false;
  }

}
