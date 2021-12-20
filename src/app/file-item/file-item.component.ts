import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit {

  showOptions = false;
  allowRename = false;

  @ViewChild('renameInput') renameInput: ElementRef<HTMLInputElement>;

  @Input() file: File;
  @Output() fileRemoved = new EventEmitter<File>();
  @Output() fileRenamed = new EventEmitter<File>();

  removeFile() {
    this.fileRemoved.emit(this.file);
  }
  renameFile() {
    if (!this.allowRename) {
      Object.defineProperty(this.file, 'name', {
        writable: true,
        value: this.file.name
      });
    } else {
      if (this.renameInput.nativeElement.value.split('').filter(char => char === '.').length < 2) {
        Object.defineProperty(this.file, 'name', {
          writable: true,
          value: this._getRenamedFileName()
        });
        this.fileRenamed.emit(this.file);
      } else {
        console.log('2 .');
      }
    }
    this.allowRename = !this.allowRename;
  }

  private _getRenamedFileName() {
    const renamedPart = this.renameInput.nativeElement.value.slice(0, this.renameInput.nativeElement.value.lastIndexOf('.'));
    const extension = this.file.name.substring(this.file.name.lastIndexOf('.'));
    return renamedPart + extension;
  }

  @HostBinding('class') get className() {
    return 'list-group-item';
  }
  @HostListener('mouseenter') onHover() {
    this.showOptions = !this.showOptions;
  }
  @HostListener('mouseleave') onLeave() {
    this.showOptions = !this.showOptions;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
