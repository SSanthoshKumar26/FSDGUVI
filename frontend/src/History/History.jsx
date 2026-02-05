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
                                color: type === 'expense' ? '#f472b6' : '#34d399'
                            }}>
                                {title} {type === 'expense' && emotionMap[emotion || 'neutral']}
                            </p>
                        </div>

                        <p style={{
                            color: type === 'expense' ? '#f472b6' : '#34d399'
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
    h3 { margin-top: 0; color: #f8fafc; }
    .history-item{
        background: #1e293b;
        border: 1px solid rgba(255, 255, 255, 0.05);
        padding: 1rem;
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: 0.2s;
        &:hover {
             background: #253347;
        }
    }
`;

export default History
