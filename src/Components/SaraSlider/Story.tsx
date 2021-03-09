import React from 'react';
import Progress from './Progress';
import { checkVideoImg, IStory } from './Stories';
import styled from 'styled-components';
import { Links, Open, Title } from './Keyframes';
import { imgPathFunc } from './DataUtil';
import { isMobile } from 'react-device-detect';

interface SProps {
    bgColor?: string;
    displayurl?: string;
    href?: string;
    isMobile?: boolean;
}

const StoryItem = styled.div<SProps>`
    background-size: auto 100%;
    width: 100%;
    height: 100%;
    float: left;
    position: relative;
    background: ${(props) => props.bgColor};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 997;
    animation: ${Open} 0.3s ease-in-out;

    & .story_img {
        width: 100%;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center;
        & img {
            width: 100%;
        }
        .overlay {
            position: absolute;
            top: 0;
            height: 100%;
            width: 100%;
            z-index: 997;
            background: url(${'/static/m/images/story_overlay.png'}) repeat-x;
            background-size: auto 100%;
        }
    }
`;
const StoryFooter = styled.div`
    position: absolute;
    bottom: 50px;
    width: 100%;
    z-index: 999;
`;

const StoryTitle = styled.div<SProps>`
    display: flex;
    flex-flow: column wrap;
    margin-bottom: ${(props) => (props.isMobile ? '10px' : '60px')};
    padding: 0 15px;
    color: #fff;
    transition: margin-bottom, opacity 0.5s linear;
    &.animation {
        animation: ${Title} 0.7s linear;
    }
    > h2 {
        color: #fff;
        font-size: 1.8em;
    }
    > span {
        margin: 5px 0;
        color: #ececec;
        font-size: 1em;
    }
`;

const StoryLink = styled.div`
    transition: margin-bottom, opacity 0.5s ease-out;
    height: 80px;
    &.animation {
        animation: ${Links} 0.5s ease-out;
    }
`;
const A = styled.a<SProps>`
    display: ${(props) => props.displayurl ?? 'flex'};
    align-items: center;
    flex-flow: column wrap;
    text-decoration: none;
    > span {
        padding: 5px 25px;
        border-radius: 0.3em;
        margin: 0 auto;
        color: white;
        text-decoration: none;
        border: 1px solid white;
    }
    > img {
        width: 45px;
        height: 45px;
        padding: 7px;
    }
`;

interface IProps extends IStory {
    key?: number;
    onChange: any;
    value: string | number;
    bar: string;
    display: string;
    ani: string;
    displayurl: string;
    href: string;
    src: string;
    story: any;
    duration: number;
    delay?: number;
}

const Story: React.FunctionComponent<IProps> = (props) => {
    return (
        <StoryItem bgColor={props.color} key={props.key}>
            <input
                onChange={props.onChange}
                value={props.value}
                type="text"
                placeholder="0"
                style={{
                    width: '100%',
                    position: 'absolute',
                    zIndex: 1,
                    height: '20px',
                    display: 'none',
                }}
            />
            <Progress delay={props.delay} bar={props.bar} display={props.display} duration={props.duration} />
            <StoryFooter>
                <StoryTitle isMobile={isMobile} className={props.ani}>
                    <h2>{props.main_copy}</h2>
                    <span>{props.sub_copy}</span>
                </StoryTitle>
                <StoryLink className={props.ani}>
                    <A href={props.href} displayurl={props.displayurl}>
                        <img src={`/static/icons/ico_circle_arrow_up.png`} alt="화살표아이콘" />
                        <span>자세히보기</span>
                    </A>
                </StoryLink>
            </StoryFooter>
            <div className="story_img">
                <div className="overlay" />
                {checkVideoImg(props.src, props.story, undefined, false)}
            </div>
        </StoryItem>
    );
};

export default Story;
