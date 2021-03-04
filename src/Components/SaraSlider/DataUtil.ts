import { IStory } from "./Stories";

export const DataUtil = {
  objectMap: (list: IStory[], func: any) => {
    return Object.fromEntries(Object.entries(list).map(func));
  },

  jsonListGroupBy: (list: any[], key: string) => {
    let groupedList: any[] = [];

    for (let item of list) {
      if (typeof groupedList[item[key]] === "undefined") {
        groupedList[item[key]] = [];
      }
      if (!item.duration) {
        item.duration = 10;
      }
      groupedList[item[key]].push(item as never);
    }

    return groupedList;
  },
};

export const imgPathFunc = {
  getImgPath: (story: any, imgDomain?: string, imgLegacy?: string) => {
    if (story) {
      if (
        story["created_at"] >= "2021-01-19" ||
        story["updated_at"] >= "2021-01-19"
      ) {
        return `${imgDomain}/banner/${story?.img}`;
      }
      return `${imgLegacy}/img/banner/image/${story?.relation_id.toString()}/${
        story?.img
      }`;
    } else {
      return `https://thesaracen.com/static/info/404-page-not-found-2.png`;
    }
  },

  solveImgError: (e: any, story: any) => {
    e.target.src =
      "https://thesaracen.com/static/info/404-page-not-found-2.png";
  },
};

export const mappingType = (filename: string) => {
  if (filename) {
    const splitName = filename?.split(".");
    const mimeType = splitName[splitName?.length - 1].toString();
    const name = splitName.filter((part) => part !== mimeType).join("");
    return { name, mimeType };
  }
};
