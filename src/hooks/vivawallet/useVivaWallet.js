import axios from "axios";
import React from "react";

export default function useVivaWallet() {
    const getOrders = import.meta.env.VITE_APP_URL_ORDERS;
    const updateOrder = import.meta.env.VITE_APP_URL_UPDATE_ORDER;
    const deleteOrder = import.meta.env.VITE_APP_URL_DELETE_ORDER;
    const localStorageKey = "japizzaOrders";
    const lastUpdateKey = "japizzaLastUpdate";
    const [allOrders, setAllOrders] = React.useState({
        amount: 0,
        cart: [{
            title: "",
            quantity: 0,
            price: 0,
        }],
        discount: 0,
        createdAt: "",
        shippingCost: 0,
        subTotal: 0,
        total: 0,
        merchantTrns: "",
        user_info: {
            address: "",
            city: "",
            contact: "",
            country: "",
            email: "",
            name: "",
            zipCode: "",
        },
        createdAt: "",
        _id: "",
    });

    // Função para salvar os pedidos no localStorage
    const saveOrdersToLocalStorage = (orders) => {
        localStorage.setItem(localStorageKey, JSON.stringify(orders));
    };

    // Função para salvar a data da última atualização no localStorage
    const saveLastUpdateDate = () => {
        localStorage.setItem(lastUpdateKey, new Date().toISOString());
    };

    // Função para carregar os pedidos do localStorage
    const loadOrdersFromLocalStorage = () => {
        const storedOrders = localStorage.getItem(localStorageKey);
        if (storedOrders) {
            try {
                return JSON.parse(storedOrders);
            } catch (e) {
                console.log("Error parsing stored orders:", e);
                return [];
            }
        }
        return [];
    };

    // Função para obter a data da última atualização do localStorage
    const getLastUpdateDate = () => {
        const storedDate = localStorage.getItem(lastUpdateKey);
        return storedDate ? new Date(storedDate) : null;
    };

    // Função para remover um pedido pelo ID do localStorage
    const removeOrderFromLocalStorage = (orderId) => {
        const storedOrders = loadOrdersFromLocalStorage();
        if (storedOrders) {
            const updatedOrders = storedOrders.filter((order) => order._id !== orderId);
            saveOrdersToLocalStorage(updatedOrders);
            setAllOrders(updatedOrders);
        }
    };

    const getAllOrders = async () => {
        try {
            const lastUpdate = getLastUpdateDate();
            const now = new Date();
            const timeSinceLastUpdate = lastUpdate ? now - lastUpdate : Infinity;
            const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            let shouldFetchAll = timeSinceLastUpdate > twentyFourHours;
            let localStorageOrders = loadOrdersFromLocalStorage();

            setAllOrders(localStorageOrders);

            if (shouldFetchAll) {
                const response = await axios.get(getOrders);

                if (response.data && Array.isArray(response.data)) {
                    setAllOrders(response.data);
                    saveOrdersToLocalStorage(response.data);
                    saveLastUpdateDate()
                }
            } else {
                const response = await axios.get(getOrders);

                if (response.data && Array.isArray(response.data)) {
                    let newOrders = [];

                    if (localStorageOrders && localStorageOrders.length > 0) {
                        //Verifica qual o pedido mais recente salvo
                        const lastStoredOrderDate = new Date(Math.max(...localStorageOrders.map(order => new Date(order.createdAt))));

                        // Filtra os novos pedidos que tem o `createdAt` maior que o último pedido salvo localmente
                        newOrders = response.data.filter(order => new Date(order.createdAt) > lastStoredOrderDate);
                    } else {
                        newOrders = response.data;
                    }

                    const updatedOrders = [...localStorageOrders, ...newOrders]
                    setAllOrders(updatedOrders);
                    saveOrdersToLocalStorage(updatedOrders);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteOrderByID = async (id) => {
        try {
            const response = await axios.delete(`${deleteOrder}/${id}`);
            if (response.status === 200) {
                console.log("Pedido deletado com sucesso");
                removeOrderFromLocalStorage(id);
            } else {
                console.log("Erro ao deletar pedido");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateStatusOrderByID = async (id, newStatus) => {
        try {
            const response = await axios.put(`${updateOrder}/${id}`, { status: newStatus });
            if (response.status === 200) {
                console.log("Status do pedido atualizado com sucesso");
                // Atualiza o status no estado local
                setAllOrders(prevOrders => prevOrders.map(order => order._id === id ? { ...order, status: newStatus } : order));
            } else {
                console.log("Erro ao atualizar status do pedido");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return {
        allOrders,
        getAllOrders,
        setAllOrders,
        removeOrderFromLocalStorage,
        deleteOrderByID,
        updateStatusOrderByID
    };
}