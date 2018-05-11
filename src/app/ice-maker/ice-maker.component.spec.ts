import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IceMakerComponent } from './ice-maker.component';

describe('IceMakerComponent', () => {
  let component: IceMakerComponent;
  let fixture: ComponentFixture<IceMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IceMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IceMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
