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
import { ChartComponent } from './sites/chart/chart.component';
import { ChartContainerComponent } from './components/chart-container/chart-container.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartButtonComponent } from './components/chart-button/chart-button.component';
import { SimpleViewButtonComponent } from './components/simple-view-button/simple-view-button.component';
import { ChartOptionsComponent } from './components/chart-options/chart-options.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CurrentSensorDataComponent,
    ChartComponent,
    ChartContainerComponent,
    ChartButtonComponent,
    SimpleViewButtonComponent,
    ChartOptionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    SwiperModule,
    FontAwesomeModule,
    NgChartsModule,
    FormsModule,
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: firebaseConfig }],
  bootstrap: [AppComponent],
})
export class AppModule {}
