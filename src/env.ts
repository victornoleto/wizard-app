import Echo from 'laravel-echo';

export interface Env {
    production: boolean;
    clientId: string;
    clientSecret: string;
    url: string;
    echo: Echo<'reverb'>['options'];
}

export const env: Env = {
    production: false,
    clientId: 'cfc597a8-ecdc-4124-a09c-dd7754b97e61',
    clientSecret: 'wizard-oauth-secret',
    url: 'https://wizard.local',
    echo: {
        broadcaster: 'reverb',
        key: 'wizardappkey',
        wsHost: 'wizard.local',
        wsPort: 80,
        wssPort: 443,
        forceTls: true,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
    },
};
