import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedDialogComponent } from './purchased-dialog.component';

describe('PurchasedDialogComponent', () => {
  let component: PurchasedDialogComponent;
  let fixture: ComponentFixture<PurchasedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasedDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
