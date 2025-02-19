import React from "react"
import { Button } from "@windmill/react-ui"

export default function PaginacaoTabelaCustomizada({ currentPage, totalPages, onPageChange }) {
    // Função para ir para a página anterior
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }
    }

    // Função para ir para a próxima página
    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    }

    // Renderiza os botões para cada número de página
    const renderPageNumbers = () => {
        const pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`px-2 py-1 rounded ${currentPage === i ? "bg-blue-500 text-gray-700" : "bg-gray-500 text-black"}`}
                    size="small"
                >
                    {i}
                </Button>
            )
        }
        return pages
    }

    return (
        <div className="flex justify-center items-center space-x-2 mt-4">
            <Button onClick={handlePrev} disabled={currentPage === 1} size="small">
                Anterior
            </Button>
            {renderPageNumbers()}
            <Button onClick={handleNext} disabled={currentPage === totalPages} size="small">
                Próximo
            </Button>
        </div>
    )
}