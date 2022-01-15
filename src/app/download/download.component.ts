import { Component, OnInit, Renderer2 } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, zip } from 'rxjs';
import { concatAll, concatMap, filter, map, switchMap, tap, toArray } from 'rxjs/operators';
import { FileToDownload } from '../models/file-to-download';
import * as JSZip from 'jszip';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private renderer: Renderer2
  ) { }

  id: string;
  files$: Observable<FileToDownload[]>;

  downloadAll() {
    const jsZip = new JSZip();

    this.files$.pipe(
      concatAll(),
      concatMap(file => ajax<Blob>({
        url: file.downloadUrl,
        body: file.name,
        responseType: 'blob',
        crossDomain: true,
        includeDownloadProgress: true
      })),
      tap(ajaxResponse => console.log(ajaxResponse.request.body, (ajaxResponse.loaded / ajaxResponse.total) * 100)),
      filter(downloadedChunk => downloadedChunk.type === 'download_load'),
      toArray(),
      switchMap(downloadFiles => {
        downloadFiles.forEach(downloadedFile => {
          jsZip.file(downloadedFile.request.body, downloadedFile.response)
        });
        return from(jsZip.generateAsync({
          type: 'blob'
        }));
      })
    ).subscribe({
      next: smth => {
        const a: HTMLAnchorElement = this.renderer.createElement('a');
        a.download = 'Shared files';
        a.href = URL.createObjectURL(smth);
        a.click();
      }
    });

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    const fileRefs$: Observable<FileToDownload> = this.storage.ref(this.id).list().pipe(
      concatMap(list => list.items)
    );
    const metadata$ = fileRefs$.pipe(
      concatMap(fileRef => from(fileRef.getMetadata()))
    );
    const downloadUrls$ = this.storage.ref(this.id).list().pipe(
      switchMap(ref => from(ref.items.map(item => item.getDownloadURL()))),
      concatAll()
    );

    this.files$ = zip(fileRefs$, downloadUrls$, metadata$)
      .pipe(
        map(fileRefsAndDownloadUrls => {
          const [fileRef, downloadUrl, metadata] = fileRefsAndDownloadUrls;

          fileRef.downloadUrl = downloadUrl;
          fileRef.type = metadata.contentType;
          fileRef.description = metadata.customMetadata?.description;
          return fileRef;
        }),
        toArray()
      );
  }
}
