import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";

describe('CalculatorService', () => {
  let calculator: CalculatorService;
  let loggerSpy: any;

  /**
   * beforeEach will execute before each test
   * this is the place to initialize the service
   * and its dependencies.
   * 
   * This will replace the service and its dependencies
   * before every test.
   */
  beforeEach(() => {
    /**
     * all dependencies of the actual service should
     * be fake. Should not test anything other than
     * this service.
     * 
     * create a fake version of the service dependencies 
     * using jasmin.createSpyObj. First param is the name
     * of the service, the second param is the name of the 
     * methods needed from that service. Jasmine essentially 
     * makes a completely fake service, the methods under 
     * the hood no longer do anything the real service does.
     */
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    /**
     * TestBed allows for using dependency injection instead
     * of creating the service manually. 
     * 
     * This best matches the way the entire framework works.
     */ 
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy }
      ]
    });

    calculator = TestBed.get(CalculatorService);
  });

  it('should add two numbers', () => {
    const result = calculator.add(2, 2);

    // test assertions
    expect(result).toBe(4, '2 + 2 should equal 4');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1)
  });

  it('should substract two numbers', () => {
    const result = calculator.subtract(2, 2)

    // test assertions
    expect(result).toBe(0, '2 - 2 should equal 0');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1)
  });
});
