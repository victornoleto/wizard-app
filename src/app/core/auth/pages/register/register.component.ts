import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
    LoginRequest,
    RegisterRequest,
} from '@app/core/auth/models/auth.model';
import { AuthService } from '@app/core/auth/services/auth.service';
import {
    FormValidationDirective,
    InputPasswordDirective,
    LoadingDirective,
} from '@app/shared/directives';
import { AlertService } from '@app/shared/services/alert.service';
import { getErrorMessage } from '@app/shared/utils/http.utils';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        LoadingDirective,
        FormValidationDirective,
        InputPasswordDirective,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
    @ViewChild('alertContainer') alertContainerRef!: ElementRef<HTMLDivElement>;

    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly alertService = inject(AlertService);
    private readonly router = inject(Router);

    readonly form = this.fb.group(
        {
            username: ['', [Validators.required, Validators.minLength(3)]],
            //email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            //password_confirmation: ['', [Validators.required]],
        },
        {
            validators: [
                /* equalsToValidator({
                    aField: 'password_confirmation',
                    bField: 'password',
                    label: 'Senha',
                }), */
            ],
        },
    );

    protected readonly isLoading = signal(false);
    protected readonly formSubmitted = signal(false);

    submit(): void {
        this.formSubmitted.set(true);

        if (this.form.invalid) {
            return;
        }

        this.isLoading.set(true);

        const data = this.form.value as RegisterRequest;

        this.authService.register(data).subscribe({
            next: () => {
                const loginData: LoginRequest = {
                    email: data.username,
                    password: data.password,
                };

                this.login(loginData);
            },
            error: (error) => {
                this.alertService.show({
                    message: getErrorMessage(error),
                    title: 'Não foi possível realizar o cadastro',
                    type: 'error',
                    container: this.alertContainerRef,
                });

                this.isLoading.set(false);
            },
        });
    }

    login(credentials: LoginRequest): void {
        this.authService
            .login(credentials)
            .subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.alertService.show({
                        message: getErrorMessage(error),
                        title: 'Não foi possível realizar o login',
                        type: 'error',
                        container: this.alertContainerRef,
                    });
                },
            })
            .add(() => {
                this.isLoading.set(false);
            });
    }
}
