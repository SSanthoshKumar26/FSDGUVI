import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext'

function History() {
    const { transactionHistory } = useGlobalContext()
    const [...history] = transactionHistory()

    return (
        <HistoryStyled>
            <h3>Recent Transactions</h3>
            {history.map((item) => {
                const { _id, title, amount, type, emotion } = item
                const emotionMap = {
                    happy: '😊',
                    guilty: '😔',
                    impulsive: '💸',
                    stressed: '😰',
                    bored: '🥱',
                    neutral: '😐'
                }
                return (
                    <div key={_id} className="history-item">
                        <div className="title-con">
                            <p style={{
                                color: type === 'expense' ? 'var(--color-accent-pink)' : 'var(--color-accent-green)'
                            }}>
                                {title} {type === 'expense' && emotionMap[emotion || 'neutral']}
                            </p>
                        </div>

                        <p style={{
                            color: type === 'expense' ? 'var(--color-accent-pink)' : 'var(--color-accent-green)'
                        }}>
                            {
                                type === 'expense' ? `-${amount <= 0 ? 0 : amount}` : `+${amount <= 0 ? 0 : amount}`
                            }
                        </p>
                    </div>
                )
            })}
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    h3 { 
        margin-top: 0; 
        color: var(--color-text-main); 
    }
    .history-item{
        background: var(--color-secondary);
        border: 1px solid var(--color-border);
        padding: 1rem;
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
        &:hover {
             border-color: var(--color-accent-cyan);
             transform: translateX(5px);
        }
    }
`;

export default History
