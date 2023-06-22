import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';

let exports = [
	DatePipe
];

@NgModule({
	exports,
	declarations: exports,
	imports: [
		CommonModule
	]
})
export class DatePipeModule { }
