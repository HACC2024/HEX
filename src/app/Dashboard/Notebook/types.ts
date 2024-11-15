export interface NotepadConfig {
    placeholder?: string;
    height?: string;
    width?: string;
    readonly?: boolean;
    buttons?: string[];
    theme?: 'light' | 'dark';
    toolbarButtons?: string[];
    initialContent?: string;
    autosave?: boolean;
    spellcheck?: boolean;
  }
  
export interface NotepadProps extends NotepadConfig {
    onSave?: (content: string) => void | Promise<void>;
    onExport?: (format: 'pdf' | 'doc' | 'txt') => void | Promise<void>;
    className?: string;
}