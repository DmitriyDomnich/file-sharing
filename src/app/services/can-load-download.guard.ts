import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanLoadDownloadGuard implements CanLoad, CanActivate {

  constructor(private storage: AngularFireStorage, private router: Router) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | boolean {

    return this.canJoinDownloadPage(segments[1].path);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const folderId = route.params['id'];

    return this.canJoinDownloadPage(folderId);
  }

  private canJoinDownloadPage(folderId: string) {
    const folderRef = this.storage.ref(folderId);

    return folderRef.list().pipe(
      map(list => list.items.length > 0 ? true : this.router.parseUrl('/')),
    );
  }
}
