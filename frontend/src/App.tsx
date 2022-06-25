import React from 'react';
import './App.css';
import Controller from './components/Controller';
import Research from '../src/research/Research'


function App() {
  return (
    <div className='h-full flex flex-col'>
      <div className='bg-black text-white p-2 text-center'>
        <h1>This dApp is under development - use at your own risk!</h1>
        <p className='text-gray-500'>If you want to try out chainlock, create a new address in metamask and only use it on this website.</p>
      </div>
      <div className='grow'>
        <Controller />
      </div>
    </div>
  );
}

export default App;
 