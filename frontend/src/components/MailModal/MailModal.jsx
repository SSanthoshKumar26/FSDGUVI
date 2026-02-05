
import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa'

function MailModal({ isOpen, onClose, onSubmit }) {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email);
        setEmail('');
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <ModalOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <ModalContent
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CloseButton onClick={onClose}>
                            <FaTimes />
                        </CloseButton>

                        <IconWrapper>
                            <FaEnvelope />
                        </IconWrapper>

                        <h2>Email Summary</h2>
                        <p>Receive your detailed financial report directly in your inbox.</p>

                        <form onSubmit={handleSubmit}>
                            <InputGroup>
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="Enter email (leave blank for default)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoFocus
                                />
                            </InputGroup>

                            <SubmitButton
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                            >
                                <FaPaperPlane /> Send Report
                            </SubmitButton>
                        </form>

                        <small>Default: srisrikanthtvs@gmail.com</small>
                    </ModalContent>
                </ModalOverlay>
            )}
        </AnimatePresence>
    )
}

const ModalOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled(motion.div)`
    background: #1e293b;
    width: 90%;
    max-width: 450px;
    padding: 3rem 2.5rem;
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    position: relative;
    text-align: center;

    h2 {
        color: #f8fafc;
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
        font-weight: 800;
    }

    p {
        color: #94a3b8;
        font-size: 1rem;
        margin-bottom: 2rem;
        line-height: 1.5;
    }

    small {
        display: block;
        margin-top: 1.5rem;
        color: #64748b;
        font-size: 0.8rem;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: #94a3b8;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
        background: rgba(244, 63, 94, 0.2);
        color: #f43f5e;
    }
`;

const IconWrapper = styled.div`
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
    margin: 0 auto 1.5rem;
    box-shadow: 0 10px 20px rgba(34, 211, 238, 0.2);
`;

const InputGroup = styled.div`
    position: relative;
    margin-bottom: 1.5rem;

    .input-icon {
        position: absolute;
        left: 1.2rem;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
        font-size: 1.1rem;
    }

    input {
        width: 100%;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1rem 1.2rem 1rem 3.2rem;
        border-radius: 16px;
        color: #f8fafc;
        font-size: 1rem;
        transition: all 0.3s;
        outline: none;

        &:focus {
            border-color: #22d3ee;
            background: rgba(15, 23, 42, 0.8);
            box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.1);
        }

        &::placeholder {
            color: #475569;
        }
    }
`;

const SubmitButton = styled(motion.button)`
    width: 100%;
    background: linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 16px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    box-shadow: 0 10px 20px rgba(14, 165, 233, 0.2);
`;

export default MailModal;
