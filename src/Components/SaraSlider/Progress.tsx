import React from 'react';
import styled from "styled-components"
import {Move} from "./Keyframes";

interface SProps {
    width?: string
    display?: string
    bar?: string
}

const ProgressContainer = styled.div<SProps>`
  width: ${props => props.width ?? "100%"};
  display: ${props => props.display};
  margin: 0 auto;
  overflow: hidden;
  height: 5px;
  background-color: rgba(245, 245, 246, 0.3);
  border-radius: 1em;
  line-height: .625em;
  box-shadow: inset 0 0.1rem 0.1rem rgba(90,97,105,.15);
  position: absolute;
  top: 7px;
  left: 0;
  z-index: 999;
`;

const ProgressBar = styled.div<SProps>`
  height: 5px;
  line-height: 5px;
  border-radius: 1em;
  width: ${props => props.bar};
  background-color: white;
  transition: width 0.1s ease;
  animation: ${Move} 6s ease-in-out;
`;

const Progress: React.FunctionComponent<SProps> = ({width, display, bar}) => (
    <>
        <ProgressContainer width={width} display={display} className={"progress_container"}>
            <ProgressBar bar={bar + "%"}/>
        </ProgressContainer>
    </>
)

export default Progress;