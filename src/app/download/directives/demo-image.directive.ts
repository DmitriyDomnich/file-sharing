import { Directive, HostBinding, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { imageExtensions } from 'src/app/models/image-extensions';

@Directive({
  selector: '[demoImage]',
})
export class DemoImageDirective implements OnInit {

  @Input('demoImage') demoImageObject: {
    template: TemplateRef<any>,
    context: {
      downloadUrl: string
    },
    extension: string
  };

  private isImage: boolean;

  constructor(
    private dialogRef: MatDialog
  ) { }

  ngOnInit(): void {
    this.isImage = imageExtensions.includes(this.demoImageObject.extension);
  }
  @HostBinding('style.cursor') get getCursor() {
    return this.isImage ? 'pointer' : 'text';
  }
  @HostListener('click') onClick() {
    if (this.isImage) {
      this.dialogRef.open(this.demoImageObject.template, {
        data: this.demoImageObject.context.downloadUrl,
      });
    }
  }

}
