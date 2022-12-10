import { Component, OnInit, Input } from '@angular/core';
import { faSun } from '@fortawesome/free-regular-svg-icons';
import {
  faTemperature3,
  faDroplet,
  faGauge,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-current-sensor-data',
  templateUrl: './current-sensor-data.component.html',
  styleUrls: ['./current-sensor-data.component.scss'],
})
export class CurrentSensorDataComponent implements OnInit {
  @Input() data: any;

  faTemperature = faTemperature3;
  faHumidity = faDroplet;
  faGauge = faGauge;
  faLight = faSun;
  faTime = faClock;

  constructor() {}

  ngOnInit(): void {}

  getMostRecentData(data: any) {
    //convert object to array
    let dataArr = Object.keys(data).map((key) => data[key]);
    //sort by timestamp
    dataArr.sort((a, b) => {
      return a.timestamp - b.timestamp;
    });
    //return last element
    return dataArr[dataArr.length - 1];
  }

  //round float to n decimals
  roundFloat(float: number, n: number) {
    return Math.round(float * Math.pow(10, n)) / Math.pow(10, n);
  }

  //format time stamp to readable time string
  formatTimestamp(timestamp: number) {
    let date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE');
  }
}
