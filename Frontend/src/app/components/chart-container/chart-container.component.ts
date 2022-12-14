import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { FirebaseService } from '../../services/firebase.service';
import { environment } from '../../../environments/environment';

export interface sensorDataObject {
  temperature: number[];
  humidity: number[];
  pressure: number[];
  light: number[];
  timestamps: string[];
}

export interface FirebaseRooms {
  [key: string]: FirebaseSensorData;
}

export interface FirebaseSensorData {
  [key: string]: FirebaseSensorDataEntry;
}

export interface FirebaseSensorDataEntry {
  t: number; //temperature
  h: number; //humidity
  p: number; //pressure
  l: number; //light
  ts: number; //timestamp
}

export interface GeneralOptions {
  smoothGraph: boolean;
  maxDataPoints: number;
}

export interface DatabaseSelectOptions {
  [key: string]: DatabaseSelectOptionsEntry;
}

export interface TimeIntervalSelectOption {
  //TODO: implement
  start: Date;
  end: Date;
}

export interface DatabaseSelectOptionsEntry {
  temperature: boolean;
  humidity: boolean;
  pressure: boolean;
  light: boolean;
  [key: string]: boolean;
}

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
})
export class ChartContainerComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  /**
   *
   *
   * @type {ChartOptions<'line'>}
   * @memberof ChartContainerComponent
   */
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    normalized: true,
  };

  public lineChartLegend = true;

  generalOptions: GeneralOptions = environment.generalOptions;
  selectOptions: DatabaseSelectOptions | null = null;
  timeInterval: TimeIntervalSelectOption = {
    //set start date to yesterday
    start: new Date(new Date().setDate(new Date().getDate() - 1)),
    end: new Date(),
  };

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    if (localStorage.getItem('roomSettings')) {
      this.selectOptions = JSON.parse(
        localStorage.getItem('roomSettings') || '{}'
      );
    }

    if (localStorage.getItem('generalSettings')) {
      this.generalOptions = JSON.parse(
        localStorage.getItem('generalSettings') || '{}'
      );
    }

    this.generateChart(this.firebaseService.lastDatabaseScreenshot);

    this.firebaseService.database.subscribe((data: FirebaseRooms) => {
      this.generateChart(data);
    });
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    localStorage.setItem('roomSettings', JSON.stringify(this.selectOptions));
    localStorage.setItem(
      'generalSettings',
      JSON.stringify(this.generalOptions)
    );
  }

  updateChart() {
    this.generateChart(this.firebaseService.lastDatabaseScreenshot);
  }

  generateChart(data: FirebaseRooms) {
    if (!data) return;

    if (!this.selectOptions) {
      this.generateSelectOptions(data);
    }

    if (!this.selectOptions) return;

    this.lineChartData.datasets = [];
    this.lineChartData.labels = [];
    let counter = 0;
    for (const [roomKey, roomValue] of Object.entries(data)) {
      let convertedData = this.convertToSensorDataObject(
        roomValue,
        this.timeInterval
      );
      let options = this.selectOptions[roomKey];

      //add converted Data to lineChartData
      for (const [key, value] of Object.entries(convertedData)) {
        if (key == 'timestamps') {
          let timeStamps = value;
          if (this.generalOptions.smoothGraph) {
            timeStamps = this.smoothValues(value, true);
          }
          this.lineChartData.labels = timeStamps;
        } else {
          if (!options[key]) continue;

          let cleanValue = value;
          if (this.generalOptions.smoothGraph) {
            cleanValue = this.smoothValues(value, false);
          }

          this.lineChartData.datasets.push({
            data: cleanValue,
            label: roomKey + '/' + key,
            fill: false,
            tension: 0.4,
            borderColor: environment.chartBorderColors[counter],
            backgroundColor: environment.chartBorderColors[counter],
            pointBorderWidth: 0,
            pointRadius: 0,
            pointHoverRadius: 5,
          });
        }
        counter++;
        if (counter >= environment.chartBorderColors.length) counter = 0;
      }
    }
    this.chart?.update();
  }

  generateSelectOptions(data: FirebaseRooms) {
    this.selectOptions = {};

    for (const [roomKey, roomValue] of Object.entries(data)) {
      this.selectOptions[roomKey] = {
        temperature: true,
        humidity: false,
        pressure: false,
        light: false,
      };
    }
  }

  smoothValues(a: number[], isDate: boolean): number[] {
    let b: number[] = [];
    let chunkSize = Math.floor(a.length / this.generalOptions.maxDataPoints);
    if (chunkSize < 1) chunkSize = 1;
    for (let i = 0; i < a.length; i++) {
      let chunk: number[] = [];
      for (let j = 0; j < chunkSize; j++) {
        if (i + j >= a.length) break;
        chunk.push(a[i + j]);
      }
      if (isDate) {
        b.push(chunk[0]);
      } else {
        b.push(this.calculateAverage(chunk));
      }
    }
    return b;
  }

  calculateAverage(a: number[]) {
    let sum: number = 0;
    for (let n of a) {
      sum += n;
    }
    return sum / a.length;
  }

  convertToSensorDataObject(
    data: FirebaseSensorData,
    dateRange: TimeIntervalSelectOption
  ): sensorDataObject {
    const sensorData: sensorDataObject = {
      temperature: [],
      humidity: [],
      pressure: [],
      light: [],
      timestamps: [],
    };

    for (const [key, value] of Object.entries(data)) {
      if (!value) return sensorData;
      if (
        value.ts < new Date(dateRange.start).getTime() ||
        value.ts > new Date(dateRange.end).getTime() + 86400000
      )
        continue;
      sensorData.temperature.push(value.t);
      sensorData.humidity.push(value.h);
      sensorData.pressure.push(value.p);
      sensorData.light.push(value.l);
      sensorData.timestamps.push(this.convertTimestampToDate(value.ts));
    }

    return sensorData;
  }

  //convert timestamp to dd/mm/yyyy hh:mm date
  convertTimestampToDate(timestamp: number) {
    let date = new Date(timestamp);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    return (
      day +
      '/' +
      month +
      '/' +
      year +
      ' ' +
      hours +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes)
    );
  }
}
