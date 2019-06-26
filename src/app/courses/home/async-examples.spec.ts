import { fakeAsync, tick, flush, flushMicrotasks } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async Testing Examples', () => {
  it('Async test example with Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000)
  });

  /**
   * fakeAsync creates a 'zone' (based on zone.js) that will detect all the async
   * operations within the test block.
   */
  it('Async test - setTimeout()', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      test = true;
    }, 1000);

    /**
     * tick pushes time forward
     * pass in the time we want to move forward in time
     * This is important because it will run the tests at this 
     * moment.
     */
    // tick(1000); // pushes time forward
    flush(); // waits until all the timeouts are done

    // Run tests after tick
    expect(test).toBeTruthy();
  }));

  it('Async test example - plain promise', fakeAsync(() => {
    /**
     * browser runs syncronous code first.
     * then it runs through all the micro task queue next.
     * then it runs through all the task queue last.
     */

    let test = false;

    console.log('Promise test started');

    // setTimeout(() => { // task queue
    //   console.log('setTimeout() first callback triggered')
    // });

    // setTimeout(() => { // task queue
    //   console.log('setTimeout() second callback triggered')
    // });

    Promise.resolve() // micro task queue
      .then(() => { // micro task
        console.log('Promise first then() evaluated')
        return Promise.resolve(); // another micro task
      })
      .then(() => { // micro task
        console.log('Promise second then() callback triggered');
        test = true;
      });

    // flush only micro tasks
    flushMicrotasks();
    console.log('Running test assertions');
    expect(test).toBeTruthy();
  }));

  it('Asnyc test example - Promises + setTimeout()', fakeAsync(() => {
    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10;

        setTimeout(() => {
          counter++;
        }, 1000);
      });

    expect(counter).toBe(0);
    
    // flush micro tasks to test Promise
    flushMicrotasks();
    expect(counter).toBe(10);

    // use tick to make sure timer is not updated early
    tick(500);
    expect(counter).toBe(10);

    // use flush to test that the end result is correct
    flush();
    expect(counter).toBe(11);
  }));

  it('Async test example - Observables', fakeAsync(() => {
    /**
     * under the hood observables use 'setTimeout' which is a 'task'
     */
    let test = false;

    console.log('Creating Observable');

    const test$ = of(test).pipe(delay(1000));
    
    test$.subscribe(() => {
      test = true;
    });

    // use tick to move time forward
    tick(1000);
    console.log('Running test assertions');

    expect(test).toBe(true);
  }));
});
