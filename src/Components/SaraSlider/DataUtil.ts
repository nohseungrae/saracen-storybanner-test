import { IStory } from './Stories';

export const DataUtil = {
    objectMap: (list: IStory[], func: any) => {
        return Object.fromEntries(Object.entries(list).map(func));
    },

    jsonListGroupBy: (list: IStory[], key: keyof IStory) => {
        let groupedList: IStory[] | any[] = [];
        console.log(list);

        for (let item of list) {
            if (typeof groupedList[item[key] as any] === 'undefined') {
                groupedList[item[key] as any] = [];
            }
            if (!item.duration || item.duration === 0) {
                item.duration = 6;
            }
            groupedList[item[key] as any].push(item as never);
        }

        return list;
    },
};

export const imgPathFunc = {
    getImgPath: (story: any, imgDomain?: string, imgLegacy?: string) => {
        if (story) {
            if (story['created_at'] >= '2021-01-19' || story['updated_at'] >= '2021-01-19') {
                return `${imgDomain}/banner/${story?.img}`;
            }
            return `${imgLegacy}/img/banner/image/${story?.relation_id.toString()}/${story?.img}`;
        } else {
            return `https://thesaracen.com/static/info/404-page-not-found-2.png`;
        }
    },

    solveImgError: (e: any, story: any) => {
        e.target.src = 'https://thesaracen.com/static/info/404-page-not-found-2.png';
    },
};
export const getBackImgPath = (story: any, imgDomain: string, imgLegacy: string) => {
    if (story.back_img) {
        if (story['created_at'] >= '2021-01-19' || story['updated_at'] >= '2021-01-19') {
            return `${imgDomain}/banner/${story?.back_img}`;
        }
        return `${imgLegacy}/img/banner/image/${story?.relation_id.toString()}/${story?.back_img}`;
    } else {
        return `https://thesaracen.com/static/info/404-page-not-found-2.png`;
    }
};
export const mappingType = (filename: string) => {
    if (filename) {
        const splitName = filename?.split('.');
        const mimeType = splitName[splitName?.length - 1].toString();
        const name = splitName.filter((part) => part !== mimeType).join('');
        return { name, mimeType };
    }
};
