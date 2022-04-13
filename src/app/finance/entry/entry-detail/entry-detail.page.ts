import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EntryRead } from 'src/models/finance/entry';
import { EntryService } from 'src/services/finance/entry';

@Component({
  selector: 'app-page-entry-detail',
  templateUrl: 'entry-detail.page.html',
  styleUrls: ['entry-detail.page.scss'],
})
export class EntryDetailPage implements OnInit {
  public selectedEntry: EntryRead;

  private entryId: number;

  constructor(
    private route: ActivatedRoute,
    private currencyPipe: CurrencyPipe,
    private entryService: EntryService
  ) { }

  public ngOnInit(): void {
    this.entryId = parseInt(this.route.snapshot.params.entryId, 10);

    this.entryService.findEntryById(this.entryId).subscribe(
      (entry: EntryRead) => this.selectedEntry = entry
    );
  }

  public getCurrency(amount: number): string {
    return this.currencyPipe.transform(amount || 0);
  }
}
