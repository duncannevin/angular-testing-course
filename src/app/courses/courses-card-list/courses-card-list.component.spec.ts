import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import { element } from 'protractor';

describe('CoursesCardListComponent', () => {
  // component for each test
  let component: CoursesCardListComponent;
  // fixture of the component for testing
  let fixture: ComponentFixture<CoursesCardListComponent>;
  // debug element from fixture. this is the component element
  let el: DebugElement;

  /**
   * Use 'async' in order to wait for the promise to return
   * before executing the tests.
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoursesModule ] // courses module contains everything for this component to work
    })
      .compileComponents()
      .then(() => {
        // this is where to setup the tests
        // this is where to get the component instance
        fixture = TestBed.createComponent(CoursesCardListComponent); // set fixture
        component = fixture.componentInstance; // set component from fixture
        el = fixture.debugElement; // set debug element
      });
  })); 

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    // assign some mocked courses to the courses variable
    component.courses = setupCourses();
    // we need to notify the component that changes were made
    fixture.detectChanges();
    /**
     * By is used to query children of the debug element
     */
    const cards = el.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('Cards could not be found');
    expect(cards.length).toBe(12, 'Unexpected number of courses');
  });

  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const firstCourse = component.courses[0];
    const firstCard = el.query(By.css('.course-card'));
    const title = firstCard.query(By.css('mat-card-title'));
    const image = firstCard.query(By.css('img'));

    expect(firstCard).toBeTruthy('Could not find course card');
    expect(title.nativeElement.textContent).toBe(firstCourse.titles.description);
    expect(image.nativeElement.src).toBe(firstCourse.iconUrl);
  });
});
