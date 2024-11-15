import  {Type} from '../models/Type';
import { Point } from './Document';
import { StakeHolder } from './StakeHolders';

export interface Filter {
    params: {
        title: string;
        type: Type;
        stakeholders: StakeHolder[];
        startDate: string;
        endDate: string;
        description: string;
        scale: string;
        location: Point;
        radius: number;
        language: string;
        minPages: number;
        maxPages: number;
    }
}

