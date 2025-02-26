import React from "react"
import NotFound from "../table/NotFound"
import useVivaWallet from "@/hooks/vivawallet/useVivaWallet"
import { FaShoppingCart, FaTrash, FaEdit } from "react-icons/fa"
import PaginacaoTabelaCustomizada from "./PaginacaoTabelaCustomizada"
import useTabelaPedidosCustomizados from "@/hooks/tabelapedidos/useTabelaPedidosCustomizados"
import { FaCheckCircle, FaExclamation, FaTimesCircle } from "react-icons/fa"
import { Table, TableCell, TableContainer, TableBody, TableHeader, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "@windmill/react-ui"

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
    const { getAllOrders, loading, removeOrderFromLocalStorage, deleteOrderByID, updateStatusOrderByID } = useVivaWallet()
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
            const result = await updateStatusOrderByID(selectedStatusOrder._id, newStatus)
            if (result.success) {
                handleCloseStatusModal()
            } else {
                // Display error message to user
                alert(result.error || "Erro ao atualizar status do pedido")
            }
        }
    }


    // formatar Data e Hora
    const formatDateAndTime = (dateString) => {
        const date = new Date(dateString)
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const formattedDate = `${day}/${month}/${year}`
        const formattedTime = `${hours}:${minutes}`
        return `${formattedDate} ${formattedTime}`
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
                    <Button disabled={loading} onClick={handleUpdateStatus} color="green">
                        {loading ? 'Atualizando...' : 'Atualizar Status'}
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
                <ModalHeader>Resumo do Pedido #{selectedOrder?.orderCode}</ModalHeader>
                <ModalBody className="overflow-y-auto max-h-[80vh]">
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Status do Pedido</h3>
                                <hr className="mb-2" />
                                <p className={`font-bold ${selectedOrder.status === 'Pago' ? 'text-green-600' :
                                    selectedOrder.status === 'Pendente' ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                    {selectedOrder.status}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Detalhes do Pedido</h3>
                                <hr className="mb-2" />
                                <p><strong>Data/Hora:</strong> {formatDateAndTime(selectedOrder.createdAt)}</p>
                                <p><strong>Valor Total:</strong> {formatEuro(selectedOrder.amount)}</p>
                                <p><strong>Frete:</strong> {selectedOrder.frete.toFixed(2)} €</p>
                                <p><strong>Retirada na Loja: </strong>{selectedOrder.retiradaNaLoja ? 'Sim' : 'Não'}</p>
                                <p><strong>Método de Pagamento:</strong> {selectedOrder.paymentMethod}</p>
                                <p><strong>Cupom:</strong> {selectedOrder.cupom || "Não aplicado"}</p>
                                <p><strong>Desconto:</strong> {selectedOrder.discount} €</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
                                <hr className="mb-2" />
                                {selectedOrder.cart.map((item, index) => (
                                    <div key={index} className="mb-4 p-2 bg-gray-50 rounded">
                                        <p><strong>Item:</strong> {item.title}</p>
                                        <p><strong>Quantidade:</strong> {item.quantity}</p>
                                        {item.extras && item.extras.length > 0 && (
                                            <p><strong>Extras:</strong> {item.extras.join(", ")}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {selectedOrder.agendamento && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Agendamento</h3>
                                    <hr className="mb-2" />
                                    <p><strong>Data:</strong> {formatDate(selectedOrder.agendamento.data)}</p>
                                    <p><strong>Horário:</strong> {selectedOrder.agendamento.horario}</p>
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Dados do Cliente</h3>
                                <hr className="mb-2" />
                                <p><strong>Nome:</strong> {selectedOrder.user_info.name}</p>
                                <p><strong>Email:</strong> {selectedOrder.user_info.email}</p>
                                <p><strong>Telefone:</strong> {selectedOrder.user_info.contact}</p>
                                <p><strong>NIF:</strong> {selectedOrder.user_info.nif}</p>
                                <p><strong>Endereço:</strong> {selectedOrder.user_info.address}</p>
                                <p><strong>Cidade:</strong> {selectedOrder.user_info.city}</p>
                                <p><strong>País:</strong> {selectedOrder.user_info.country}</p>
                                <p><strong>CEP:</strong> {selectedOrder.user_info.zipCode}</p>
                            </div>
                            {selectedOrder.user_info.additionalInformation && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Informações Adicionais</h3>
                                    <hr className="mb-2" />
                                    <p>{selectedOrder.user_info.additionalInformation}</p>
                                </div>
                            )}
                            {selectedOrder.paymentMethodDetails && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Detalhes do Pagamento na Entrega</h3>
                                    <hr className="mb-2" />
                                    <p><strong>Forma de Pagamento:</strong> {selectedOrder.paymentMethodDetails.method}</p>
                                    {selectedOrder.paymentMethodDetails.changeFor && (
                                        <p><strong>Troco para:</strong> {selectedOrder.paymentMethodDetails.changeFor} €</p>
                                    )}
                                </div>
                            )}
                            {selectedOrder.localizacao && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Localização</h3>
                                    <hr className="mb-2" />
                                    <p><strong>Coordenadas:</strong> {selectedOrder.localizacao}</p>
                                </div>
                            )}
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