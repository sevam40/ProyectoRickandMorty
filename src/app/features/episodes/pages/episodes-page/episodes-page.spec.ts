import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodesPage } from './episodes-page';

describe('EpisodesPage', () => {
  let component: EpisodesPage;
  let fixture: ComponentFixture<EpisodesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EpisodesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
