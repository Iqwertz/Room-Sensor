import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination } from 'swiper';

SwiperCore.use([Pagination]);

@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements OnInit {
  constructor(public firebaseService: FirebaseService) {}

  backgroundImage = 'assets/winter.jpg';

  ngOnInit(): void {
    this.firebaseService.database.subscribe((data) => {
      console.log('MainComponent: ', data);
      let firstRoom = data[Object.keys(data)[0]];

      this.backgroundImage = this.backgroundImageFromTemperature(
        firstRoom[Object.keys(firstRoom)[0]].temperature
      );
    });
  }

  backgroundImageFromTemperature(temperature: number): string {
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
}
