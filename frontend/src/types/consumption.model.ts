export type Consumption = {
    quantity: number;
    date: Date;
    product: string;
}

// indexed type
export type ConsumptionsListByProductId = {
    [key: number]: Consumption[];
}


