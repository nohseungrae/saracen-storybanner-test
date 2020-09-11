import { gql } from "@apollo/client";

export const GET_BANNERS_BY_CATEGORYID = gql`
  query getBannerList($categoryId: Float!) {
    getBannerListByGraphAndCategoryId(categoryId: $categoryId) {
      id
      type
      relationId
      img
      alt
    }
  }
`;

export const GET_BANNERS_BY_TYPE = gql`
  query getBannerList($typeAndCategoryIdInput: TypeAndCategoryIdInput!) {
    getBannerListByGraphAndType(
      typeAndCategoryIdInput: $typeAndCategoryIdInput
    ) {
      adminId
      alt
      backImg
      backImgPos
      color
      createdAt
      id
      img
      mainCopy
      miniImg
      relationId
      seq
      subCopy
      type
      updatedAt
      url
    }
  }
`;
