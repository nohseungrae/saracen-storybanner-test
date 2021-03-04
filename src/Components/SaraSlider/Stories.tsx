import React, { useEffect, useRef, useState } from 'react';
import StorySlider from './StorySlider';
import { DataUtil, imgPathFunc, mappingType } from './DataUtil';
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import styled from 'styled-components';
import { isMobile, isIE } from 'react-device-detect';

interface ISProps {
    isMobile: boolean;
}

const StoryMain = styled.div`
    display: flex;
    overflow-x: auto;
    max-width: 100%;
    margin: auto;
    -ms-overflow-style: none;
`;
const SaraStory1 = styled.ul<ISProps>`
    display: flex;
    ${(props) => (props.isMobile ? { padding: ' 0 3% 3% 3%' } : { padding: '30px 0 30px 40px', margin: 'auto' })};
    justify-content: center;
    flex-grow: 1;
`;
const SaraLi = styled.li<ISProps>`
    ${(props) => (props.isMobile ? { width: '125px' } : { height: '350px' })};
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
    backImg?: null | string;
    backImgPos?: null | string;
    color?: string;
    createdAt?: string | Date;
    id?: number;
    img?: string;
    main_copy?: string;
    miniImg?: null;
    relation_id?: number;
    seq?: number;
    sub_copy?: string;
    type?: string;
    updatedAt?: string | Date;
    url?: string;
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
export const checkVideoImg = (img: string, story: any) => {
    const mimeTypes = ['avi', 'mov', 'mp4', 'm4v', 'mpeg', 'mpg', 'oga', 'ogg', 'ogv', 'webm', 'wmv'];
    const mapping = mappingType(img) as { mimeType: string; name: string };
    if (mimeTypes.includes(mapping?.mimeType)) {
        return (
            <video controlsList="nodownload" muted autoPlay playsInline loop style={{ width: '100%', height: '100%' }} src={img}></video>
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
    const elRef = useRef(null);
    const useHorizontalScroll = () => {
        useEffect(() => {
            const el: any = elRef.current;
            if (el) {
                const onWheel = (e: any) => {
                    e.preventDefault();
                    if (!isIE) {
                        return el?.scrollTo({
                            left: el?.scrollLeft + e.deltaY,
                        });
                    }
                    $(el).scrollLeft(el?.scrollLeft + e.deltaY);
                };
                el?.addEventListener('wheel', onWheel);
                return () => el?.removeEventListener('wheel', onWheel);
            }
        }, []);
        return elRef;
    };
    const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

    const [state, setState] = useState({
        displayState: 'none',
        slides: '',
        index: 0,
        stories: [] as IStory[],
        groupedStories: [] as any[],
        targetElement: null,
    });
    const [check, setCheck] = useState(false);

    const handleOpenStory = (e: any, i: number) => {
        e.preventDefault();
        const parsedIndex = i;
        const body: HTMLBodyElement | null = document.querySelector('body') as HTMLBodyElement;
        // console.log(body, parsedIndex);
        body.style.overflowY = 'hidden';
        setState({
            ...state,
            displayState: 'block',
            index: parsedIndex,
        });
        setCheck(true);
        disableBodyScroll(targetEl as HTMLElement);
    };

    const handleCloseStory = () => {
        const body: HTMLElement | null = document.querySelector('body') as HTMLBodyElement;
        body.style.overflowY = 'auto';
        setState({
            ...state,
            displayState: 'none',
        });
        setCheck(false);
        enableBodyScroll(targetEl as HTMLElement);
    };

    useEffect(() => {
        setTargetEl(document.querySelector('body') as HTMLBodyElement);
        return () => clearAllBodyScrollLocks();
    }, [targetEl]);

    useEffect(() => {
        if (stories?.length > 0) {
            setState({
                ...state,
                displayState: 'none',
                slides: '',
                index: 0,
                stories: stories,
                groupedStories: DataUtil.jsonListGroupBy(stories, 'seq')
                    .flatMap((item: any) => item)
                    .sort(compare),
                targetElement: null,
            });
        }
    }, [stories]);

    useHorizontalScroll();

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
                    {state.groupedStories.map((story: any, i) => (
                        <SaraLi color={story.color} isMobile={isMobile} key={i} onClick={(e) => handleOpenStory(e, i)}>
                            <Span>{story.alt}</Span>
                            <Overlay className="overlay" src={`/static/m/images/story_overlay.png`} alt="overlay" />
                            {checkVideoImg(imgPathFunc.getImgPath(story, imgDomain, imgLegacy), story)}
                        </SaraLi>
                    ))}
                </SaraStory1>
            </StoryMain>
        </>
    );
};

export default Stories;
