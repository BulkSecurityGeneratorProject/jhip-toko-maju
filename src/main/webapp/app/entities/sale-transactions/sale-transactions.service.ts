import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISaleTransactions } from 'app/shared/model/sale-transactions.model';

type EntityResponseType = HttpResponse<ISaleTransactions>;
type EntityArrayResponseType = HttpResponse<ISaleTransactions[]>;

@Injectable({ providedIn: 'root' })
export class SaleTransactionsService {
    public resourceUrl = SERVER_API_URL + 'api/sale-transactions';
    public resourceSearchUrl = SERVER_API_URL + 'api/_search/sale-transactions';

    constructor(protected http: HttpClient) {}

    create(saleTransactions: ISaleTransactions): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(saleTransactions);
        return this.http
            .post<ISaleTransactions>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(saleTransactions: ISaleTransactions): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(saleTransactions);
        return this.http
            .put<ISaleTransactions>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ISaleTransactions>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ISaleTransactions[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ISaleTransactions[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    protected convertDateFromClient(saleTransactions: ISaleTransactions): ISaleTransactions {
        const copy: ISaleTransactions = Object.assign({}, saleTransactions, {
            saleDate: saleTransactions.saleDate != null && saleTransactions.saleDate.isValid() ? saleTransactions.saleDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.saleDate = res.body.saleDate != null ? moment(res.body.saleDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((saleTransactions: ISaleTransactions) => {
                saleTransactions.saleDate = saleTransactions.saleDate != null ? moment(saleTransactions.saleDate) : null;
            });
        }
        return res;
    }
}