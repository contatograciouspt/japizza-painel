import React from "react";
import { FaUserAlt } from "react-icons/fa";
import NotFound from "../table/NotFound";
import useVivaWallet from "@/hooks/vivawallet/useVivaWallet";
import { BsFillHouseAddFill } from "react-icons/bs";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import useTabelaPedidosCustomizados from "@/hooks/tabelapedidos/useTabelaPedidosCustomizados";
import { Table, TableCell, TableContainer, TableBody, TableHeader, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui";

export default function TabelaPedidosCustomizada() {
    const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
    const [selectedStatusOrder, setSelectedStatusOrder] = React.useState(null);
    const [newStatus, setNewStatus] = React.useState("");
    const { getAllOrders, removeOrderFromLocalStorage, updateStatusOrderByID } = useVivaWallet();
    const {
        isOrderModalOpen,
        selectedOrder,
        handleOpenOrderModal,
        handleCloseOrderModal,
        formatDate,
        formatEuro,
        orders,
        getStatusColor
    } = useTabelaPedidosCustomizados();

    React.useEffect(() => {
        getAllOrders();
    }, []);

    const handleRemoveOrder = (orderId) => {
        removeOrderFromLocalStorage(orderId);
    };

    const handleOpenStatusModal = (order) => {
        setSelectedStatusOrder(order);
        setNewStatus(order.status);
        setIsStatusModalOpen(true);
    };

    const handleCloseStatusModal = () => {
        setIsStatusModalOpen(false);
    };

    const handleUpdateStatus = async () => {
        if (selectedStatusOrder && newStatus) {
            await updateStatusOrderByID(selectedStatusOrder._id, newStatus);
            handleCloseStatusModal();
        }
    };

    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <div className="p-4">
                {orders && orders.length > 0 ? (
                    <TableContainer className="mb-8">
                        <Table>
                            <TableHeader>
                                <tr>
                                    <TableCell>Pedidos</TableCell>
                                    <TableCell>Excluir</TableCell>
                                    <TableCell>Status</TableCell>
                                </tr>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleOpenOrderModal(order)}
                                                icon={FaShoppingCart}
                                                aria-label="Order Details"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleRemoveOrder(order._id)}
                                                icon={FaTrash}
                                                aria-label="Delete Order"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleOpenStatusModal(order)}
                                                className={`border rounded px-2 py-1 text-sm ${getStatusColor(order.status)}`}
                                                size="small"
                                            >
                                                {order.status}
                                            </Button>
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
            <Modal isOpen={isStatusModalOpen} onClose={handleCloseStatusModal}>
                <ModalHeader>Alterar Status do Pedido</ModalHeader>
                <ModalBody>
                    <div className="mb-4">
                        <label htmlFor="orderStatus" className="block text-gray-700 text-sm font-bold mb-2">
                            Novo Status:
                        </label>
                        <select
                            id="orderStatus"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="Pendente">Pendente</option>
                            <option value="Pago">Pago</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleUpdateStatus} color="green">
                        Confirmar
                    </Button>
                    <Button onClick={handleCloseStatusModal} >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal}>
                <ModalHeader>Detalhes do Pedido</ModalHeader>
                <ModalBody>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Resumo do Pedido</h3>
                                <hr className="mb-2" />
                                <p><strong>Data do Pedido:</strong> {formatDate(selectedOrder.createdAt)}</p>
                                <p><strong>Valor Total:</strong> {formatEuro(selectedOrder.total)}</p>
                                <br />
                                <p>{selectedOrder.dynamicDescriptor}</p>
                                <hr />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Localização</h3>
                                <hr className="mb-2" />
                                <p>{selectedOrder.user_info.address}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Cliente</h3>
                                <hr className="mb-2" />
                                <p><strong>Nome:</strong> {selectedOrder.user_info.name}</p>
                                <p><strong>Email:</strong> {selectedOrder.user_info.email}</p>
                                <p><strong>Contato:</strong> {selectedOrder.user_info.contact}</p>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleCloseOrderModal}>Fechar</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}