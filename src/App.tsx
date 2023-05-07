import React from 'react';
import './App.css';
import CodeReader from './components/CodeReader';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>QR & Barcode Reader</h1>
      </header>
      <main>
        <CodeReader />
      </main>
    </div>
  );
};

export default App;