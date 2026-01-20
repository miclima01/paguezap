'use client'

import { ChargeFormData } from './schema'

interface WhatsAppPreviewProps {
    data: Partial<ChargeFormData>
    clientName?: string
}

export function WhatsAppPreview({ data, clientName }: WhatsAppPreviewProps) {
    const isSimple = data.template_type === 'simple' || !data.template_type

    return (
        <div className="mx-auto w-[320px] h-[640px] bg-black rounded-[3rem] p-3 border-4 border-gray-800 shadow-2xl relative overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>

            {/* Screen */}
            <div className="w-full h-full bg-[#E5DDD5] rounded-[2.5rem] overflow-hidden flex flex-col relative z-10">

                {/* Header */}
                <div className="bg-[#075E54] h-16 flex items-center px-4 pt-4 text-white">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                    <div className="font-semibold text-sm">Pague Zap</div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-sm">

                    {/* Message Bubble */}
                    <div className="bg-white rounded-lg p-2 shadow-sm max-w-[90%] self-start rounded-tl-none">
                        {/* Image Header */}
                        {data.snapshot_image_url && (
                            <div className="w-full h-32 bg-gray-200 rounded-md mb-2 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={data.snapshot_image_url} alt="Product" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Body */}
                        <div className="text-gray-800 space-y-1 mb-2">
                            <p>Olá {clientName || 'Cliente'}, tudo bem?</p>

                            {isSimple ? (
                                <>
                                    <p>Aqui está sua cobrança referente a <strong>{data.snapshot_product_name || '...'}</strong> no valor de <strong>R$ {Number(data.snapshot_price || 0).toFixed(2)}</strong>.</p>
                                </>
                            ) : (
                                <>
                                    <p>Segue sua cobrança:</p>
                                    <p>📦 Produto: <strong>{data.snapshot_product_name || '...'}</strong></p>
                                    <p>📝 {data.snapshot_product_description || '...'}</p>
                                    <p>💰 Valor: <strong>R$ {Number(data.snapshot_price || 0).toFixed(2)}</strong></p>
                                </>
                            )}

                            <p>Para facilitar o pagamento, você pode usar o botão abaixo ou acessar: https://...</p>
                        </div>

                        {/* Footer */}
                        <div className="text-[10px] text-gray-500 text-right">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>

                        {/* Button */}
                        <div className="border-t border-gray-100 mt-2 pt-2 text-center">
                            <div className="text-blue-500 font-medium cursor-pointer">
                                Ver Pedido
                            </div>
                        </div>
                    </div>

                </div>

                {/* Input Area (Mock) */}
                <div className="h-12 bg-[#F0F0F0] flex items-center px-2">
                    <div className="flex-1 bg-white h-8 rounded-full"></div>
                </div>
            </div>
        </div>
    )
}
