import React from 'react'
import './transaction-history.css'
import { useGlobalStore } from '../../store/GlobalStoreContext'

export const TransactionHistoryView = () => {
    const { transactions } = useGlobalStore()

    return (
        <div className="thv-container">
            <h2 className="thv-title">Transaction History</h2>

            {transactions.length === 0 ? (
                <p className="thv-no-transactions">No transactions yet</p>
            ) : (
                <div className="thv-table-wrapper">
                    <table className="thv-table">
                        <thead>
                        <tr className="thv-header-row">
                            <th className="thv-header-cell">ID</th>
                            <th className="thv-header-cell">Trade</th>
                            <th className="thv-header-cell">Ver</th>
                            <th className="thv-header-cell">Security</th>
                            <th className="thv-header-cell thv-cell-right">Qty</th>
                            <th className="thv-header-cell">Type</th>
                            <th className="thv-header-cell">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.transactionId} className="thv-row">
                                <td className="thv-cell">{tx.transactionId}</td>
                                <td className="thv-cell">{tx.tradeId}</td>
                                <td className="thv-cell">{tx.version}</td>
                                <td className="thv-cell">{tx.securityCode}</td>
                                <td className="thv-cell thv-cell-right">{tx.quantity}</td>
                                <td className={`thv-cell thv-type-${tx.type.toLowerCase()}`}>
                                    {tx.type}
                                </td>
                                <td className={`thv-cell thv-action-${tx.action.toLowerCase()}`}>
                                    {tx.action}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
