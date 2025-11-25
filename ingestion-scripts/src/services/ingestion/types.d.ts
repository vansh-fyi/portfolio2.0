export interface Document {
    content: string;
    metadata: Record<string, any>;
}
export interface IngestionSource {
    name: string;
    fetchDocuments(): Promise<Document[]>;
}
