import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
} from '@angular/core';

@Component({
    selector: 'app-section',
    templateUrl: './section.component.html',
    styleUrl: './section.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent {
    opened = model<boolean>(true);

    className = input<string>();

    toggle(): void {
        this.opened.set(!this.opened());
    }
}
