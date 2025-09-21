import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth.service';
import {
    FormValidationDirective,
    InputPasswordDirective,
    LoadingDirective,
} from '@app/shared/directives';
import { AlertService } from '@app/shared/services/alert.service';
import { ToastService } from '@app/shared/services/toast.service';
import { getErrorMessage } from '@app/shared/utils/http.utils';
import { az09_ } from '@app/shared/utils/map.utils';
import { LoginRequest } from '../../models/auth.model';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        FormValidationDirective,
        LoadingDirective,
        InputPasswordDirective,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    protected readonly fb = inject(FormBuilder);

    protected readonly router = inject(Router);

    protected readonly toastService = inject(ToastService);

    protected readonly authService = inject(AuthService);

    protected readonly alertService = inject(AlertService);

    readonly form = this.fb.group({
        username: ['', [Validators.required]],
        password: ['password', [Validators.required, Validators.minLength(6)]],
    });

    isLoading = signal<boolean>(false);
    formSubmitted = signal<boolean>(false);

    ngOnInit(): void {
        this.form.get('username')?.valueChanges.subscribe(() => {
            const value = this.form.get('username')?.value || '';

            const sanitizedValue = az09_(value);

            if (value !== sanitizedValue) {
                this.form.get('username')?.setValue(sanitizedValue, {
                    emitEvent: false,
                });
            }
        });
    }

    submit(): void {
        this.formSubmitted.set(true);

        if (this.form.invalid) {
            return;
        }

        const credentials: LoginRequest = {
            email: this.form.value.username || '',
            password: this.form.value.password || '',
        };

        this.isLoading.set(true);

        this.authService
            .login(credentials)
            .subscribe({
                next: () => {
                    this.router.navigate(['/games']);
                },
                error: (error) => {
                    this.toastService.error(getErrorMessage(error));
                },
            })
            .add(() => {
                this.isLoading.set(false);
            });
    }
}
