import React, {createContext, useState} from "react";

export const OrderDataContext = createContext();

const OrderContext = ({ children }) => {

    const [order, setOrder] = useState([]);

    return (
        <OrderDataContext.Provider value={{ order, setOrder }}>
            {children}
        </OrderDataContext.Provider>
    );
};

export default OrderContext;