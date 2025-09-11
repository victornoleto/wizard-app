import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Tipos para melhor type safety
 */
type ComparableValue = string | number;
type ComparisonFunction = (a: ComparableValue, b: ComparableValue) => boolean;
type ValidationKey = 'equalsTo' | 'gt' | 'gte' | 'lt' | 'lte';

/**
 * Interface para configuração do validador
 */
interface ComparisonValidatorConfig {
    aField: string;
    bField: string;
    label?: string;
    message?: string;
}

/**
 * Mensagens padrão para cada tipo de validação
 */
const DEFAULT_MESSAGES: Record<ValidationKey, string> = {
    equalsTo: 'Este campo deve ter o valor igual ao campo {label}',
    gt: 'Este campo deve ter o valor maior que o campo {label}',
    gte: 'Este campo deve ter o valor maior ou igual ao campo {label}',
    lt: 'Este campo deve ter o valor menor que o campo {label}',
    lte: 'Este campo deve ter o valor menor ou igual ao campo {label}',
};

/**
 * Funções de comparação
 */
const COMPARISON_FUNCTIONS: Record<ValidationKey, ComparisonFunction> = {
    equalsTo: (a, b) => a === b, // Usando === para comparação estrita
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
};

/**
 * Validador genérico de comparação
 */
function createComparisonValidator(
    key: ValidationKey,
    config: ComparisonValidatorConfig,
): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        return comparisonValidator(
            formGroup,
            key,
            config,
            COMPARISON_FUNCTIONS[key],
        );
    };
}

/**
 * Validador de igualdade
 */
export function equalsToValidator(
    config: ComparisonValidatorConfig,
): ValidatorFn {
    return createComparisonValidator('equalsTo', config);
}

/**
 * Validador maior que
 */
export function gtValidator(config: ComparisonValidatorConfig): ValidatorFn {
    return createComparisonValidator('gt', config);
}

/**
 * Validador maior ou igual que
 */
export function gteValidator(config: ComparisonValidatorConfig): ValidatorFn {
    return createComparisonValidator('gte', config);
}

/**
 * Validador menor que
 */
export function ltValidator(config: ComparisonValidatorConfig): ValidatorFn {
    return createComparisonValidator('lt', config);
}

/**
 * Validador menor ou igual que
 */
export function lteValidator(config: ComparisonValidatorConfig): ValidatorFn {
    return createComparisonValidator('lte', config);
}

/**
 * Função auxiliar para verificar se um valor é válido para comparação
 */
function isValidValue(value: unknown): value is ComparableValue {
    return value !== null && value !== undefined && value !== '';
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
 * Implementação principal do validador de comparação
 */
function comparisonValidator(
    formGroup: AbstractControl,
    key: ValidationKey,
    config: ComparisonValidatorConfig,
    compareFunction: ComparisonFunction,
): ValidationErrors | null {
    const {
        aField,
        bField,
        label = bField,
        message = DEFAULT_MESSAGES[key],
    } = config;

    const aControl = formGroup.get(aField);
    const bControl = formGroup.get(bField);

    // Se os controles não existem, não há como validar
    if (!aControl || !bControl) {
        return null;
    }

    // Limpar validação anterior
    clearValidationError(aControl, key);

    const aValue = aControl.value;
    const bValue = bControl.value;

    // Só valida se ambos os valores são válidos
    if (!isValidValue(aValue) || !isValidValue(bValue)) {
        return null;
    }

    // Realiza a comparação
    if (!compareFunction(aValue, bValue)) {
        const errorMessage = message.replace('{label}', label);
        const error = {
            [key]: { message: errorMessage },
        };

        setValidationError(aControl, key, errorMessage);
        return error;
    }

    return null;
}
