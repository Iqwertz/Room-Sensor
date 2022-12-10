import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartButtonComponent } from './chart-button.component';

describe('ChartButtonComponent', () => {
  let component: ChartButtonComponent;
  let fixture: ComponentFixture<ChartButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
