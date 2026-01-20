'use client'

import { useState } from 'react'
import { ProductDialog } from './product-dialog'

export function ProductDialogClientWrapper() {
    const [open, setOpen] = useState(false)
    return <ProductDialog open={open} setOpen={setOpen} />
}
