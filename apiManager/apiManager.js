import ENDPOINTS from "./EndPoints.js";
import APIMethods from "./apiMethods.js";

class ApiManager {
    static getAllOrders = () => {
        return APIMethods.get(ENDPOINTS.ORDERS());
    }

    static getSpecificOrder = (id) => {
        return APIMethods.get(ENDPOINTS.SPECIFIC_ORDER(id));
    }

    static getOrdersFrom = (date) => {
        return APIMethods.get(ENDPOINTS.ORDERS_FROM(date));
    }

    static newOrder = (data) => {
        return APIMethods.put(ENDPOINTS.ORDERS(), data);
    }

    static updateOrderStatus = (id, data) => {
        return APIMethods.patch(ENDPOINTS.SPECIFIC_ORDER(id), data);
    }

    static deleteOrder = (id) => {
        return APIMethods.delete(ENDPOINTS.SPECIFIC_ORDER(id));
    }

    static getCustomerAddress = (customer_id) => {
        return APIMethods.get(ENDPOINTS.ADDRESS(customer_id));
    }

    static events = () => {
        return APIMethods.events();
    }
}
export default ApiManager;