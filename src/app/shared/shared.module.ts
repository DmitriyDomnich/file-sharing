import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackComponent } from './go-back.component';
import { SizePipe } from './size.pipe';



@NgModule({
  declarations: [
    GoBackComponent,
    SizePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GoBackComponent,
    SizePipe
  ]
})
export class SharedModule { }
