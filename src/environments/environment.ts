const host = '192.168.1.21';
const port = '8000';
const url = 'http://' + host + ':' + port;

export const environment = {
	production: false,
	url: url + '/api',
	api: {
		id: '1',
		secret: '42HKbk4cACFjOnSiN9TXRVw3Z5awqgkc0mfNzUn1',
	},
	redirects: {
		auth: 'games',
		guest: 'login'
	},
	echo: {
		broadcaster: 'pusher',
		key: 'myappkey',
		cluster: 'mt1',
		wsHost: '192.168.1.21',
		wsPort: 6001,
		wssPort: 6001,
		forceTLS: false,
		disableStats: true,
		enabledTransports: ['ws', 'wss']
	}
};