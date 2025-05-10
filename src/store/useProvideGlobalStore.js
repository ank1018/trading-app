import { useState, useEffect } from "react";

export const useProvideGlobalStore = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem("trades");
    return saved ? JSON.parse(saved) : [];
  });

  const [positions, setPositions] = useState(() => {
    const saved = localStorage.getItem("positions");
    return saved ? JSON.parse(saved) : [];
  });

  const [nextTransactionId, setNextTransactionId] = useState(() => {
    const saved = localStorage.getItem("nextTransactionId");
    return saved ? parseInt(saved) : 1;
  });

  const [nextTradeId, setNextTradeId] = useState(() => {
    const saved = localStorage.getItem("nextTradeId");
    return saved ? parseInt(saved) : 1;
  });

  const securityCodeArray = ["REL", "ITC", "INF"];

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem("positions", JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem("nextTransactionId", nextTransactionId.toString());
  }, [nextTransactionId]);

  useEffect(() => {
    localStorage.setItem("nextTradeId", nextTradeId.toString());
  }, [nextTradeId]);

  const processTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
    handleTradeUpdate(transaction);
  };

  const handleTradeUpdate = (transaction) => {
    const { tradeId, version } = transaction;
    if (trades.some((t) => t.tradeId === tradeId && t.version === version)) {
      return;
    }
    const newTrade = {
      tradeId: transaction.tradeId,
      version: transaction.version,
      securityCode: transaction.securityCode,
      quantity: transaction.quantity,
      action: transaction.action,
      type: transaction.type,
    };
    setTrades((prev) => [...prev, newTrade]);
  };

  useEffect(() => {
    const latestTradeMap = new Map();
    trades.forEach((trade) => {
      const prev = latestTradeMap.get(trade.tradeId);
      if (!prev || trade.version > prev.version) {
        latestTradeMap.set(trade.tradeId, trade);
      }
    });

    const posMap = new Map();
    latestTradeMap.forEach((trade) => {
      if (trade.type === "CANCEL") {
        posMap.set(trade.securityCode, 0);
        return;
      }
      const current = posMap.get(trade.securityCode) || 0;
      const updated =
        trade.action === "Buy"
          ? current + trade.quantity
          : current - trade.quantity;
      posMap.set(trade.securityCode, updated);
    });

    const newPositions = Array.from(posMap.entries()).map(
      ([securityCode, quantity]) => ({ securityCode, quantity })
    );
    setPositions(newPositions);
  }, [trades]);

  const addTransaction = (txn) => {
    const { type } = txn;
    let tradeId, version;

    if (type === "INSERT") {
      tradeId = nextTradeId;
      version = 1;
      setNextTradeId((id) => id + 1);
    } else {
      tradeId = txn.tradeId;
      const existing = trades
        .filter((t) => t.tradeId === tradeId)
        .map((t) => t.version);
      const highest = existing.length ? Math.max(...existing) : 0;
      version = highest + 1;
    }

    const transaction = {
      ...txn,
      transactionId: nextTransactionId,
      tradeId,
      version,
    };
    setNextTransactionId((id) => id + 1);
    processTransaction(transaction);
  };

  const clearStorage = () => {
    setTransactions([]);
    setTrades([]);
    setPositions([]);
    setNextTransactionId(1);
    setNextTradeId(1);

    localStorage.removeItem("transactions");
    localStorage.removeItem("trades");
    localStorage.removeItem("positions");
    localStorage.removeItem("nextTransactionId");
    localStorage.removeItem("nextTradeId");
  };

  return {
    transactions,
    trades,
    positions,
    addTransaction,
    securityCodeArray,
    clearStorage,
  };
};
