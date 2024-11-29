import { TrackedProduct } from "./tracked-product.model";

export type Consumption = {
    quantity: number;
    date: Date;
    tracked_product: TrackedProduct;
}

// indexed type
export type ConsumptionsListByTrackedProductId = {
    [key: number]: Consumption[];
}


