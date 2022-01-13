import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { reduce } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadGuard implements CanActivate {

  constructor(private storage: AngularFireStorage) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const folderId = route.params['id'];

    const folderRef = this.storage.ref(folderId);

    return folderRef.list().pipe(
      reduce((all, curr) => curr.items.length > 0, false)
    );
  }

}
