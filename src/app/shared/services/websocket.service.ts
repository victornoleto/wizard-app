import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { env } from '@env';
import Echo from 'laravel-echo';
import Pusher, { Channel, ChannelAuthorizationCallback } from 'pusher-js';
import { DeprecatedChannelAuthorizer } from 'pusher-js/types/src/core/auth/deprecated_channel_authorizer';
import { ChannelAuthorizationData } from 'pusher-js/types/src/core/auth/options';
import { getErrorMessage } from '../utils/http.utils';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    protected readonly Pusher: typeof Pusher;
    protected readonly Echo: Echo<'reverb'>;

    readonly http = inject(HttpClient);

    constructor() {
        this.Pusher = Pusher;

        const settings = env.echo as Echo<'reverb'>['options'];

        settings.authorizer = (
            channel: Channel,
            //options: DeprecatedAuthorizerOptions,
        ): DeprecatedChannelAuthorizer => {
            return {
                authorize: (
                    socketId: string,
                    callback: ChannelAuthorizationCallback,
                ): void => {
                    const data = {
                        socket_id: socketId,
                        channel_name: channel.name,
                    };
                    this.http
                        .post<ChannelAuthorizationData>(
                            env.url + '/api/broadcasting/auth',
                            data,
                        )
                        .subscribe({
                            next: (response: ChannelAuthorizationData) => {
                                callback(null, response);
                            },
                            error: (error: HttpErrorResponse) => {
                                callback(
                                    {
                                        message: getErrorMessage(error),
                                    } as Error,
                                    null,
                                );
                            },
                        });
                },
            };
        };

        this.Echo = new Echo(settings);
    }

    public channel(channel: string) {
        return this.Echo.channel(channel);
    }

    public privateChannel(channel: string) {
        return this.Echo.private(channel);
    }
}
