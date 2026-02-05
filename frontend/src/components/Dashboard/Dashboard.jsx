
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import History from '../../History/History'
import { InnerLayout } from '../../utils/layouts'
import Chart from '../Chart/Chart'
import { Doughnut } from 'react-chartjs-2'
import { FaArrowUp, FaArrowDown, FaWallet, FaEnvelope, FaQuoteLeft } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { quotes } from '../../utils/quotes'
import { toast } from 'react-toastify'
import FinancialAdvisor from '../FinancialAdvisor/FinancialAdvisor'
import BehavioralAnalysis from '../BehavioralAnalysis/BehavioralAnalysis'
import FinancialNews from '../FinancialNews/FinancialNews'
import MailModal from '../MailModal/MailModal'

function Dashboard() {
    const { totalIncome, totalExpense, totalBalance, getTransactions, incomes, expenses, transactions, triggerSummaryMail } = useGlobalContext()
    const [quote, setQuote] = useState({ text: '', author: '' })
    const [sending, setSending] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        getTransactions()
        setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    }, [])

    const healthScore = useMemo(() => {
        const inc = totalIncome();
        const exp = totalExpense();
        if (inc === 0) return 0;
        const score = Math.max(0, Math.min(100, ((inc - exp) / inc) * 100));
        return Math.round(score);
    }, [totalIncome, totalExpense]);

    const handleManualMail = () => {
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (userEmail) => {
        setIsModalOpen(false);
        setSending(true);
        const toastId = toast.loading("Generating your financial report...");
        try {
            await triggerSummaryMail(userEmail);
            toast.update(toastId, { render: `Success! Report sent to ${userEmail || 'srisrikanthtvs@gmail.com'}.`, type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Failed to send email. Check backend logs.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setSending(false);
        }
    };

    const categoryData = useMemo(() => {
        const categories = {};
        expenses.forEach(txn => {
            categories[txn.category] = (categories[txn.category] || 0) + txn.amount;
        });

        return {
            labels: Object.keys(categories).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf', '#22d3ee'
                ],
                borderWidth: 0,
            }]
        };
    }, [expenses]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <DashboardStyled>
            <InnerLayout>
                <div className="header-stats">
                    <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        Dashboard Overview
                    </motion.h1>
                    <div className="actions-container">
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(244, 114, 182, 0.2)' }}
                            whileTap={{ scale: 0.95 }}
                            className="mail-trigger-btn"
                            onClick={handleManualMail}
                            disabled={sending}
                        >
                            <FaEnvelope /> {sending ? 'Sending...' : 'Mail Summary'}
                        </motion.button>
                        <div className="balance-highlight">
                            <span>Balance:</span>
                            <h2 className={totalBalance() >= 0 ? 'positive' : 'negative'}>
                                ₹ {totalBalance().toLocaleString()}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="top-layout">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="health-card"
                    >
                        <div className="score-ring">
                            <svg viewBox="0 0 36 36">
                                <path className="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <motion.path
                                    className="progress"
                                    strokeDasharray={`${healthScore}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5 }}
                                />
                            </svg>
                            <div className="score-text">
                                <span>{healthScore}%</span>
                                <p>Health</p>
                            </div>
                        </div>
                        <div className="health-info">
                            <h4>Financial Health</h4>
                            <p>{healthScore > 50 ? 'Excellent! Savings are on track.' : 'Watch out! Expenses are high.'}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="quote-card"
                    >
                        <div className="quote-icon"><FaQuoteLeft /></div>
                        <div className="quote-content">
                            <p>{quote.text}</p>
                            <span>- {quote.author}</span>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="stats-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="stat-card income">
                        <div className="icon"><FaArrowUp /></div>
                        <div>
                            <p>Total Income</p>
                            <h3>₹ {totalIncome().toLocaleString()}</h3>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="stat-card expense">
                        <div className="icon"><FaArrowDown /></div>
                        <div>
                            <p>Total Expense</p>
                            <h3>₹ {totalExpense().toLocaleString()}</h3>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="stat-card balance">
                        <div className="icon"><FaWallet /></div>
                        <div>
                            <p>Total Balance</p>
                            <h3>₹ {totalBalance().toLocaleString()}</h3>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="stat-card count">
                        <div className="icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>#</div>
                        <div>
                            <p>Activity</p>
                            <h3>{transactions.length} Txns</h3>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="main-grid">
                    <div className="chart-section">
                        <h3>Financial Trends</h3>
                        <div className="chart-container">
                            <Chart />
                        </div>
                        <div className="doughnut-container">
                            <h4>Distribution</h4>
                            {expenses.length > 0 ? (
                                <div className="doughnut-wrapper">
                                    <Doughnut data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8' } } } }} />
                                </div>
                            ) : <p className="no-data">Add expenses to see breakdown</p>}
                        </div>
                    </div>

                    <div className="history-section">
                        <History />
                        <div className="min-max-stats">
                            <div className="mm-item">
                                <p>Peak Income</p>
                                <span>₹ {Math.max(...incomes.map(i => i.amount), 0).toLocaleString()}</span>
                            </div>
                            <div className="mm-item">
                                <p>Peak Expense</p>
                                <span>₹ {Math.max(...expenses.map(i => i.amount), 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <FinancialNews />
                    </div>
                </div>

                <FinancialAdvisor />
                <BehavioralAnalysis />
                <MailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                />
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .header-stats {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;

        h1 { margin: 0; font-size: 1.8rem; font-weight: 800; color: #f8fafc; }
        
        @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
            h1 { font-size: 1.5rem; }
        }

        .actions-container {
             display: flex;
             align-items: center;
             gap: 1rem;
             width: 100%;
             justify-content: space-between;
             
             @media (max-width: 480px) {
                 flex-direction: column;
                 align-items: stretch;
             }
        }

        .balance-highlight {
            background: rgba(34, 211, 238, 0.05);
            padding: 0.6rem 1.2rem;
            border-radius: 16px;
            border: 1px solid rgba(34, 211, 238, 0.2);
            display: flex;
            align-items: center;
            gap: 0.8rem;
            span { color: #94a3b8; font-size: 0.8rem; font-weight: 600; }
            h2 { font-size: 1.3rem; margin: 0; font-weight: 800; }
            .positive { color: #10b981; }
            .negative { color: #f43f5e; }
        }
    }

    .mail-trigger-btn {
        background: rgba(244, 114, 182, 0.1);
        color: #f472b6;
        border: 1px solid rgba(244, 114, 182, 0.2);
        padding: 0.6rem 1.2rem;
        border-radius: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-weight: 700;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        &:disabled { opacity: 0.4; cursor: not-allowed; }
    }

    .top-layout {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
        @media (max-width: 1024px) { grid-template-columns: 1fr; }
    }

    .health-card {
        background: #1e293b;
        border-radius: 24px;
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.05);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);

        @media (max-width: 480px) {
            flex-direction: column;
            text-align: center;
            padding: 1.2rem;
        }

        .score-ring {
            width: 80px;
            height: 80px;
            position: relative;
            flex-shrink: 0;
            
            svg {
                transform: rotate(-90deg);
                path.bg { fill: none; stroke: #334155; stroke-width: 4; }
                path.progress { 
                    fill: none; 
                    stroke: #22d3ee; 
                    stroke-width: 4; 
                    stroke-linecap: round;
                }
            }
            
            .score-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                span { font-size: 1.2rem; font-weight: 800; color: #f8fafc; display: block; }
                p { font-size: 0.6rem; color: #94a3b8; margin: 0; text-transform: uppercase; font-weight: 700; }
            }
        }

        .health-info {
            h4 { margin: 0 0 0.3rem 0; color: #f8fafc; font-size: 1rem; font-weight: 700; }
            p { margin: 0; font-size: 0.8rem; color: #94a3b8; line-height: 1.4; }
        }
    }

    .quote-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        padding: 1.5rem;
        display: flex;
        gap: 1.5rem;
        align-items: center;
        backdrop-filter: blur(10px);

        @media (max-width: 480px) {
            flex-direction: column;
            text-align: center;
            padding: 1.2rem;
            .quote-icon { width: 45px; height: 45px; font-size: 1.1rem; }
        }

        .quote-icon {
            background: rgba(34, 211, 238, 0.1);
            color: #22d3ee;
            width: 50px;
            height: 50px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            flex-shrink: 0;
        }

        .quote-content {
            p { margin: 0; font-size: 1rem; font-style: italic; color: #f1f5f9; line-height: 1.5; font-weight: 500; }
            span { display: block; margin-top: 0.5rem; font-size: 0.85rem; color: #64748b; font-weight: 600; }
        }
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.2rem;
        margin-bottom: 2rem;
        
        @media (max-width: 480px) {
            grid-template-columns: 1fr;
        }

        .stat-card {
            background: #1e293b;
            padding: 1.5rem;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 1.2rem;
            border: 1px solid rgba(255,255,255,0.05);
            transition: all 0.3s ease;
            &:hover { transform: translateY(-5px); border-color: rgba(34, 211, 238, 0.3); }

            .icon {
                width: 50px;
                height: 50px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
                color: #fff;
            }
            
            &.income .icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
            &.expense .icon { background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); }
            &.balance .icon { background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); }

            p { color: #94a3b8; font-size: 0.85rem; margin-bottom: 0.2rem; font-weight: 600; }
            h3 { font-size: 1.5rem; margin: 0; font-weight: 800; color: #f8fafc; }
        }
    }

    .main-grid {
        display: grid;
        grid-template-columns: 1.8fr 1fr;
        gap: 2rem;
        @media (max-width: 1200px) { grid-template-columns: 1fr; }

        .chart-section {
            background: #1e293b;
            border-radius: 24px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            
            h3, h4 { margin-top: 0; margin-bottom: 1.5rem; color: #f8fafc; font-size: 1.2rem; font-weight: 700; }

            .chart-container{ height: 300px; margin-bottom: 2rem; }

            .doughnut-container {
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 1.5rem;
                .doughnut-wrapper { height: 250px; width: 100%; }
                
                @media (max-width: 600px) {
                    .doughnut-wrapper { height: 350px; }
                }
            }
        }

        .history-section {
             display: flex;
             flex-direction: column;
             gap: 1.5rem;
             
             .min-max-stats {
                 display: grid;
                 grid-template-columns: 1fr 1fr;
                 gap: 1rem;
                 .mm-item {
                     background: #1e293b;
                     padding: 1.2rem;
                     border-radius: 18px;
                     border: 1px solid rgba(255, 255, 255, 0.05);
                     text-align: center;
                     p { color: #94a3b8; font-size: 0.75rem; margin-bottom: 0.5rem; font-weight: 700; text-transform: uppercase; }
                     span { color: #f1f5f9; font-weight: 800; font-size: 1.1rem; }
                 }
             }
        }
    }
`;

export default Dashboard
