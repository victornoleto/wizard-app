import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { getControl } from "../form-utils";

@Component({
	template: ''
})
export class FormInput {

	public fc: FormControl|null;
	public value: string = '';

	@ViewChild('input', { static: true }) input: ElementRef;

	@Input('name') name: string;
	@Input('label') label: string; 
	@Input('description') description: string = '';
	@Input('disabled') disabled: boolean = false;
	@Input('required') required: boolean = false;
	@Input('placeholder') placeholder: string;

	ngDoCheck() {
		this.load();
	}

	public onChange(value: string) {
		this.fc?.setValue(value);
	}

	private load() {

		if (this.fc) return;
		
		this.fc = getControl(this.input, this.name);

		if (this.fc) {

			//console.debug('[form-input.ts] "' + this.name + '" form control loaded!');
		
			if (this.fc.value) {
				this.value = this.fc.value;
			}
		
			this.fc.valueChanges.subscribe(value => {
				this.value = value;
				this.postOnFormControlValueChanges();
			});
		}
	}

	public postOnFormControlValueChanges() {
	}
}