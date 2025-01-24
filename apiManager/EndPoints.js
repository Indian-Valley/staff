const ENDPOINTS = {
    ORDERS: () => '/orders',
    SPECIFIC_ORDER: (id) => `/orders/${id}`,
    ORDERS_FROM: (date) => `/orders/from/${date}`,
    ADDRESS: (id)=> `/addresses/${id}`,

    EVENTS: () => '/events/staff',
}

export default ENDPOINTS;