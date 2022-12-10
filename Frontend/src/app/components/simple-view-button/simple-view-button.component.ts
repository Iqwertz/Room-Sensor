import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-simple-view-button',
  templateUrl: './simple-view-button.component.html',
  styleUrls: ['./simple-view-button.component.scss'],
})
export class SimpleViewButtonComponent implements OnInit {
  constructor(private router: Router) {}

  faHome = faHome;

  ngOnInit(): void {}

  navigate() {
    this.router.navigate(['/']);
  }
}
