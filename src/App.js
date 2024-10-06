import React from 'react';
import GameTable from './components/GameTableComponent'; // Adjust the path if necessary

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold text-center my-4">Welcome to War Card Game</h1>
      </header>
      {/* Game Table Component */}
      <GameTable />
    </div>
  );
}

export default App;
