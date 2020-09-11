import {IStory} from "./Stories";

export const DataUtil = {
    objectMap: (list: IStory[], func: any) => {
        return Object.fromEntries(Object.entries(list).map(func))
    },

    jsonListGroupBy: (list: any[], key: string) => {
        let groupedList: any[] = []

        for (let item of list) {
            if (typeof groupedList[item[key]] === 'undefined') {
                groupedList[item[key]] = []
            }
            groupedList[item[key]].push(item as never)
        }

        return groupedList;
    }
}
