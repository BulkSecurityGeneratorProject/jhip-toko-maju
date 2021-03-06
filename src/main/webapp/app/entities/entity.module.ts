import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiptokomajuCustomerModule } from './customer/customer.module';
import { JhiptokomajuProductModule } from './product/product.module';
import { JhiptokomajuProjectModule } from './project/project.module';
import { JhiptokomajuSupplierModule } from './supplier/supplier.module';
import { JhiptokomajuSaleTransactionsModule } from './sale-transactions/sale-transactions.module';
import { JhiptokomajuInvoiceModule } from './invoice/invoice.module';
import { JhiptokomajuDuePaymentModule } from './due-payment/due-payment.module';

@NgModule({
    imports: [
        JhiptokomajuCustomerModule,
        JhiptokomajuProductModule,
        JhiptokomajuProjectModule,
        JhiptokomajuSupplierModule,
        JhiptokomajuSaleTransactionsModule,
        JhiptokomajuInvoiceModule,
        JhiptokomajuDuePaymentModule,
        RouterModule.forChild([
            // {
            //     path: 'customer',
            //     loadChildren: './customer/customer.module#JhiptokomajuCustomerModule'
            // },
            //     {
            //         path: 'product',
            //         loadChildren: './product/product.module#JhiptokomajuProductModule'
            //     },
            //     {
            //         path: 'project',
            //         loadChildren: './project/project.module#JhiptokomajuProjectModule'
            //     },
            {
                path: 'supplier',
                loadChildren: './supplier/supplier.module#JhiptokomajuSupplierModule'
            },
            // {
            //     path: 'sale-transactions',
            //     loadChildren: './sale-transactions/sale-transactions.module#JhiptokomajuSaleTransactionsModule'
            // }
            // {
            //     path: 'invoice',
            //     loadChildren: './invoice/invoice.module#JhiptokomajuInvoiceModule'
            // }
            // {
            //     path: 'due-payment',
            //     loadChildren: './due-payment/due-payment.module#JhiptokomajuDuePaymentModule'
            // }
            {
                path: 'unit',
                loadChildren: './unit/unit.module#JhiptokomajuUnitModule'
            },
            {
                path: 'cancel-transaction',
                loadChildren: './cancel-transaction/cancel-transaction.module#JhiptokomajuCancelTransactionModule'
            }
            //     /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhiptokomajuEntityModule {}
