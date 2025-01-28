import React from "react";

export default function useTabelaPedidosCustomizados() {
    const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false)
    const [selectedAddress, setSelectedAddress] = React.useState("")
    const [isClientModalOpen, setIsClientModalOpen] = React.useState(false)
    const [selectedClient, setSelectedClient] = React.useState(null)
    const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false)
    const [orders, setOrders] = React.useState([])
    const [selectedOrder, setSelectedOrder] = React.useState({
        amount: 0,
        _id: "",
        cart: [],
        createdAt: "",
        dynamicDescriptor: "",
        customerTrns: "",
        discount: 0,
        invoice: 0,
        total: 0,
        status: "",
        orderCode: 0,
        user_info: {
            address: "",
            contact: "",
            email: "",
            name: "",
        }
    });

    // Função para abrir o modal de endereço
    const handleOpenAddressModal = (address) => {
        setSelectedAddress(address);
        setIsAddressModalOpen(true);
    };

    //Função para fechar o modal de endereço
    const handleCloseAddressModal = () => {
        setIsAddressModalOpen(false);
    };

    // Função para abrir o modal de cliente
    const handleOpenClientModal = (client) => {
        setSelectedClient(client);
        setIsClientModalOpen(true);
    };

    //Função para fechar o modal de cliente
    const handleCloseClientModal = () => {
        setIsClientModalOpen(false);
    };

    // Função para abrir o modal do pedido
    const handleOpenOrderModal = (order) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    //Função para fechar o modal do pedido
    const handleCloseOrderModal = () => {
        setIsOrderModalOpen(false);
    };

    // Função para carregar pedidos do localStorage
    const loadOrdersFromLocalStorage = () => {
        const storedOrders = localStorage.getItem('japizzaOrders');
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

    //Função para formatar o valor em EURO
    const formatEuro = (amount) => {
        const formattedAmount = new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
        }).format(amount / 100); // Divide por 100 para converter centavos para euros
        return formattedAmount;
    };

    // Carregar pedidos do localStorage ao iniciar o componente
    React.useEffect(() => {
        const loadedOrders = loadOrdersFromLocalStorage();
        setOrders(loadedOrders);
    }, []);

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
        handleCloseOrderModal,
        orders
    };
}
