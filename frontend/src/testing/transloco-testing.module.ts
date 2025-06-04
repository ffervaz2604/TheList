import { NgModule } from '@angular/core';
import {
    TranslocoModule,
    TRANSLOCO_CONFIG,
    TRANSLOCO_LOADER,
    TRANSLOCO_TRANSPILER,
    TRANSLOCO_MISSING_HANDLER,
    TRANSLOCO_INTERCEPTOR,
    TRANSLOCO_FALLBACK_STRATEGY,
    TranslocoConfig,
    TranslocoLoader,
    TranslocoMissingHandler,
    TranslocoFallbackStrategy,
    DefaultTranspiler
} from '@ngneat/transloco';
import { of } from 'rxjs';

class FakeTranslocoLoader implements TranslocoLoader {
    getTranslation(lang: string) {
        return of({
            dashboard: {
                welcome: {
                    title: 'Welcome!',
                    description: 'This is a test',
                    cta: 'Create your first list'
                }
            },
            lists: {
                archived_lists: 'Archived Lists',
                loading: 'Loading...',
                empty: {
                    title: 'No lists found',
                    subtitle: 'Start by creating your first one'
                },
                buttons: {
                    unarchive: 'Unarchive'
                }
            },
            'shared-lists': {
                product_unit: 'product',
                product_plural: 'products'
            }
        });
    }
}

class CustomMissingHandler implements TranslocoMissingHandler {
    handle(key: string) {
        return key;
    }
}

class CustomFallbackStrategy implements TranslocoFallbackStrategy {
    getNextLangs() {
        return ['en'];
    }
}

const translocoConfig: TranslocoConfig = {
    availableLangs: ['es', 'en'],
    defaultLang: 'es',
    fallbackLang: 'en',
    reRenderOnLangChange: true,
    prodMode: true,
    flatten: { aot: false },
    interpolation: ['{{', '}}'],
    failedRetries: 0,
    missingHandler: {
        logMissingKey: false,
        allowEmpty: true,
        useFallbackTranslation: false
    }
};

@NgModule({
    exports: [TranslocoModule],
    providers: [
        { provide: TRANSLOCO_CONFIG, useValue: translocoConfig },
        { provide: TRANSLOCO_LOADER, useClass: FakeTranslocoLoader },
        { provide: TRANSLOCO_TRANSPILER, useClass: DefaultTranspiler },
        { provide: TRANSLOCO_MISSING_HANDLER, useClass: CustomMissingHandler },
        { provide: TRANSLOCO_INTERCEPTOR, useValue: { preSaveTranslation: () => { } } },
        { provide: TRANSLOCO_FALLBACK_STRATEGY, useClass: CustomFallbackStrategy }
    ]
})
export class TranslocoTestingModule { }
