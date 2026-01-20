'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react'
import { deleteProduct } from './actions'
import { toast } from 'sonner'
import { useState } from 'react'
import { ProductDialog } from './product-dialog'

export function ProductTable({ products }: { products: any[] }) {
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [open, setOpen] = useState(false)

    async function handleDelete(id: string) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            const result = await deleteProduct(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Produto excluído com sucesso')
            }
        }
    }

    function handleEdit(product: any) {
        setEditingProduct(product)
        setOpen(true)
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Imagem</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                                        {product.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <ImageIcon className="h-4 w-4 text-gray-400" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate" title={product.description_short}>{product.description_short || '-'}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Nenhum produto cadastrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ProductDialog
                open={open}
                setOpen={(val) => {
                    setOpen(val)
                    if (!val) setEditingProduct(null)
                }}
                productToEdit={editingProduct}
            />
        </>
    )
}
