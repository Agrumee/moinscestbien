import { TrackedProduct } from "./tracked-product.model";

export type Consumption = {
    quantity: number;
    date: Date;
    trackedProduct: TrackedProduct;
}

// indexed type
export type ConsumptionsListByProductId = {
    [key: number]: Consumption[];
}


