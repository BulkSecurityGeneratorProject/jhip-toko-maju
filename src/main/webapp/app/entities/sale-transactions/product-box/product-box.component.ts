import { Component, OnInit, OnDestroy, Input, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { IProduct, Product } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { ISaleItem, SaleItem } from 'app/shared/model/sale-item.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ISaleTransactions } from 'app/shared/model/sale-transactions.model';
import { CustomerService } from 'app/entities/customer';
import { ICustomerProduct } from 'app/shared/model/customer-product.model';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-product-box',
    templateUrl: './product-box.component.html',
    styles: []
})
export class ProductBoxComponent implements OnInit, AfterViewInit, OnDestroy {
    selectedProduct: IProduct;
    selectedItem: ISaleItem = new SaleItem();
    customerProducts: ICustomerProduct[];
    // tslint:disable-next-line: no-input-rename
    @Input('sale') saleTransactions: ISaleTransactions;
    eventCustomerSubscription: Subscription;
    eventSaveSubscription: Subscription;
    eventProductSubscription: Subscription;
    searchBarcode: string;
    @ViewChild('barcode') barcodeField: ElementRef;
    @ViewChild('quantity') quantityField: ElementRef;

    constructor(
        private productService: ProductService,
        protected customerService: CustomerService,
        protected eventManager: JhiEventManager,
        protected jhiAlertService: JhiAlertService,
        protected router: Router
    ) {
        this.selectedItem.quantity = 1;
        this.customerProducts = [];
    }

    ngOnInit() {
        this.registerEvent();
    }

    ngAfterViewInit(): void {
        this.loadCustomerProduct();
        this.barcodeField.nativeElement.focus();
    }

    @HostListener('window:keypress', ['$event'])
    keyPressEvent(event: KeyboardEvent) {
        // alt + p
        if (event.altKey && event.keyCode === 960) {
            setTimeout(() => {
                this.router
                    .navigate(['/', { outlets: { popup: 'sale/search-product' } }])
                    .then(() => {
                        this.barcodeField.nativeElement.value = '';
                        this.searchBarcode = '';
                    })
                    .catch(() => {
                        this.barcodeField.nativeElement.value = '';
                        this.searchBarcode = '';
                    });
            }, 10);

            this.searchBarcode = '';
        } else if (event.ctrlKey && event.keyCode === 2) {
            // ctrl + b
            this.barcodeField.nativeElement.focus();
        }
    }

    searchProduct() {
        this.productService
            .findByBarcode(this.searchBarcode)
            .pipe(
                filter((mayBeOk: HttpResponse<IProduct>) => mayBeOk.ok),
                map((response: HttpResponse<IProduct>) => response.body)
            ) // res[0] index to 0 because response from back end is array list of product
            .subscribe((res: IProduct) => this.foundProduct(res[0]), (err: HttpErrorResponse) => this.onError(err.message));
    }

    clearSelectedProduct() {
        this.selectedItem.setProduct(new Product());
        this.barcodeField.nativeElement.value = '';
        this.quantityField.nativeElement.value = 1;
    }

    protected foundProduct(found: IProduct): void {
        if (!found) {
            this.clearSelectedProduct();
            return;
        }

        this.updateToCustPrice(found);
        this.selectedItem.setProduct(found);
        this.searchBarcode = found.barcode;
        this.quantityField.nativeElement.focus();
    }

    protected updateToCustPrice(found: IProduct) {
        const exist: ICustomerProduct = this.lookupInCustomerProducts(found.id);
        if (!exist) {
            return;
        }

        found.sellingPrice = exist.specialPrice;
    }

    protected lookupInCustomerProducts(productId: number): ICustomerProduct {
        let item: ICustomerProduct = null;
        if (this.customerProducts || this.customerProducts.length > 0) {
            item = this.customerProducts.find(p => p.productId === productId);
        }
        return item;
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventCustomerSubscription);
        this.eventManager.destroy(this.eventSaveSubscription);
        this.eventManager.destroy(this.eventProductSubscription);
    }

    checkStock(): boolean {
        return this.selectedItem.isQtyBigerThanStock();
    }

    isProductSelected(): boolean {
        return this.selectedItem.product === null || this.selectedItem.product === undefined || this.selectedItem.product.id === undefined;
    }

    addToCart(form: NgForm) {
        if (form.invalid || this.checkStock()) {
            return;
        }
        this.selectedItem.createItem();
        this.saleTransactions.addOrUpdate(this.selectedItem);
        this.reset();
        form.resetForm(this.selectedItem);
    }

    protected reset(): any {
        this.selectedItem = new SaleItem();
        this.selectedItem.quantity = 1;
        this.quantityField.nativeElement.value = 1;
        this.barcodeField.nativeElement.value = '';
        this.barcodeField.nativeElement.focus();
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    protected registerEvent() {
        this.eventCustomerSubscription = this.eventManager.subscribe('onSelectCustomerEvent', response => this.loadCustomerProduct());
        this.eventProductSubscription = this.eventManager.subscribe('onSelectProductEvent', response => {
            this.foundProduct(response.data);
        });
        this.eventSaveSubscription = this.eventManager.subscribe('onSaveSale', () => {
            this.barcodeField.nativeElement.focus();
        });
    }

    protected loadCustomerProduct() {
        if (!this.saleTransactions || !this.saleTransactions.customer) {
            return;
        }

        this.customerService.searcyByCustomer(this.saleTransactions.customer.id).subscribe(
            response => {
                this.customerProducts = [];
                this.customerProducts = response.body;
            },
            err => {
                this.onError(err.message);
            }
        );
    }
}
