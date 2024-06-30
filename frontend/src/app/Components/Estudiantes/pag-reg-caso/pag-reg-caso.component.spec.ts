import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagRegCasoComponent } from './pag-reg-caso.component';

describe('PagRegCasoComponent', () => {
  let component: PagRegCasoComponent;
  let fixture: ComponentFixture<PagRegCasoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagRegCasoComponent]
    });
    fixture = TestBed.createComponent(PagRegCasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
