import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { getControl } from '../form-utils';

@Component({
    selector: 'app-form-checkbox',
    templateUrl: './form-checkbox.component.html',
    styleUrls: ['./form-checkbox.component.scss'],
})
export class FormCheckboxComponent implements OnInit {

    public fc: FormControl|null;
    public id: string;

    private isList: boolean = false;

    @ViewChild('input', { static: true }) input: ElementRef;
    
    @Input('type') type: string = 'checkbox';
    @Input('name') name: string;
    @Input('value') value: string;
    @Input('text') text: string;
    @Input('description') description: string;
    @Input('checked') checked: boolean = false;
    @Input('disableFc') disableFc: boolean = false;
    
    @Output('onChange') onChangeOutput = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
        if (this.disableFc) this.load();
    }

    ngDoCheck() {
        if (!this.disableFc && !this.fc) this.load();
    }

    public onChange(status: boolean) {

        if (this.isList) {
            
            let value = this.fc?.value;

            let index = value.indexOf(this.value);

            if (index > -1) {
                value.splice(index, 1);
            }

            if (status) {
                value.push(this.value);
            }

            this.fc?.setValue(value);

        } else {
            this.fc?.setValue(status ? this.value : '');
        }
    }

    private load() {

        if (this.value === undefined) {
            this.value = "1";
        }

        this.id = this.name + "_" + this.value;

        if (!this.disableFc) {

            this.fc = getControl(this.input, this.name);
    
            if (this.fc) {
    
                let startValue = this.fc.value;
                
                this.isList = Array.isArray(startValue);

                if (this.isList) this.type = 'checkbox';
        
                this.fc.valueChanges.subscribe(value => {
                    this.updatedCheckedStatus();
                });
        
                this.updatedCheckedStatus();
            }
        }
    }

    private updatedCheckedStatus() {
        
        if (this.isList) {
            this.checked = this.fc?.value.indexOf(this.value) > -1;
        
        } else {
            this.checked = this.fc?.value == this.value;
        }
    }
}
