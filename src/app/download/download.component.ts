import { Component, OnInit, Renderer2 } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, from, Observable, of, zip } from 'rxjs';
import { concatAll, concatMap, filter, map, switchMap, tap, toArray } from 'rxjs/operators';
import { FileToDownload } from '../models/file-to-download';
import * as JSZip from 'jszip';
import { ajax } from 'rxjs/ajax';
import { DownloadService } from './services/download.service';
import { DownloadState } from '../models/download-state';

@Component({
  selector: 'download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private renderer: Renderer2,
    private downloadService: DownloadService
  ) { }

  downloadState: DownloadState = 'waiting';
  id: string;
  files$: Observable<FileToDownload[]>;

  downloadAll() {
    const jsZip = new JSZip();
    this.downloadState = 'downloads_one_by_one';

    this.files$.pipe(
      concatAll(),
      concatMap((file, index) => combineLatest([ajax<Blob>({
        url: file.downloadUrl,
        responseType: 'blob',
        crossDomain: true,
        includeDownloadProgress: true
      }), of({ index: index, fileName: file.name })])),
      map(ajaxResponseWithFileInfoTuple => ({ ajaxResponse: ajaxResponseWithFileInfoTuple[0], fileInfo: ajaxResponseWithFileInfoTuple[1] })),
      tap(ajaxResponseWithFileInfo => {
        const { ajaxResponse, fileInfo } = ajaxResponseWithFileInfo;
        const progress = ajaxResponse.loaded / ajaxResponse.total * 100;

        this.downloadService.fileDownload.next({
          index: fileInfo.index,
          isUploaded: progress === 100,
          progress: progress
        });
      }),
      filter(ajaxResponseWithFileInfo => ajaxResponseWithFileInfo.ajaxResponse.type === 'download_load'),
      toArray(),
      switchMap(downloadFiles => {
        this.downloadState = 0;
        downloadFiles.forEach(downloadedFile => {
          jsZip.file(downloadedFile.fileInfo.fileName, downloadedFile.ajaxResponse.response)
        });

        return from(jsZip.generateAsync({
          type: 'blob',
          streamFiles: true,
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9
          }
        }, metadata => {
          this.downloadState = metadata.percent;
        }));
      })
    ).subscribe({
      next: smth => {
        const a: HTMLAnchorElement = this.renderer.createElement('a');
        a.download = 'Shared files';
        a.href = URL.createObjectURL(smth);
        a.click();
        this.downloadState = 'waiting';
      },
      error: err => {
        console.log(err);
        this.downloadState = 'waiting';
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
          fileRef.size = metadata.size;
          return fileRef;
        }),
        toArray()
      );
  }
}
