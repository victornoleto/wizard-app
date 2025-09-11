import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    NavigationError,
    ResolveEnd,
    ResolveStart,
    Router,
    RouterOutlet,
} from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import { filter } from 'rxjs';
import { LoadingDirective } from './shared/directives';
import { LoadingService } from './shared/services/loading.service';
import { ToastService } from './shared/services/toast.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoadingDirective],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    protected readonly loadingService = inject(LoadingService);
    protected readonly toastService = inject(ToastService);

    constructor() {
        this.setupRouterEvents();
    }

    private setupRouterEvents(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof ResolveStart),
                takeUntilDestroyed(),
            )
            .subscribe(() => {
                this.loadingService.show();
            });

        this.router.events
            .pipe(
                filter((event) => event instanceof ResolveEnd),
                takeUntilDestroyed(),
            )
            .subscribe(() => {
                this.loadingService.dismiss();
            });

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationError),
                takeUntilDestroyed(),
            )
            .subscribe((event) => {
                const navigationErrorEvent = event as NavigationError;
                this.toastService.error(navigationErrorEvent.error.message);
                this.loadingService.dismiss();
            });
    }
}
