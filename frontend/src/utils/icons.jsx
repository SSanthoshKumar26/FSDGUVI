import React from 'react';
import styled from 'styled-components';
// unused import removed

import { FaChartLine, FaCreditCard, FaTags, FaWallet, FaSignOutAlt, FaMoneyBillWave } from 'react-icons/fa';

const dashboard = <FaChartLine />
const transactions = <FaCreditCard />
const categories = <FaTags />
const accounts = <FaWallet />
const signout = <FaSignOutAlt />
const trend = <FaMoneyBillWave />
const expenses = <FaMoneyBillWave /> // Reusing or finding another icon

export {
    dashboard, transactions, categories, accounts, signout, trend, expenses
}
