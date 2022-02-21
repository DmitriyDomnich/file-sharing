import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanLoadDownloadGuard } from './services/can-load-download.guard';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: UploadComponent },
  {
    path: 'room/:id', canActivate: [CanLoadDownloadGuard], canLoad: [CanLoadDownloadGuard],
    loadChildren: () => import('./download/download.module').then(m => m.DownloadModule),
  },
  {
    path: '**',
    redirectTo: '/'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    CanLoadDownloadGuard
  ]
})
export class AppRoutingModule { }
