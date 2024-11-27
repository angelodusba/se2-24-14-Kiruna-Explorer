import Coordinates from "./coordinates";

class Area{
    id: number;
    name: string;
    location: Coordinates[];


    constructor(
        id: number,
        name: string,
        location: Coordinates[]
    ){
        this.id=id;
        this.name=name;
        this.location=location;
    }

}

export default Area;

