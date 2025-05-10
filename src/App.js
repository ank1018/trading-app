import './App.css';
import {TradeForm} from "./components/trade-form/trade-form.view";
import {CurrentPositionView} from "./components/current-position/current-position.view";
import {TransactionHistoryView} from "./components/transaction-history/transaction-history.view";

function App() {
  return (
    <div className="App">
      <TradeForm />
        <CurrentPositionView />
        <TransactionHistoryView />
    </div>
  );
}

export default App;
