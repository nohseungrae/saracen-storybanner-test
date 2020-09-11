import React, { useState, useEffect } from "react";
import SaraStoryPresenter from "./SaraStoryPresenter";
import { useQuery } from "@apollo/client";
import { GET_BANNERS_BY_TYPE } from "src/Graphql";

const SaraStoryContainer = () => {
  const variables = { type: ["sara_story"], relationId: [0] };
  const { data } = useQuery(GET_BANNERS_BY_TYPE, {
    variables: { typeAndCategoryIdInput: variables },
  });

  const [saraMain, setSaraMain] = useState<any>(
    data?.getBannerListByGraphAndType
  );
  const [banners, setBanners] = useState({
    logo: {},
    top: {},
  });

  useEffect(() => {
    setSaraMain(
      data?.getBannerListByGraphAndType.filter((item: any) =>
        item.type.includes("sara_story")
      )
    );
    const topAndLogo = data?.getBannerListByGraphAndType.filter(
      (item: any) =>
        item.type.includes("logo") || item.type.includes("top_banner")
    );
    if (data?.getBannerListByGraphAndType) {
      setBanners({ ...banners, logo: topAndLogo[0], top: topAndLogo[1] });
    }
  }, [data?.getBannerListByGraphAndType]);

  return <SaraStoryPresenter saraStory={saraMain} />;
};

export default SaraStoryContainer;
