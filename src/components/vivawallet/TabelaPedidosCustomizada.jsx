import React from "react";
import { FaUserAlt } from "react-icons/fa";
import NotFound from "../table/NotFound";
import useVivaWallet from "@/hooks/vivawallet/useVivaWallet";
import { BsFillHouseAddFill } from "react-icons/bs";
import { FaShoppingCart, FaTrash } from "react-icons/fa" // Importe o ícone de lixeira
import useTabelaPedidosCustomizados from "@/hooks/tabelapedidos/useTabelaPedidosCustomizados";
import { Table, TableCell, TableContainer, TableBody, TableHeader, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";

export default function TabelaPedidosCustomizada() {
    const { allOrders, getAllOrders, removeOrderFromLocalStorage } = useVivaWallet(); // Adicionando a função de exclusão
    const {
        isAddressModalOpen,
        isClientModalOpen,
        selectedAddress,
        selectedClient,
        formatDate,
        formatEuro,
        getStatusColor,
        handleCloseAddressModal,
        handleCloseClientModal,
        handleOpenAddressModal,
        handleOpenClientModal,
        handleOpenOrderModal,
        handleCloseOrderModal,
        selectedOrder,
        isOrderModalOpen
    } = useTabelaPedidosCustomizados();

    React.useEffect(() => {
        getAllOrders();
    }, []);

    // Função para lidar com a exclusão do pedido
    const handleRemoveOrder = (orderId) => {
        removeOrderFromLocalStorage(orderId)
    }


    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <div className="p-4">
                {allOrders && allOrders.length > 0 ? (
                    <TableContainer className="mb-8">
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableCell>Pedidos</TableCell>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Loja</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Endereço</TableCell>
                                    <TableCell>Excluir</TableCell>
                                    <TableCell>Status</TableCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {allOrders.map((order) => (
                                    <tr key={order._id}>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleOpenOrderModal(order)}
                                                icon={FaShoppingCart}
                                                aria-label="Order Details"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                        <TableCell>{order.dynamicDescriptor}</TableCell>
                                        <TableCell>{formatEuro(order.amount)}</TableCell>
                                        <TableCell>
                                            <Button
                                                icon={FaUserAlt}
                                                aria-label="Client Details"
                                                size="small"
                                                onClick={() =>
                                                    handleOpenClientModal({
                                                        fullName: order.fullName,
                                                        email: order.email,
                                                        phone: order.phone,
                                                    })
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleOpenAddressModal(order.customerTrns)}
                                                icon={BsFillHouseAddFill} // ícone do endereço
                                                aria-label="Address Details" // TableCell para exibir o endereço
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleRemoveOrder(order._id)} // Chama a função de remoção com o ID do pedido
                                                icon={FaTrash} // Usa o ícone de lixeira
                                                aria-label="Delete Order"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </TableCell>
                                    </tr>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <div className="flex justify-center items-center">
                        <NotFound title="Desculpe, não há pedidos no momento." />
                    </div>
                )}
            </div>
            <Modal isOpen={isAddressModalOpen} onClose={handleCloseAddressModal}>
                <ModalHeader>Detalhes do Endereço</ModalHeader>
                <ModalBody>
                    <p>{selectedAddress}</p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleCloseAddressModal}>Fechar</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isClientModalOpen} onClose={handleCloseClientModal}>
                <ModalHeader>Detalhes do Cliente</ModalHeader>
                <ModalBody>
                    {selectedClient && (
                        <>
                            <p><strong>Nome:</strong> {selectedClient.fullName}</p>
                            <p><strong>Email:</strong> {selectedClient.email}</p>
                            <p><strong>Telefone:</strong> {selectedClient.phone}</p>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleCloseClientModal}>Fechar</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal}>
                <ModalHeader>Detalhes do Pedido</ModalHeader>
                <ModalBody>
                    {selectedOrder && (
                        <>
                            <p><strong>N° do Pedido:</strong> {selectedOrder.invoice}</p>
                            <p><strong>Produtos:</strong> {selectedOrder.merchantTrns.split("-").join(", ")}</p>
                            <p><strong>Quantidade:</strong> {selectedOrder.merchantTrns.split("-").length}</p>
                            <p><strong>Loja:</strong> {selectedOrder.dynamicDescriptor}</p>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleCloseOrderModal}>Fechar</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}