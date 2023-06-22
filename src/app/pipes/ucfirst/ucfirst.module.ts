import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UcfirstPipe } from './ucfirst.pipe';

let exports = [
	UcfirstPipe
];

@NgModule({
	exports,
	declarations: exports,
	imports: [
		CommonModule
	]
})
export class UcfirstPipeModule { }
