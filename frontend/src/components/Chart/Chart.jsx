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

    const getStyle = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    const colorGreen = getStyle('--color-accent-green') || '#10b981';
    const colorPink = getStyle('--color-accent-pink') || '#f43f5e';
    const colorMuted = getStyle('--color-text-muted') || '#94a3b8';
    const colorBorder = getStyle('--color-border') || 'rgba(0,0,0,0.1)';

    const data = {
        labels: incomes.map((inc) => {
            const { date } = inc
            return dateFormat(date)
        }),
        datasets: [
            {
                label: 'Income',
                data: incomes.map((income) => income.amount),
                backgroundColor: colorGreen,
                borderColor: colorGreen,
                tension: .2,
                pointBackgroundColor: colorGreen,
            },
            {
                label: 'Expenses',
                data: expenses.map((expense) => expense.amount),
                backgroundColor: colorPink,
                borderColor: colorPink,
                tension: .2,
                pointBackgroundColor: colorPink,
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: colorMuted
                }
            }
        },
        scales: {
            x: {
                ticks: { color: colorMuted },
                grid: { color: colorBorder }
            },
            y: {
                ticks: { color: colorMuted },
                grid: { color: colorBorder }
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
    background: transparent;
    height: 100%;
    width: 100%;
    position: relative; /* Crucial for responsiveness */
    min-width: 0;
`;

export default Chart
