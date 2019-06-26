import { CoursesService } from "./courses.service";
import { TestBed, flush } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, LESSONS, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('CoursesService', () => {
  let coursesService: CoursesService; // service with mocked dependencies
  let httpTestingController: HttpTestingController; // fake controller for mocking http calls

  beforeEach(() => {
    /**
     * Use HttpClientTestingModule in place of 
     * HttpCLient. This will allow us to make http
     * calls without effective the actual db. It also 
     * gives functionality that allows for testing the call
     * beheavior from the service.
     */
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        CoursesService
      ]
    })

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should retreive all couses', () => {
    /**
     * Call method here
     */
    coursesService.findAllCourses()
      .subscribe(courses => {
        // assertion test expected response
        expect(courses).toBeTruthy('No coursed returned');
        expect(courses.length).toBe(12, 'Incorrect number of courses');
        const course = courses.find(course => course.id === 12);
        expect(course.titles.description).toBe('Angular Testing Course')
      });

    /**
     * Build actual call to the testing controller.
     * Expect a single call to '/api/courses'.
     * Expect call to be a GET request.
     * use 'req.flush' to mock the data that should be returned.
     * 
     * Only when 'flush' is called will the above actually be 
     * executed. That is why the tests appear to pass with 'flush'
     * 
     * Feed 'flush' exactly what you want the subscribe method to 
     * have as a parameter.
     */
    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({ payload: Object.values(COURSES) });
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12)
      .subscribe(course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12])
  });

  it('should save a course', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } }

    coursesService.saveCourse(12, changes)
      .subscribe(course => {
        expect(course).toBeTruthy();
        expect(course.id).toBe(12);
      });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    req.flush({
      ...COURSES[12],
      ...changes
    })
  });

  /**
   * Test error handling
   */
  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = { titles: { description: 'Testing Course' } }
    
    coursesService.saveCourse(12, changes)
      .subscribe(
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpTestingController.expectOne('/api/courses/12');
      expect(req.request.method).toEqual('PUT');
      // mock failed response
      req.flush('Save course failed', { status: 500, statusText: 'Internal Server Failed' });
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      })

    /**
     * you can pass a perdicate in place of a string to test 
     * anything in the req. This is useful here to eliminate the 
     * need for adding the parameters. 
     */
    const req = httpTestingController.expectOne(req => req.url === '/api/lessons');
    expect(req.request.method).toBe('GET');
    // here test that all required params are included
    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');
    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    });
  });

  afterEach(() => {
    /**
     * Verify that only the http request specified in the test
     * was actually called by the method being tested.
     */
    httpTestingController.verify();
  });
});
