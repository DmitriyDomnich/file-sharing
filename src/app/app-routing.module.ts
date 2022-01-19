import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownloadGuard } from './download/download.guard';
import { UploadComponent } from './upload/upload.component';
import { PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { component: UploadComponent, path: '' },
  {
    loadChildren: () => import('./download/download.module').then(m => m.DownloadModule),
    path: 'room/:id', canActivate: [DownloadGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
