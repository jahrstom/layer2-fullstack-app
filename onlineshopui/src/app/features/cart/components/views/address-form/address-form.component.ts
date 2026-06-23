import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressFormGroup } from '../../../utils/address-form.utils';
import { ErrorMessageComponent } from '../../../../../clib/components/error-message/error-message.component';

@Component({
    selector: 'app-address-form',
    standalone: true,
    imports: [ReactiveFormsModule, ErrorMessageComponent],
    templateUrl: './address-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent {
    form = input.required<AddressFormGroup>();
    isSubmitting = input<boolean>(false);
}
