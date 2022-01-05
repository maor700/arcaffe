import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsListItemComponent } from './materials-list-item.component';

describe('MaterialsListItemComponent', () => {
  let component: MaterialsListItemComponent;
  let fixture: ComponentFixture<MaterialsListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
