import { ElementRef, EventEmitter, Output } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { getErrors } from './form-utils';
import { ToastService } from 'src/app/services/toast.service';

@Directive({
    selector: '[appFg]'
})
export class FormDirective {

    @Input('appFg') fg: FormGroup;
    @Input('btnSubmit') btnSubmit: HTMLButtonElement;
    @Output('onSubmit') onSubmit = new EventEmitter();

    private formElement: any;
    private submitted: boolean = false;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {

        //console.debug('[form.directive] loaded');

        let form = this.el.nativeElement;

        this.formElement = form;
        this.formElement.fg = this.fg;

        this.fg.valueChanges.subscribe((data) => {

            let values = Object.values(data);

            values = values.filter(v => v !== null);

            if (this.submitted && values.length == 0) {
                
                this.submitted = false;

                for (let key in this.fg.controls) {
                    this.clearInputErrors(key);
                }
            }

        });

        for (let key in this.fg.controls) {

            this.fg.controls[key].valueChanges.subscribe(() => {
                if (this.submitted) this.validateInput(key);
            });
        }
    }

    ngAfterViewInit() {

        if (this.btnSubmit) {

            this.renderer.listen(this.btnSubmit, 'click', () => {
                this.onSubmitTry();
            });
        }
    }

    private onSubmitTry() {

        this.submitted = true;

        if (this.fg.valid) {
            this.onSubmit.emit();

        } else {

            for (let key in this.fg.controls) {
                this.validateInput(key);
            }
        }
    }

    private validateInput(key: string) {

        let fc = this.fg.controls[key];

        let errors = getErrors(fc);

        this.clearInputErrors(key);

        if (errors.length > 0) {
            this.showInputErrors(key, errors);
        }
    }

    private clearInputErrors(key: string) {

        let group = this.formElement.querySelector(`app-form-group[data-for="${key}"]`);

        if (!group) return;

        this.renderer.removeClass(group, 'error');

        var errorsWrapper = group.querySelector('.errors-wrapper');

        var parent = errorsWrapper || group;

        var errorsList = parent.querySelector('ul.errors');

        if (errorsList) {
            this.renderer.removeChild(parent, errorsList);
        }
    }

    private showInputErrors(key: string, errors: string[]) {

        let group = this.formElement.querySelector(`app-form-group[data-for="${key}"]`);

        if (!group) return;
        
        var ul = this.renderer.createElement('ul');
        
        this.renderer.addClass(group, 'error');
        this.renderer.addClass(ul, 'errors');

        errors.forEach(error => {

            var li = this.renderer.createElement('li');

            this.renderer.appendChild(li, this.renderer.createText(error));

            this.renderer.appendChild(ul, li);

        });

        var errorsWrapper = group.querySelector('.errors-wrapper');

        this.renderer.appendChild(errorsWrapper || group, ul);
    }
}
