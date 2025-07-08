import { FileFinder } from '../core/FileFinder';
import { FileInfo } from '../types';

export class SimpleFileWidget {
  private fileFinder: FileFinder;
  private widgetElement: HTMLElement | null = null;

  constructor() {
    this.fileFinder = new FileFinder();
    this.createWidget();
    this.scanAndDisplay();
  }

  private createWidget(): void {
    // Créer le widget
    this.widgetElement = document.createElement('div');
    this.widgetElement.id = 'simple-file-widget';
    this.widgetElement.innerHTML = `
            <div class="widget-header">
                📁 Fichiers utilisés
            </div>
            <div class="widget-content" id="fileContent">
                <div class="loading">Analyse en cours...</div>
            </div>
        `;

    // Injecter les styles
    this.injectStyles();

    // Ajouter au DOM
    document.body.appendChild(this.widgetElement);
  }

  private async scanAndDisplay(): Promise<void> {
    try {
      const files = await this.fileFinder.findFiles();
      this.displayFiles(files);
    } catch {
      this.showError("Erreur lors de l'analyse");
    }
  }

  private displayFiles(files: FileInfo[]): void {
    if (!this.widgetElement) return;

    const contentEl = this.widgetElement.querySelector(
      '#fileContent'
    ) as HTMLElement;

    if (files.length === 0) {
      contentEl.innerHTML = '<div class="empty">Aucun fichier trouvé</div>';
      return;
    }

    // Grouper par type
    const grouped = this.fileFinder.groupByType(files);
    let html = `<div class="file-count">${files.length} fichier(s)</div>`;

    // CSS
    if (grouped.css?.length > 0) {
      html += `<div class="file-group">
                <div class="group-title">🎨 CSS (${grouped.css.length})</div>
                ${grouped.css.map(file => `<div class="file-item">${file.name}</div>`).join('')}
            </div>`;
    }

    // JS
    if (grouped.js?.length > 0) {
      html += `<div class="file-group">
                <div class="group-title">⚡ JS (${grouped.js.length})</div>
                ${grouped.js.map(file => `<div class="file-item">${file.name}</div>`).join('')}
            </div>`;
    }

    // Images
    if (grouped.image?.length > 0) {
      html += `<div class="file-group">
                <div class="group-title">🖼️ Images (${grouped.image.length})</div>
                ${grouped.image.map(file => `<div class="file-item">${file.name}</div>`).join('')}
            </div>`;
    }

    contentEl.innerHTML = html;
  }

  private showError(message: string): void {
    if (!this.widgetElement) return;

    const contentEl = this.widgetElement.querySelector(
      '#fileContent'
    ) as HTMLElement;
    contentEl.innerHTML = `<div class="error">${message}</div>`;
  }

  private injectStyles(): void {
    if (document.getElementById('simple-file-widget-styles')) return;

    const style = document.createElement('style');
    style.id = 'simple-file-widget-styles';
    style.textContent = `
            #simple-file-widget {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                max-height: 400px;
                background: white;
                border: 2px solid #333;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                z-index: 999999;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                overflow: hidden;
            }

            .widget-header {
                background: #333;
                color: white;
                padding: 8px 12px;
                font-weight: bold;
                text-align: center;
            }

            .widget-content {
                padding: 12px;
                max-height: 350px;
                overflow-y: auto;
            }

            .file-count {
                text-align: center;
                font-weight: bold;
                margin-bottom: 10px;
                color: #666;
            }

            .file-group {
                margin-bottom: 12px;
            }

            .group-title {
                font-weight: bold;
                margin-bottom: 4px;
                color: #333;
                border-bottom: 1px solid #eee;
                padding-bottom: 2px;
            }

            .file-item {
                padding: 2px 8px;
                background: #f5f5f5;
                margin: 2px 0;
                border-radius: 3px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .loading, .error, .empty {
                text-align: center;
                padding: 20px;
                color: #666;
            }

            .error {
                color: #d32f2f;
            }
        `;

    document.head.appendChild(style);
  }

  public destroy(): void {
    if (this.widgetElement) {
      this.widgetElement.remove();
      this.widgetElement = null;
    }
  }
}
