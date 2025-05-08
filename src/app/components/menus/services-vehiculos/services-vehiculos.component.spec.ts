import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesVehiculosComponent } from './services-vehiculos.component';

describe('ServicesVehiculosComponent', () => {
  let component: ServicesVehiculosComponent;
  let fixture: ComponentFixture<ServicesVehiculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesVehiculosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
