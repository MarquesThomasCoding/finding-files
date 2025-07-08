/**
 * Main class to find files used in a page
 */
import { FindFilesOptions, FileInfo } from '../types';

export class FileFinder {
  private options: FindFilesOptions;

  constructor(options: FindFilesOptions = {}) {
    this.options = {
      includeImages: true,
      includeCSS: true,
      includeJS: true,
      includeOther: false,
      ...options,
    };
  }

  /**
   * Finds all files used in the current document
   * @returns Promise<FileInfo[]>
   */
  async findFiles(): Promise<FileInfo[]> {
    const files: FileInfo[] = [];

    if (typeof document === 'undefined' || !document) {
      throw new Error(
        'This function can only be used in a browser environment'
      );
    }

    // Search for CSS files
    if (this.options.includeCSS) {
      files.push(...this.findCSSFiles());
    }

    // Search for JavaScript files
    if (this.options.includeJS) {
      files.push(...this.findJSFiles());
    }

    // Search for images
    if (this.options.includeImages) {
      files.push(...this.findImageFiles());
    }

    return files;
  }

  /**
   * Finds CSS files
   */
  private findCSSFiles(): FileInfo[] {
    const cssFiles: FileInfo[] = [];
    const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
    console.log(linkElements);

    linkElements.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        cssFiles.push({
          name: this.extractFileName(href),
          type: 'css',
          src: href,
        });
      }
    });

    return cssFiles;
  }

  /**
   * Finds JavaScript files
   */
  private findJSFiles(): FileInfo[] {
    const jsFiles: FileInfo[] = [];
    const scriptElements = document.querySelectorAll('script[src]');

    scriptElements.forEach(script => {
      const src = script.getAttribute('src');
      if (src) {
        jsFiles.push({
          name: this.extractFileName(src),
          type: 'js',
          src: src,
        });
      }
    });

    return jsFiles;
  }

  /**
   * Finds image files
   */
  private findImageFiles(): FileInfo[] {
    const imageFiles: FileInfo[] = [];
    const imgElements = document.querySelectorAll('img[src]');

    imgElements.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        imageFiles.push({
          name: this.extractFileName(src),
          type: 'image',
          src: src,
        });
      }
    });

    return imageFiles;
  }

  /**
   * Extracts the file name from a URL
   */
  private extractFileName(url: string): string {
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName || '';
  }

  /**
   * Filters files by type
   */
  filterByType(files: FileInfo[], type: FileInfo['type']): FileInfo[] {
    return files.filter(file => file.type === type);
  }

  /**
   * Counts the total number of files
   */
  countFiles(files: FileInfo[]): number {
    return files.length;
  }

  /**
   * Groups files by type
   */
  groupByType(files: FileInfo[]): Record<string, FileInfo[]> {
    return files.reduce(
      (acc, file) => {
        if (!acc[file.type]) {
          acc[file.type] = [];
        }
        acc[file.type].push(file);
        return acc;
      },
      {} as Record<string, FileInfo[]>
    );
  }
}

/**
 * Utility function to create a FileFinder instance
 */
export function createFileFinder(options?: FindFilesOptions): FileFinder {
  return new FileFinder(options);
}

/**
 * Utility function to quickly find all files
 */
export async function findAllFiles(
  options?: FindFilesOptions
): Promise<FileInfo[]> {
  const finder = createFileFinder(options);
  return finder.findFiles();
}
