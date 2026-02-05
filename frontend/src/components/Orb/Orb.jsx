import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useWindowSize } from '../../utils/useWindowSize'

const moveOrb = keyframes`
    0%{
        transform: translate(0, 0);
    }
    50%{
        transform: translate(400px, 50vh);
    }
    100%{
        transform: translate(0, 0);
    }
`

const OrbStyled = styled.div`
    width: 70vh;
    height: 70vh;
    position: absolute;
    border-radius: 50%;
    margin-left: -37vh;
    margin-top: -37vh;
    background: linear-gradient(180deg, #64FFDA 0%, #0A192F 100%); 
    filter: blur(400px);
    animation: ${moveOrb} 15s alternate linear infinite;
    z-index: -1;
`;

function Orb() {
    const { width, height } = useWindowSize()

    return (
        <OrbStyled></OrbStyled>
    )
}

export default Orb
