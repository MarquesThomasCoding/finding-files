import { SimpleFileWidget } from './widget/SimpleWidget';

// Instance globale du widget
let widgetInstance: SimpleFileWidget | null = null;

/**
 * Initialise le widget Finding Files
 * Cette fonction lance automatiquement l'analyse et l'affichage des fichiers
 */
export function initFindingFiles(): void {
  // Éviter les doublons
  if (widgetInstance) {
    console.warn('Finding Files widget is already initialized');
    return;
  }

  // Vérifier l'environnement navigateur
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.error(
      'Finding Files widget can only be used in a browser environment'
    );
    return;
  }

  // Initialiser le widget quand le DOM est prêt
  const initialize = (): void => {
    try {
      widgetInstance = new SimpleFileWidget();
      // eslint-disable-next-line no-console
      console.log('Finding Files widget initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Finding Files widget:', error);
    }
  };

  // Lancer l'initialisation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

/**
 * Détruit le widget Finding Files
 */
export function destroyFindingFiles(): void {
  if (widgetInstance) {
    widgetInstance.destroy();
    widgetInstance = null;
    // eslint-disable-next-line no-console
    console.log('Finding Files widget destroyed');
  }
}

/**
 * Vérifie si le widget est initialisé
 */
export function isFindingFilesInitialized(): boolean {
  return widgetInstance !== null;
}

// Export de la classe pour utilisation avancée
export { SimpleFileWidget } from './widget/SimpleWidget';
export { FileFinder } from './core/FileFinder';
export * from './types';
