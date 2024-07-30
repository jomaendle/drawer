import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayerExplorerComponent } from './layer-explorer.component';

describe('LayerExplorerComponent', () => {
  let component: LayerExplorerComponent;
  let fixture: ComponentFixture<LayerExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayerExplorerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayerExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
