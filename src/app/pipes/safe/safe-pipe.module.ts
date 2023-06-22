import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';

let exports = [
	SafePipe
];

@NgModule({
	exports,
	declarations: exports,
	imports: [
		CommonModule
	]
})
export class SafePipeModule { }
