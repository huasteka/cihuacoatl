import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-entry-detail',
  templateUrl: 'entry-detail.page.html'
})
export class EntryDetailPage implements OnInit {
  private entryId: number;

  constructor(private route: ActivatedRoute) { }

  public ngOnInit() {
    this.entryId = parseInt(this.route.snapshot.params.entryId, 10);
  }
}
