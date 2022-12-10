import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleViewButtonComponent } from './simple-view-button.component';

describe('SimpleViewButtonComponent', () => {
  let component: SimpleViewButtonComponent;
  let fixture: ComponentFixture<SimpleViewButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleViewButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleViewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
