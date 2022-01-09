import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlsComponent } from './controls/controls.component';



@NgModule({
  declarations: [
    ControlsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ControlsComponent
  ]
})
export class ControlsModule { }
