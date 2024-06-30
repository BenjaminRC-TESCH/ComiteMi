import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstHistorialComponent } from './est-historial.component';

describe('EstHistorialComponent', () => {
  let component: EstHistorialComponent;
  let fixture: ComponentFixture<EstHistorialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstHistorialComponent]
    });
    fixture = TestBed.createComponent(EstHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
