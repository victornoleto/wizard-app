import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-auth-blank',
    imports: [RouterOutlet],
    templateUrl: './auth-blank.component.html',
    styleUrl: './auth-blank.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthBlankComponent {}
