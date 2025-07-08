import { SimpleFileWidget } from './widget/SimpleWidget';

// Auto-initialisation quand le DOM est prêt
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SimpleFileWidget();
        });
    } else {
        // DOM déjà prêt
        new SimpleFileWidget();
    }
}

export { SimpleFileWidget }; 