class Document {
    id?: number;
    title: string;
    description: string;
    type_id: number;
    issue_date: Date;
    scale: string;
    location: string;
    language?: string;
    pages?: string;

    constructor(
        id: number,
        title: string,
        description: string,
        type_id: number,
        issue_date: Date,
        scale: string,
        location: string,
        language: string,
        pages: string
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type_id = type_id;
        this.issue_date = issue_date;
        this.scale = scale;
        this.location = location;
        this.language = language;
        this.pages = pages;
    }
}

export { Document };
