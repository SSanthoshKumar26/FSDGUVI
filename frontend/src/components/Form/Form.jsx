import React, { useState } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import { FaPlus, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Form({ closeCallback }) {
    const { addTransaction, error, setError } = useGlobalContext()
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: new Date(),
        category: '',
        description: '',
        type: 'income',
        division: 'Personal',
        emotion: 'neutral',
        paymentMethod: 'Cash'
    })
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { title, amount, date, category, description, type, division, emotion, paymentMethod } = inputState;

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value })
        setError('')
    }

    const handleSubmit = async e => {
        e.preventDefault()

        // Safety Checks
        if (!amount || isNaN(amount) || amount <= 0) {
            setError("Please enter a valid amount greater than 0");
            return;
        }
        if (!title) {
            setError("Title is required");
            return;
        }

        setLoading(true);
        try {
            await addTransaction({
                ...inputState,
                amount: parseFloat(amount) // Ensure Number
            })

            setSuccessMsg('Transaction Added Successfully!');

            // Reset Form but keep current date/type for convenience
            setInputState({
                title: '',
                amount: '',
                date: new Date(),
                category: '',
                description: '',
                type: type,
                division: division,
                paymentMethod: 'Cash'
            })

            // Auto close after short delay
            setTimeout(() => {
                if (closeCallback) closeCallback();
            }, 1000);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to add transaction");
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='error-box'
                >
                    <FaExclamationCircle /> {error}
                </motion.div>
            )}
            {successMsg && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='success-box'
                >
                    <FaCheck /> {successMsg}
                </motion.div>
            )}

            <div className="tabs">
                <div
                    className={`tab ${type === 'income' ? 'active-tab income' : ''}`}
                    onClick={() => setInputState({ ...inputState, type: 'income' })}
                >Income</div>
                <div
                    className={`tab ${type === 'expense' ? 'active-tab expense' : ''}`}
                    onClick={() => setInputState({ ...inputState, type: 'expense' })}
                >Expense</div>
            </div>

            <div className="form-grid">
                <div className="input-control">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        name={'title'}
                        placeholder="e.g. Salary, Rent"
                        onChange={handleInput('title')}
                    />
                </div>
                <div className="input-control">
                    <label>Amount (₹)</label>
                    <input value={amount}
                        type="number"
                        name={'amount'}
                        placeholder={'0.00'}
                        onChange={handleInput('amount')}
                    />
                </div>
                <div className="input-control">
                    <label>Date</label>
                    <DatePicker
                        id='date'
                        placeholderText='DD/MM/YYYY'
                        selected={date}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => {
                            setInputState({ ...inputState, date: date })
                        }}
                        className="date-picker-input"
                    />
                </div>

                <div className="input-control">
                    <label>Category</label>
                    <select required value={category} name="category" id="category" onChange={handleInput('category')}>
                        <option value="" disabled >Select Category</option>
                        <option value="education">Education</option>
                        <option value="groceries">Groceries</option>
                        <option value="health">Health</option>
                        <option value="subscriptions">Subscriptions</option>
                        <option value="takeaways">Takeaways</option>
                        <option value="clothing">Clothing</option>
                        <option value="travelling">Travelling</option>
                        <option value="other">Other</option>
                        <option value="salary">Salary (Income Only)</option>
                        <option value="freelancing">Freelancing</option>
                        <option value="investments">Investments</option>
                        <option value="bank">Bank Transfer</option>
                    </select>
                </div>
                <div className="input-control">
                    <label>Division</label>
                    <select required value={division} name="division" id="division" onChange={handleInput('division')}>
                        <option value="Personal">Personal</option>
                        <option value="Office">Office</option>
                    </select>
                </div>
                <div className="input-control">
                    <label>Payment Method</label>
                    <select value={paymentMethod} name="paymentMethod" id="paymentMethod" onChange={handleInput('paymentMethod')}>
                        <option value="Cash">Cash 💵</option>
                        <option value="Card">Card 💳</option>
                        <option value="UPI">UPI 📱</option>
                        <option value="Bank Transfer">Bank 🏦</option>
                        <option value="Other">Other 🔄</option>
                    </select>
                </div>
                <div className="input-control" style={{ display: type === 'expense' ? 'block' : 'none' }}>
                    <label>How did this spend feel?</label>
                    <select value={emotion} name="emotion" id="emotion" onChange={handleInput('emotion')}>
                        <option value="neutral">Neutral 😐</option>
                        <option value="happy">Happy/Reward 😊</option>
                        <option value="guilty">Guilty/Regret 😔</option>
                        <option value="impulsive">Impulsive/Flashy 💸</option>
                        <option value="stressed">Stressed/Necessary 😰</option>
                        <option value="bored">Bored/Habit 🥱</option>
                    </select>
                </div>
            </div>

            <div className="input-control">
                <label>Description</label>
                <textarea name="description" value={description} placeholder='Add a short note...' id="description" cols="30" rows="3" onChange={handleInput('description')}></textarea>
            </div>

            <motion.div className="submit-btn" whileTap={{ scale: 0.98 }}>
                <button disabled={loading}>
                    {loading ? 'Adding...' : <><FaPlus /> Add Transaction</>}
                </button>
            </motion.div>
        </FormStyled>
    )
}


const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .error-box, .success-box {
        padding: 0.8rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }
    .error-box { background: rgba(244, 114, 182, 0.2); color: #f472b6; border: 1px solid rgba(244, 114, 182, 0.4); }
    .success-box { background: rgba(52, 211, 153, 0.2); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.4); }

    label {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        display: block;
    }

    input, textarea, select, .date-picker-input{
        font-family: inherit;
        font-size: 1rem;
        outline: none;
        border: none;
        padding: 0.8rem 1rem;
        border-radius: 12px;
        border: 1px solid var(--color-border);
        background: var(--color-primary);
        resize: none;
        color: var(--color-text-main);
        width: 100%;
        transition: 0.2s;
        
        &:focus {
            border-color: var(--color-accent-cyan);
            background: var(--color-secondary);
        }

        &::placeholder{
            color: var(--color-text-muted);
            opacity: 0.5;
        }
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        @media(max-width: 600px){
            grid-template-columns: 1fr;
        }
    }

    .tabs{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 0.5rem;
        background: var(--color-primary);
        padding: 0.5rem;
        border-radius: 16px;
        
        .tab{
            padding: 0.8rem;
            cursor: pointer;
            border-radius: 12px;
            text-align: center;
            color: var(--color-text-muted);
            transition: all 0.3s ease;
            font-weight: 500;
            
            &:hover {
                background: rgba(255,255,255,0.05);
            }
        }
        .active-tab{
             color: #fff;
             font-weight: 700;
             box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
             &.income { background: var(--color-accent-green); }
             &.expense { background: var(--color-accent-pink); }
        }
    }

    .submit-btn{
        button{
            width: 100%;
            padding: 1rem;
            border-radius: 12px;
            background: var(--color-accent-cyan);
            border: none;
            color: #fff;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: 0.3s;
            &:disabled { opacity: 0.7; cursor: not-allowed; }
            &:hover:not(:disabled){
                background: #0ea5e9;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(34, 211, 238, 0.3);
            }
        }
    }
`;
export default Form
