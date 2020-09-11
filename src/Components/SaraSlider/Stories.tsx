import React, {useEffect, useState} from "react";
import StorySlider from "./StorySlider";
import {DataUtil} from "./DataUtil";
import {
    clearAllBodyScrollLocks,
    disableBodyScroll,
    enableBodyScroll,
} from "body-scroll-lock";
import styled from "styled-components";

const StoryMain = styled.div`
  display: block;
  overflow-x: auto;
  width: 100%;
`;
const SaraStory1 = styled.ul`
  display: flex;
  width: max-content;
`;
const SaraLi = styled.li`
  width: 200px;
  margin-right: 10px;
  position: relative;
  display: block;
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
    mainCopy?: string;
    miniImg?: null;
    relationId?: number;
    seq?: number;
    subCopy?: string;
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
}

const Stories: React.FunctionComponent<IProps> = ({stories}) => {
    const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

    const [state, setState] = useState({
        displayState: "none",
        slides: "",
        index: 0,
        stories: [] as IStory[],
        groupedStories: [] as any[],
        targetElement: null,
    });

    const handleOpenStory = (e: any, i: number) => {
        e.preventDefault();
        const parsedIndex = i;
        const body: HTMLBodyElement | null = document.querySelector(
            "body"
        ) as HTMLBodyElement;
        console.log(body, parsedIndex);
        body.style.overflowY = "hidden";
        setState({
            ...state,
            displayState: "block",
            index: parsedIndex,
        });
        disableBodyScroll(targetEl as HTMLElement);
    };

    const handleCloseStory = () => {
        const body: HTMLElement | null = document.querySelector(
            "body"
        ) as HTMLBodyElement;
        body.style.overflowY = "auto";
        setState({
            ...state,
            displayState: "none",
        });
        enableBodyScroll(targetEl as HTMLElement);
    };

    useEffect(() => {
        setTargetEl(document.querySelector("body") as HTMLBodyElement);
        if (stories?.length > 0) {
            console.log("여기봐라");
            setState({
                ...state,
                displayState: "none",
                slides: "",
                index: 0,
                stories: stories,
                groupedStories: DataUtil.jsonListGroupBy(stories, "seq")
                    .map((item: any) =>
                        item.sort(() => {
                            return Math.random() - Math.random();
                        })
                    )
                    .flatMap((item: any) => item),
                targetElement: null,
            });
        }
        return () => clearAllBodyScrollLocks();
    }, [targetEl]);

    return (
        <>
            <StorySlider
                stories={state.groupedStories}
                CloseStory={handleCloseStory}
                display={state.displayState}
                index={state.index}
            />
            <StoryMain className="story">
                <SaraStory1 style={{padding: "0"}}>
                    {state.groupedStories.map((story: any, i) => (
                        <SaraLi key={i} onClick={(e) => handleOpenStory(e, i)}>
                            <Span>{story.alt}</Span>
                            <Overlay
                                className="overlay"
                                src={`${process.env.REACT_APP_ABSOLUTE_HOST}static/m/images/story_overlay.png`}
                                alt="overlay"
                            />
                            <img
                                src={`${process.env.REACT_APP_ACTIVE_IMG}img/banner/image/${
                                    story.relationId + "/" + story.img
                                }`}
                                alt={story.alt}
                            />
                        </SaraLi>
                    ))}
                </SaraStory1>
            </StoryMain>
        </>
    );
};

export default Stories;
