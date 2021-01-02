export interface Dated {
    dateCreated: number;
    dateUpdated: number;
}

export interface Unique {
    id: string;
}

export interface Owned {
    userId: string;
}