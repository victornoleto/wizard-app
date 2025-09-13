import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnInit,
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
import { ToastService } from '@app/shared/services/toast.service';
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
export class RegisterComponent implements OnInit {
    @ViewChild('alertContainer') alertContainerRef!: ElementRef<HTMLDivElement>;

    protected readonly toastService = inject(ToastService);

    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly alertService = inject(AlertService);
    private readonly router = inject(Router);

    readonly form = this.fb.group(
        {
            username: ['', [Validators.required, Validators.minLength(3)]],
            //email: ['', [Validators.required, Validators.email]],
            password: [
                'password',
                [Validators.required, Validators.minLength(8)],
            ],
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

    ngOnInit(): void {
        this.form.get('username')?.valueChanges.subscribe(() => {
            const value = this.form.get('username')?.value || '';

            // regex only a-z0-9 and _
            const sanitizedValue = value
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, '')
                .replace(/__+/g, '_')
                .replace(/^_+|_+$/g, '');

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
                /* this.alertService.show({
                    message: getErrorMessage(error),
                    title: 'Não foi possível realizar o cadastro',
                    type: 'error',
                    container: this.alertContainerRef,
                }); */

                this.toastService.error(getErrorMessage(error));

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
