import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
)

function Chart() {
    const { incomes, expenses } = useGlobalContext()

    const data = {
        labels: incomes.map((inc) => {
            const { date } = inc
            return dateFormat(date)
        }),
        datasets: [
            {
                label: 'Income',
                data: [
                    ...incomes.map((income) => {
                        const { amount } = income
                        return amount
                    })
                ],
                backgroundColor: '#34d399',
                borderColor: '#34d399',
                tension: .2,
                pointBackgroundColor: '#34d399',
            },
            {
                label: 'Expenses',
                data: [
                    ...expenses.map((expense) => {
                        const { amount } = expense
                        return amount
                    })
                ],
                backgroundColor: '#f472b6',
                borderColor: '#f472b6',
                tension: .2,
                pointBackgroundColor: '#f472b6',
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#94a3b8' // Slate 400
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            }
        }
    }


    return (
        <ChartStyled >
            <Line data={data} options={options} />
        </ChartStyled>
    )
}

const ChartStyled = styled.div`
    background: transparent; // Let parent control bg
    height: 100%;
    width: 100%;
`;

export default Chart
