import { Component, input } from '@angular/core';

@Component({
    selector: 'app-btn-toggle-sidebar',
    imports: [],
    templateUrl: './btn-toggle-sidebar.component.html',
    styleUrl: './btn-toggle-sidebar.component.scss',
})
export class BtnToggleSidebarComponent {
    readonly toggled = input.required<boolean>();
}
