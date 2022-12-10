import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from 'src/environments/firebase-config';
import { MainComponent } from './sites/main/main.component';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { CurrentSensorDataComponent } from './components/current-sensor-data/current-sensor-data.component';
import { SwiperModule } from 'swiper/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AppComponent, MainComponent, CurrentSensorDataComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    SwiperModule,
    FontAwesomeModule,
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: firebaseConfig }],
  bootstrap: [AppComponent],
})
export class AppModule {}
