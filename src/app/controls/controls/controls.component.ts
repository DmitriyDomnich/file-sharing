import { Component, Input, OnChanges } from '@angular/core';
import { UploadTask } from '@angular/fire/compat/storage/interfaces';

@Component({
  selector: 'controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnChanges {

  @Input() uploadTask: UploadTask;
  constructor() { }

  ngOnChanges(): void {
    console.log(this.uploadTask);

  }

}
