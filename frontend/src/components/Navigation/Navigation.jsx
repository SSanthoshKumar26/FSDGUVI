import React, { useState } from 'react'
import styled from 'styled-components'
import { menuItems } from '../../utils/menuItems'
import { signout } from '../../utils/icons'

function Navigation({ active, setActive, isOpen, toggleMenu }) {
    return (
        <NavStyled $isOpen={isOpen}>
            <div className="user-con">
                <img src="https://ui-avatars.com/api/?name=Guest&background=22d3ee&color=fff" alt="" />
                <div className="text">
                    <h2>Guest User</h2>
                    <p>Money Master</p>
                </div>
            </div>
            <ul className="menu-items">
                {menuItems.map((item) => {
                    return <li
                        key={item.id}
                        onClick={() => {
                            setActive(item.id);
                            if (window.innerWidth < 1024) toggleMenu(); // Close on mobile select
                        }}
                        className={active === item.id ? 'active' : ''}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </li>
                })}
            </ul>
            <div className="bottom-nav">
                <li className="signout">
                    {signout} Sign Out
                </li>
            </div>
        </NavStyled>
    )
}

const NavStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 280px;
    height: 100%;
    background: var(--color-secondary);
    border-right: 1px solid var(--color-border);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2rem;
    z-index: 50;
    transition: all 0.3s ease-in-out;

    /* Mobile Responsive Styles */
    @media (max-width: 1024px) {
        position: fixed;
        left: ${props => props.$isOpen ? '0' : '-100%'};
        top: 0;
        width: 85%;
        max-width: 320px;
        height: 100vh;
        box-shadow: ${props => props.$isOpen ? '0 0 50px rgba(0,0,0,0.8)' : 'none'};
    }

    .user-con{
        height: 80px;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border);
        img{
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--color-accent-cyan);
            padding: 2px;
        }
        h2{
            color: var(--color-text-main);
            font-size: 1.1rem;
            font-weight: 600;
        }
        p{
            color: var(--color-text-muted);
            font-size: 0.9rem;
        }
    }

    .menu-items{
        flex: 1;
        display: flex;
        flex-direction: column;
        li{
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .5rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            color: var(--color-text-muted);
            padding: 0.8rem 1rem;
            border-radius: 12px;
            
            i{
                color: var(--color-text-muted);
                font-size: 1.2rem;
                transition: all 0.2s ease-in-out;
            }
            span{
                 font-size: 1rem;
            }

            &:hover{
                background: rgba(34, 211, 238, 0.05); /* very subtle cyan hover */
                color: var(--color-text-main);
                i{ color: var(--color-accent-cyan); }
            }
        }
    }

    .active{
        background: rgba(34, 211, 238, 0.1) !important;
        color: var(--color-accent-cyan) !important;
        border-left: 4px solid var(--color-accent-cyan);
        border-radius: 4px 12px 12px 4px !important;
        i{
            color: var(--color-accent-cyan) !important;
        }
    }
    
    .bottom-nav {
       .signout {
           color: var(--color-accent-pink); 
           display: flex;
           align-items: center;
           gap: 0.8rem;
           cursor: pointer;
           padding: 1rem;
           transition: 0.2s;
           &:hover{
               color: var(--color-text-main);
           }
       }
    }
`;

export default Navigation
