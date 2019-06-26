import {async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any; // testbed returns a type any not the type of the service

  const beginnerCourses = setupCourses()
    .filter(course => course.category === 'BEGINNER');

  const advancedCourses = setupCourses()
    .filter(course => course.category === 'ADVANCED');

  beforeEach(async(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', [ 'findAllCourses' ]);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule // substitutes animations with noop animations
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.get(CoursesService); // get courses service from testbed
      });      
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    /**
     * This is mocking an async service, however this is syncronous code
     * set mock values in coursesService
     * 'of' will call the passed in function before running returnValue method,
     * this is important so that it gets the correct values first and it will 
     * simulate async behaviour syncronously.
     */
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    // tell fixture to detect changes
    fixture.detectChanges();

    // query dom for beginner and advanced tabs
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    // test to make sure there is only 1 tab
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    // tell fixture to detect changes
    fixture.detectChanges();

    // query dom for beginner and advanced tabs
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    // test to make sure there is only 1 tab
    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });

  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    // query dom for beginner and advanced tabs
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    // test to make sure there is only 1 tab
    expect(tabs.length).toBe(2, 'Expected to find 2 tabs open');
  });

  it("should display advanced courses when tab clicked - fakeAsync", fakeAsync(() => {
    // create some test data
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    /**
     * simulate click event
     * using a helper function
     */
    click(tabs[1]);
    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(By.css('.mat-card-title'));

    // assert card titles is not empty
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
    // assert that the first card title contains the correct title
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  it("should display advanced courses when tab clicked - async", async(() => {
    // create some test data
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));

    /**
     * simulate click event
     * using a helper function
     */
    click(tabs[1]);
    fixture.detectChanges();

    fixture.whenStable()
      .then(() => {
        const cardTitles = el.queryAll(By.css('.mat-card-title'));

        // assert card titles is not empty
        expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
        // assert that the first card title contains the correct title
        expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
      });
  }));
});
