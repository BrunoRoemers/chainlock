import React from 'react';
import './App.css';
import Research from './research/Research';

function App() {
  return (
    <div>
      <div className='bg-black text-white p-2 text-center'>
        <h1>This dApp is under development - use at your own risk!</h1>
        <p className='text-gray-500'>If you want to try out chainlock, create a new address in metamask and only use it on this website.</p>
      </div>
      <Research/>
    </div>
  );
}

export default App;
