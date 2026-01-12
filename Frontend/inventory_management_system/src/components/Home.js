import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Home() {
  // --- TYPEWRITER LOGIC ---
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const fullText1 = "> CONNECTING_TO_DATABASE...";
  const fullText2 = "> CHECKING_STOCK_LEVELS: COMPLETE";
  const fullText3 = "> SYSTEM_STATUS: READY_FOR_INPUT";

  useEffect(() => {
    // Type line 1
    let i = 0;
    const interval1 = setInterval(() => {
      setText1(fullText1.slice(0, i + 1));
      i++;
      if (i > fullText1.length) {
        clearInterval(interval1);
        
        // Start typing line 2 after line 1 finishes
        let j = 0;
        const interval2 = setInterval(() => {
          setText2(fullText2.slice(0, j + 1));
          j++;
          if (j > fullText2.length) {
            clearInterval(interval2);
            
            // Start typing line 3 after line 2 finishes
            let k = 0;
            const interval3 = setInterval(() => {
              setText3(fullText3.slice(0, k + 1));
              k++;
              if (k > fullText3.length) clearInterval(interval3);
            }, 30); // Speed for line 3
          }
        }, 30); // Speed for line 2
      }
    }, 50); // Speed for line 1 (slower start)

    return () => {
      clearInterval(interval1);
    };
  }, []);

  return (
    <div className='app-container'>
      
      {/* 1. HERO TITLE (With Fade In) */}
      <h1 className="mt-5 animate-fade-up">SMART_STOCK_MANAGER</h1>

      {/* 2. TERMINAL WINDOW (With Typewriter Effect) */}
      <div className="mx-auto mb-5 p-4 text-start animate-fade-up delay-1" style={{ 
          maxWidth: '600px', 
          backgroundColor: '#1a1a1a', 
          border: '3px solid #000', 
          boxShadow: '8px 8px 0px 0px #000',
          color: '#4ade80', 
          fontFamily: 'Space Mono, monospace',
          minHeight: '180px' /* Keeps box size stable while typing */
      }}>
        {/* Window Controls */}
        <div className="d-flex gap-2 mb-3 border-bottom border-secondary pb-2">
           <span style={{height: '12px', width: '12px', borderRadius: '50%', backgroundColor: '#ef4444'}}></span>
           <span style={{height: '12px', width: '12px', borderRadius: '50%', backgroundColor: '#eab308'}}></span>
           <span style={{height: '12px', width: '12px', borderRadius: '50%', backgroundColor: '#22c55e'}}></span>
           <span className="ms-auto text-secondary" style={{fontSize: '0.8rem'}}>WAREHOUSE.EXE</span>
        </div>
        
        {/* Dynamic Typewriter Text */}
        <p className="m-0" style={{minHeight: '24px'}}>{text1}</p>
        <p className="m-0" style={{minHeight: '24px'}}>{text2}</p>
        <p className="m-0" style={{minHeight: '24px'}}>
          {text3} 
          {/* Only show cursor if text 3 is done typing */}
          {text3.length === fullText3.length && <span className="cursor-blink"></span>}
        </p>
      </div>

      {/* 3. MAIN BUTTON (With Fade In) */}
      <NavLink to="/products" className="neo-button text-decoration-none mb-5 animate-fade-up delay-2">
        ACCESS_INVENTORY <i className="fa-solid fa-box-open ms-2"></i>
      </NavLink>

      {/* 4. FEATURE CARDS (With Staggered Fade In) */}
      <div className="row mt-5">
        
        {/* Card 1 */}
        <div className="col-md-4 mb-4 animate-fade-up delay-3">
          <div className="neo-card h-100">
             <div className="border border-2 border-black d-inline-block p-2 mb-3" style={{backgroundColor: '#facc15'}}>
                <i className="fa-solid fa-boxes-stacked fa-2x text-black"></i>
             </div>
             <h3>LIVE_TRACKING</h3>
             <p>Monitor stock levels in real-time. Never lose count of your assets again.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-md-4 mb-4 animate-fade-up delay-3">
          <div className="neo-card h-100">
             <div className="border border-2 border-black d-inline-block p-2 mb-3" style={{backgroundColor: '#c084fc'}}>
                <i className="fa-solid fa-bell fa-2x text-black"></i>
             </div>
             <h3>LOW_STOCK_ALERTS</h3>
             <p>Automated warnings when items fall below threshold levels.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-md-4 mb-4 animate-fade-up delay-4">
          <div className="neo-card h-100">
             <div className="border border-2 border-black d-inline-block p-2 mb-3" style={{backgroundColor: '#4ade80'}}>
                <i className="fa-solid fa-clipboard-list fa-2x text-black"></i>
             </div>
             <h3>INSTANT_REPORTS</h3>
             <p>Generate detailed inventory reports with a single click.</p>
          </div>
        </div>

      </div>
    </div>
  )
}