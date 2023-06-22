import { Injectable } from '@angular/core';

import Echo from 'laravel-echo';
import * as Pusher from 'pusher-js';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

	private Echo: Echo;
	private Pusher: any;

    constructor(
	) {

		this.Pusher = Pusher;

		this.Echo = new Echo(environment.echo);
	
		console.log('echo?', this.Echo);
	}

	public channel(channel: string) {

		return this.Echo.channel(channel);
	}
}
