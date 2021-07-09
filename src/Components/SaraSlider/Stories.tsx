import React, { useCallback, useEffect, useRef, useState } from 'react';
import StorySlider from './StorySlider';
import { DataUtil, getBackImgPath, imgPathFunc, mappingType } from './DataUtil';
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import styled from 'styled-components';
import { isMobile, isIE } from 'react-device-detect';
import { RefObject } from 'react';

interface ISProps {
    isMobile: boolean;
}

const StoryMain = styled.div`
    display: flex;
    overflow: auto;
    max-width: 100%;
    margin: auto;
    -ms-overflow-style: none;
`;
const SaraStory1 = styled.ul<ISProps>`
    display: flex;
    ${(props) => (props.isMobile ? { padding: ' 3% 3% 3% 3%' } : { padding: '30px 0 30px 40px', margin: 'auto' })};
    justify-content: center;
    flex-grow: 1;
    flex-shrink: 0;
`;
const SaraLi = styled.li<ISProps>`
    ${(props) => (props.isMobile ? { width: '170px' } : { height: '338px' })};
    width: 194px;
    margin-right: 10px;
    position: relative;
    border-radius: 0.7em;
    display: block;
    background-color: ${(props) => props.color};
    img {
        width: 100%;
        border-radius: 0.7em;
        height: 100%;
    }
    video {
        border-radius: 0.7em;
    }
`;
const Overlay = styled.img`
    position: absolute;
    bottom: 0;
    z-index: 1;
`;
const Span = styled.span`
    position: absolute;
    bottom: 15px;
    width: 100%;
    z-index: 2;
    text-align: center;
    color: #fff;
`;

export interface IStory {
    adminId?: number;
    alt?: string;
    back_img?: null | string;
    back_img_pos?: null | string;
    color?: string;
    createdAt?: string | Date;
    id?: number;
    img?: string;
    main_copy?: string;
    mini_img?: null;
    relation_id?: number;
    seq?: number;
    sub_copy?: string;
    type?: string;
    updatedAt?: string | Date;
    url?: string;
    duration?: number;
}

interface IProps {
    displayState?: string;
    slides?: string;
    index?: number;
    stories: IStory[];
    groupedStories?: any[];
    targetElement?: null | string;
    imgDomain: string;
    imgLegacy: string;
}

interface ICompare {
    seq: number;
    id: string;
}
export const checkVideoImg = (img: string, story: any, value?: any, loop?: boolean) => {
    const mimeTypes = ['avi', 'mov', 'mp4', 'm4v', 'mpeg', 'mpg', 'oga', 'ogg', 'ogv', 'webm', 'wmv'];
    const mapping = mappingType(img) as { mimeType: string; name: string };
    const backImg = getBackImgPath(story, 'https://img.thesaracen.com', 'https://active.thesaracen.com');
    if (mimeTypes.includes(mapping?.mimeType)) {
        return (
            <video
                className={`story_video_${story.id}`}
                controlsList="nodownload"
                poster={backImg}
                muted
                autoPlay
                playsInline
                loop={loop}
                style={{ width: '100%', height: '100%' }}
                src={img}
            ></video>
        );
    }
    return <img src={img} onError={(e: any) => imgPathFunc.solveImgError(e, story)} alt={story.alt} />;
};
export const compare = (a: ICompare, b: ICompare) => {
    const relationA = a.seq;
    const relationB = b.seq;
    let comparison = 0;
    if (relationA === relationB) {
        if (parseInt(a.id) > parseInt(b.id)) {
            // console.log("비교중")
            comparison = 1;
        } else if (parseInt(a.id) < parseInt(b.id)) {
            // console.log("비교중2")
            comparison = -1;
        }
        return comparison;
    }

    if (relationA > relationB) {
        comparison = 1;
    } else if (relationA < relationB) {
        comparison = -1;
    }
    return comparison;
};

const Stories: React.FunctionComponent<IProps> = ({ stories, imgDomain, imgLegacy }) => {
    const elRef: RefObject<any> = useRef(null);
    const body = document.querySelector('body') as HTMLBodyElement;

    useEffect(() => {
        //휠 이벤트 on/off

        //클릭 시 휠 이벤트 off
        // const eventGoSetting = (e: any) => {
        //     window.localStorage.setItem('wheel', 'false');
        //     e.stopPropagation();
        // };
        // const liveRoot = document.querySelector('#saralive_root');
        // liveRoot?.addEventListener('click', eventGoSetting);
        //-----------------------------------------------------

        const el = elRef.current;

        const onWheel = (e: any) => {
            const wheel = window.localStorage.getItem('wheel');
            const result = e.path
                .map((p: any) => {
                    if (p?.classList?.contains('view')) {
                        return true;
                    }
                    return false;
                })
                .filter((i: any) => i)
                .shift();
            if (wheel === 'false') {
                return e.stopImmediatePropagation();
            }
            //
            e.preventDefault();
            if (!isIE) {
                return el?.scrollTo({
                    left: el?.scrollLeft + e.deltaY,
                });
            }
            $(el).scrollLeft(el?.scrollLeft + e.deltaY);
        };
        el?.addEventListener('wheel', onWheel);
        return () => {
            el?.removeEventListener('wheel', onWheel);
        };
    });

    const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

    const groupedStories = (stories: IStory[]) => {
        return DataUtil.jsonListGroupBy(stories, 'seq')
            .flatMap((item: any) => item)
            .sort(compare);
    };

    const [state, setState] = useState({
        displayState: 'none',
        slides: '',
        index: 0,
        stories,
        groupedStories: groupedStories(stories),
        targetElement: null,
    });
    const [check, setCheck] = useState(false);

    const handleOpenStory = useCallback((e: any, i: number) => {
        e.preventDefault();
        const parsedIndex = i;
        // console.log(body, parsedIndex);
        body.style.overflowY = 'hidden';
        setState({
            ...state,
            displayState: 'block',
            index: parsedIndex,
        });
        setCheck(true);
        disableBodyScroll(targetEl as HTMLElement);
    }, []);

    const handleCloseStory = useCallback(() => {
        body.style.overflowY = 'auto';
        setState({
            ...state,
            displayState: 'none',
        });
        setCheck(false);
        enableBodyScroll(targetEl as HTMLElement);
    }, []);

    useEffect(() => {
        setTargetEl(body);
        return () => clearAllBodyScrollLocks();
    }, [body]);

    return (
        <>
            {state?.displayState === 'none' ? null : (
                <StorySlider
                    stories={state.groupedStories}
                    CloseStory={handleCloseStory}
                    display={state.displayState}
                    index={state.index}
                    check={check}
                    imgDomain={imgDomain}
                    imgLegacy={imgLegacy}
                />
            )}
            <StoryMain className="story" ref={elRef}>
                <SaraStory1 isMobile={isMobile}>
                    {state.groupedStories.map((story: any, i: number) => (
                        <SaraLi color={story.color} isMobile={isMobile} key={i} onClick={(e) => handleOpenStory(e, i)}>
                            <Span>{story.alt}</Span>
                            <Overlay className="overlay" src={`/static/m/images/story_overlay.png`} alt="overlay" />
                            {checkVideoImg(imgPathFunc.getImgPath(story, imgDomain, imgLegacy), story, undefined, true)}
                        </SaraLi>
                    ))}
                </SaraStory1>
            </StoryMain>
        </>
    );
};

export default Stories;
