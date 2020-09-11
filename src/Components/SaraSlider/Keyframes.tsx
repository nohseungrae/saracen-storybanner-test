import {keyframes} from "styled-components";

//----------------------------------------------------------
export const Open = keyframes`
  0% {
    transform: scale(0.2);
    opacity: 0; 
  }
  
  20%{
    transform: scale(0.2);
    opacity: 0; 
  }
  100% { 
    transform: scale(1);
    opacity: 1;
  }
`
//----------------------------------------------------------
export const Title = keyframes`
  from {
    transform: translate(0, -120px);
    opacity: 0;
  }
  50% {
    transform: translate(0, -40px);
    opacity: 0;  
  }
  to{
    margin-bottom: 60px;
    opacity: 1;
  }
`
//----------------------------------------------------------
export const Links = keyframes`
  from {
    transform: translate(0, 100px);
    opacity: 0;
  }
  to{
    transform: translate(0, 0);
    opacity: 1;
  }
`
//----------------------------------------------------------
export const Heart = keyframes`
  from {
    transform: translate(50%,100px);
    opacity: 0;
  }
  to{
    transform: translate(50%, 0);
    opacity: 1;
  }
`
//----------------------------------------------------------
export const Move = keyframes`
  from { width: 0; }
  to { width: 100%;}
`
//----------------------------------------------------------
export const LogoAni = keyframes`
  from {
    transform: translate(-120px, 0);
    opacity: 0;
  }
  50% {
    transform: translate(-40px, 0);
    opacity: 0;  
  }
  to{
    opacity: 1;
  }
`