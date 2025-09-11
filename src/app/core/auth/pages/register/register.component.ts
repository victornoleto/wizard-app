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
import { RegisterRequest } from '@app/core/auth/models/auth.model';
import { AuthService } from '@app/core/auth/services/auth.service';
import {
    FormValidationDirective,
    InputPasswordDirective,
    LoadingDirective,
} from '@app/shared/directives';
import { AlertService } from '@app/shared/services/alert.service';
import { getErrorMessage } from '@app/shared/utils/http.utils';
import { equalsToValidator } from '@app/shared/validators';

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
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            password_confirmation: ['', [Validators.required]],
        },
        {
            validators: [
                equalsToValidator({
                    aField: 'password_confirmation',
                    bField: 'password',
                    label: 'Senha',
                }),
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

        const data: RegisterRequest = {
            name: this.form.value.name || '',
            email: this.form.value.email || '',
            password: this.form.value.password || '',
            password_confirmation: this.form.value.password_confirmation || '',
        };

        this.authService
            .register(data)
            .subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.alertService.show({
                        message: getErrorMessage(error),
                        title: 'Não foi possível realizar o cadastro',
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
