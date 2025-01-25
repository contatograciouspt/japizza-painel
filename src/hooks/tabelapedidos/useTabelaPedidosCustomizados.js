import { useState } from "react";

export default function useTabelaPedidosCustomizados() {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Função para abrir o modal de endereço
    const handleOpenAddressModal = (address) => {
        setSelectedAddress(address);
        setIsAddressModalOpen(true);
    };

    //Funcao para fechar o modal de endereco
    const handleCloseAddressModal = () => {
        setIsAddressModalOpen(false);
    };

    // Função para abrir o modal de cliente
    const handleOpenClientModal = (client) => {
        setSelectedClient(client);
        setIsClientModalOpen(true);
    };

    //Funcao para fechar o modal de cliente
    const handleCloseClientModal = () => {
        setIsClientModalOpen(false);
    };

    // Função para abrir o modal do pedido
    const handleOpenOrderModal = (order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    //Funcao para fechar o modal do pedido
    const handleCloseOrderModal = () => {
        setIsOrderModalOpen(false);
    };


    // Função para determinar a classe CSS do status
    const getStatusColor = (status) => {
        switch (status) {
            case "Pago":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"; // Azul para "Pago"
            case "Pendente":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"; // Amarelo para "Pendente"
            case "Cancelado":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"; // Vermelho para "Cancelado"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
        }
    };

    // converter data para formato dd/mm/aaaa
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    //Funcao para formatar o valor em EURO
    const formatEuro = (amount) => {
        const formattedAmount = new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
        }).format(amount / 100); // Divide por 100 para converter centavos para euros
        return formattedAmount;
    };

    return {
        isAddressModalOpen,
        selectedAddress,
        handleOpenAddressModal,
        handleCloseAddressModal,
        isClientModalOpen,
        selectedClient,
        formatEuro,
        getStatusColor,
        formatDate,
        handleOpenClientModal,
        handleCloseClientModal,
        isOrderModalOpen,
        selectedOrder,
        handleOpenOrderModal,
        handleCloseOrderModal
    };
}