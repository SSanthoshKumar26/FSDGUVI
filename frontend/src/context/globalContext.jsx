import React, { useContext, useState } from "react";
import axios from "axios";
import API_URL from "../utils/api";

const BASE_URL = `${API_URL}/api/v1`;

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);

    // Fetch transactions
    const getTransactions = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/get-transactions`);

            const txns = Array.isArray(response.data)
                ? response.data
                : response.data.data || response.data.transactions || [];

            setTransactions(txns);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch transactions");
            setTransactions([]);
        }
    };

    // Add transaction
    const addTransaction = async (transaction) => {
        try {
            await axios.post(`${BASE_URL}/add-transaction`, transaction);
            getTransactions();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add transaction");
            throw err;
        }
    };

    // Delete transaction
    const deleteTransaction = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/delete-transaction/${id}`);
            getTransactions();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete transaction");
        }
    };

    const incomes = transactions.filter(t => t.type === "income");
    const expenses = transactions.filter(t => t.type === "expense");

    const totalIncome = () =>
        incomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const totalExpense = () =>
        expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const totalBalance = () => totalIncome() - totalExpense();

    const transactionHistory = () =>
        [...transactions]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

    const triggerSummaryMail = async (email) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/mail/trigger-summary`,
                { email }
            );
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to trigger email");
            throw err;
        }
    };

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
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
