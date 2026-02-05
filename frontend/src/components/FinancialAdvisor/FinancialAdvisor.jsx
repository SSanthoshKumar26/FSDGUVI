
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FaChalkboardTeacher, FaChartLine, FaPiggyBank, FaBitcoin, FaGem } from 'react-icons/fa'
import { useGlobalContext } from '../../context/globalContext'

function FinancialAdvisor() {
    const { totalIncome, totalExpense } = useGlobalContext()

    const income = totalIncome()
    const expense = totalExpense()
    const savings = income - expense
    const savingsRate = income > 0 ? (savings / income) * 100 : 0

    const suggestions = useMemo(() => {
        const targetRate = 30 // Target 30% savings
        const shortfall = targetRate - savingsRate

        const advice = []

        if (savingsRate < 0) {
            advice.push({
                icon: <FaPiggyBank />,
                title: "Emergency Alert",
                desc: "Your expenses exceed your income. Priority #1: Cut non-essential subscriptions and luxury spending immediately to build a safety net.",
                color: "#ef4444"
            })
        } else if (savingsRate < 20) {
            advice.push({
                icon: <FaChartLine />,
                title: "Boost Savings",
                desc: `You're saving ${savingsRate.toFixed(1)}%. Aim for 20% by automating a transfer of ₹${(income * 0.2).toLocaleString()} to a separate RD account.`,
                color: "#f59e0b"
            })
        } else {
            advice.push({
                icon: <FaGem />,
                title: "Wealth Preservation",
                desc: "Excellent! Your savings rate is healthy. Consider diversifying your surplus into low-risk instruments.",
                color: "#10b981"
            })
        }

        // Investment Guide
        advice.push({
            icon: <FaChalkboardTeacher />,
            title: "Diversification Strategy",
            desc: "Split your ₹" + savings.toLocaleString() + " savings: 50% in FD/RD for stability, 30% in Index Funds, and 20% in high-growth assets.",
            color: "#6366f1"
        })

        advice.push({
            icon: <FaBitcoin />,
            title: "Crypto (BNB/BTC) Guide",
            desc: "Allocate only 5-10% of your portfolio here. Use it for long-term 'HODLing' rather than day trading to minimize stress.",
            color: "#f3ba2f"
        })

        return advice
    }, [income, expense, savingsRate])

    return (
        <AdvisorStyled
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="advisor-header">
                <h3><FaChalkboardTeacher /> AI Financial Advisor</h3>
                <p>Personalized investment guidance based on your spending habits.</p>
            </div>

            <div className="stats-indicator">
                <div className="status-label">Current Savings Rate: <span>{savingsRate.toFixed(1)}%</span></div>
                <div className="progress-bar">
                    <motion.div
                        className="fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>

            <div className="advice-grid">
                {suggestions.map((item, index) => (
                    <motion.div
                        key={index}
                        className="advice-card"
                        whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                            {item.icon}
                        </div>
                        <div className="text">
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AdvisorStyled>
    )
}

const AdvisorStyled = styled(motion.div)`
    background: var(--color-secondary);
    border: 1px solid var(--color-border);
    border-radius: 24px;
    padding: 2rem;
    margin-top: 2rem;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
    
    @media (max-width: 480px) {
        padding: 1rem;
        border-radius: 16px;
    }

    .advisor-header {
        margin-bottom: 2rem;
        h3 {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: var(--color-text-main);
            font-size: 1.5rem;
            margin: 0;
            svg { color: var(--color-accent-cyan); }
        }
        p { color: var(--color-text-muted); margin-top: 0.5rem; font-size: 0.9rem; }
    }

    .stats-indicator {
        margin-bottom: 2rem;
        .status-label {
            color: var(--color-text-main);
            font-size: 0.9rem;
            margin-bottom: 0.8rem;
            span { font-weight: 700; color: var(--color-accent-cyan); }
        }
        .progress-bar {
            height: 10px;
            background: rgba(0,0,0,0.1);
            border-radius: 5px;
            overflow: hidden;
            [data-theme='dark'] & { background: #334155; }
            .fill {
                height: 100%;
                background: linear-gradient(90deg, var(--color-accent-cyan), #0ea5e9);
            }
        }
    }

    .advice-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        
        @media (max-width: 600px) {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
    }

    .advice-card {
        background: rgba(0,0,0,0.02);
        padding: 1.5rem;
        border-radius: 16px;
        display: flex;
        gap: 1rem;
        border: 1px solid var(--color-border);
        transition: all 0.3s ease;
        
        @media (max-width: 480px) {
            padding: 1rem;
            gap: 0.8rem;
        }

        .icon {
            width: 45px;
            height: 45px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            flex-shrink: 0;
        }

        .text {
            min-width: 0; /* Important for flex child wrapping */
            h4 { margin: 0 0 0.5rem 0; font-size: 1rem; color: var(--color-text-main); word-wrap: break-word; }
            p { margin: 0; font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5; word-wrap: break-word; }
        }
    }
`;

export default FinancialAdvisor
