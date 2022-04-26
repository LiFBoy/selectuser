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
        orgInfoList = [],
        userInfoList = [],
        tagInfoList = [],
        groupInfoList = [],
        orgRelInfoList = [],
        maternalInfoList = [],
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

      // 存储所有组织id
      const orgObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'ORG',
      };
      for (const item of orgInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'ORG';

        orgObject.selectNodeList.push({
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

      // 存储所有行政组织id
      const orgRelObject: SelectUserCountRequestItem = {
        selectNodeList: [],
        type: 'ORG_REL',
      };
      for (const item of orgRelInfoList) {
        // 如果传入的数据中没有type属性，则在初始化时需要设置item的type
        if (!item.type) item.type = 'ORG_REL';

        orgRelObject.selectNodeList.push({
          contactType: item.contactType,
          id: item.id,
        });
      }

      selectCountRequestList = [
        deptObject,
        orgObject,
        tagObject,
        groupObject,
        maternalObject,
        orgRelObject,
      ];

      // selectType设置为dept则计算已选节点数量，否则计算可选节点的总人数
      if (selectType === 'dept') {
        const count = {
          orgCount: orgObject.selectNodeList.length,
          deptCount: deptObject.selectNodeList.length,
          tagCount: tagObject.selectNodeList.length,
          groupCount: groupObject.selectNodeList.length,
          orgRelCount: orgRelObject.selectNodeList.length,
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
      generateKey(orgInfoList, 'ORG');
      generateKey(userInfoList);
      generateKey(tagInfoList);
      generateKey(maternalInfoList);
      generateKey(groupInfoList);
      generateKey(orgRelInfoList);

      // 更新选中的节点数据
      setSelectedData({
        deptInfoList,
        orgInfoList,
        userInfoList,
        tagInfoList,
        maternalInfoList,
        groupInfoList,
        orgRelInfoList,
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
          console.log(result, 'result');
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
