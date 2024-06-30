import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagLogInComponent } from './pag-log-in.component';

describe('PagLogInComponent', () => {
  let component: PagLogInComponent;
  let fixture: ComponentFixture<PagLogInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagLogInComponent]
    });
    fixture = TestBed.createComponent(PagLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
