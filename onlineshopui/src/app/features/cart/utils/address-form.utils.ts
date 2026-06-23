import { FormControl, FormGroup, Validators } from '@angular/forms';

export type AddressFormGroup = FormGroup<{
    country: FormControl<string>;
    city: FormControl<string>;
    county: FormControl<string>;
    streetAddress: FormControl<string>;
}>;

export function createAddressForm(): AddressFormGroup {
    return new FormGroup({
        country: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100)]
        }),
        city: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(100)]
        }),
        county: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.maxLength(100)]
        }),
        streetAddress: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(255)]
        })
    });
}
