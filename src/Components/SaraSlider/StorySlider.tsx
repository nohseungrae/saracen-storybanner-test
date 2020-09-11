import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import ArrowBackIosSharpIcon from "@material-ui/icons/ArrowBackIosSharp";
import ArrowForwardIosSharpIcon from "@material-ui/icons/ArrowForwardIosSharp";
import Slider from "react-slick";
import styled from "styled-components";
import Story from "./Story";
import {Heart, LogoAni} from "./Keyframes";
import Close from "./Close";

interface SProps {
    display: string;
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
const Logo = styled.div`
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
const StoryBox = styled.div`
display: flex;
  height: 100%;
  background-color: #000000db;
    .slick-slider .slick-list, .slick-slider .slick-track {
      transform: translateZ(0);
  }
  .slick-slider > .slick-list {
    position: relative;
    display: block;
  }
    .slick-slider {
    width : 100%;
    height: 100%;
    display: flex !important;
    position: relative;
    z-index: 400;
    overflow-y: hidden;
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
    .slick-next, .slick-prev {
    font-size: 0;
    line-height: 0;
    display: block;
    cursor: pointer;
    border: none;
  }
    .slick-next:hover svg, .slick-prev:hover svg{
      transition: linear .2s;
      color : #ffffff !important;
  }

  .slick-track {
    position: relative;
    top: 0;
    left: 0;
    display: block;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
  }
    .slick-initialized .slick-slide {
    display: block;
    width: 100%;
    position : relative;
  }

  .slick-slide {
    display: none;
    float: left;
    height: 100%;
    
    > div {
    height: 100%;
    }
`;
const LeftSide = styled.div`
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
  width: 60px;
  height: 60px;
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
const RightSide = styled.div`
  position: relative;
  width: calc(100% - 360px);
`;
const StoryHeart = styled.div`
  cursor: pointer;
  //border-left: 1px solid #eaeaea;
  position: absolute;
  bottom: 60px;
  right: 5%;
  width: 55px;
  height: 30px;
  z-index: 1000;
  transform: translate(50%, 0);
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
}


const StorySlider: React.FunctionComponent<IProps> = ({
                                                          stories,
                                                          CloseStory,
                                                          display,
                                                          index,
                                                      }) => {
    const [storyState, setStoryState] = useState({
        slideIndex: 0,
        stories: stories,
        heartIndex: [],
    });
    const [state, setState] = useState<{
        nav1: Slider | undefined;
        nav2: Slider | undefined;
    }>({
        nav1: undefined,
        nav2: undefined,
    });

    let slider: Slider;
    let subSlide: Slider;

    const settings = {
        dots: false,
        infinite: true,
        autoplay: true,
        speed: 300,
        autoplaySpeed: 6000,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow/>,
        prevArrow: <PrevArrow/>,
        beforeChange: (current: any, next: any) => {
            console.log(current, next);
            setStoryState({...storyState, slideIndex: next});
        },
    };

    const handleSlideIndex = ({target: {value}}: any) => {
        console.log(value, "slider handleSlideindex");
        const parsedVal = parseInt(value);
        slider?.slickGoTo(parsedVal);
        if (value !== "") {
            setStoryState({
                ...storyState,
                slideIndex: parsedVal,
            });
        }
    };

    const handleAddHeart = (e: any, i: number) => {
        e.preventDefault();
        const {target} = e;
        const heartBtn = target.parentElement;
        let cloneIcon = target.cloneNode();

        cloneIcon.classList.add("animation-icon");
        target.setAttribute(
            "src",
            `${process.env.REACT_APP_ABSOLUTE_HOST}static/icons/ico_heart_on.png`
        );
        cloneIcon.setAttribute(
            "src",
            `${process.env.REACT_APP_ABSOLUTE_HOST}static/icons/ico_heart_on.png`
        );

        heartBtn.insertAdjacentElement("beforeend", cloneIcon);

        setTimeout(function () {
            cloneIcon.classList.add("animate");
            cloneIcon.style.left = 80 * Math.random() + "px";
        }, 50);

        setTimeout(() => cloneIcon.parentNode.removeChild(cloneIcon), 600);

        // TODO : Rest JS로 하트 하기
    };
    useEffect(() => {
        setState({
            nav1: slider,
            nav2: subSlide,
        });
    }, []);
    const usePrevValues = (value: any, callback: Function) => {
        console.log("클릭한 value 값들 : ", value)
        const prevValues = useRef(value);
        if (value === prevValues) {

        }
        useEffect(() => {
            callback(prevValues.current);
            return () => (prevValues.current = value);
        }, [value]);
    };

    usePrevValues(
        index,
        useCallback(
            (prevValues: any) => {
                if (prevValues !== index) {
                    console.log("서로 값이 다른 경우", "이전값 :", prevValues, "지금값 :", index);
                    const parsedIndex = index;
                    slider?.slickGoTo(parsedIndex);
                    setStoryState({
                        ...storyState,
                        slideIndex: parsedIndex,
                    });
                } else {
                    console.log("값이 같은 경우", "이전값 :", prevValues, "지금값 :", index);
                    const parsedIndex = index;
                    slider?.slickGoTo(parsedIndex);
                }
            },
            [index]
        )
    );

    return (
        <StoryContainer display={display}>
            <Close CloseStory={CloseStory}/>
            <Logo>
                <img src={"/assets/images/saracen_logo.png"}/>
            </Logo>
            <StoryBox>
                <LeftSide>
                    <LeftSideBox>
                        <LeftSideContent>
                            <Slider
                                asNavFor={state?.nav1}
                                ref={(slider: Slider) => (subSlide = slider)}
                                slidesToShow={stories.length}
                                vertical={true}
                                speed={300}
                                focusOnSelect={true}
                                className={"side_items"}
                            >
                                {stories.map((story: any, i: number) => (
                                    <SideItem key={i}>
                                        <ItemWrap className={"item_wrap"}>
                                            <ItemLeft>
                                                <ItemLeftBox>
                                                    <img
                                                        src={`${process.env.REACT_APP_ACTIVE_IMG}/img/banner/image/${story.relationId}/${story.img}`}
                                                    />
                                                </ItemLeftBox>
                                            </ItemLeft>
                                            <ItemRight>
                                                <ItemRightBox>
                                                    <SpanBox>
                                                        <span>{story.mainCopy}</span>
                                                    </SpanBox>
                                                    <SpanBox>
                                                        <span>{story.subCopy}</span>
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
                <TopSide/>
                <RightSide>
                    <Slider
                        asNavFor={state.nav2}
                        {...settings}
                        ref={(slide: Slider) => (slider = slide)}
                    >
                        {stories.map((story: any, i: number) => (
                            <React.Fragment key={i}>
                                <Story
                                    color={story.color}
                                    mainCopy={story.mainCopy}
                                    subCopy={story.subCopy}
                                    src={`${process.env.REACT_APP_ACTIVE_IMG}img/banner/image/${story.relationId}/${story.img}`}
                                    alt={story.alt}
                                    href={story.url}
                                    value={storyState.slideIndex}
                                    onChange={(e: any) => handleSlideIndex(e)}
                                    bar={i === storyState.slideIndex ? "100" : "0"}
                                    display={i === storyState.slideIndex ? "block" : "none"}
                                    ani={i === storyState.slideIndex ? "animation" : ""}
                                    displayurl={
                                        story.url === null || story.url === "" ? "none" : "flex"
                                    }
                                />
                                <StoryHeart
                                    onClick={(e) => handleAddHeart(e, i)}
                                    style={{
                                        display: i === storyState.slideIndex ? "block" : "none",
                                    }}
                                >
                                    <div className="heartBtn">
                                        <img
                                            src={`${process.env.REACT_APP_ABSOLUTE_HOST}static/icons/ico_heart_off.png`}
                                            alt="하트버튼"
                                        />
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
const NextArrow = ({className, style, onClick}: any) => {
    return (
        <div
            className={className}
            style={{
                ...style,
                position: "relative",
                flexGrow: 1,
                height: "100%",
            }}
            onClick={onClick}
        >
            <ArrowForwardIosSharpIcon
                style={{
                    color: "gray",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />
        </div>
    );
};

const PrevArrow = ({className, style, onClick}: any) => {
    return (
        <div
            className={className}
            style={{
                ...style,
                position: "relative",
                flexGrow: 1,
                height: "100%",
            }}
            onClick={onClick}
        >
            <ArrowBackIosSharpIcon
                style={{
                    color: "gray",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />
        </div>
    );
};
export default StorySlider;
