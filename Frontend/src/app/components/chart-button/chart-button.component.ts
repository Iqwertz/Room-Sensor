import { Component, OnInit } from '@angular/core';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart-button',
  templateUrl: './chart-button.component.html',
  styleUrls: ['./chart-button.component.scss'],
})
export class ChartButtonComponent implements OnInit {
  constructor(private router: Router) {}

  faChart = faChartLine;

  ngOnInit(): void {}

  navigate() {
    this.router.navigate(['/chart']);
  }
}
