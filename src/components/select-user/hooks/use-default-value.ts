import { useEffect } from 'react';
import net from '../../../services/index';
import { URL } from '../../../utils/api';
import {
  PropTypes,
  SelectUserCountRequestItem,
  IlistItem,
  IdefaultValue,
} from '../interface';
import { dealtKeyByType } from '../../../utils/index';
export type Config = Pick<
  PropTypes,
  | 'selectSignature'
  | 'defaultValue'
  | 'requestParams'
  | 'basePath'
  | 'selectType'
  | 'getCheckedNodes'
>;

export interface Foo {
  setUserCount: any;
  getUserCount: any;
  setSelectedData: any;
}

export default (
  {
    selectSignature,
    defaultValue,
    requestParams,
    basePath,
    selectType,
    getCheckedNodes,
  }: Config,
  { setUserCount, getUserCount, setSelectedData }: Foo
) => {
  useEffect(() => {
    /**
     * 对defaultValue或者请求获取的数据源进行处理
     * @param data
     */
    function resolveData(data: IdefaultValue) {
      const {
        deptInfoList = [],
        userInfoList = [],
        tagInfoList = [],
        customerManagerInfoList = [],
        cameraInfoList = [],
        groupInfoList = [],
        maternalInfoList = [],
        customerTagInfoList = [],
        groupTagInfoList = [],
        circlesTagInfoList = [],
        contentTagInfoList = [],
      } = data;

      const checkedKeys: string[] = [];

      let selectCountRequestList: SelectUserCountRequestItem[] = [];

      // 存储所有部门id
      const deptObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'DEPT',
      };
      for (const item of deptInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'DEPT';

        deptObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有标签id
      const tagObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'TAG',
      };
      for (const item of tagInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'TAG';

        tagObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有客户标签id
      const customerTagObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'CUSTOMER_TAG',
      };
      for (const item of customerTagInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'CUSTOMER_TAG';

        customerTagObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }
      // 存储所有客户标签id
      const customerManageObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'CUSTOMER_MANAGER_USER',
      };
      for (const item of customerManagerInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'CUSTOMER_MANAGER_USER';

        customerTagObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有群标签id
      const groupTagObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'GROUP_TAG',
      };
      for (const item of groupTagInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'GROUP_TAG';

        groupTagObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有圈子标签id
      const circlesTagObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'CIRCLES_TAG',
      };
      for (const item of circlesTagInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'CIRCLES_TAG';

        circlesTagObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储摄像头
      const cameraObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'CAMERA',
      };
      for (const item of cameraInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'CAMERA';

        cameraObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有内容标签id
      const contentTagObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'CONTENT_TAG',
      };
      for (const item of contentTagInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'CONTENT_TAG';

        contentTagObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有母婴id
      const maternalObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'MATERNAL',
      };
      for (const item of maternalInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'MATERNAL';

        maternalObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      // 存储所有分组id
      const groupObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'GROUP',
      };
      for (const item of groupInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'GROUP';

        groupObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      selectCountRequestList = [
        deptObject,
        tagObject,
        groupObject,
        maternalObject,
        customerTagObject,
        groupTagObject,
        circlesTagObject,
        customerManageObject,
        cameraObject,
        contentTagObject,
      ];

      // selectType设置为dept则计算已选节点数量，否则计算可选节点的总人数
      if (selectType === 'dept') {
        const count = {
          deptCount: deptObject.selectNodeList.length,
          tagCount: tagObject.selectNodeList.length,
          customerTagCount: customerTagObject.selectNodeList.length,
          groupTagCount: groupTagObject.selectNodeList.length,
          circlesTagCount: circlesTagObject.selectNodeList.length,
          contentTagCount: contentTagObject.selectNodeList.length,
          groupCount: groupObject.selectNodeList.length,
          cameraCount: cameraObject.selectNodeList.length,
          maternalCount: maternalObject.selectNodeList.length,
        };

        setUserCount(count);
      } else {
        // 获取已选用户总人数
        getUserCount(selectCountRequestList, userInfoList);
      }

      /**
       * @param list
       * @param type 判断是否是“下属组织”或“行政组织”
       */
      const generateKey = (list: IlistItem[], type?: string) => {
        list?.forEach((item: IlistItem) => {
          checkedKeys.push(dealtKeyByType(basePath, item, type));
        });
      };

      generateKey(deptInfoList);
      generateKey(userInfoList);
      generateKey(customerManagerInfoList);
      generateKey(tagInfoList);
      generateKey(customerTagInfoList);
      generateKey(groupTagInfoList);
      generateKey(contentTagInfoList);
      generateKey(circlesTagInfoList);
      generateKey(maternalInfoList);
      generateKey(groupInfoList);
      generateKey(cameraInfoList);

      // 更新选中的节点数据
      setSelectedData({
        deptInfoList,
        userInfoList,
        customerManagerInfoList,
        tagInfoList,
        customerTagInfoList,
        groupTagInfoList,
        circlesTagInfoList,
        contentTagInfoList,
        maternalInfoList,
        groupInfoList,
        cameraInfoList,
        checkedKeys,
      });
    }

    // 如果传入了默认值
    if (defaultValue) {
      // 处理默认值
      resolveData(defaultValue);
    }

    if (selectSignature) {
      // 拉取数据并更新treeState中的已选数据
      // tslint:disable-next-line: no-floating-promises
      net
        .request(
          `${URL()}/select/component/result?selectSignature=${selectSignature}`,
          {
            method: 'GET',
          }
        )
        .then((result: any) => {
          // 处理响应数据
          if (result.data) {
            resolveData(result.data);
          }

          if (typeof getCheckedNodes === 'function') {
            getCheckedNodes({
              ...result.data,
              selectSignature: result.data.id,
            });
          }
        });
    }
  }, [selectSignature, defaultValue]);
};
