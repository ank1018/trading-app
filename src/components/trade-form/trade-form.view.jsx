
import React, { useState } from 'react'
import './trade-form.css'
import { useGlobalStore } from '../../store/GlobalStoreContext'

export const TradeForm = () => {
    const { addTransaction, trades, securityCodeArray, transactions } = useGlobalStore()

    const [type, setType] = useState('INSERT')
    const [selectedTradeId, setSelectedTradeId] = useState()
    const [securityCode, setSecurityCode] = useState('')
    const [quantity, setQuantity] = useState('')
    const [action, setAction] = useState('Buy')

    const isInsert = type === 'INSERT'
    const isUpdate = type === 'UPDATE'
    const isCancel = type === 'CANCEL'
    const tradeIds = Array.from(new Set(trades.map(t => t.tradeId)))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isInsert && selectedTradeId === undefined) return

        const payload = { type, securityCode, quantity, action }
        if (!isInsert) payload.tradeId = selectedTradeId
        if (isUpdate) {
            const tempTransaction = transactions.find((t) => t.tradeId === selectedTradeId)
            payload.securityCode = tempTransaction.securityCode
        }
        if (isCancel) {
            const tempTransaction = transactions.find((t) => t.tradeId === selectedTradeId)
            payload.securityCode = tempTransaction.securityCode
            payload.quantity = tempTransaction.quantity
        }
        addTransaction(payload)

        setType('INSERT')
        setSelectedTradeId(undefined)
        setSecurityCode('')
        setQuantity('')
        setAction('Buy')
    }

    return (
        <div className="trade-form-container">
            <h1 className="trade-form-title">Equity Positions Management</h1>
            <form className="trade-form" onSubmit={handleSubmit}>
                <h2 className="trade-form-section-title">Add Transaction</h2>

                <div className="trade-form-grid">
                    <div className="trade-form-field">
                        <label className="trade-form-label">Type</label>
                        <select
                            className="trade-form-select"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        >
                            <option value="INSERT">INSERT</option>
                            <option value="UPDATE">UPDATE</option>
                            <option value="CANCEL">CANCEL</option>
                        </select>
                    </div>

                    {!isInsert && (
                        <div className="trade-form-field">
                            <label className="trade-form-label">Trade ID</label>
                            <select
                                className="trade-form-select"
                                value={selectedTradeId}
                                onChange={e => setSelectedTradeId(parseInt(e.target.value) || undefined)}
                                required
                            >
                                <option value="">Select Trade</option>
                                {tradeIds.map(id => (
                                    <option key={id} value={id}>{id}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {isInsert && <div className="trade-form-field">
                        <label className="trade-form-label">Security Code</label>
                        <select
                            className="trade-form-select"
                            value={securityCode}
                            onChange={e => setSecurityCode(e.target.value)}
                            disabled={isCancel}
                            required={!isCancel}
                        >
                            <option value="">Select Security Code</option>
                            {securityCodeArray.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </select>
                    </div>}

                    {!isCancel && <div className="trade-form-field">
                        <label className="trade-form-label">Quantity</label>
                        <input
                            type="number"
                            className="trade-form-input"
                            value={quantity}
                            onChange={e => {
                                const val = e.target.value;
                                if (val === '') {
                                    setQuantity('');
                                } else {
                                    setQuantity(parseInt(val, 10));
                                }
                            }}
                            disabled={isCancel}
                            required={!isCancel}
                            min={0}
                        />
                    </div>}

                    <div className="trade-form-field">
                        <label className="trade-form-label">Action</label>
                        <select
                            className="trade-form-select"
                            value={action}
                            onChange={e => setAction(e.target.value)}
                            disabled={isCancel}
                        >
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                        </select>
                    </div>
                </div>

                <div className="trade-form-actions">
                    <button type="submit" className="trade-form-button">
                        Add Transaction
                    </button>
                </div>
            </form>
        </div>
    )
}
