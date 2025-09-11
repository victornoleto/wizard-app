import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    input,
} from '@angular/core';
import Tagify, { TagData } from '@yaireo/tagify';
import { TagsinputComponent } from '../tagsinput/tagsinput.component';

type SelectOption = Record<string, string | number>;

type LabelFunction = (item: SelectOption) => string;

@Component({
    selector: 'app-select-multiple',
    templateUrl: '../tagsinput/tagsinput.component.html',
    styleUrl: './select-multiple.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMultipleComponent extends TagsinputComponent {
    // Propriedades específicas do select-multiple
    options = input.required<SelectOption[]>();
    valueKey = input<string>('id');
    labelKey = input<string>('name');
    labelKeyFn = input<LabelFunction | null>(null);
    placeholder = input<string>('Selecione uma ou mais opções');

    // Whitelist computada baseada nas options
    private readonly computedWhitelist = computed(() => {
        const options = this.options();
        const labelFn = this.labelKeyFn();
        const labelKey = this.labelKey();

        // Tagify.TagData expects at least a 'value' property, but can include others
        return options.map((option) => ({
            value: labelFn ? labelFn(option) : option[labelKey],
            ...option,
        })) as Tagify.TagData[];
    });

    // Sobrescrever settings para incluir configurações específicas
    private readonly selectSettings = computed(() => {
        const baseSettings = this.settings();

        return {
            ...baseSettings,
            enforceWhitelist: true,
            placeholder: this.placeholder(),
            dropdown: {
                enabled: 0, // 0 = show dropdown immediately on focus
                maxItems: 20,
                closeOnSelect: false,
                highlightFirst: false,
                ...baseSettings.dropdown,
            },
            whitelist: this.computedWhitelist(),
        } as Partial<Tagify.TagifySettings>;
    });

    constructor() {
        super();

        // Effect para atualizar whitelist quando options mudam
        effect(() => {
            const whitelist = this.computedWhitelist();
            if (this.tagify) {
                this.tagify.whitelist = whitelist;
                const controlValue = this.currentValue();
                this.tagify.removeAllTags();
                if (controlValue.length > 0) {
                    this.tagify.addTags(controlValue.map(String), false, false);
                }
            }
        });
    }

    protected override initializeTagify(): void {
        // Destroyer instância existente se houver
        this.destroyTagify();

        const inputElem = this.inputElement.nativeElement;

        // Usar as configurações específicas do select
        this.tagify = new Tagify(inputElem, this.selectSettings());

        // Definir valor inicial se existir
        const currentValues = this.currentValue();
        if (currentValues.length > 0) {
            // Buscar os objetos completos baseados nos valores atuais
            const whitelist = this.computedWhitelist();
            const fullTagObjects = currentValues.map((val) => {
                const fullObject = whitelist.find((item) => item.value === val);
                return fullObject || { value: val };
            });
            this.tagify.addTags(
                fullTagObjects.map((obj) => String(obj.value)),
                false,
                false,
            );
        }

        this.tagify.on('change', () => {
            this.handleTagifyChange();
        });

        this.tagify.on('blur', () => {
            this.onTouched();
        });

        // Mostrar dropdown automaticamente no focus
        this.tagify.on('focus', () => {
            if (this.tagify) {
                this.tagify.dropdown.show();
            }
        });
    }

    override writeValue(value: (string | number)[]): void {
        // Converter valores primitivos para objetos com base nas options
        const primitiveValues = value || [];
        const options = this.options();
        const valueKey = this.valueKey();

        const selectedOptions = primitiveValues
            .map((primitiveValue) => {
                const option = options.find(
                    (opt) => opt[valueKey] === primitiveValue,
                );
                if (option) {
                    const labelFn = this.labelKeyFn();
                    const labelKey = this.labelKey();
                    return {
                        value: labelFn ? labelFn(option) : option[labelKey],
                        ...option,
                    };
                }
                return null;
            })
            .filter(Boolean);

        // Converter para array de strings que o tagsinput espera
        const stringValues = selectedOptions.map((opt) => opt!.value);

        this.currentValue.set(stringValues);

        if (this.tagify) {
            const currentTagifyValue = this.extractTagValues(this.tagify.value);

            if (
                !this.arraysEqual(
                    currentTagifyValue.map(String),
                    stringValues.map(String),
                )
            ) {
                this.tagify.removeAllTags();
                if (selectedOptions.length > 0) {
                    // Usar os objetos completos das options para os tags
                    const validOptions = selectedOptions.filter(
                        (opt) => opt !== null,
                    );
                    this.tagify.addTags(
                        validOptions.map((opt) => String(opt!.value)),
                        false,
                        false,
                    );
                }
            }
        } else if (this.inputElement?.nativeElement) {
            // Se o tagify não foi inicializado mas temos o elemento input, tentar inicializar
            setTimeout(() => this.initializeTagify(), 0);
        }
    }

    protected override handleTagifyChange(): void {
        if (this.tagify) {
            const whitelist = this.computedWhitelist();
            const tagifyTags = this.tagify.value;

            // Extrair apenas os valores primitivos (IDs) para o form control
            const primitiveValues = tagifyTags.map((tag: TagData) => tag.value);

            // Atualizar o currentValue com os labels para exibição
            const displayValues = this.extractTagValues(tagifyTags).filter(
                (val) => whitelist.some((item) => item.value === val),
            );

            this.currentValue.set(displayValues);

            // Enviar os valores primitivos para o form control
            this.onChange(primitiveValues);
            this.cdr.markForCheck();
        }
    }
}
