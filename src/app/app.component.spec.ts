import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  it('should render canvas', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(' Welcome to The Island Discovery ');
  }));

  it('should render true if set sea', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.setValueAt(0, 0, 0);
    expect(app.isSea(0, 0)).toEqual(true);
  }));

  it('should return false if set land', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    app.setValueAt(3, 5, 1);
    expect(app.isSea(3, 5)).toEqual(false);
  }));

  it('should return true if not valid position', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.isNotValidPosition(-3, 5)).toEqual(true);
  }));
  it('should return true if not valid position', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.isNotValidPosition(1, -5)).toEqual(true);
  }));
  it('should return true if not valid position', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.isNotValidPosition(-3, 5)).toEqual(true);
  }));
  it('should return true if not valid position', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.isNotValidPosition(1, 100)).toEqual(true);
  }));
  it('should return true if not valid position', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    expect(app.isNotValidPosition(100, 5)).toEqual(true);
  }));
  it('should return 0 island if have 0 island', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.debugElement.componentInstance;
    for (let col = 0; col < app.SIZE; col++) {
      for (let row = 0; row < app.SIZE; row++) {
        app.setValueAt(row, col, 0);
      }
    }
    app.numberOfIslands = 0;
    app.findIslands();
    expect(app.numberOfIslands).toEqual(0);
  }));
});
