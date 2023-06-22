import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'ucfirst'
})
export class UcfirstPipe implements PipeTransform {
	
	transform(value: string, ...args: unknown[]): unknown {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}
}
