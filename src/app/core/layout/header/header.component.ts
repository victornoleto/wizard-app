import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    output,
} from '@angular/core';
import { HeaderContentService } from './header-content.service';
import { BtnToggleSidebarComponent } from './partials/btn-toggle-sidebar/btn-toggle-sidebar.component';

@Component({
    selector: 'app-header',
    imports: [BtnToggleSidebarComponent, NgTemplateOutlet],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    public sidebarToggled = input<boolean>(false);
    protected readonly headerContentService = inject(HeaderContentService);

    public toggleSidebarState = output<void>();
    public setSidebarState = output<boolean>();

    protected onToggleSidebarState(): void {
        this.toggleSidebarState.emit();
    }

    protected onSetSidebarState(state: boolean): void {
        this.setSidebarState.emit(state);
    }
}
