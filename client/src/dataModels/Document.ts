export class Document {
    title: string;
    description: string;
    stakeholder: string[];
    type: number;
    pages: number;
    coordinates: {
        lat: number;
        long: number;
    };
    issueDate: string;
    scale: string;
    language:string;

    constructor(
        title: string,
        description: string,
        stakeholder: string[],
        type: number,
        pages: number,
        coordinates: { lat: number; long: number },
        issueDate: string,
        scale: string,
        language: string,
    ) {
        this.title = title;
        this.description = description;
        this.stakeholder = stakeholder;
        this.type = type;
        this.pages = pages;
        this.coordinates = coordinates;
        this.issueDate = issueDate;
        this.scale = scale;
        this.language = language;
    }
}