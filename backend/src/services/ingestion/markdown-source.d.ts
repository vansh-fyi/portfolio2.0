import { IngestionSource, Document } from './types';
export declare class MarkdownSource implements IngestionSource {
    name: string;
    private contentDir;
    constructor(contentDir: string);
    fetchDocuments(): Promise<Document[]>;
}
