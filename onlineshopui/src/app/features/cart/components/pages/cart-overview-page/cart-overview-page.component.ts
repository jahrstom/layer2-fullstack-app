import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../../products/services/product.service';
import { OrdersService } from '../../../../orders/services/orders.service';
import { SpinnerComponent } from '../../../../../clib/components/spinner/spinner.component';
import { CartItemRowComponent } from '../../views/cart-item-row/cart-item-row.component';
import { CartSummaryComponent } from '../../views/cart-summary/cart-summary.component';
import { AddressFormComponent } from '../../views/address-form/address-form.component';
import { AppNavRoutes } from '../../../../../core/config/constants/navigation.constants';
import { NotificationsService } from '../../../../../core/services/notifications.service';
import {
    buildProductsById,
    calculateCartSubtotal,
    toCreateOrderDto
} from '../../../utils/cart.utils';
import { createAddressForm } from '../../../utils/address-form.utils';

@Component({
    selector: 'app-cart-overview-page',
    imports: [SpinnerComponent, CartItemRowComponent, CartSummaryComponent, AddressFormComponent, RouterLink],
    templateUrl: './cart-overview-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartOverviewPageComponent implements OnInit {
    private readonly cartService = inject(CartService);
    private readonly productService = inject(ProductService);
    private readonly ordersService = inject(OrdersService);
    private readonly router = inject(Router);
    private readonly notificationsService = inject(NotificationsService);

    readonly cartItems = this.cartService.items;
    readonly products = this.productService.products;
    readonly loading = this.productService.loading;
    readonly error = this.productService.error;
    readonly isSubmitting = signal(false);
    readonly productsLink = [
        '/',
        AppNavRoutes.Products.root,
        AppNavRoutes.Products.features.overview
    ];

    readonly addressForm = createAddressForm();
    readonly isAddressModalOpen = signal(false);

    readonly productsById = computed(() => buildProductsById(this.products()));

    readonly subtotal = computed(() =>
        calculateCartSubtotal(this.cartItems(), this.productsById())
    );

    readonly itemCount = this.cartService.totalItems;

    ngOnInit(): void {
        this.productService.loadAll().pipe(take(1)).subscribe();
    }

    onQuantityChange(productId: string, quantity: number): void {
        this.cartService.updateQuantity(productId, quantity);
    }

    onRemoveItem(productId: string): void {
        this.cartService.removeItem(productId);
    }

    onClearCart(): void {
        this.cartService.clear();
    }

    onCheckout(): void {
        if (this.cartItems().length === 0) return;
        this.isAddressModalOpen.set(true);
    }

    onConfirmOrder(): void {
        this.addressForm.markAllAsTouched();
        if (this.addressForm.invalid) {
            return;
        }

        const address = this.addressForm.getRawValue();
        const payload = toCreateOrderDto(this.cartItems(), address);
        if (!payload) return;

        this.isSubmitting.set(true);
        this.ordersService
            .create(payload)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.isSubmitting.set(false);
                    this.isAddressModalOpen.set(false);
                    this.cartService.clear();
                    this.addressForm.reset();
                    this.notificationsService.notifySuccess({
                        title: 'Order placed',
                        message: 'Your order is being processed.'
                    });
                    this.router.navigate([
                        '/',
                        AppNavRoutes.Orders.root,
                        AppNavRoutes.Orders.features.overview
                    ]);
                },
                error: err => {
                    console.error('Failed to create order:', err);
                    this.notificationsService.notifyError({
                        title: 'Order failed',
                        message: 'Please try again in a moment.'
                    });
                    this.isSubmitting.set(false);
                }
            });
    }

    onCancelOrder(): void {
        this.isAddressModalOpen.set(false);
        this.addressForm.reset();
    }

    retry(): void {
        this.productService.loadAll().pipe(take(1)).subscribe();
    }
}
