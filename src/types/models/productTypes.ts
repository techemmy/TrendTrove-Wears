export interface ProductAttributes {
    id?: number;
    name: string;
    price: string;
    category: string;
    size?: string;
    sizes?: string[];
    color?: string;
    shortDescription: string;
    longDescription?: string;
    available: boolean;
    imageURL: string;
}
