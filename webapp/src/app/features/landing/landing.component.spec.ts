import { TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  it('should render heading and CTA links', () => {
    TestBed.configureTestingModule({ imports: [LandingComponent] }).compileComponents();
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement as any;
    expect(el.textContent).toContain('Welcome to');
    expect(el.textContent).toContain('Get started');
  });
});

