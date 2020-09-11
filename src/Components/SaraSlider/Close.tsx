import React from 'react';
import styled from "styled-components";

const CloseBox = styled.div`
    cursor: pointer;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 50px;
    height: 50px;
    opacity: 1;
    z-index: 999;
    margin : 5px 0 0 5px;
    &:before, &:after {
        position: absolute;
        left: 50%;
        top: 25%;
        content: ' ';
        height: 33px;
        width: 2px;
        background-color: #fff;
        box-shadow: 10px 10px 5px -9px rgba(0,0,0,0.16);
    }
    &:before {
        transform: rotate(45deg);
    }
    &:after {
        transform: rotate(-45deg);
    }
`;

interface IProps {
    CloseStory: any
}

const Close: React.FunctionComponent<IProps> = ({CloseStory}) => {
    return (
        <CloseBox onClick={CloseStory}/>
    );
};

export default Close;