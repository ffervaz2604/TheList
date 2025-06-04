import { NgModule } from '@angular/core';
import {
    TranslocoModule,
    TRANSLOCO_CONFIG,
    TRANSLOCO_LOADER,
    TRANSLOCO_TRANSPILER,
    TranslocoConfig,
    TranslocoLoader,
    DefaultTranspiler
} from '@ngneat/transloco';
import { of } from 'rxjs';

class FakeTranslocoLoader implements TranslocoLoader {
    getTranslation(lang: string) {
        return of({});
    }
}

const translocoConfig = {
    availableLangs: ['es'],
    defaultLang: 'es',
    fallbackLang: 'es',
    reRenderOnLangChange: true,
    prodMode: true
};

@NgModule({
    exports: [TranslocoModule],
    providers: [
        {
            provide: TRANSLOCO_CONFIG,
            useValue: translocoConfig
        },
        {
            provide: TRANSLOCO_LOADER,
            useClass: FakeTranslocoLoader
        },
        {
            provide: TRANSLOCO_TRANSPILER,
            useClass: DefaultTranspiler
        }
    ]
})
export class TranslocoTestingModule { }
