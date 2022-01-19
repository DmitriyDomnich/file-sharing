import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'join-download',
  templateUrl: './join-download.component.html',
  styleUrls: ['./join-download.component.scss']
})
export class JoinDownloadComponent implements OnInit {

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  onPaste(ev: ClipboardEvent) {
    ev.preventDefault();

    const slicedId = ev.clipboardData.getData('text/plain').slice(-25);
    this.input.nativeElement.value = slicedId;
  }

  joinDownload(ev: SubmitEvent) {
    ev.preventDefault();


    this.router.navigate(['room', this.input.nativeElement.value])
      .then(can => console.log(can))
      .catch(cant => console.log(cant))

  }

  constructor(private router: Router) {

  }

  ngOnInit(): void {
  }

}
