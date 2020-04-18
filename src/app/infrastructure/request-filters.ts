import { LogicalOperator } from './logical-operator';
import { Filter } from './filter';

export interface RequestFilters{
    operator: LogicalOperator;
    filters: Filter[];
}