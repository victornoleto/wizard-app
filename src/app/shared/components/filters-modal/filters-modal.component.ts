import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
    signal,
    TemplateRef,
    viewChild,
} from '@angular/core';
import {
    NgbModal,
    NgbModalOptions,
    NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-filters-modal',
    imports: [],
    templateUrl: './filters-modal.component.html',
    styleUrl: './filters-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersModalComponent {
    private readonly modalService = inject(NgbModal);

    protected readonly content =
        viewChild<TemplateRef<HTMLDivElement>>('content');
    protected readonly modalRef = signal<NgbModalRef | null>(null);
    protected readonly canceled = signal(false);

    readonly modalOptions = input<NgbModalOptions>();

    readonly clear = output<void>();
    readonly cancel = output<void>();
    readonly submit = output<void>();

    open(): void {
        this.canceled.set(false);

        const modal = this.modalService.open(this.content(), {
            //ariaLabelledBy: 'modal-basic-title',
            //backdrop: 'static',
            //keyboard: false,
            scrollable: true,
            ...this.modalOptions(),
        });

        this.modalRef.set(modal);

        modal.hidden.subscribe(() => {
            if (this.canceled()) {
                this.cancel.emit();
            }
        });

        modal.result.then(
            () => void 0,
            () => {
                this.canceled.set(true);
            },
        );
    }

    close(): void {
        const currentModal = this.modalRef();

        if (!currentModal) {
            return;
        }

        currentModal.close();
        this.modalRef.set(null);
    }

    protected onCancel(): void {
        this.canceled.set(true);
        this.close();
    }
}
