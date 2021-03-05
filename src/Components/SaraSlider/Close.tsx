import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

interface ISProps {
    isMobile: boolean;
}

const CloseBox = styled.div<ISProps>`
    cursor: pointer;
    ${(props) =>
        props.isMobile
            ? { position: 'absolute', right: '0px', top: ' 3px' }
            : { position: 'fixed', left: '0px', top: '0px', margin: '5px 0 0 5px' }}
    width: 50px;
    height: 50px;
    opacity: 1;
    z-index: 999;
    &:before,
    &:after {
        position: absolute;
        left: 50%;
        top: 25%;
        content: ' ';
        height: 33px;
        width: 2px;
        background-color: #fff;
        box-shadow: 10px 10px 5px -9px rgba(0, 0, 0, 0.16);
    }
    &:before {
        transform: rotate(45deg);
    }
    &:after {
        transform: rotate(-45deg);
    }
`;

interface IProps {
    CloseStory: any;
    display: string;
}

const Close: React.FunctionComponent<IProps> = ({ CloseStory, display }) => {
    useEffect(() => {
        const eventFunc = (e: any) => {
            if (e.keyCode === 27) {
                CloseStory();
            }
        };
        if (display === 'block') {
            window.addEventListener('keydown', eventFunc);
        }
        return () => window.removeEventListener('keydown', eventFunc);
    }, []);

    return <CloseBox isMobile={isMobile} onClick={CloseStory} />;
};

export default Close;
