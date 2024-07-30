import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShapeContextMenuComponent } from './shape-context-menu.component';

describe('ShapeContextMenuComponent', () => {
  let component: ShapeContextMenuComponent;
  let fixture: ComponentFixture<ShapeContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeContextMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShapeContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
