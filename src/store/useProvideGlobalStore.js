import { useState, useEffect } from 'react'

export const useProvideGlobalStore = () => {
    const [transactions, setTransactions] = useState([])
    const [trades, setTrades] = useState([])
    const [positions, setPositions] = useState([])
    const [nextTransactionId, setNextTransactionId] = useState(1)
    const [nextTradeId, setNextTradeId] = useState(1)

    const securityCodeArray = ['REL', 'ITC', 'INF']

    const processTransaction = (transaction) => {
        setTransactions(prev => [...prev, transaction])
        handleTradeUpdate(transaction)
    }

    const handleTradeUpdate = (transaction) => {
        const { tradeId, version } = transaction
        if (trades.some(t => t.tradeId === tradeId && t.version === version)) {
            return
        }
        const newTrade = {
            tradeId: transaction.tradeId,
            version: transaction.version,
            securityCode: transaction.securityCode,
            quantity: transaction.quantity,
            action: transaction.action,
            type: transaction.type,
        }
        setTrades(prev => [...prev, newTrade])
    }

    useEffect(() => {
        const latestTradeMap = new Map()
        trades.forEach(trade => {
            const prev = latestTradeMap.get(trade.tradeId)
            if (!prev || trade.version > prev.version) {
                latestTradeMap.set(trade.tradeId, trade)
            }
        })

        const posMap = new Map()
        latestTradeMap.forEach(trade => {
            if (trade.type === 'CANCEL') {
                posMap.set(trade.securityCode, 0)
                return
            }
            const current = posMap.get(trade.securityCode) || 0
            const updated = trade.action === 'Buy'
                ? current + trade.quantity
                : current - trade.quantity
            posMap.set(trade.securityCode, updated)
        })

        const newPositions = Array.from(posMap.entries()).map(
            ([securityCode, quantity]) => ({ securityCode, quantity })
        )
        setPositions(newPositions)
    }, [trades])

    const addTransaction = (txn) => {
        const { type } = txn
        let tradeId, version

        if (type === 'INSERT') {
            tradeId = nextTradeId
            version = 1
            setNextTradeId(id => id + 1)
        } else {
            tradeId = txn.tradeId
            const existing = trades
                .filter(t => t.tradeId === tradeId)
                .map(t => t.version)
            const highest = existing.length ? Math.max(...existing) : 0
            version = highest + 1
        }

        const transaction = {
            ...txn,
            transactionId: nextTransactionId,
            tradeId,
            version,
        }
        setNextTransactionId(id => id + 1)
        processTransaction(transaction)
    }

    return {
        transactions,
        trades,
        positions,
        addTransaction,
        securityCodeArray
    }
}
