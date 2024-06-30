import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstPerfilComponent } from './est-perfil.component';

describe('EstPerfilComponent', () => {
  let component: EstPerfilComponent;
  let fixture: ComponentFixture<EstPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstPerfilComponent]
    });
    fixture = TestBed.createComponent(EstPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
