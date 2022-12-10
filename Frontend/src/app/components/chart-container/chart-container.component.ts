import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { FirebaseService } from '../../services/firebase.service';

export interface sensorDataObject {
  temperature: number[];
  humidity: number[];
  pressure: number[];
  light: number[];
  timestamps: number[];
}

export interface FirebaseRooms {
  [key: string]: FirebaseSensorData;
}

export interface FirebaseSensorData {
  [key: string]: FirebaseSensorDataEntry;
}

export interface FirebaseSensorDataEntry {
  temperature: number;
  humidity: number;
  pressure: number;
  light: number;
  timestamp: number;
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
    scales: {
      small: {
        type: 'linear',
        position: 'left',
        bounds: 'ticks',
      },
      big: {
        type: 'linear',
        position: 'right',
      },
    },
  };

  public lineChartLegend = true;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.generateChart(this.firebaseService.lastDatabaseScreenshot);

    this.firebaseService.database.subscribe((data: FirebaseRooms) => {
      this.generateChart(data);
    });
  }

  generateChart(data: FirebaseRooms) {
    if (!data) return;

    this.lineChartData.datasets = [];
    this.lineChartData.labels = [];

    for (const [roomKey, roomValue] of Object.entries(data)) {
      let convertedData = this.convertToSensorDataObject(roomValue);

      //add converted Data to lineChartData
      for (const [key, value] of Object.entries(convertedData)) {
        if (key == 'timestamps') {
          this.lineChartData.labels = value;
        } else {
          let yAxisId = 'small';
          if (this.calculateAverage(value) < 100) {
            yAxisId = 'small';
          } else {
            yAxisId = 'big';
          }
          this.lineChartData.datasets.push({
            data: value,
            label: roomKey + '/' + key,
            fill: false,
            tension: 0.4,
            borderColor: 'black',
            backgroundColor: 'rgba(255,0,0,0.3)',
            yAxisID: yAxisId,
          });
        }
      }
    }
    this.chart?.update();

    console.log(this.lineChartData);
  }

  calculateAverage(a: number[]) {
    let sum: number = 0;
    for (let n of a) {
      sum += n;
    }

    return sum / a.length;
  }

  convertToSensorDataObject(data: FirebaseSensorData): sensorDataObject {
    const sensorData: sensorDataObject = {
      temperature: [],
      humidity: [],
      pressure: [],
      light: [],
      timestamps: [],
    };

    for (const [key, value] of Object.entries(data)) {
      if (!value) return sensorData;
      sensorData.temperature.push(value.temperature);
      sensorData.humidity.push(value.humidity);
      sensorData.pressure.push(value.pressure);
      sensorData.light.push(value.light);
      sensorData.timestamps.push(value.timestamp);
    }

    return sensorData;
  }
}
