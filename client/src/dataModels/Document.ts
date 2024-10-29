export class Document {
    title: string;
    description: string;
    stakeholder: string[];
    type: string;
    paper: string|ArrayBuffer|null; // base64 encoded file
    coordinates: {
        lat: number;
        long: number;
    };

    constructor(
        title: string,
        description: string,
        stakeholder: string[],
        type: string,
        paper: string,
        coordinates: { lat: number; long: number }
    ) {
        this.title = title;
        this.description = description;
        this.stakeholder = stakeholder;
        this.type = type;
        this.paper = paper;
        this.coordinates = coordinates;
    }
}