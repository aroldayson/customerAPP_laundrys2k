import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusUpdatecategComponent } from './cus-updatecateg.component';

describe('CusUpdatecategComponent', () => {
  let component: CusUpdatecategComponent;
  let fixture: ComponentFixture<CusUpdatecategComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CusUpdatecategComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusUpdatecategComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
