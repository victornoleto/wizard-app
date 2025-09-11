import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator for Brazilian license plates (both old and Mercosul formats)
 * Old format: ABC-1234 or ABC1234
 * Mercosul format: ABC1D23 or ABC-1D23
 */
export function validatePlate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null; // Don't validate empty values, use Validators.required for that
        }

        const value = control.value.toString().trim().toUpperCase();

        // Check if it matches old format (3 letters + 4 numbers)
        const oldFormatRegex = /^[A-Z]{3}[0-9]{4}$/;

        // Check if it matches Mercosul format (3 letters + 1 number + 1 letter + 2 numbers)
        const mercosulFormatRegex = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;

        const isValidOldFormat = oldFormatRegex.test(value);
        const isValidMercosulFormat = mercosulFormatRegex.test(value);

        if (isValidOldFormat || isValidMercosulFormat) {
            return null; // Valid plate
        }

        return {
            invalidPlate: {
                value: control.value,
                message: 'A placa deve seguir o formato ABC1234 ou ABC1D23',
            },
        };
    };
}

/**
 * Alternative validator for international plates (more flexible)
 */
export function internationalPlateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const value = control.value.toString().trim();

        // Basic pattern: 2-8 alphanumeric characters with optional hyphen
        const internationalRegex = /^[A-Z0-9]{2,8}(-[A-Z0-9]{1,4})?$/i;

        if (internationalRegex.test(value)) {
            return null;
        }

        return {
            invalidPlate: {
                value: control.value,
                message: 'Formato de placa inválido',
            },
        };
    };
}
