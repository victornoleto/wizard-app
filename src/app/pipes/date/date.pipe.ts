import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import "moment/locale/pt-br";

@Pipe({
	name: 'appDate'
})
export class DatePipe implements PipeTransform {
	
	transform(value: string, ...args: string[]): unknown {

        try {

			let baseFormat: string = 'DD MMM HH:mm';
			let format: string = args && args[0] ? args[0] : baseFormat;

			let date = moment(value);

			let dateFormatted: string = "";

			if (format == 'relative') {

				let today = moment();

				if (date.isSame(today, 'day')) {
					dateFormatted = date.format('HH:mm');
					
				} else {
					dateFormatted = date.format(baseFormat);
				}

			} else {
				dateFormatted = date.format(format);
			}

			return dateFormatted;

		} catch (exception) {

			console.error("Não foi possível aplicar o pipe", exception);

			return value;
		}
    }
}
