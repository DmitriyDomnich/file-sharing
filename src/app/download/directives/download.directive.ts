import { Directive, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { filter, tap } from 'rxjs/operators';

type DownloadFileInfo = { fileName: string, downloadUrl: string };

@Directive({
  selector: '[download]'
})
export class DownloadDirective implements OnInit {

  @Input('download') downloadInfo: DownloadFileInfo;
  @Output() downloadProgress = new EventEmitter<number>();

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {

  }

  @HostListener('click') onClick() {
    ajax<Blob>({
      url: this.downloadInfo.downloadUrl,
      responseType: 'blob',
      crossDomain: true,
      includeDownloadProgress: true,
      body: this.downloadInfo.fileName
    }).pipe(
      tap(ajaxResponse => this.downloadProgress.emit(ajaxResponse.loaded / ajaxResponse.total * 100)),
      filter(ajaxResponse => ajaxResponse.type === 'download_load')
    ).subscribe({
      next: ajaxProgress => {
        const aElement: HTMLAnchorElement = this.renderer.createElement('a');
        aElement.href = URL.createObjectURL(ajaxProgress.response);
        aElement.download = ajaxProgress.request.body;
        aElement.click();
        this.downloadProgress.emit(0);
      }
    });
  }
}
