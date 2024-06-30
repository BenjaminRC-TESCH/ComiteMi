import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstRegistroComponent } from './est-registro.component';

describe('EstRegistroComponent', () => {
  let component: EstRegistroComponent;
  let fixture: ComponentFixture<EstRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstRegistroComponent]
    });
    fixture = TestBed.createComponent(EstRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
