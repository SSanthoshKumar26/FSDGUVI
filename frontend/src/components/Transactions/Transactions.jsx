import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { InnerLayout } from '../../utils/layouts'
import { dateFormat } from '../../utils/dateFormat'
import { FaTrash, FaPen, FaMoneyBillWave, FaCalendar, FaCommentDots, FaArrowDown, FaArrowUp, FaSearch } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

function Transactions({ filterType = 'all' }) {
    const { transactions, getTransactions, deleteTransaction } = useGlobalContext()
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    useEffect(() => {
        getTransactions()
    }, [])

    // Check 12h limit
    const canEdit = (createdAt) => {
        const createdTime = new Date(createdAt).getTime()
        const currentTime = new Date().getTime()
        const hoursDiff = (currentTime - createdTime) / (1000 * 60 * 60)
        return hoursDiff <= 12
    }

    // Filter Logic
    const filteredTransactions = transactions.filter(t => {
        const matchesType = filterType === 'all' ? true : t.type === filterType;
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ? true : t.category === selectedCategory;
        return matchesType && matchesSearch && matchesCategory;
    });

    const uniqueCategories = ['all', ...new Set(transactions.map(t => t.category))];

    return (
        <TransactionsStyled>
            <InnerLayout>
                <div className="header-actions">
                    <h1>{filterType === 'all' ? 'All Transactions' : filterType === 'income' ? 'Incomes' : 'Expenses'}</h1>
                    <div className="filters">
                        <div className="search-box">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="category-select"
                        >
                            {uniqueCategories.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="transactions-list">
                    {filteredTransactions.length === 0 && <p className="no-data">No transactions found.</p>}

                    <AnimatePresence mode="popLayout">
                        {filteredTransactions.map((transaction) => {
                            const { _id, title, amount, date, category, description, type, createdAt } = transaction
                            return (
                                <motion.div
                                    key={_id}
                                    className="transaction-item"
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={`icon ${type}`}>
                                        {type === 'expense' ? <FaArrowDown /> : <FaArrowUp />}
                                    </div>
                                    <div className="content">
                                        <div className="title-row">
                                            <h5>{title}</h5>
                                            <span className={`amount ${type}`}>
                                                {type === 'expense' ? '-' : '+'}₹{amount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="inner-content">
                                            <div className="text">
                                                <p><FaCalendar /> {dateFormat(date)}</p>
                                                <p className="description"><FaCommentDots /> {description}</p>
                                                <span className="category-pill">{category}</span>
                                                <span className="category-pill" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--color-text-muted)' }}>
                                                    {transaction.paymentMethod || 'Cash'}
                                                </span>
                                            </div>
                                            <div className="btn-con">
                                                {canEdit(createdAt) && (
                                                    <button className="edit-btn" title="Edit (Only within 12h)">
                                                        <FaPen />
                                                    </button>
                                                )}
                                                <button className="delete-btn" onClick={() => deleteTransaction(_id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </InnerLayout>
        </TransactionsStyled>
    )
}

const TransactionsStyled = styled.div`
    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        gap: 1rem;
        
        h1{ margin: 0; color: var(--color-text-main); }
        
        .filters {
            display: flex;
            gap: 1rem;
            
            .search-box {
                background: var(--color-secondary);
                padding: 0.5rem 1rem;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                border: 1px solid var(--color-border);
                color: var(--color-text-muted);
                input {
                    background: transparent;
                    border: none;
                    outline: none;
                    color: var(--color-text-main);
                    &::placeholder { color: var(--color-text-muted); opacity: 0.6; }
                }
            }
            .category-select {
                background: var(--color-secondary);
                border: 1px solid var(--color-border);
                color: var(--color-text-main);
                padding: 0.5rem 1rem;
                border-radius: 12px;
                outline: none;
            }
        }
    }

    .transactions-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        
        .no-data {
            text-align: center;
            color: var(--color-text-muted);
            margin-top: 2rem;
        }

        .transaction-item {
            background: var(--color-secondary);
            border: 1px solid var(--color-border);
            border-radius: 20px;
            padding: 1.2rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            transition: all 0.2s ease;
            
            &:hover {
                transform: translateY(-2px);
                background: var(--color-secondary);
                // add brightness filter instead of color change for generic theme supoprt
                filter: brightness(1.1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .icon {
                width: 60px;
                height: 60px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                flex-shrink: 0;
                
                &.expense { background: rgba(244, 114, 182, 0.15); color: var(--color-accent-pink); }
                &.income { background: rgba(52, 211, 153, 0.15); color: var(--color-accent-green); }
            }

            .content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                
                .title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    h5 { font-size: 1.2rem; margin: 0; color: var(--color-text-main); }
                    .amount { 
                        font-weight: 700; 
                        font-size: 1.2rem; 
                        &.expense { color: var(--color-accent-pink); }
                        &.income { color: var(--color-accent-green); }
                    }
                }

                .inner-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;

                    .text {
                        display: flex;
                        align-items: center;
                        gap: 1.5rem;
                        flex-wrap: wrap;
                        
                        p {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            color: var(--color-text-muted);
                            font-size: 0.9rem;
                        }
                        
                        .category-pill {
                            background: rgba(34, 211, 238, 0.1);
                            color: var(--color-accent-cyan);
                            padding: 0.2rem 0.8rem;
                            border-radius: 20px;
                            font-size: 0.8rem;
                            text-transform: capitalize;
                        }
                    }

                    .btn-con {
                        display: flex;
                        gap: 0.8rem;
                        button {
                            border: none;
                            background: rgba(255,255,255,0.05);
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            transition: 0.2s;
                            
                            &.delete-btn { color: var(--color-accent-pink); &:hover { background: rgba(244, 114, 182, 0.2); }}
                            &.edit-btn { color: var(--color-accent-cyan); &:hover { background: rgba(34, 211, 238, 0.2); }}
                        }
                    }
                }
            }
        }
    }
    
    @media (max-width: 768px) {
        .inner-content {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
            width: 100%;
            .btn-con { width: 100%; justify-content: flex-end; }
        }
        .transaction-item {
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem;
            .icon { width: 45px; height: 45px; font-size: 1.1rem; margin-bottom: 0.5rem; }
            .content { 
                width: 100%; 
                .title-row {
                    h5 { font-size: 1.1rem; }
                    .amount { font-size: 1.1rem; }
                }
                .text {
                    gap: 1rem;
                    p { font-size: 0.8rem; }
                }
            }
        }
        .header-actions {
            flex-direction: column;
            align-items: flex-start;
            .filters {
                width: 100%;
                flex-direction: column;
                .search-box, .category-select { width: 100%; }
            }
        }
    }
`;

export default Transactions
