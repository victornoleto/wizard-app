import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal,
    TemplateRef,
    viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingComponent } from '@app/shared/components/loading/loading.component';
import { FormValidationDirective } from '@app/shared/directives';
import { ToastService } from '@app/shared/services/toast.service';
import { getErrorMessage } from '@app/shared/utils/http.utils';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GameStoreRequest } from '../../games.model';
import { GamesService } from '../../games.service';

@Component({
    selector: 'app-game-create-modal',
    imports: [ReactiveFormsModule, FormValidationDirective, LoadingComponent],
    templateUrl: './game-create-modal.component.html',
    styleUrl: './game-create-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCreateModalComponent {
    protected readonly fb = inject(FormBuilder);

    protected readonly modalService = inject(NgbModal);

    protected readonly toastService = inject(ToastService);

    protected readonly gamesService = inject(GamesService);

    protected readonly content =
        viewChild<TemplateRef<HTMLDivElement>>('content');

    protected readonly modalRef = signal<NgbModalRef | null>(null);

    protected readonly formSubmitted = signal(false);

    protected readonly isLoading = signal(false);

    protected readonly form = this.fb.group({
        start_match: this.fb.control<number>(1, {
            validators: [
                Validators.required,
                Validators.min(1),
                Validators.max(20),
            ],
        }),
        max_matches: this.fb.control<number>(20, {
            validators: [
                Validators.required,
                Validators.min(3),
                Validators.max(20),
            ],
        }),
    });

    open(): void {
        const modal = this.modalService.open(this.content(), {
            scrollable: true,
        });

        this.modalRef.set(modal);

        modal.hidden.subscribe(() => {
            console.debug('Modal hidden');
        });

        modal.result.then(
            () => void 0,
            () => void 0,
        );
    }

    cancel(): void {
        this.formSubmitted.set(false);
        this.form.reset({
            start_match: 1,
            max_matches: 20,
        });
        this.modalRef()?.close();
    }

    submit(): void {
        this.isLoading.set(true);

        this.formSubmitted.set(true);

        if (!this.form.valid) {
            return;
        }

        const data = this.form.value as GameStoreRequest;

        this.gamesService
            .store(data)
            .subscribe({
                next: (response) => {
                    this.toastService.success(response.message);
                    this.cancel();
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
