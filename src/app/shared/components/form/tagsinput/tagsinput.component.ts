import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    ViewEncapsulation,
    computed,
    effect,
    inject,
    input,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import Tagify, { TagData } from '@yaireo/tagify';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-tagsinput',
    templateUrl: './tagsinput.component.html',
    styleUrl: './tagsinput.component.scss',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TagsinputComponent
    implements AfterViewInit, OnDestroy, ControlValueAccessor
{
    @ViewChild('input') protected inputElement!: ElementRef<HTMLInputElement>;

    private ngControl = inject(NgControl, { optional: true });
    protected cdr = inject(ChangeDetectorRef);

    id = input<string>();
    name = input<string>();
    settings = input<Partial<Tagify.TagifySettings>>({});
    disabled = input<boolean>(false, { alias: 'isDisabled' });

    readonly currentValue = signal<(string | number)[]>([]);
    protected tagify: Tagify | null = null;
    protected onChange: (value: string[]) => void = () => void 0;
    protected onTouched: () => void = () => void 0;

    finalId = computed(() => this.id() || `input-${uuidv4()}`);
    finalName = computed(
        () => this.name() || this.getControlName() || 'tagsinput',
    );

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
        effect(() => {
            const disabled = this.disabled();
            if (this.tagify) {
                this.tagify.setDisabled(disabled);
            }
        });
    }

    ngAfterViewInit(): void {
        this.initializeTagify();
    }

    ngOnDestroy(): void {
        this.destroyTagify();
    }

    protected destroyTagify(): void {
        if (this.tagify) {
            this.tagify.destroy();
            this.tagify = null;
        }
    }

    protected getControlName(): string | null {
        if (this.ngControl?.name) {
            return typeof this.ngControl.name === 'string'
                ? this.ngControl.name
                : this.ngControl.name.toString();
        }
        return null;
    }

    protected initializeTagify(): void {
        // Destroy existing instance if it exists (useful for hot reload)
        this.destroyTagify();

        const inputElem = this.inputElement.nativeElement;

        // Initialize Tagify with merged settings
        const defaultSettings: Partial<Tagify.TagifySettings> = {
            delimiters: ',',
            trim: true,
            duplicates: false,
        };

        this.tagify = new Tagify(inputElem, {
            ...defaultSettings,
            ...this.settings(),
        });

        // Set initial value if exists
        if (this.currentValue().length > 0) {
            const tagifyValue = this.currentValue().map((val) => String(val));
            this.tagify.addTags(tagifyValue, false, false);
        }

        this.tagify.on('change', () => {
            this.handleTagifyChange();
        });

        this.tagify.on('blur', () => {
            this.onTouched();
        });
    }

    protected handleTagifyChange(): void {
        if (this.tagify) {
            const arrayValue = this.extractTagValues(this.tagify.value);
            this.currentValue.set(arrayValue);
            this.onChange(arrayValue);
            this.cdr.markForCheck();
        }
    }

    protected extractTagValues(tags: TagData[]): string[] {
        return (tags || []).map((tag: TagData) =>
            typeof tag === 'string'
                ? tag
                : typeof tag.value === 'string'
                  ? tag.value
                  : String(tag.value ?? tag),
        );
    }

    writeValue(value: string[]): void {
        const newValue = value || [];
        this.currentValue.set(newValue);

        if (this.tagify) {
            const currentTagifyValue = this.extractTagValues(this.tagify.value);

            // Only update if the values are different
            if (!this.arraysEqual(currentTagifyValue, newValue)) {
                this.tagify.removeAllTags();
                if (newValue.length > 0) {
                    const tagifyValue = newValue.map((val) => ({ value: val }));
                    this.tagify.addTags(tagifyValue, false, false);
                }
            }
        } else if (this.inputElement?.nativeElement) {
            // If tagify is not initialized but we have the input element, try to initialize
            setTimeout(() => this.initializeTagify(), 0);
        }
    }

    protected arraysEqual(a: string[], b: string[]): boolean {
        if (a.length !== b.length) return false;
        return a.every((val, index) => val === b[index]);
    }

    registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        if (this.tagify) {
            this.tagify.setDisabled(isDisabled);
        } else if (this.inputElement?.nativeElement) {
            // If tagify is not initialized, set disabled state on the native input
            this.inputElement.nativeElement.disabled = isDisabled;
        }
    }
}
