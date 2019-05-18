import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { JhiptokomajuSharedModule } from 'app/shared';
import {
    BadStockProductComponent,
    BadStockProductDetailComponent,
    BadStockProductUpdateComponent,
    BadStockProductDeletePopupComponent,
    BadStockProductDeleteDialogComponent,
    badStockProductRoute,
    badStockProductPopupRoute
} from './';

const ENTITY_STATES = [...badStockProductRoute, ...badStockProductPopupRoute];

@NgModule({
    imports: [JhiptokomajuSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        BadStockProductComponent,
        BadStockProductDetailComponent,
        BadStockProductUpdateComponent,
        BadStockProductDeleteDialogComponent,
        BadStockProductDeletePopupComponent
    ],
    entryComponents: [
        BadStockProductComponent,
        BadStockProductUpdateComponent,
        BadStockProductDeleteDialogComponent,
        BadStockProductDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhiptokomajuBadStockProductModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}