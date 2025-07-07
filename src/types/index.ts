/**
 * Interface to represent a file found
 */
export interface FileInfo {
  name: string;
  type: 'css' | 'js' | 'image' | 'other';
  src: string;
  size?: number;
}

/**
 * Options for file search
 */
export interface FindFilesOptions {
  includeImages?: boolean;
  includeCSS?: boolean;
  includeJS?: boolean;
  includeOther?: boolean;
}