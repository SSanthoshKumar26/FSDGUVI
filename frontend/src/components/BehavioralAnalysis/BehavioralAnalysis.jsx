
import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBrain, FaRegAngry, FaLaughBeam, FaHeartBroken, FaRunning, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useGlobalContext } from '../../context/globalContext'

function BehavioralAnalysis() {
    const { transactions, totalIncome, totalExpense } = useGlobalContext()
    const [monthlyTargetPercent, setMonthlyTargetPercent] = useState(30)
    const [currentTime, setCurrentTime] = useState(new Date())

    // Update time for calculations every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    const analysis = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense')

        // Emotion counts
        const emotions = {
            happy: { count: 0, amount: 0, label: 'Reward/Happy', icon: <FaLaughBeam color="#34d399" /> },
            guilty: { count: 0, amount: 0, label: 'Guilty/Regret', icon: <FaHeartBroken color="#f472b6" /> },
            impulsive: { count: 0, amount: 0, label: 'Impulsive/Flashy', icon: <FaRegAngry color="#f59e0b" /> },
            stressed: { count: 0, amount: 0, label: 'Stress Spend', icon: <FaRegAngry color="#ef4444" /> },
            bored: { count: 0, amount: 0, label: 'Boredom/Habit', icon: <FaRunning color="#6366f1" /> },
            neutral: { count: 0, amount: 0, label: 'Neutral', icon: <FaBrain color="#94a3b8" /> }
        }

        expenses.forEach(t => {
            const emo = t.emotion || 'neutral'
            if (emotions[emo]) {
                emotions[emo].count += 1
                emotions[emo].amount += t.amount
            }
        })

        // Habit Identification
        const habitKillingSavings = []
        if (emotions.impulsive.count > 2 || emotions.impulsive.amount > (totalIncome() * 0.1)) {
            habitKillingSavings.push({
                habit: "Impulsive Shopping",
                impact: "High",
                advice: "You're spending too much on impulse. Try the '24-hour rule' before checkout."
            })
        }
        if (emotions.guilty.count > 1) {
            habitKillingSavings.push({
                habit: "Regretful Spending",
                impact: "Medium",
                advice: "You are often regretting your buys. Stick to a pre-planned shopping list."
            })
        }
        if (emotions.bored.count > 3) {
            habitKillingSavings.push({
                habit: "Automated Boredom",
                impact: "Sustained",
                advice: "Boredom is your savings killer. Find a hobby that doesn't cost money when you're bored."
            })
        }

        return { emotions, habits: habitKillingSavings }
    }, [transactions, totalIncome])

    // Challenge Logic
    const challengeData = useMemo(() => {
        const income = totalIncome()
        const targetAmount = (income * monthlyTargetPercent) / 100
        const daysInMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate()
        const currentDay = currentTime.getDate()

        const dailyTarget = targetAmount / daysInMonth

        // Calculate accrued target up to today
        const accruedTarget = dailyTarget * currentDay

        // Calculate actual savings so far (Income - All Expenses since start of month)
        const startOfMonth = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1)
        const monthTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth)
        const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0)
        const monthExpense = monthTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0)
        const actualSavings = monthIncome - monthExpense

        // REFINED RECOVERY LOGIC:
        // Instead of asking for the whole gap in one day, amortize it over the rest of the month
        const gap = accruedTarget - actualSavings
        const remainingDays = daysInMonth - currentDay + 1
        const todayRequired = dailyTarget + (gap > 0 ? (gap / remainingDays) : 0)

        return {
            dailyTarget,
            actualSavings,
            todayRequired,
            isBehind: actualSavings < (accruedTarget - 1), // small buffer
            progress: targetAmount > 0 ? (actualSavings / targetAmount) * 100 : 0
        }
    }, [transactions, totalIncome, totalExpense, monthlyTargetPercent, currentTime])

    return (
        <AnalysisStyled>
            <div className="section-title">
                <h3><FaBrain /> Psychological Spending Analysis</h3>
                <p>Understanding the "Why" behind your money.</p>
            </div>

            <div className="analysis-grid">
                <motion.div
                    className="emotional-state card"
                    whileHover={{ scale: 1.02 }}
                >
                    <h4>Emotional Spending Profile</h4>
                    <div className="emotion-list">
                        {Object.entries(analysis.emotions).filter(([_, v]) => v.count > 0).map(([k, v]) => (
                            <div key={k} className="emotion-item">
                                <span className="icon">{v.icon}</span>
                                <div className="info">
                                    <div className="label">{v.label}</div>
                                    <div className="bar-container">
                                        <div className="bar" style={{ width: `${(v.amount / totalExpense()) * 100}%`, backgroundColor: v.icon.props.color }}></div>
                                    </div>
                                </div>
                                <span className="val">₹{v.amount.toLocaleString()}</span>
                            </div>
                        ))}
                        {totalExpense() === 0 && <p className="nomsg">No expense history to analyze emotions.</p>}
                    </div>
                </motion.div>

                <motion.div
                    className="habits card"
                    whileHover={{ scale: 1.02 }}
                >
                    <h4>Habit Warning Center</h4>
                    <div className="habit-list">
                        {analysis.habits.length > 0 ? analysis.habits.map((h, i) => (
                            <div key={i} className="habit-card">
                                <div className="header">
                                    <FaExclamationTriangle color="#ef4444" />
                                    <span>{h.habit}</span>
                                    <small>{h.impact} Impact</small>
                                </div>
                                <p>{h.advice}</p>
                            </div>
                        )) : <div className="perfect-habit"><FaCheckCircle color="#34d399" /> Your spending habits look mindful!</div>}
                    </div>
                </motion.div>

                <motion.div
                    className="savings-challenge card full-width"
                    whileHover={{ scale: 1.01 }}
                >
                    <div className="challenge-top">
                        <h4>Daily Savings Challenge</h4>
                        <div className="target-selector">
                            Target:
                            <select value={monthlyTargetPercent} onChange={(e) => setMonthlyTargetPercent(e.target.value)}>
                                <option value="10">10%</option>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                                <option value="40">40%</option>
                                <option value="50">50%</option>
                            </select>
                        </div>
                    </div>

                    <div className="challenge-main">
                        <div className="gauge">
                            <div className="gauge-val" style={{ color: challengeData.isBehind ? '#fb7185' : '#10b981' }}>
                                ₹{challengeData.todayRequired.toLocaleString()}
                            </div>
                            <div className="gauge-label">{challengeData.isBehind ? '🔴 Recovery Target' : '🟢 Daily Target'}</div>
                        </div>

                        <div className="progress-info">
                            <div className="prog-text">
                                <span>Month Progress</span>
                                <span>{challengeData.progress.toFixed(1)}%</span>
                            </div>
                            <div className="main-bar">
                                <motion.div
                                    className="fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, Math.max(0, challengeData.progress))}%` }}
                                    transition={{ duration: 1 }}
                                    style={{ backgroundColor: challengeData.isBehind ? '#ef4444' : '#10b981' }}
                                />
                            </div>
                            <p className="status-msg">
                                {challengeData.isBehind
                                    ? "⚠️ You missed a few days of target. Your daily requirement has increased to cover the backlog."
                                    : "✅ You are ahead of schedule! Keep this momentum to crush your monthly goal."}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnalysisStyled>
    )
}

const AnalysisStyled = styled.div`
    margin-top: 2rem;
    width: 100%;
    
    .section-title {
        margin-bottom: 2rem;
        h3 { display: flex; align-items: center; gap: 1rem; color: var(--color-text-main); font-size: 1.5rem; margin: 0; svg { color: #818cf8; } }
        p { color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.5rem; }
    }

    .analysis-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        
        @media (max-width: 1024px) {
            grid-template-columns: 1fr;
        }

        .card {
            background: var(--color-secondary);
            border-radius: 24px;
            padding: 1.8rem;
            border: 1px solid var(--color-border);
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            min-width: 0; /* Prevent grid overflow */
            
            @media (max-width: 480px) {
                padding: 1.2rem;
            }
            
            h4 { color: var(--color-text-main); margin-top: 0; margin-bottom: 1.5rem; font-size: 1.1rem; border-left: 4px solid #818cf8; padding-left: 10px; }
        }

        .full-width { grid-column: 1 / -1; }
    }

    .emotion-list {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        .emotion-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            .icon { font-size: 1.2rem; flex-shrink: 0; }
            .info {
                flex: 1;
                min-width: 0;
                .label { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 0.4rem;  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .bar-container {
                    height: 6px;
                    background: rgba(0,0,0,0.1);
                    border-radius: 3px;
                    .bar { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
                }
            }
            .val { font-size: 0.9rem; font-weight: 700; color: var(--color-text-main); white-space: nowrap; }
        }
        .nomsg { color: var(--color-text-muted); font-style: italic; text-align: center; }
    }

    .habit-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .habit-card {
            background: rgba(239, 68, 68, 0.05);
            border: 1px solid rgba(239, 68, 68, 0.1);
            padding: 1.2rem;
            border-radius: 16px;
            @media (max-width: 480px) { padding: 1rem; }
            
            .header {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                margin-bottom: 0.5rem;
                flex-wrap: wrap; /* allow wrap on very small screens */
                span { font-weight: 700; color: var(--color-text-main); }
                small { margin-left: auto; color: #fb7185; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; white-space: nowrap; }
            }
            p { margin: 0; font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5; }
        }
        .perfect-habit {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            height: 100px;
            color: var(--color-accent-green);
            font-weight: 600;
        }
    }

    .savings-challenge {
        .challenge-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
            .target-selector {
                font-size: 0.9rem;
                color: var(--color-text-muted);
                select {
                    background: rgba(0,0,0,0.05);
                    border: none;
                    color: var(--color-text-main);
                    padding: 0.3rem 0.6rem;
                    border-radius: 8px;
                    margin-left: 0.5rem;
                    outline: none;
                }
            }
        }

        .challenge-main {
            display: flex;
            align-items: center;
            gap: 3rem;
            @media (max-width: 768px) { flex-direction: column; gap: 1.5rem; align-items: stretch; }

            .gauge {
                text-align: center;
                padding: 2rem;
                background: rgba(0,0,0,0.02);
                border-radius: 20px;
                border: 1px dashed var(--color-border);
                min-width: 200px;
                @media (max-width: 480px) { padding: 1.5rem; width: 100%; min-width: 0; }
                
                .gauge-val { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -1px; color: var(--color-text-main); word-break: break-all; }
                .gauge-label { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 2px; }
            }

            .progress-info {
                flex: 1;
                width: 100%;
                min-width: 0;
                .prog-text {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.8rem;
                    span { font-size: 0.95rem; font-weight: 600; color: var(--color-text-main); }
                }
                .main-bar {
                    height: 12px;
                    background: rgba(0,0,0,0.1);
                    border-radius: 6px;
                    margin-bottom: 1rem;
                    overflow: hidden;
                    .fill { height: 100%; border-radius: 6px; }
                }
                .status-msg { margin: 0; font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.6; }
            }
        }
    }
`;

export default BehavioralAnalysis
