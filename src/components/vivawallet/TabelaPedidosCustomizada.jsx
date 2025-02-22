import React from "react"
import NotFound from "../table/NotFound"
import useVivaWallet from "@/hooks/vivawallet/useVivaWallet"
import { FaShoppingCart, FaTrash, FaEdit } from "react-icons/fa"
import useTabelaPedidosCustomizados from "@/hooks/tabelapedidos/useTabelaPedidosCustomizados"
import { FaCheckCircle, FaExclamation, FaTimesCircle } from "react-icons/fa"
import { Table, TableCell, TableContainer, TableBody, TableHeader, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui"
import PaginacaoTabelaCustomizada from "./PaginacaoTabelaCustomizada"

function StatusBadge({ status }) {
    let Icon
    let colorClass

    switch (status) {
        case "Pago":
            Icon = FaCheckCircle
            colorClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            break
        case "Pendente":
            Icon = FaExclamation
            colorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            break
        case "Cancelado":
            Icon = FaTimesCircle
            colorClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            break
        default:
            Icon = null
            colorClass = "bg-gray-400 text-gray-00 dark:text-grays-300"
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
        >
            {Icon && <Icon className="h-3 w-3 mr-1" />}
            {status}
        </span>
    )
}

export default function TabelaPedidosCustomizada() {
    const [currentPage, setCurrentPage] = React.useState(1)
    const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false)
    const [selectedStatusOrder, setSelectedStatusOrder] = React.useState(null)
    const [newStatus, setNewStatus] = React.useState("")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [selectedOrderToDelete, setSelectedOrderToDelete] = React.useState(null)
    const { getAllOrders, removeOrderFromLocalStorage, deleteOrderByID, updateStatusOrderByID } = useVivaWallet()
    const {
        isOrderModalOpen,
        selectedOrder,
        handleOpenOrderModal,
        handleCloseOrderModal,
        formatDate,
        formatEuro,
        orders,
        getStatusColor
    } = useTabelaPedidosCustomizados()

    const itemsPerPage = 20
    const totalPages = Math.ceil(orders.length / itemsPerPage)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const currentOrders = sortedOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    React.useEffect(() => {
        getAllOrders()
    }, [])

    // Atualiza a página atual caso os pedidos sejam alterados e a página atual esteja fora do novo range
    React.useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1)
        }
    }, [orders, currentPage, totalPages])

    // Função para abrir o modal de confirmação de exclusão
    const handleRemoveOrder = (order) => {
        setSelectedOrderToDelete(order)
        setIsDeleteModalOpen(true)
    }

    // Função para fechar o modal de confirmação de exclusão
    const handleCloseDeleteModal = () => {
        setSelectedOrderToDelete(null)
        setIsDeleteModalOpen(false)
    }

    // Função para lidar com a confirmação da exclusão
    const confirmDeleteOrder = async () => {
        if (selectedOrderToDelete) {
            try {
                await deleteOrderByID(selectedOrderToDelete._id)
                removeOrderFromLocalStorage(selectedOrderToDelete._id)
                handleCloseDeleteModal()
                window.location.reload()
            } catch (error) {
                console.error("Erro ao excluir o pedido:", error)
                // Tratamento de erro, se necessário
            }
        }
    }

    // Função para abrir o modal de status
    const handleOpenStatusModal = (order) => {
        setSelectedStatusOrder(order)
        setNewStatus(order.status) // Define o status atual como valor inicial
        setIsStatusModalOpen(true)
    }

    // Função para fechar o modal de status
    const handleCloseStatusModal = () => {
        setIsStatusModalOpen(false)
    }

    // Função para lidar com a atualização do status do pedido
    const handleUpdateStatus = async () => {
        if (selectedStatusOrder && newStatus) {
            await updateStatusOrderByID(selectedStatusOrder._id, newStatus)
            handleCloseStatusModal()
        }
    }

    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <div className="flex-col justify-between items-center mb-4 mt-4">
                {orders && orders.length > 0 ? (
                    <>
                        <TableContainer className="mb-8">
                            <Table>
                                <TableHeader>
                                    <tr>
                                        <TableCell>Pedidos</TableCell>
                                        <TableCell>Data</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </tr>
                                </TableHeader>
                                <TableBody>
                                    {currentOrders.map((order) => (
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
                                            <TableCell>
                                                <StatusBadge status={order.status} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        onClick={() => handleOpenStatusModal(order)}
                                                        className={`bg-gray-500 border rounded px-2 py-1 text-sm ${getStatusColor(order.status)}`}
                                                        size="large"
                                                        aria-label="Edit Order Status"
                                                        icon={FaEdit}
                                                    />
                                                    <Button
                                                        onClick={() => handleRemoveOrder(order)}
                                                        icon={FaTrash}
                                                        aria-label="Delete Order"
                                                        size="small"
                                                    />
                                                </div>
                                            </TableCell>
                                        </tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* Componente de paginação */}
                        {totalPages > 1 && (
                            <PaginacaoTabelaCustomizada
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
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
                        <label htmlFor="orderStatus" className="block text-sm font-bold mb-2">
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
                    <Button onClick={handleCloseStatusModal}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
                <ModalHeader>Confirmar Exclusão</ModalHeader>
                <ModalBody>
                    <p>Tem certeza que deseja excluir este pedido?</p>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={confirmDeleteOrder} color="red">
                        Confirmar
                    </Button>
                    <Button onClick={handleCloseDeleteModal}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal}>
                <ModalHeader>Resumo do Pedido</ModalHeader>
                <ModalBody>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div>
                                <hr className="mb-2" />
                                <p><strong>Hora do Pedido:</strong> {new Date(selectedOrder.createdAt).getHours().toFixed(0)}:{new Date(selectedOrder.createdAt).getMinutes().toFixed(0)}</p>
                                <p><strong>Valor Total:</strong> {formatEuro(selectedOrder.amount)}</p>
                                <p><strong>Custo do Envio:</strong> {selectedOrder.cart[0].shippingCost || "0.00"} €</p>
                                <p><strong>Pagamento na Entrega:</strong> {selectedOrder.pagamentoNaEntrega ? "Sim" : "Não"} </p>
                                {selectedOrder.discount > 0 && (
                                    <p><strong>Desconto:</strong> {formatEuro(selectedOrder.discount)}</p>
                                )}
                            </div>
                            {/* Payment Method Details */}
                            {selectedOrder.paymentMethodDetails && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Detalhes do Pagamento</h3>
                                    <hr className="mb-2" />
                                    <p><strong>Método:</strong> {selectedOrder.paymentMethodDetails.method}</p>
                                    {selectedOrder.paymentMethodDetails.changeFor && (
                                        <p><strong>Troco para:</strong> {selectedOrder.paymentMethodDetails.changeFor}€</p>
                                    )}
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Agendamento</h3>
                                <hr className="mb-2" />
                                <p><strong>Data:</strong> {new Date(selectedOrder.agendamento?.data).toLocaleDateString('pt-PT') || "Sem data agendada"}</p>
                                <p><strong>Hora:</strong> {selectedOrder.agendamento?.horario || "Sem horário agendado"}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
                                <hr className="mb-2" />
                                {selectedOrder.cart && selectedOrder.cart.map((item, i) => (
                                    <div key={i}>
                                        {item.cart && item.cart.map((cartItem, index) => (
                                            <div key={index}>
                                                <p><strong>{cartItem.quantity}</strong> {cartItem.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {/* Location Details */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Localização</h3>
                                <hr className="mb-2" />
                                {selectedOrder.localizacao ? (
                                    <div>
                                        <p><strong>Latitude:</strong> {selectedOrder.localizacao.latitude || "Latitude não informada"}</p>
                                        <p><strong>Longitude:</strong> {selectedOrder.localizacao.longitude || "Longitude não informada"}</p>
                                    </div>
                                ) : (
                                    <div>
                                    <p>Latitude não informada</p>
                                    <p>Longitude não informada</p>
                                </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Informações do Cliente</h3>
                                <hr className="mb-2" />
                                <div>
                                    <p><strong>Nome:</strong> {selectedOrder.cart[0].user_info?.name || "Não informado"}</p>
                                    <p><strong>Email:</strong> {selectedOrder.cart[0].user_info?.email || "Não informado"}</p>
                                    <p><strong>NIF:</strong> {selectedOrder.cart[0].user_info?.nif || "Não informado"}</p>
                                    <p><strong>Contato:</strong> {selectedOrder.cart[0].user_info?.contact || "Não informado"}</p>
                                    <p><strong>Endereço:</strong> {selectedOrder.cart[0].user_info?.address || "Não informado"}</p>
                                    <p><strong>Cidade:</strong> {selectedOrder.cart[0].user_info?.city || "Não informado"}</p>
                                    <p><strong>Código Postal:</strong> {selectedOrder.cart[0].user_info?.zipCode || "Não informado"}</p>
                                    <p><strong>País:</strong> {selectedOrder.cart[0].user_info?.country || "Não informado"}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Informações Adicionais</h3>
                                <hr className="mb-2" />
                                <p>{selectedOrder.additionalInformation || "Não informado"}</p>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleCloseOrderModal}>Fechar</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}