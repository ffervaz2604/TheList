import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { TranslocoTestingModule } from '../../../testing/transloco-testing.module';

describe('WelcomeComponent', () => {
    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                WelcomeComponent,
                RouterTestingModule,
                TranslocoTestingModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería contener el botón para ver listas', () => {
        const button = fixture.debugElement.query(By.css('button[routerLink="/dashboard/lists"]'));
        expect(button).toBeTruthy();
    });
});
