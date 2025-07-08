/**
 * @jest-environment node
 */

/**
 * Tests for FileFinder class
 */
import {
  FileFinder,
  createFileFinder,
  findAllFiles,
} from '../src/core/FileFinder';
import { FileInfo, FindFilesOptions } from '../src/types';

// Types for mock DOM elements
interface MockElement {
  getAttribute(attr: string): string | null;
}

interface MockGlobal {
  document: MockDocument | null;
}

// Interface to access private methods for testing
interface FileFinderWithPrivateMethods {
  extractFileName(url: string): string;
}

// Mock DOM environment
class MockDocument {
  private elements: { [key: string]: MockElement[] } = {};

  querySelectorAll(selector: string): MockElement[] {
    console.log('Mock querySelectorAll:', selector);
    return this.elements[selector] || [];
  }

  setElements(selector: string, elements: MockElement[]): void {
    this.elements[selector] = elements;
  }

  clear(): void {
    this.elements = {};
  }
}

// Mock global document
const mockDocument = new MockDocument();
(global as unknown as MockGlobal).document = mockDocument;

describe('FileFinder', () => {
  beforeAll(() => {
    (global as unknown as MockGlobal).document = mockDocument;
  });
  beforeEach(() => {
    mockDocument.clear();
  });

  describe('Constructor', () => {
    it('should create instance with default options', () => {
      const finder = new FileFinder();
      expect(finder).toBeInstanceOf(FileFinder);
    });

    it('should create instance with custom options', () => {
      const options: FindFilesOptions = {
        includeImages: false,
        includeCSS: true,
        includeJS: false,
        includeOther: true,
      };
      const finder = new FileFinder(options);
      expect(finder).toBeInstanceOf(FileFinder);
    });
  });

  describe('findFiles', () => {
    it('should return empty array when no files are found', async () => {
      const finder = new FileFinder();
      const files = await finder.findFiles();
      expect(files).toEqual([]);
    });

    it('should throw error when document is undefined', async () => {
      const originalDocument = (global as unknown as MockGlobal).document;
      (global as unknown as MockGlobal).document = null;
      console.log((global as unknown as MockGlobal).document);

      const finder = new FileFinder();
      await expect(finder.findFiles()).rejects.toThrow(
        'This function can only be used in a browser environment'
      );

      (global as unknown as MockGlobal).document = originalDocument;
    });

    it('should find all types of files when all options are enabled', async () => {
      // Mock CSS files
      mockDocument.setElements('link[rel="stylesheet"]', [
        {
          getAttribute: (attr: string) =>
            attr === 'href' ? 'styles.css' : null,
        },
      ]);

      // Mock JS files
      mockDocument.setElements('script[src]', [
        {
          getAttribute: (attr: string) => (attr === 'src' ? 'script.js' : null),
        },
      ]);

      // Mock image files
      mockDocument.setElements('img[src]', [
        {
          getAttribute: (attr: string) => (attr === 'src' ? 'image.png' : null),
        },
      ]);

      const finder = new FileFinder();
      const files = await finder.findFiles();

      expect(files).toHaveLength(3);
      expect(files).toContainEqual({
        name: 'styles.css',
        type: 'css',
        src: 'styles.css',
      });
      expect(files).toContainEqual({
        name: 'script.js',
        type: 'js',
        src: 'script.js',
      });
      expect(files).toContainEqual({
        name: 'image.png',
        type: 'image',
        src: 'image.png',
      });
    });
  });

  describe('findCSSFiles', () => {
    it('should find CSS files', async () => {
      mockDocument.setElements('link[rel="stylesheet"]', [
        {
          getAttribute: (attr: string) =>
            attr === 'href' ? '/css/main.css' : null,
        },
        {
          getAttribute: (attr: string) =>
            attr === 'href' ? 'https://cdn.example.com/bootstrap.css' : null,
        },
      ]);

      const finder = new FileFinder({ includeJS: false, includeImages: false });
      const files = await finder.findFiles();

      expect(files).toHaveLength(2);
      expect(files[0]).toEqual({
        name: 'main.css',
        type: 'css',
        src: '/css/main.css',
      });
      expect(files[1]).toEqual({
        name: 'bootstrap.css',
        type: 'css',
        src: 'https://cdn.example.com/bootstrap.css',
      });
    });

    it('should ignore CSS files when includeCSS is false', async () => {
      mockDocument.setElements('link[rel="stylesheet"]', [
        {
          getAttribute: (attr: string) =>
            attr === 'href' ? 'styles.css' : null,
        },
      ]);

      const finder = new FileFinder({ includeCSS: false });
      const files = await finder.findFiles();

      expect(files).not.toContainEqual(
        expect.objectContaining({ type: 'css' })
      );
    });
  });

  describe('findJSFiles', () => {
    it('should find JavaScript files', async () => {
      mockDocument.setElements('script[src]', [
        {
          getAttribute: (attr: string) =>
            attr === 'src' ? '/js/app.js' : null,
        },
        {
          getAttribute: (attr: string) =>
            attr === 'src' ? 'https://cdn.example.com/jquery.min.js' : null,
        },
      ]);

      const finder = new FileFinder({
        includeCSS: false,
        includeImages: false,
      });
      const files = await finder.findFiles();

      expect(files).toHaveLength(2);
      expect(files[0]).toEqual({
        name: 'app.js',
        type: 'js',
        src: '/js/app.js',
      });
      expect(files[1]).toEqual({
        name: 'jquery.min.js',
        type: 'js',
        src: 'https://cdn.example.com/jquery.min.js',
      });
    });

    it('should ignore JS files when includeJS is false', async () => {
      mockDocument.setElements('script[src]', [
        {
          getAttribute: (attr: string) => (attr === 'src' ? 'script.js' : null),
        },
      ]);

      const finder = new FileFinder({ includeJS: false });
      const files = await finder.findFiles();

      expect(files).not.toContainEqual(expect.objectContaining({ type: 'js' }));
    });
  });

  describe('findImageFiles', () => {
    it('should find image files', async () => {
      mockDocument.setElements('img[src]', [
        {
          getAttribute: (attr: string) =>
            attr === 'src' ? '/images/logo.png' : null,
        },
        {
          getAttribute: (attr: string) =>
            attr === 'src' ? 'https://cdn.example.com/banner.jpg' : null,
        },
      ]);

      const finder = new FileFinder({ includeCSS: false, includeJS: false });
      const files = await finder.findFiles();

      expect(files).toHaveLength(2);
      expect(files[0]).toEqual({
        name: 'logo.png',
        type: 'image',
        src: '/images/logo.png',
      });
      expect(files[1]).toEqual({
        name: 'banner.jpg',
        type: 'image',
        src: 'https://cdn.example.com/banner.jpg',
      });
    });

    it('should ignore image files when includeImages is false', async () => {
      mockDocument.setElements('img[src]', [
        {
          getAttribute: (attr: string) => (attr === 'src' ? 'image.png' : null),
        },
      ]);

      const finder = new FileFinder({ includeImages: false });
      const files = await finder.findFiles();

      expect(files).not.toContainEqual(
        expect.objectContaining({ type: 'image' })
      );
    });
  });

  describe('extractFileName', () => {
    it('should extract file name from URL', () => {
      const finder = new FileFinder();
      const finderWithPrivates = finder as unknown as FileFinderWithPrivateMethods;

      // Test private method through type assertion
      expect(finderWithPrivates.extractFileName('/path/to/file.js')).toBe(
        'file.js'
      );
      expect(
        finderWithPrivates.extractFileName('https://example.com/assets/style.css')
      ).toBe('style.css');
      expect(finderWithPrivates.extractFileName('image.png')).toBe('image.png');
      expect(finderWithPrivates.extractFileName('/')).toBe('');
    });
  });

  describe('filterByType', () => {
    it('should filter files by type', () => {
      const finder = new FileFinder();
      const files: FileInfo[] = [
        { name: 'style.css', type: 'css', src: 'style.css' },
        { name: 'script.js', type: 'js', src: 'script.js' },
        { name: 'image.png', type: 'image', src: 'image.png' },
      ];

      const cssFiles = finder.filterByType(files, 'css');
      expect(cssFiles).toHaveLength(1);
      expect(cssFiles[0].type).toBe('css');

      const jsFiles = finder.filterByType(files, 'js');
      expect(jsFiles).toHaveLength(1);
      expect(jsFiles[0].type).toBe('js');

      const imageFiles = finder.filterByType(files, 'image');
      expect(imageFiles).toHaveLength(1);
      expect(imageFiles[0].type).toBe('image');
    });
  });

  describe('countFiles', () => {
    it('should count files correctly', () => {
      const finder = new FileFinder();
      const files: FileInfo[] = [
        { name: 'file1.css', type: 'css', src: 'file1.css' },
        { name: 'file2.js', type: 'js', src: 'file2.js' },
        { name: 'file3.png', type: 'image', src: 'file3.png' },
      ];

      expect(finder.countFiles(files)).toBe(3);
      expect(finder.countFiles([])).toBe(0);
    });
  });

  describe('groupByType', () => {
    it('should group files by type', () => {
      const finder = new FileFinder();
      const files: FileInfo[] = [
        { name: 'style1.css', type: 'css', src: 'style1.css' },
        { name: 'style2.css', type: 'css', src: 'style2.css' },
        { name: 'script.js', type: 'js', src: 'script.js' },
        { name: 'image.png', type: 'image', src: 'image.png' },
      ];

      const grouped = finder.groupByType(files);

      expect(grouped.css).toHaveLength(2);
      expect(grouped.js).toHaveLength(1);
      expect(grouped.image).toHaveLength(1);
      expect(grouped.css[0].name).toBe('style1.css');
      expect(grouped.css[1].name).toBe('style2.css');
    });

    it('should handle empty array', () => {
      const finder = new FileFinder();
      const grouped = finder.groupByType([]);
      expect(grouped).toEqual({});
    });
  });

  describe('Utility functions', () => {
    describe('createFileFinder', () => {
      it('should create a FileFinder instance', () => {
        const finder = createFileFinder();
        expect(finder).toBeInstanceOf(FileFinder);
      });

      it('should create a FileFinder instance with options', () => {
        const options: FindFilesOptions = { includeImages: false };
        const finder = createFileFinder(options);
        expect(finder).toBeInstanceOf(FileFinder);
      });
    });

    describe('findAllFiles', () => {
      it('should find all files using utility function', async () => {
        mockDocument.setElements('link[rel="stylesheet"]', [
          {
            getAttribute: (attr: string) =>
              attr === 'href' ? 'test.css' : null,
          },
        ]);

        const files = await findAllFiles();
        expect(files).toHaveLength(1);
        expect(files[0]).toEqual({
          name: 'test.css',
          type: 'css',
          src: 'test.css',
        });
      });

      it('should find all files with custom options', async () => {
        mockDocument.setElements('link[rel="stylesheet"]', [
          {
            getAttribute: (attr: string) =>
              attr === 'href' ? 'test.css' : null,
          },
        ]);

        const files = await findAllFiles({ includeCSS: false });
        expect(files).toHaveLength(0);
      });
    });
  });
});
