import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  DatabaseSelectOptions,
  TimeIntervalSelectOption,
} from '../chart-container/chart-container.component';

@Component({
  selector: 'app-chart-options',
  templateUrl: './chart-options.component.html',
  styleUrls: ['./chart-options.component.scss'],
})
export class ChartOptionsComponent implements OnInit {
  //Dual way bind chart options
  @Input() options: DatabaseSelectOptions | null = null;
  @Output() optionsChange = new EventEmitter<any>();

  @Input() timeOptions: TimeIntervalSelectOption | null = null;
  @Output() timeOptionsChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    console.log(this.options);
  }

  update(room: any, value: any) {
    if (!this.options) return;
    this.options[room][value.key] = !this.options[room][value.key];
    this.optionsChange.emit(this.options);
  }
}
