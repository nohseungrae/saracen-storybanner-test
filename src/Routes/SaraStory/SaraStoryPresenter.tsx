import React, { useEffect, useState } from "react";
import Stories from "../../Components/SaraSlider/Stories";
// import Stories from "saracen-storybanner";

interface IProps {
  saraStory: any[];
}

const SaraStoryPresenter: React.FunctionComponent<IProps> = ({ saraStory }) => {
  // return <Stories stories={saraStory}></Stories>;

  if (saraStory) {
    return <Stories stories={saraStory} />;
  }
  return <></>;
};

export default SaraStoryPresenter;
