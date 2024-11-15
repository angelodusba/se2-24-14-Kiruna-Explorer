import  {Type} from '../models/Type';
import { Point } from './Document';
import { StakeHolder } from './StakeHolders';

export interface Filter {
    params: {
        title: string | undefined;
        type: Type | undefined;
        stakeholders: StakeHolder[] | undefined;
        startDate: string | undefined;
        endDate: string | undefined;
        description: string | undefined;
        scale: string | undefined;
        location: Point | undefined;
        radius: number | undefined;
        language: string | undefined;
        minPages: number | undefined;
        maxPages: number | undefined;
    }
}

