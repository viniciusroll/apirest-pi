export interface Order {
    order_id: number;
    client_id: number;
    date: string;
    payment: number;
    created_at: string
}

export interface OrderItem {
    order_id: number;
    product_id: number;
    quantity: number;
}