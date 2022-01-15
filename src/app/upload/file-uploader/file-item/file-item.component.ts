import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UploadState } from 'src/app/models/upload-state';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit, OnDestroy {

  @ViewChild('renameInput') renameInput: ElementRef<HTMLInputElement>;
  @Input() file: File;
  @Output() fileRemoved = new EventEmitter<File>();
  @Output() fileIsBeingRenamed = new EventEmitter<File>();

  allowRename = false;
  showOptions = false;
  showDelete = true;
  isCollapsed = false;
  description: string;
  state: UploadState = 'waiting';

  sub: Subscription;

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
      Object.defineProperty(this.file, 'name', {
        writable: true,
        value: this._getRenamedFileName()
      });
      this.showDelete = true;
    }
    this.fileIsBeingRenamed.emit(this.file);
    this.allowRename = !this.allowRename;
  }

  private _getRenamedFileName() {
    const renamedPart = this.renameInput.nativeElement.value.charAt(this.renameInput.nativeElement.value.length - 1) === '.'
      ? this.renameInput.nativeElement.value.slice(0, this.renameInput.nativeElement.value.length - 1)
      : this.renameInput.nativeElement.value;
    const extension = this.file.name.substring(this.file.name.lastIndexOf('.'));
    return renamedPart + extension;
  }

  @HostBinding('class') get getClassName() {
    return 'list-group-item';
  }
  @HostBinding('class.uploaded') get uploadedClassName() {
    return this.state === 'uploaded';
  }
  @HostListener('mouseenter') onHover() {
    if (this.state === 'waiting')
      this.showOptions = !this.showOptions;
  }
  @HostListener('mouseleave') onLeave() {
    this.showOptions = false;
  }
  @HostListener('click', ["$event"]) changeCollapse(ev: MouseEvent) {
    if (this.state !== 'waiting') {
      return;
    }
    if ((ev.target as HTMLElement).closest('#collapse-content')) {
      return;
    }
    if (this.showDelete)
      this.isCollapsed = !this.isCollapsed;
  }

  constructor(
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit(): void {
    this.sub = this.fileUploadService.updateProgress
      .pipe(filter(updateProgress => !updateProgress))
      .subscribe(_ => this.state = 'waiting');
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
