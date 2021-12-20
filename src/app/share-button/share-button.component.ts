import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.scss']
})
export class ShareButtonComponent implements OnInit {

  @Input() files: File[];

  share() {
    console.log(this.files);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
