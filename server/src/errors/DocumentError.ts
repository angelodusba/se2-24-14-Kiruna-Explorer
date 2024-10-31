export class DocumentError extends Error {
    constructor(message: string, originalError?: any) {
        super(message);
        this.name = 'DocumentError';
        if (originalError) {
            console.error('Original Error:', originalError);
        }
    }
}
