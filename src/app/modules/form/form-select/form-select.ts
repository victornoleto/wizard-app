import { Component, Input, OnInit} from "@angular/core";

import { FormInput } from "../form-input/form-input";

@Component({
	template: ''
})
export class FormSelect extends FormInput implements OnInit {

	// Dados
	@Input('list') list: any[] = [];
	@Input('nameAttr') nameAttr: string = 'name';
	@Input('valueAttr') valueAttr: string = 'id';
	
	ngOnInit(): void {
		
		if (!this.placeholder) {
			this.placeholder = 'Selecione uma opção';
		}
	}

	public override postOnFormControlValueChanges() {
	}
}