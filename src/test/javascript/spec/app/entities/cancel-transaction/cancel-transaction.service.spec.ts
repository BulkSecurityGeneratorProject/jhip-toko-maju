/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { CancelTransactionService } from 'app/entities/cancel-transaction/cancel-transaction.service';
import { ICancelTransaction, CancelTransaction } from 'app/shared/model/cancel-transaction.model';

describe('Service Tests', () => {
    describe('CancelTransaction Service', () => {
        let injector: TestBed;
        let service: CancelTransactionService;
        let httpMock: HttpTestingController;
        let elemDefault: ICancelTransaction;
        let currentDate: moment.Moment;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule]
            });
            injector = getTestBed();
            service = injector.get(CancelTransactionService);
            httpMock = injector.get(HttpTestingController);
            currentDate = moment();

            elemDefault = new CancelTransaction(0, 'AAAAAAA', currentDate, 'AAAAAAA', 'AAAAAAA');
        });

        describe('Service methods', async () => {
            it('should find an element', async () => {
                const returnedFromService = Object.assign(
                    {
                        cancelDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                service
                    .find(123)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: elemDefault }));

                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should create a CancelTransaction', async () => {
                const returnedFromService = Object.assign(
                    {
                        id: 0,
                        cancelDate: currentDate.format(DATE_TIME_FORMAT)
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        cancelDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .create(new CancelTransaction(null))
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'POST' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should update a CancelTransaction', async () => {
                const returnedFromService = Object.assign(
                    {
                        noInvoice: 'BBBBBB',
                        cancelDate: currentDate.format(DATE_TIME_FORMAT),
                        note: 'BBBBBB',
                        noCancelInvoice: 'BBBBBB'
                    },
                    elemDefault
                );

                const expected = Object.assign(
                    {
                        cancelDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .update(expected)
                    .pipe(take(1))
                    .subscribe(resp => expect(resp).toMatchObject({ body: expected }));
                const req = httpMock.expectOne({ method: 'PUT' });
                req.flush(JSON.stringify(returnedFromService));
            });

            it('should return a list of CancelTransaction', async () => {
                const returnedFromService = Object.assign(
                    {
                        noInvoice: 'BBBBBB',
                        cancelDate: currentDate.format(DATE_TIME_FORMAT),
                        note: 'BBBBBB',
                        noCancelInvoice: 'BBBBBB'
                    },
                    elemDefault
                );
                const expected = Object.assign(
                    {
                        cancelDate: currentDate
                    },
                    returnedFromService
                );
                service
                    .query(expected)
                    .pipe(
                        take(1),
                        map(resp => resp.body)
                    )
                    .subscribe(body => expect(body).toContainEqual(expected));
                const req = httpMock.expectOne({ method: 'GET' });
                req.flush(JSON.stringify([returnedFromService]));
                httpMock.verify();
            });

            it('should delete a CancelTransaction', async () => {
                const rxPromise = service.delete(123).subscribe(resp => expect(resp.ok));

                const req = httpMock.expectOne({ method: 'DELETE' });
                req.flush({ status: 200 });
            });
        });

        afterEach(() => {
            httpMock.verify();
        });
    });
});
