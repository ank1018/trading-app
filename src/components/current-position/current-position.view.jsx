import React from 'react'
import './current-position.css'
import { useGlobalStore } from '../../store/GlobalStoreContext'

export const CurrentPositionView = () => {
    const { positions } = useGlobalStore()

    return (
        <div className="cpv-container">
            <h2 className="cpv-title">Current Positions</h2>

            {positions.length === 0 ? (
                <p className="cpv-no-positions">No positions yet</p>
            ) : (
                <div className="cpv-table-wrapper">
                    <table className="cpv-table">
                        <thead>
                        <tr className="cpv-header-row">
                            <th className="cpv-header-cell">Security</th>
                            <th className="cpv-header-cell">Position</th>
                        </tr>
                        </thead>
                        <tbody>
                        {positions.map(({ securityCode, quantity }) => (
                            <tr key={securityCode} className="cpv-row">
                                <td className="cpv-cell">{securityCode}</td>
                                <td className={`cpv-cell`}
                                >
                                    {quantity > 0 ? `+${quantity}` : quantity}
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
