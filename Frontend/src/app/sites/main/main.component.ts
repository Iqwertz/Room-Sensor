import {
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination } from 'swiper';
import { SafeStyle } from '@angular/platform-browser';

SwiperCore.use([Pagination]);

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  constructor(public firebaseService: FirebaseService) {}

  database: any;
  currentSlide: number = 0;

  backgroundImage: string = 'assets/winter.jpg';

  ngOnInit(): void {
    this.firebaseService.database.subscribe((data) => {
      console.log('MainComponent: ', data);
      this.database = data;
      this.updateBackgroundImage();
    });
  }

  trans(event: any) {
    this.currentSlide = event[0].activeIndex;

    this.updateBackgroundImage();
  }

  updateBackgroundImage() {
    if (!this.database) return;

    let room = this.database[Object.keys(this.database)[this.currentSlide]];
    this.backgroundImage = this.backgroundImageFromTemperature(
      this.getMostRecentData(room).temperature
    );
  }

  backgroundImageFromTemperature(temperature: number): string {
    console.log('temperature: ', temperature);
    if (temperature < 0) {
      return 'assets/winter.jpg';
    } else if (temperature < 15) {
      return 'assets/autumn.jpg';
    } else if (temperature < 25) {
      return 'assets/spring.jpg';
    } else {
      return 'assets/summer.jpg';
    }
  }

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
}
