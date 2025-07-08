export { FileFinder } from './core/FileFinder';
export { createFileFinder, findAllFiles } from './core/FileFinder';
export type { FileInfo, FindFilesOptions } from './types';

// Widget functions - SIMPLE API
export { initFindingFiles, destroyFindingFiles, isFindingFilesInitialized } from './init';

// Widget classes for advanced usage
export { SimpleFileWidget } from './widget/SimpleWidget';
