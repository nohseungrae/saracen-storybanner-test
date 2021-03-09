import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';
import ArrowForwardIosSharpIcon from '@material-ui/icons/ArrowForwardIosSharp';
import Slider from 'react-slick';
import styled from 'styled-components';
import Story from './Story';
import { Heart, LogoAni } from './Keyframes';
import Close from './Close';
import { imgPathFunc } from './DataUtil';
import { isMobile, isIE } from 'react-device-detect';
import { checkVideoImg } from './Stories';

interface SProps {
    display?: string;
    isMobile?: boolean;
    isIE?: boolean;
}

const StoryContainer = styled.div<SProps>`
    display: ${(props) => props.display};
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 100000;
    transition: all 2s ease-in-out;
`;
const Logo = styled.div<SProps>`
    ${(props) => (props.isMobile ? { display: 'none' } : { display: 'block' })};
    position: absolute;
    top: 0;
    left: 50px;
    z-index: 10;
    width: 50px;
    height: 50px;
    margin: 10px 0 0 5px;
    animation: ${LogoAni} linear 0.5s;
    img {
        width: 100%;
    }
`;
const StoryBox = styled.div<SProps>`
    display: flex;
    height: 100%;
    background-color: #000000db;
    .slick-slider .slick-list,
    .slick-slider .slick-track {
        transform: translateZ(0);
    }
    .slick-slider > .slick-list {
        overflow-y: auto;
        position: relative;
        display: block;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .slick-list::-webkit-scrollbar {
        width: 0px;
    }
    .slick-slider {
        width: 100%;
        height: 100%;
        display: flex !important;
        position: relative;
        z-index: 400;
        /* overflow-y: hidden; */
        box-sizing: border-box;
        user-select: none;
        touch-action: pan-y;
        justify-content: center;
    }
    .slick-list {
        max-width: 642px;
        width: 100%;
        overflow: hidden;
        height: 100%;
    }
    .slick-next,
    .slick-prev {
        font-size: 0;
        line-height: 0;
        display: block;
        cursor: pointer;
        border: none;
        background-color: black;
        opacity: ${(props) => (props.isIE ? '0.9' : '0.6')};
    }
    .slick-next:hover svg,
    .slick-prev:hover svg {
        transition: linear 0.2s;
        color: #ffffff !important;
    }

    .slick-track {
        position: relative;
        top: 0;
        left: 0;
        display: block;
        margin-left: auto;
        margin-right: auto;
        height: 100%;
        overflow: hidden;
    }
    .slick-initialized .slick-slide {
        display: block;
        width: 100%;
        position: relative;
    }

    .slick-slide {
        display: none;
        float: left;
        height: 100%;

        > div {
            height: 100%;
        }
    }
`;
const LeftSide = styled.div<SProps>`
    ${(props) => (props.isMobile ? { display: 'none' } : { display: 'block' })};
    width: 360px;
    height: 100%;
    background-color: black;
    position: relative;
`;
const LeftSideBox = styled.div`
    position: fixed;
    top: 70px;
    bottom: 0;
    width: inherit;
    margin: 10px 0 0 0;
    padding: 5px 0;
`;
const LeftSideContent = styled.div`
    width: 100%;
    height: 100%;
    .side_items {
        padding: 2px;
    }
    .slick-track {
        display: flex;
        flex-flow: column nowrap;
        height: auto !important;
    }
    .slick-current .item_wrap {
        background-color: #ffffff1a;
    }
`;
const SideItem = styled.div`
    padding: 2px;
    color: #ffffff;
`;
const ItemWrap = styled.div`
    border-radius: 6px;
    margin: 0 5px;
    padding: 8px;
    display: flex;
`;
const ItemLeft = styled.div`
    margin-right: 10px;
`;
const ItemLeftBox = styled.div`
    margin: 2px;
    width: 50px;
    height: 85px;
    overflow: hidden;
    border-radius: 10%;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
const ItemRight = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;
const ItemRightBox = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    > div:last-child span {
        font-size: 12px;
    }
`;
const SpanBox = styled.div`
    padding: 2px 0;
    display: inline-block;
    span {
        font-size: 14px;
    }
`;
const TopSide = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 70px;
`;
const RightSide = styled.div<SProps>`
    position: relative;
    width: ${(props) => (props.isMobile ? '100%' : 'calc(100% - 360px)')};
`;
const StoryHeart = styled.div<SProps>`
    cursor: pointer;
    ${(props) =>
        props.isMobile
            ? { borderLeft: '1px solid #eaeaea', bottom: '9px', right: '0' }
            : {
                  bottom: '60px',
                  right: '5%',
              }}
    position: absolute;
    width: 55px;
    height: 30px;
    z-index: 1000;
    ${(props) => (props.isMobile ? {} : { transform: 'translate(50%, 0)' })};
    animation: ${Heart} linear 0.5s;
    & .heartBtn {
        font-size: 2em;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        > img {
            width: 34px;
            height: auto;
        }
    }

    .animation-icon {
        position: absolute;
        left: 50%;
        bottom: calc(50% - 12px);
        transform: translateX(-50%);
        transition: 0.8s;
        opacity: 1;

        &.animate {
            font-size: 50px;
            opacity: 0;
            vertical-align: bottom;
            bottom: 100px;
        }
    }
`;

interface IProps {
    stories: any[];
    CloseStory: Function;
    display: string;
    index: number;
    check: boolean;
    imgDomain: string;
    imgLegacy: string;
}

const StorySlider: React.FunctionComponent<IProps> = ({ stories, CloseStory, display, index, check, imgDomain, imgLegacy }) => {
    const [storyState, setStoryState] = useState({
        slideIndex: 0,
        stories,
        heartIndex: [],
    });
    const [state, setState] = useState<{
        nav1: RefObject<Slider> | undefined;
        nav2: RefObject<Slider> | undefined;
    }>({
        nav1: undefined,
        nav2: undefined,
    });
    const mySlider = useRef<Slider>(null);
    const subSlider = useRef<Slider>(null);

    const videoFunc = (newI: number) => {
        const myVideo: any = document.querySelector(`.story_img .story_video_${storyState.stories[newI].id}`);
        return myVideo;
    };
    const [delay, setDelay] = useState<number>(0);

    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: storyState.stories[storyState.slideIndex]?.duration * 1000 + delay,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: false,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        initialSlide: storyState.slideIndex,
        beforeChange: (old: any, newI: number) => {
            const myVideo = videoFunc(newI);
            const t0 = performance.now();
            // console.log(old, newI);

            if (myVideo) {
                myVideo.addEventListener(
                    'loadeddata',
                    () => {
                        const t1 = performance.now();
                        const loadingTime = Math.ceil(((t1 - t0) / 1000) % 60);
                        setDelay(loadingTime);
                    },
                    true
                );
            } else {
                setDelay(0);
            }
            if (!myVideo?.paused && old !== newI) {
                myVideo?.load();
                myVideo?.play();
            }
            if (myVideo?.paused && old !== newI) {
                myVideo?.load();
                myVideo?.play();
            }

            setStoryState({
                ...storyState,
                slideIndex: newI,
            });
        },
    };

    const handleSlideIndex = ({ target: { value } }: any) => {
        // console.log(value, 'slider handleSlideindex');
        const parsedVal = parseInt(value);
        const slider = mySlider.current;
        slider?.slickGoTo(parsedVal);
        if (value !== '') {
            setStoryState({
                ...storyState,
                slideIndex: parsedVal,
            });
        }
    };

    const handleAddHeart = (e: any, i: number) => {
        e.preventDefault();
        const { target } = e;
        const heartBtn = target.parentElement;
        let cloneIcon = target.cloneNode();

        cloneIcon.classList.add('animation-icon');
        target.setAttribute('src', `/static/icons/ico_heart_on.png`);
        cloneIcon.setAttribute('src', `/static/icons/ico_heart_on.png`);

        heartBtn.insertAdjacentElement('beforeend', cloneIcon);

        setTimeout(function () {
            cloneIcon.classList.add('animate');
            cloneIcon.style.left = 80 * Math.random() + 'px';
        }, 50);

        setTimeout(() => cloneIcon.parentNode.removeChild(cloneIcon), 600);

        // TODO : Rest JS로 하트 하기
    };
    useEffect(() => {
        setState({
            nav1: mySlider,
            nav2: subSlider,
        });
    }, []);
    const usePrevValues = (value: any, callback: Function) => {
        // console.log('클릭한 value 값들 : ', value, state);
        const prevValues = useRef(value);
        if (value === prevValues) {
        }
        useEffect(() => {
            callback(prevValues.current);
            return () => (prevValues.current = value);
        }, [check]);
    };

    usePrevValues(
        useMemo(() => index, [index]),
        useCallback(
            (prevValues: any) => {
                // console.log(prevValues, index);
                if (prevValues !== index) {
                    // console.log("서로 값이 다른 경우", "이전값 :", prevValues, "지금값 :", index);
                    const parsedIndex = index;
                    const slider = mySlider.current;
                    slider?.slickGoTo(parsedIndex);
                    setStoryState({
                        ...storyState,
                        slideIndex: parsedIndex,
                    });
                } else {
                    // console.log("값이 같은 경우", "이전값 :", prevValues, "지금값 :", index);
                    const slider = mySlider.current;
                    const parsedIndex = index;
                    slider?.slickGoTo(parsedIndex);
                }
            },
            [check]
        )
    );

    return (
        <StoryContainer display={display}>
            <Close CloseStory={CloseStory} display={display} />
            <Logo isMobile={isMobile}>
                <img src={'/fwa/admin/operation/assets/images/saracen_logo.png'} />
            </Logo>
            <StoryBox isIE={isIE}>
                <LeftSide isMobile={isMobile}>
                    <LeftSideBox>
                        <LeftSideContent>
                            <Slider
                                asNavFor={state?.nav1?.current as Slider}
                                ref={subSlider}
                                slidesToShow={stories.length}
                                vertical={true}
                                focusOnSelect={true}
                                className={'side_items'}
                            >
                                {stories.map((story: any, i: number) => (
                                    <SideItem key={i}>
                                        <ItemWrap className={'item_wrap'}>
                                            <ItemLeft>
                                                <ItemLeftBox>
                                                    {checkVideoImg(
                                                        imgPathFunc.getImgPath(story, imgDomain, imgLegacy),
                                                        story,
                                                        undefined,
                                                        true
                                                    )}
                                                </ItemLeftBox>
                                            </ItemLeft>
                                            <ItemRight>
                                                <ItemRightBox>
                                                    <SpanBox>
                                                        <span>{story.main_copy}</span>
                                                    </SpanBox>
                                                    <SpanBox>
                                                        <span>{story.sub_copy}</span>
                                                    </SpanBox>
                                                </ItemRightBox>
                                            </ItemRight>
                                        </ItemWrap>
                                    </SideItem>
                                ))}
                            </Slider>
                        </LeftSideContent>
                    </LeftSideBox>
                </LeftSide>
                <TopSide />
                <RightSide isMobile={isMobile}>
                    <Slider asNavFor={state?.nav2?.current as Slider} {...settings} ref={mySlider}>
                        {stories.map((story: any, i: number) => (
                            <React.Fragment key={i}>
                                {/* {console.log(
                                    i,
                                    storyState.slideIndex,
                                    i === storyState.slideIndex ? '100' : '0',
                                    i === storyState.slideIndex ? 'animation' : '',
                                    i === storyState.slideIndex ? 'block' : 'none'
                                )} */}
                                <Story
                                    delay={delay}
                                    color={story.color}
                                    main_copy={story.main_copy}
                                    sub_copy={story.sub_copy}
                                    src={imgPathFunc.getImgPath(story, imgDomain, imgLegacy)}
                                    story={story}
                                    alt={story.alt}
                                    href={story.url}
                                    value={storyState.slideIndex}
                                    onChange={(e: any) => handleSlideIndex(e)}
                                    bar={i === storyState.slideIndex ? '100' : '0'}
                                    ani={i === storyState.slideIndex ? 'animation' : ''}
                                    display={i === storyState.slideIndex ? 'block' : 'none'}
                                    duration={story.duration}
                                    displayurl={story.url === null || story.url === '' ? 'none' : 'flex'}
                                />
                                <StoryHeart
                                    isMobile={isMobile}
                                    onClick={(e) => handleAddHeart(e, i)}
                                    style={{
                                        display: i === storyState.slideIndex ? 'block' : 'none',
                                    }}
                                >
                                    <div className="heartBtn">
                                        <img src={`/static/icons/ico_heart_off.png`} alt="하트버튼" />
                                        <span></span>
                                    </div>
                                </StoryHeart>
                            </React.Fragment>
                        ))}
                    </Slider>
                </RightSide>
            </StoryBox>
        </StoryContainer>
    );
};
const NextArrow = ({ className, style, onClick }: any) => {
    return (
        <div
            className={className}
            style={{
                ...style,
                position: 'relative',
                flexGrow: 1,
                height: '100%',
            }}
            onClick={onClick}
        >
            <ArrowForwardIosSharpIcon
                style={{
                    color: 'gray',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(0%, -50%)',
                }}
            />
        </div>
    );
};

const PrevArrow = ({ className, style, onClick }: any) => {
    return (
        <div
            className={className}
            style={{
                ...style,
                position: 'relative',
                flexGrow: 1,
                height: '100%',
            }}
            onClick={onClick}
        >
            <ArrowBackIosSharpIcon
                style={{
                    color: 'gray',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(0%, -50%)',
                }}
            />
        </div>
    );
};
export default StorySlider;
