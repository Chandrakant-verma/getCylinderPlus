import { createContext, useState, useContext } from 'react';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [ captain, setCaptain ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ orders, setOrders] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [deliveryStage, setDeliveryStage] = useState("orders");

    const updateCaptain = (captainData) => {
        setCaptain(captainData);
    };

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateCaptain,
        orders,
        setOrders,
        currentOrder,
        setCurrentOrder,
        deliveryStage,
        setDeliveryStage
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;