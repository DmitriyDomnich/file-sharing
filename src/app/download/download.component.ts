import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  id: string;
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

  }

}
