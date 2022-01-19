import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackComponent } from './go-back.component';
import { SizePipe } from './size.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    GoBackComponent,
    SizePipe,
    SafePipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GoBackComponent,
    SizePipe,
    SafePipe
  ]
})
export class SharedModule { }
