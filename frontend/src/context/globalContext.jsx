import React, { useContext, useState } from "react"
import axios from 'axios'

import API_URL from "../utils/api";

const BASE_URL = API_URL + "/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({ children }) => {

    const [transactions, setTransactions] = useState([])
    const [error, setError] = useState(null)

    // Fetch all transactions
    const getTransactions = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-transactions`)
            setTransactions(response.data)
        } catch (err) {
            setError(err.response?.data?.message)
        }
    }

    const addTransaction = async (transaction) => {
        try {
            await axios.post(`${BASE_URL}add-transaction`, transaction)
            getTransactions()
        } catch (err) {
            setError(err.response?.data?.message)
            throw err
        }
    }

    const deleteTransaction = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-transaction/${id}`)
            getTransactions()
        } catch (err) {
            setError(err.response?.data?.message)
        }
    }

    const incomes = transactions.filter(t => t.type === 'income')
    const expenses = transactions.filter(t => t.type === 'expense')

    const totalIncome = () => {
        return incomes.reduce((acc, curr) => acc + curr.amount, 0)
    }

    const totalExpense = () => {
        return expenses.reduce((acc, curr) => acc + curr.amount, 0)
    }

    const totalBalance = () => {
        return totalIncome() - totalExpense()
    }

    const transactionHistory = () => {
        const history = [...transactions]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 5) // Recent 5
    }

    const triggerSummaryMail = async (email) => {
        try {
            const response = await axios.post(`${BASE_URL}mail/trigger-summary`, { email })
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to trigger email')
            throw err
        }
    }

    return (
        <GlobalContext.Provider value={{
            getTransactions,
            addTransaction,
            deleteTransaction,
            triggerSummaryMail,
            transactions,
            incomes,
            expenses,
            totalIncome,
            totalExpense,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}
