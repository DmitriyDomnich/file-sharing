import { Directive, HostListener, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { imageExtensions } from 'src/app/models/image-extensions';

@Directive({
  selector: '[demoImage]',
})
export class DemoImageDirective implements OnInit {

  @Input('demoImage') templateRef: {
    template: TemplateRef<any>,
    context: {
      $implicit: string
    },
    extension: string
  };
  private isImage: boolean;

  constructor(
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.isImage = imageExtensions.includes(this.templateRef.extension);
  }
  @HostListener('mouseover') onMouseOver() {
    if (this.isImage)
      this.viewContainerRef.createEmbeddedView(this.templateRef.template, this.templateRef.context);
  }
  @HostListener('mouseleave') onMouseLeave() {
    if (this.isImage)
      this.viewContainerRef.clear();
  }
}
