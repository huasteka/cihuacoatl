import { Component, OnInit } from "@angular/core";
import { NavParams } from "ionic-angular";
import { EntryWrite } from "../../../../models/finance/entryce/entry";

@Component({
  selector: 'page-entry-detail',
  templateUrl: 'entry-detail.html'
})
export class EntryDetailPage implements OnInit {
  selectedEntry: EntryWrite;

  constructor(private navParams: NavParams) {
  }

  ngOnInit() {
    this.selectedEntry = this.navParams.get('entry');
  }
}