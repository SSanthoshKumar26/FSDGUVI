
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRegNewspaper, FaChartLine, FaIndianRupeeSign, FaBolt } from 'react-icons/fa6'

const newsData = [
    {
        id: 1,
        title: "Union Budget 2026: 'AI-First' Economy Focus",
        desc: "Finance Minister Sitharaman announced record ₹12.2 lakh crore Capex target for FY27.",
        tag: "Budget 2026",
        color: "#0ea5e9"
    },
    {
        id: 2,
        title: "India-US Trade Deal Slashes Tariffs",
        desc: "Reciprocal tariffs lowered to 18%, boosting GDP growth forecast to 6.9%.",
        tag: "Global Trade",
        color: "#10b981"
    },
    {
        id: 3,
        title: "Nifty Drops 2% Post STT Hike",
        desc: "Market reacts to increased Securities Transaction Tax on derivatives trades.",
        tag: "Markets",
        color: "#f43f5e"
    },
    {
        id: 4,
        title: "ISM 2.0 Launched for Semiconductor Boost",
        desc: "₹40,000 crore outlay for local electronics component manufacturing.",
        tag: "Tech Policy",
        color: "#6366f1"
    }
]

function FinancialNews() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % newsData.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <NewsStyled
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
        >
            <div className="news-header">
                <div className="title">
                    <FaRegNewspaper /> <span>Live Finance Feed</span>
                </div>
                <div className="live-indicator">
                    <span className="dot"></span> LIVE
                </div>
            </div>

            <div className="news-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={newsData[index].id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="news-item"
                    >
                        <div className="tag" style={{ backgroundColor: `${newsData[index].color}20`, color: newsData[index].color }}>
                            {newsData[index].tag}
                        </div>
                        <h4>{newsData[index].title}</h4>
                        <p>{newsData[index].desc}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="quick-stats">
                <div className="q-item">
                    <FaIndianRupeeSign /> <span>USD/INR: 83.42</span>
                </div>
                <div className="q-item">
                    <FaBolt /> <span>NIFTY: 22,142</span>
                </div>
            </div>
        </NewsStyled>
    )
}

const NewsStyled = styled(motion.div)`
    background: var(--color-secondary);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 250px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);

    .news-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        .title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--color-text-main);
            font-weight: 700;
            font-size: 0.9rem;
            svg { color: #f59e0b; }
        }
        .live-indicator {
            font-size: 0.7rem;
            font-weight: 800;
            color: #fb7185;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            .dot {
                width: 6px;
                height: 6px;
                background: #fb7185;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
            }
        }
    }

    .news-content {
        flex: 1;
        display: flex;
        align-items: center;
        .news-item {
            .tag {
                display: inline-block;
                padding: 0.2rem 0.6rem;
                border-radius: 6px;
                font-size: 0.7rem;
                font-weight: 700;
                text-transform: uppercase;
                margin-bottom: 0.8rem;
            }
            h4 { margin: 0 0 0.5rem 0; color: var(--color-text-main); font-size: 1.1rem; line-height: 1.4; }
            p { margin: 0; color: var(--color-text-muted); font-size: 0.85rem; line-height: 1.5; }
        }
    }

    .quick-stats {
        margin-top: 1.2rem;
        display: flex;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
        .q-item {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.75rem;
            color: var(--color-text-muted);
            font-weight: 600;
        }
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
    }
`;

export default FinancialNews
