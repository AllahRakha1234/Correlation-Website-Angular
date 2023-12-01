import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrLogicComponent } from './corr-logic.component';

describe('CorrLogicComponent', () => {
  let component: CorrLogicComponent;
  let fixture: ComponentFixture<CorrLogicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrLogicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrLogicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
