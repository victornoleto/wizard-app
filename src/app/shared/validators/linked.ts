import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Interface para configuração do validador linked
 */
interface LinkedValidatorConfig {
    aField: string;
    bField: string;
    label?: string;
    message?: string;
}

/**
 * Mensagem padrão para validação de campo obrigatório condicionalmente
 */
const DEFAULT_MESSAGE =
    'Este campo é obrigatório quando o campo {label} possui valor';

/**
 * Validador que torna um campo obrigatório quando outro campo possui valor
 */
export function requiredWithValidator(
    config: LinkedValidatorConfig,
): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        return linkedFieldValidator(formGroup, config);
    };
}

/**
 * Função auxiliar para verificar se um valor é considerado "vazio"
 */
function isEmpty(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
    );
}

/**
 * Limpa erros específicos de um controle
 */
function clearValidationError(control: AbstractControl, key: string): void {
    if (!control.hasError(key)) return;

    const errors = { ...control.errors };
    delete errors[key];

    const hasRemainingErrors = Object.keys(errors).length > 0;
    control.setErrors(hasRemainingErrors ? errors : null);
}

/**
 * Adiciona erro de validação a um controle
 */
function setValidationError(
    control: AbstractControl,
    key: string,
    message: string,
): void {
    const error = {
        [key]: { message },
    };

    control.setErrors({
        ...control.errors,
        ...error,
    });
}

/**
 * Implementação principal do validador de campo obrigatório condicionalmente
 */
function linkedFieldValidator(
    formGroup: AbstractControl,
    config: LinkedValidatorConfig,
): ValidationErrors | null {
    const {
        aField,
        bField,
        label = bField,
        message = DEFAULT_MESSAGE,
    } = config;

    const aControl = formGroup.get(aField);
    const bControl = formGroup.get(bField);

    // Se os controles não existem, não há como validar
    if (!aControl || !bControl) {
        return null;
    }

    // Limpar validação anterior
    clearValidationError(aControl, 'requiredWith');

    const aValue = aControl.value;
    const bValue = bControl.value;

    // Se bField não possui valor, aField não é obrigatório
    if (isEmpty(bValue)) {
        return null;
    }

    // Se bField possui valor, aField deve possuir valor também
    if (isEmpty(aValue)) {
        const errorMessage = message.replace('{label}', label);
        const error = {
            requiredWith: { message: errorMessage },
        };

        setValidationError(aControl, 'requiredWith', errorMessage);
        return error;
    }

    return null;
}
