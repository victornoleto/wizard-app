import { ElementRef } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

export function getErrors(fc: AbstractControl): string[] {

	let errors: string[] = [];

	if (!fc.errors) {
		return errors;
	}

	let keys = Object.keys(fc.errors);

	let def: any = {
		required: 'Este campo é obrigatório',
		email: 'O valor deste campo deve ser um e-mail válido',
		cpf: 'O valor deste campo deve ser um CPF válido',
		cnpj: 'O valor deste campo deve ser um CNPJ válido',
		plate: 'O valor deste campo deve ser uma placa válida',
		date: 'O valor deste campo deve ser uma data válida',
		phone: 'O valor deste campo deve ser um telefone válido',
		zipcode: 'O valor deste campo deve ser um código postal válido',
		letters_and_spaces: 'O valor deste campo deve conter apenas letras e espaços',
		alphanumeric: 'O valor deste campo deve conter apenas letras e números'
	};

	for (let key of keys) {

		if (!fc.errors[key]) {
			continue;
		}

		let message = 'O campo apresenta o seguinte erro: ' + key;

		if (fc.errors[key] !== true) {

			if (typeof fc.errors[key] === 'string') {
				message = fc.errors[key];

			} else {

				if (key == 'minlength' || key == 'maxlength') {
                    message = `O campo precisa ter um valor ${key == 'minlength' ? 'mínimo' : 'máximo'} de ` + fc.errors[key].requiredLength + ' caracteres';
				
				} else if (key == 'min' || key == 'max') {
                    message = `O valor ${key == 'min' ? 'mínimo' : 'máximo'} para esse campo é ` + fc.errors[key][key];
				}
			}
			
		} else if (def[key]) {
			message = def[key];
		}

		errors.push(message);
	}

	return errors;
}

export function getControl(input: ElementRef, name: string): FormControl|null {

	let form = input.nativeElement.closest('form');
	
	let fg = form.fg;

	if (!fg) {
		return null;
	}

	return fg.get(name);
}