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

  @Input() timeOptions: TimeIntervalSelectOption = {
    start: new Date(),
    end: new Date(),
  };
  @Output() timeOptionsChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  update(room: any, value: any) {
    if (!this.options) return;
    this.options[room][value.key] = !this.options[room][value.key];
    this.optionsChange.emit(this.options);
  }

  updateDate() {
    if (!this.timeOptions) return;
    if (this.timeOptions.start > this.timeOptions.end) {
      this.timeOptions.end = this.timeOptions.start;
    }
    this.timeOptionsChange.emit(this.timeOptions);
    this.optionsChange.emit(this.options);
  }
}
