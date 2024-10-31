export class Document {
    title: string;
    description: string;
    stakeholder: string[];
    type: string;
    pages: string;
    coordinates: {
        lat: number;
        long: number;
    };
    issueDate: string

    constructor(
        title: string,
        description: string,
        stakeholder: string[],
        type: string,
        pages: string,
        coordinates: { lat: number; long: number },
        issueDate: string
    ) {
        this.title = title;
        this.description = description;
        this.stakeholder = stakeholder;
        this.type = type;
        this.pages = pages;
        this.coordinates = coordinates;
        this.issueDate = issueDate
    }
}