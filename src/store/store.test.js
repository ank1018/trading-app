import { act } from 'react';
import { renderHook } from '@testing-library/react';
import {useProvideGlobalStore} from "./useProvideGlobalStore";

describe('useProvideGlobalStore', () => {
    test('should initialize with empty arrays and correct initial ids', () => {
        const { result } = renderHook(() => useProvideGlobalStore());

        expect(result.current.transactions).toEqual([]);
        expect(result.current.trades).toEqual([]);
        expect(result.current.positions).toEqual([]);
        expect(result.current.securityCodeArray).toEqual(['REL', 'ITC', 'INF']);
    });

    test('should add a new INSERT transaction correctly', () => {
        const { result } = renderHook(() => useProvideGlobalStore());

        act(() => {
            result.current.addTransaction({
                type: 'INSERT',
                securityCode: 'REL',
                quantity: 100,
                action: 'Buy'
            });
        });

        expect(result.current.transactions).toHaveLength(1);
        expect(result.current.transactions[0]).toEqual({
            type: 'INSERT',
            securityCode: 'REL',
            quantity: 100,
            action: 'Buy',
            transactionId: 1,
            tradeId: 1,
            version: 1
        });

        expect(result.current.trades).toHaveLength(1);
        expect(result.current.trades[0]).toEqual({
            tradeId: 1,
            version: 1,
            securityCode: 'REL',
            quantity: 100,
            action: 'Buy',
            type: 'INSERT'
        });

        expect(result.current.positions).toHaveLength(1);
        expect(result.current.positions[0]).toEqual({
            securityCode: 'REL',
            quantity: 100
        });
    });

    test('should handle UPDATE transactions correctly', () => {
        const { result } = renderHook(() => useProvideGlobalStore());

        act(() => {
            result.current.addTransaction({
                type: 'INSERT',
                securityCode: 'REL',
                quantity: 100,
                action: 'Buy'
            });
        });

        act(() => {
            result.current.addTransaction({
                type: 'UPDATE',
                tradeId: 1,
                securityCode: 'REL',
                quantity: 150,
                action: 'Buy'
            });
        });

        expect(result.current.transactions).toHaveLength(2);
        expect(result.current.transactions[1].transactionId).toBe(2);
        expect(result.current.transactions[1].version).toBe(2);

        expect(result.current.trades).toHaveLength(2);

        expect(result.current.positions).toHaveLength(1);
        expect(result.current.positions[0]).toEqual({
            securityCode: 'REL',
            quantity: 150
        });
    });
});
