'use client'

import { useState } from 'react'
import { ClientDialog } from './client-dialog'

export function ClientDialogClientWrapper() {
    const [open, setOpen] = useState(false)
    return <ClientDialog open={open} setOpen={setOpen} />
}
