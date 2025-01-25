import axios from "axios";
import React from "react";

export default function useVivaWallet() {
    const [allOrders, setAllOrders] = React.useState([]);
    const urlDevelopment = import.meta.env.VITE_APP_URL_PAYMENT;
    const localStorageKey = "japizzaOrders";
    const lastUpdateKey = "japizzaLastUpdate";

    console.log("Pedidos :", allOrders);

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

            let shouldFetchAll = timeSinceLastUpdate > twentyFourHours; // Verifica se deve buscar todos os pedidos
            let localStorageOrders = loadOrdersFromLocalStorage();

            setAllOrders(localStorageOrders);

            if (shouldFetchAll) {
                const response = await axios.get(urlDevelopment);

                if (response.data && Array.isArray(response.data)) {
                    setAllOrders(response.data);
                    saveOrdersToLocalStorage(response.data);
                    saveLastUpdateDate()
                }
            } else {
                const response = await axios.get(urlDevelopment);

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

    return {
        allOrders,
        getAllOrders,
        removeOrderFromLocalStorage, // Adicione esta linha para expor a função de remoção
    };
}