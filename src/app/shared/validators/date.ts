import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment, { unitOfTime, Moment } from 'moment';

/**
 * Tipos para melhor type safety
 */
type DateUnit = unitOfTime.Base;

/**
 * Interface para configuração de range de diferença
 */
interface DateDifferenceConfig {
    readonly aField: string;
    readonly bField: string;
    readonly maxValue: number;
    readonly unit?: DateUnit;
    readonly format?: string;
    readonly message?: string;
}

/**
 * Mapeamento de unidades para texto em português
 */
const UNIT_TEXT_MAP: Record<string, { singular: string; plural: string }> = {
    year: { singular: 'ano', plural: 'anos' },
    month: { singular: 'mês', plural: 'meses' },
    week: { singular: 'semana', plural: 'semanas' },
    day: { singular: 'dia', plural: 'dias' },
    hour: { singular: 'hora', plural: 'horas' },
    minute: { singular: 'minuto', plural: 'minutos' },
    second: { singular: 'segundo', plural: 'segundos' },
};

/**
 * Mensagens padrão para validações
 */
const DEFAULT_MESSAGES = {
    dateInvalid: 'Este campo precisa ser uma data válida no formato {format}',
    dateRange: 'Data deve estar entre {minDate} e {maxDate}',
    dateCompare: 'Data deve ser {comparison} que {fieldName}',
    dateDifference:
        'A diferença entre as datas não pode exceder {value} {unit}',
} as const;

/**
 * Cria um objeto Moment com parsing estrito
 */
function createMoment(value: string, format: string): Moment {
    return moment(value.trim(), format, true);
}

/**
 * Verifica se um valor é uma string válida não vazia
 */
function isValidString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Obtém texto da unidade em português
 */
function getUnitText(value: number, unit: DateUnit): string {
    const unitTexts = UNIT_TEXT_MAP[unit];
    if (!unitTexts) return unit;

    return value === 1 ? unitTexts.singular : unitTexts.plural;
}

/**
 * Limpa erro específico de um controle
 */
function clearValidationError(
    control: AbstractControl,
    errorKey: string,
): void {
    if (!control.hasError(errorKey)) return;

    const errors = { ...control.errors };
    delete errors[errorKey];

    const hasRemainingErrors = Object.keys(errors).length > 0;
    control.setErrors(hasRemainingErrors ? errors : null);
}

/**
 * Adiciona erro de validação a um controle
 */
function setValidationError(
    control: AbstractControl,
    errorKey: string,
    error: ValidationErrors[string],
): void {
    control.setErrors({
        ...control.errors,
        [errorKey]: error,
    });
}

/**
 * Validador de formato de data usando Moment.js
 */
export function dateValidator(
    format = 'YYYY-MM-DD',
    message: string = DEFAULT_MESSAGES.dateInvalid,
): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;

        const value = control.value.toString();
        if (!isValidString(value)) return null;

        const momentDate = createMoment(value, format);

        if (!momentDate.isValid()) {
            return {
                dateInvalid: {
                    message: message.replace('{format}', format),
                    actualValue: value,
                    expectedFormat: format,
                },
            };
        }

        return null;
    };
}

/**
 * Validador de range entre duas datas
 */
export function dateRangeValidator(config: DateDifferenceConfig): ValidatorFn {
    const {
        aField,
        bField,
        maxValue,
        unit = 'day',
        format = 'YYYY-MM-DD',
        message = DEFAULT_MESSAGES.dateDifference,
    } = config;

    return (formGroup: AbstractControl): ValidationErrors | null => {
        const startControl = formGroup.get(aField);
        const endControl = formGroup.get(bField);

        // Limpar validação anterior
        if (startControl) {
            clearValidationError(startControl, 'dateRange');
        }

        if (!startControl?.value || !endControl?.value) {
            return null;
        }

        const startValue = startControl.value.toString();
        const endValue = endControl.value.toString();

        if (!isValidString(startValue) || !isValidString(endValue)) return null;

        const startDate = createMoment(startValue, format);
        const endDate = createMoment(endValue, format);

        if (!startDate.isValid() || !endDate.isValid()) return null;

        const difference = Math.abs(startDate.diff(endDate, unit));

        if (difference <= maxValue) {
            return null;
        }

        const unitText = getUnitText(maxValue, unit);
        const errorMessage = message
            .replace('{value}', maxValue.toString())
            .replace('{unit}', unitText);

        const error = {
            dateRange: {
                message: errorMessage,
                maxValue,
                unit,
                actualDifference: difference,
            },
        };

        // Adiciona o erro ao campo inicial
        if (startControl) {
            setValidationError(startControl, 'dateRange', error.dateRange);
        }

        return error;
    };
}
