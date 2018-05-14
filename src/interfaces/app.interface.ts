import { Tag } from './bacnet.interface';

export interface ReaderOptions {
    optional?: boolean;
    silent?: boolean;
    tag?: Tag;
}
