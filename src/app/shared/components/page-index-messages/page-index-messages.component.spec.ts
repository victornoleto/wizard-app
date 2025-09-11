import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIndexMessagesComponent } from './page-index-messages.component';

describe('PageIndexMessagesComponent', () => {
    let component: PageIndexMessagesComponent;
    let fixture: ComponentFixture<PageIndexMessagesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageIndexMessagesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PageIndexMessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
