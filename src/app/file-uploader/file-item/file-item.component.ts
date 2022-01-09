import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit {

  allowRename = false;
  showOptions = false;
  showDelete = true;
  isCollapsed = false;
  description: string;
  uploaded = false;

  @ViewChild('renameInput') renameInput: ElementRef<HTMLInputElement>;
  @Input() file: File;
  @Output() fileRemoved = new EventEmitter<File>();
  @Output() fileIsBeingRenamed = new EventEmitter<File>();

  removeFile() {
    this.fileRemoved.emit(this.file);
  }
  renameFile(ev: MouseEvent) {
    ev.stopPropagation();
    if (this.isCollapsed) {
      this.isCollapsed = !this.isCollapsed;
    }
    if (!this.allowRename) {
      Object.defineProperty(this.file, 'name', {
        writable: true,
        value: this.file.name
      });
      this.showDelete = false;
    } else {
      if (!this.renameInput.nativeElement.value.includes('.')) {
        Object.defineProperty(this.file, 'name', {
          writable: true,
          value: this._getRenamedFileName()
        });
      } else {
        console.log('2 .');
      }
      this.showDelete = true;
    }
    this.fileIsBeingRenamed.emit(this.file);
    this.allowRename = !this.allowRename;
  }

  private _getRenamedFileName() {
    const renamedPart = this.renameInput.nativeElement.value;
    const extension = this.file.name.substring(this.file.name.lastIndexOf('.'));
    return renamedPart + extension;
  }

  @HostBinding('class') get getClassName() {
    return 'list-group-item';
  }
  @HostBinding('class.uploaded') get uploadedClassName() {
    return this.uploaded;
  }
  @HostListener('mouseenter') onHover() {
    this.showOptions = !this.showOptions;
  }
  @HostListener('mouseleave') onLeave() {
    this.showOptions = !this.showOptions;
  }
  @HostListener('click', ["$event"]) changeCollapse(ev: MouseEvent) {
    if ((ev.target as HTMLElement).closest('#collapse-content')) {
      return;
    }
    if (this.showDelete)
      this.isCollapsed = !this.isCollapsed;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
