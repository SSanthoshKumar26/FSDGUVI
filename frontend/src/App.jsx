import React, { useMemo, useState, useEffect } from 'react'
import styled from "styled-components";
import { MainLayout } from './utils/layouts'
import Orb from './components/Orb/Orb'
import Navigation from './components/Navigation/Navigation'
import Dashboard from './components/Dashboard/Dashboard'
import Transactions from './components/Transactions/Transactions'
import Form from './components/Form/Form'
import { FaPlus, FaTimes, FaBars, FaMoon, FaSun } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [active, setActive] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState('dark')

  // Theme Toggle Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const displayData = () => {
    switch (active) {
      case 1: return <Dashboard key="dashboard" />
      case 2: return <Transactions key="transactions" filterType="all" />
      case 3: return <Transactions key="incomes" filterType="income" />
      case 4: return <Transactions key="expenses" filterType="expense" />
      default: return <Dashboard />
    }
  }

  const orbMemo = useMemo(() => {
    return <Orb />
  }, [])

  return (
    <AppStyled className="App" theme={theme}>
      {theme === 'dark' && orbMemo}
      <MainLayout>
        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FaBars />
          </div>
          <h2>Money Manager</h2>
          <div className="theme-toggle-mobile" onClick={toggleTheme}>
            {theme === 'dark' ? <FaSun color="#fbbf24" /> : <FaMoon color="#475569" />}
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && <div className="menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

        <Navigation active={active} setActive={setActive} isOpen={isMobileMenuOpen} toggleMenu={() => setIsMobileMenuOpen(false)} />

        <main>
          {/* Top Bar for Desktop */}
          <div className="top-bar">
            <div className="page-title">
              {active === 1 ? 'Dashboard' : active === 2 ? 'Transactions' : active === 3 ? 'Incomes' : 'Expenses'}
            </div>
            <div className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ height: 'calc(100% - 60px)', overflowY: 'auto' }}
            >
              {displayData()}
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="floating-btn"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPlus />
          </motion.div>
        </main>
      </MainLayout>

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false)
            }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            >
              <div className="modal-header">
                <h2>Add Transaction</h2>
                <div className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <FaTimes />
                </div>
              </div>
              <Form closeCallback={() => setIsModalOpen(false)} />
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </AppStyled>
  );
}

const ModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
    .modal-content{
        background: var(--color-secondary);
        padding: 2.5rem;
        border-radius: 24px;
        width: 90%;
        max-width: 550px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border: 1px solid var(--color-border);
        color: var(--color-text-main);
        
        .modal-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 2rem;
           h2{
                color: var(--color-text-main);
                font-size: 1.8rem;
                font-weight: 700;
                margin: 0;
            }
            .close-btn{
                color: var(--color-text-muted);
                font-size: 1.4rem;
                cursor: pointer;
                transition: color 0.2s;
                &:hover{
                    color: var(--color-accent-pink);
                }
            }
        }
    }
`;

const AppStyled = styled.div`
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: var(--color-primary);

  .mobile-header {
      display: none;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: var(--color-secondary);
      border-bottom: 1px solid var(--color-border);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 40;
      
      .menu-btn {
          font-size: 1.5rem;
          color: var(--color-text-main);
          cursor: pointer;
      }
      h2 {
          font-size: 1.2rem;
          color: var(--color-accent-cyan);
          margin: 0;
      }
      .theme-toggle-mobile {
         font-size: 1.2rem;
         cursor: pointer;
      }
  }

  .menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 45;
      backdrop-filter: blur(2px);
  }

  @media (max-width: 1024px) {
      .mobile-header { display: flex; }
      main {
          margin-top: 60px; /* Space for header */
          border-radius: 0 !important;
          border: none !important;
      }
  }

  main{
    flex: 1;
    background: var(--color-bg-overlay);
    border: 1px solid var(--color-border);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    overflow: hidden; /* Changed to hidden to handle scroll inside motion div */
    position: relative; 
    display: flex;
    flex-direction: column;

    @media (max-width: 1024px) {
        border-radius: 0;
        margin: 0;
        height: 100vh;
    }

    .top-bar {
       height: 60px;
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 0 2rem;
       border-bottom: 1px solid var(--color-border);
       
       .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-main);
       }

       .theme-toggle-btn {
          cursor: pointer;
          background: var(--color-secondary);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border);
          transition: transform 0.2s;
          &:hover { transform: scale(1.1); }
          .icon-sun { color: #fbbf24; font-size: 1.2rem; }
          .icon-moon { color: #475569; font-size: 1.2rem; }
       }
       
       @media (max-width: 1024px) {
           display: none;
       }
    }
  }

  .floating-btn{
      position: fixed;
      bottom: 40px;
      right: 40px;
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--color-accent-cyan) 0%, #0ea5e9 100%);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 1.8rem;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(34, 211, 238, 0.4);
      z-index: 50;
      
      @media (max-width: 768px) {
          bottom: 30px;
          right: 30px;
          width: 56px;
          height: 56px;
          font-size: 1.5rem;
      }
      
      /* Safe area support for newer phones */
      @supports (padding-bottom: env(safe-area-inset-bottom)) {
          @media (max-width: 768px) {
              bottom: calc(30px + env(safe-area-inset-bottom));
          }
      }
  }
`;

export default App;
