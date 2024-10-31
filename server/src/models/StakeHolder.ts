class StakeHolder {
    id: number;   // Define the type of `id`
    name: string; // Define the type of `name`

    constructor(id: number, name: string) { // Add types for parameters
        this.id = id;
        this.name = name;
    }
}

export { StakeHolder };
