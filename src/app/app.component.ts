import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { map, share, withLatestFrom } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('fileList') fileList: ElementRef<HTMLOListElement>;
  inputFiles$: Observable<File[]> = of([]).pipe(share());
  totalSize = 0;
  fileInputSub: Subscription;

  removeFile(removedFile: File) {
    this.inputFiles$.subscribe(files => {
      const removedFileIndex = files.findIndex(presentFile => presentFile === removedFile);
      files.splice(removedFileIndex, 1);
    });
  }

  constructor(private storage: AngularFireStorage) { }

  ngAfterViewInit(): void {
    this.fileInputSub = fromEvent(this.fileInput.nativeElement, 'change').pipe(
      withLatestFrom(this.inputFiles$),
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
    ).subscribe(value => {
      value[1].push(...value[0]);
      setTimeout(() => this.fileList.nativeElement.children.item(this.fileList.nativeElement.children.length - 1).scrollIntoView({
        behavior: 'smooth'
      }));
    });
  }
  ngOnDestroy(): void {
    this.fileInputSub.unsubscribe();
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
