import { getProducts } from './actions'
import { ProductTable } from './product-table'
import { ProductDialogClientWrapper } from './product-dialog-wrapper'

export default async function ProdutosPage() {
    const products = await getProducts()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                <ProductDialogClientWrapper />
            </div>

            <ProductTable products={products || []} />
        </div>
    )
}
