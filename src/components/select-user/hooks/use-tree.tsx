import React, { useState, useCallback, useRef } from 'react';
import net from '../../../services/index';
import { URL } from '../../../utils/api';
import { intersectionWith, isEqual, setWith, clone } from 'lodash';
import { Popover } from 'antd';
import {
  NodeType,
  ItreeItem,
  PropTypes,
  SelectUserCountRequestItem,
  IsaveResultParams,
  IlistItem,
} from '../interface';
import treeNodeIconMap from '../../../components/tree-node-icon';
import useDefaultValue from './use-default-value';
import { dealtKey, dealtKeyByType } from '../../../utils/index';
import { showNameFunc } from '../../../utils/index';

import '../index.less';

let timeStamp = Date.now();
export function getUid(): string {
  return `${(timeStamp += 1)}`;
}

// 持久化的属性，设置一次之后就不会修改
type StaticProps = Pick<
  PropTypes,
  | 'showTabList'
  | 'selectType'
  | 'basePath'
  | 'requestParams'
  | 'multiple'
  | 'onlyLeafCheckable'
  | 'unCheckableNodeType'
  | 'selectSignature'
  | 'defaultValue'
  | 'onOk'
  | 'isSaveSelectSignature'
  | 'getCheckedNodes'
  | 'getTotalCount'
  | 'orgRelAnalysisRange'
>;
type ItreeState = StaticProps & {
  treeData: ItreeItem[];
  searchResult: any[];
  checkedKeys: string[];
  tagGroupItemList?: any[];
  deptInfoList: ItreeItem[];
  userInfoList: ItreeItem[];
  customerManagerInfoList: ItreeItem[];
  equipmentInfoList: ItreeItem[];
  tvInfoList: ItreeItem[];
  maternalInfoList: ItreeItem[];
  cameraInfoList: ItreeItem[];
  tagInfoList: ItreeItem[];
  customerTagInfoList: ItreeItem[];
  groupTagInfoList: ItreeItem[];
  circlesTagInfoList: ItreeItem[];
  contentTagInfoList: ItreeItem[];
  groupInfoList: ItreeItem[];
  workGroupInfoList: ItreeItem[];
  userCount: IuserCount;
};

interface IResult {
  code: number;
  data: {
    dataSource: (ItreeItem & { label: string })[];
  };
  errorMsg: string | null;
  success: boolean;
}

interface IuserCount {
  deptCount?: number;
  equipmentCount?: number;
  tvCount?: number;
  cameraCount?: number;
  workGroupCount?: number;
  maternalCount?: number;
  tagCount?: number;
  customerTagCount?: number;
  customerManagerCount?: number;
  groupTagCount?: number;
  circlesTagCount?: number;
  contentTagCount?: number;
  groupCount?: number;
  [key: string]: any;
}

export interface ItreeContext {
  // 存储树及选中数据的state
  treeState: ItreeState;
  // 设置bath
  setBasePath: (basePath: string) => void;
  // 设置当前树的data方法
  setTreeData: (treeData: ItreeItem[]) => void;
  // 设置当前选中数据的方法
  setSelectedData: (selectData: any) => void;
  // 更新树节点选中状态的方法, 返回该节点当前的选中状态
  updateCheckedNode: (node: ItreeItem, tabType?: string) => boolean;
  // 清空当前选中数据的方法
  clear: () => void;
  // 取消指定keys选中状态的方法
  delKeys: (itemList: ItreeItem[], type?: NodeType) => void;
  // 设置分组人员信息
  setUserCount: (userCount: IuserCount) => void;
  // 请求重新计算用户人数
  resetUserCount: (
    item: ItreeItem,
    checked: boolean,
    isRequest?: boolean
  ) => void;
  getTreeRoot: (type: string) => void;
  getSearchResult: (params: any) => void;
  // 是否在加载
  loading: boolean;
  loadData: (item: ItreeItem, type: string) => Promise<void>;
  getUserCount: (
    selectCountRequestList: SelectUserCountRequestItem[],
    userInfoList: any
  ) => void;

  handleOk: () => void;
  setRequest?: (loading: boolean) => void;
  resultLoading?: boolean;
}

const INIT_STATE: ItreeState = {
  // 存储树data
  treeData: [],
  // 存储树的搜索结果
  searchResult: [],
  // 存储当前所有选中的keys
  checkedKeys: [],

  tagGroupItemList: [], // todo
  // 选中的部门类型节点
  deptInfoList: [],
  // 选中的用户类型节点
  userInfoList: [],
  // 选中的设备类型节点
  equipmentInfoList: [],
  // 选中的tv节点
  tvInfoList: [],
  // 私域
  maternalInfoList: [],
  // 摄像头
  cameraInfoList: [],
  // 选中的标签类型节点
  tagInfoList: [],
  customerManagerInfoList: [],
  customerTagInfoList: [],
  groupTagInfoList: [],
  circlesTagInfoList: [],
  contentTagInfoList: [],
  // 选中的群类型节点
  groupInfoList: [],
  // 相关告警群
  workGroupInfoList: [],

  // 不同类型选中的人员数量统计
  userCount: {
    deptCount: 0,
    equipmentCount: 0,
    tvCount: 0,
    cameraCount: 0,
    workGroupCount: 0,
    maternalCount: 0,
    tagCount: 0,
    customerTagCount: 0,
    customerManagerCount: 0,
    groupTagCount: 0,
    circlesTagCount: 0,
    contentTagCount: 0,
    groupCount: 0,
  },
  // 请求基本路径
  basePath: 'pc',
  // 请求附加参数
  requestParams: {},
  isSaveSelectSignature: false,
  onOk() {},
  getCheckedNodes(value) {},
  getTotalCount(value) {},
};

// 树节点控制逻辑
const useTree = (staticProps: StaticProps): ItreeContext => {
  // dataSource 中间态，稳定后 set 到 dataSource 中，以解决递归、异步、setState 协同的问题。
  const cachedDataSource = useRef<ItreeItem[]>([]);
  // 树的数据
  const [treeState, setTreeState] = useState<ItreeState>({
    ...INIT_STATE,
    ...staticProps,
  });
  const [loading, setLoading] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  // 根据类型获取选中列表
  const getListByType = (type: NodeType, treeStateToFind = treeState) => {
    const typeToKeyMap = {
      DEPT: 'deptInfoList',
      TAG: 'tagInfoList',
      CUSTOMER_TAG: 'customerTagInfoList',
      CUSTOMER_MANAGER_USER: 'customerManagerInfoList',
      GROUP_TAG: 'groupTagInfoList',
      CIRCLES_TAG: 'circlesTagInfoList',
      CONTENT_TAG: 'contentTagInfoList',
      USER: 'userInfoList',
      EQUIPMENT: 'equipmentInfoList',
      TV: 'tvInfoList',
      CAMERA: 'cameraInfoList',
      MATERNAL: 'maternalInfoList',
      GROUP: 'groupInfoList',
      root: '',
      CIRCLES_TAG_GROUP: '',
      WORK_GROUP: 'workGroupInfoList',
    };
    const key: string = typeToKeyMap[type];
    // @ts-ignore
    return [treeStateToFind[key], key];
  };

  // 设置treeData
  const setTreeData = (treeData: ItreeItem[]) => {
    setTreeState((treeState) => {
      return {
        ...treeState,
        treeData,
      };
    });
  };

  // 设置treeData
  const setSearchResult = (searchResult: any[]) => {
    setTreeState((treeState) => {
      return {
        ...treeState,
        searchResult,
      };
    });
  };
  // 设置标签组
  const setTagGroupItemList = (tagGroupItemList: any[]) => {
    setTreeState((treeState) => {
      return {
        ...treeState,
        tagGroupItemList,
      };
    });
  };

  const setRequest = (loading: boolean) => {
    setResultLoading(loading);
  };

  const renderSearchText = (text: string) => {
    const nextSearchValue = localStorage.getItem('nextSearchValue');
    if (!text?.includes(nextSearchValue)) return text;
    const [str1, str2] = text.replace(nextSearchValue, '&').split('&');
    return (
      <>
        {str1}
        <span
          style={{ color: '#2c7ef8' }}
          className="search-result-item-title_matched"
        >
          {nextSearchValue}
        </span>
        {str2}
      </>
    );
  };

  const formatData = useCallback(
    (
      // 结合业务需求格式化树节点数据
      list: ItreeItem[] = [], // 待格式化的树节点列表
      type: string, // 当前的树所属的类型
      isRoot?: boolean // 是否是根节点
    ) => {
      const { onlyLeafCheckable, unCheckableNodeType, selectType } = treeState;
      const enmu: any = {
        1: '运营标签组',
        2: '系统标签组',
      };
      for (const item of list) {
        item.id = item.key;
        item.name = item.label;
        const NodeIcon = treeNodeIconMap[item.type];
        let label: any = item.name;

        // 特殊处理内部通讯录根节点 与标签有区别
        if (isRoot && type === 'innerContacts') {
          // 内部通讯录的跟节点不允许被选择
          item.checkable = false;
        }

        const overlayStyle = {
          maxWidth: '20em',
          fontSize: '12px',
          color: '#666',
          overflow: 'auto',
          backgroud: '#fff',
          maxHeight: '400px',
          boxShadow: '5px 5px 10px rgba(129, 133, 167, 0.2)',
        };

        if (item.id === localStorage.getItem('selectId')) {
          label = renderSearchText(item.name);
        }

        item.title = (
          <div className="treeNode">
            <Popover
              placement="bottomLeft"
              overlayStyle={overlayStyle}
              content={item.name}
              trigger="hover"
            >
              <NodeIcon />
              <div className="nodeContent">
                <div className="titleWrapper">
                  <div className="title">{label}</div>
                  {item.labelPermission === 2 && !item.noTagLabelPermission && (
                    <span className="label-group-disabled">(不可修改)</span>
                  )}

                  {item.labelGroupType && (
                    <span className="label-group-type">
                      {enmu[item.labelGroupType]}
                    </span>
                  )}
                </div>
              </div>
            </Popover>
          </div>
        );

        // 内部通迅录、残疾人、私域特殊逻辑
        if (
          ['innerContacts', 'maternalContacts', 'disabledHomeContacts'].indexOf(
            type
          ) > -1
        ) {
          if (
            item.type === 'DEPT' && // 如果节点类型为DEPT
            selectType === 'user' // 且当前组件 selectType 为 user
          ) {
            item.isLeaf = false; // 则 DEPT 节点一律视为非叶子结点 (实际场景中DEPT 节点下一定有子节点)
          } else if (
            selectType === 'dept' &&
            onlyLeafCheckable &&
            item.isLeaf === false
          ) {
            // 如果当前组件 selectType 为 dept
            // 设置仅叶子节点可选
            item.checkable = false;
          }
        }

        // 如果配置了不可选节点类型，且当前节点类型在不可选类型中，则节点不可选
        if (unCheckableNodeType.indexOf(item.type) !== -1) {
          item.checkable = false;
        }

        // 标签的非叶子节点不可选
        if (item.type === 'TAG' && item.isLeaf === false) {
          item.checkable = false;
        }

        // 标签组节点不可选
        if (
          [
            'CUSTOMER_TAG_GROUP',
            'GROUP_TAG_GROUP',
            'CIRCLES_TAG_GROUP',
            'CONTENT_TAG_GROUP',
          ].indexOf(item.type) > -1
        ) {
          item.checkable = false;
        }

        // 分组的非叶子节点不可勾选
        if (
          onlyLeafCheckable &&
          item.type === 'GROUP' &&
          item.isLeaf === false
        ) {
          item.checkable = false;
        }

        // 如果只有叶子节点可选，且当前 selectType 为 user，则非 USER 节点一律不可选
        if (
          onlyLeafCheckable &&
          selectType === 'user' &&
          item.type !== 'USER'
        ) {
          item.checkable = false;
        }

        if (item.children) {
          formatData(item.children, type);
        }
      }
    },
    [treeState]
  );

  const getObjById = (list: any, id: string): any => {
    // 遍历数组
    for (const i in list) {
      const item = list[i];
      if (item.id === id) {
        return item;
      } else {
        // 查不到继续遍历
        if (item.children) {
          const _value = getObjById(item.children, id);
          // 查询到直接返回
          if (_value) {
            return _value;
          }
        }
      }
    }
  };

  const loadData = async (item: ItreeItem, type: string) => {
    if (item.children && item.children.length !== 0) return;
    await fetchTreeNodes(item, type);
    const { id, selectType, type: _type } = item;
    if (
      [
        'CUSTOMER_TAG_GROUP',
        'GROUP_TAG_GROUP',
        'CIRCLES_TAG_GROUP',
        'CONTENT_TAG_GROUP',
      ].indexOf(_type) > -1 &&
      selectType === 'radio'
    ) {
      const newTagGroup = treeState.tagGroupItemList.concat(
        getObjById(cachedDataSource.current, id)
      );
      setTagGroupItemList(newTagGroup);
    }
    setTreeData(cachedDataSource.current);
  };

  // 动态获取子节点列表
  const fetchTreeNodes = useCallback(
    (
      item: Pick<ItreeItem, 'orgId' | 'key' | 'type' | 'id' | 'pos'>,
      type: string
    ): Promise<any> => {
      return new Promise<any>((resolve: any) => {
        const { requestParams } = treeState;
        const { id, pos, orgId } = item;
        const isRoot = pos === '0';
        net
          .request(`${URL()}/select/component/${type}`, {
            method: 'POST',
            data: {
              orgId: orgId,
              parentId: id,
              ...requestParams,
            },
          })
          .then((result: IResult) => {
            const _dataSource = result.data;
            // @ts-ignore
            formatData(_dataSource, type, isRoot);
            if (isRoot) {
              // @ts-ignore
              cachedDataSource.current = _dataSource;
              resolve(1);
              return;
            }
            // 获取当前节点的序号路径
            const position = pos
              ? pos
                .split('-')
              // 去掉第一级的 0（antd 的 tree 组件的 pos 前面额外多了个 0）
                .slice(1)
                .reduce((setterPath: (number | string)[], index: string) => {
                  return setterPath.concat([+index, 'children']);
                }, [])
              : [];
            cachedDataSource.current = setWith(
              clone(cachedDataSource.current),
              position,
              _dataSource,
              clone
            );

            resolve(2);
          });
      });
    },
    [treeState, formatData, setTreeData, timeStamp]
  );

  // 总数计算
  const resultCount = (
    checked: boolean,
    orgCount: number,
    userCount: number
  ) => {
    return checked ? orgCount + userCount : orgCount - userCount;
  };

  // 根据当前 type 获取树的根节点
  const getTreeRoot = useCallback(
    (type: string) => {
      setLoading(true);
      // 清空之前的树内容
      setTreeData([]);
      // debugger;

      fetchTreeNodes({ orgId: null, key: null, id: null, pos: '0' }, type)
        .then(() => {
          // 如果只有一个根节点，则默认获取其子节点
          if (
            cachedDataSource.current.length === 1 &&
            cachedDataSource.current[0].isLeaf !== true
          ) {
            // tslint:disable-next-line: no-floating-promises
            fetchTreeNodes(
              {
                ...cachedDataSource.current[0],
                pos: '0-0',
              },
              type
            ).then(() => {
              setLoading(false);
              setTreeData(cachedDataSource.current);
            });
          } else {
            setLoading(false);
            setTreeData(cachedDataSource.current);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [treeState, setLoading, formatData, fetchTreeNodes, setTreeData]
  );

  // 获取用户人数
  const getUserCount = (selectCountRequestList: any, userInfoList: any) => {
    const { requestParams, getTotalCount } = treeState;
    // tslint:disable-next-line: no-floating-promises
    net
      .request(`${URL()}/select/component/getUserCount`, {
        method: 'POST',
        data: {
          category: requestParams?.category,

          selectCountRequestList,
        },
      })
      .then((res) => {
        const data = res.data;
        const count = {
          deptCount: 0,
          equipmentCount: 0,
          tvCount: 0,
          cameraCount: 0,
          workGroupCount: 0,
          maternalCount: 0,
          tagCount: 0,
          customerTagCount: 0,
          customerManagerCount: 0,
          groupTagCount: 0,
          circlesTagCount: 0,
          contentTagCount: 0,
          groupCount: 0,
          userCount: 0,
        };

        for (const item of data) {
          switch (item.type) {
            case 'DEPT':
              count.deptCount = item.userCount;
              break;
            case 'EQUIPMENT':
              count.equipmentCount = item.equipmentCount;
            case 'TV':
              count.tvCount = item.tvCount;
            case 'CAMERA':
              count.cameraCount = item.cameraCount;
            case 'WORK_GROUP':
              count.workGroupCount = item.workGroupCount;
            case 'MATERNAL':
              count.maternalCount = item.maternalCount;
              break;
            case 'GROUP':
              count.groupCount = item.groupCount;
              break;
            case 'TAG':
              count.tagCount = item.tagCount;
              break;
            case 'CUSTOMER_TAG':
              count.customerTagCount = item.customerTagCount;
              break;
            case 'CUSTOMER_MANAGER_USER':
              count.customerManagerCount = item.customerManagerCount;
              break;
            case 'GROUP_TAG':
              count.groupTagCount = item.groupTagCount;
              break;
            case 'CIRCLES_TAG':
              count.circlesTagCount = item.circlesTagCount;
              break;
            case 'CONTENT_TAG':
              count.contentTagCount = item.contentTagCount;
              break;
          }
        }
        setUserCount(count);

        if (typeof getTotalCount === 'function') {
          let totalCount = userInfoList?.length || 0; // 已选总数
          for (const key in data) {
            totalCount += data[key].userCount || 0;
          }
          count.userCount = userInfoList?.length || 0;
          getTotalCount({ totalCount, count });
        }
      });
  };

  // 用于设置各个infoList中的数据
  const setSelectedData = (selectData: any) => {
    setTreeState((treeState) => {
      return {
        ...treeState,
        ...selectData,
      };
    });
  };

  // 请求获取搜索结果
  const getSearchResult = (params: any) => {
    setLoading(true);
    // tslint:disable-next-line: no-floating-promises
    net
      .request(`${URL()}/select/component/search`, {
        method: 'POST',
        data: params,
      })
      .then(({ data = {}}) => {
        setLoading(false);
        // debugger;
        setSearchResult(data || null);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // 更新选中节点
  const updateCheckedNode = (node: ItreeItem, tabType?: string) => {
    const { basePath } = treeState;
    const nextTreeState = { ...treeState };
    const { tagGroupItemList } = treeState;
    let checkedKeys = treeState.checkedKeys;

    const updateNode = (node: ItreeItem, deleteItem?: any): boolean => {
      const [list = [], listKey] = getListByType(node.type);
      let nextList = [];
      const nodeIndex = list.findIndex((item: ItreeItem) => {
        return item.id === node.id;
      });
      // 如果节点未选中则选中
      if (nodeIndex === -1) {
        nextList = list.concat({ ...node });
      } else {
        // 否则取消选中
        nextList = list.slice(0, nodeIndex).concat(list.slice(nodeIndex + 1));
      }
      if (deleteItem) {
        const nodeIndex = nextList.findIndex((item: ItreeItem) => {
          return item.id === deleteItem.id;
        });

        nextList = nextList
          .slice(0, nodeIndex)
          .concat(nextList.slice(nodeIndex + 1));
      }

      // @ts-ignore
      nextTreeState[listKey] = nextList;
      return !deleteItem ? nextList.length > list.length : false;
    };

    let deleteItem = null;

    if (tagGroupItemList.length > 0 && node.selectType === 'radio') {
      const tagGropChild = treeState.tagGroupItemList.find(
        (tag) => tag.id === node.parentId
      ).children;
      const _checkedKeys = intersectionWith(
        tagGropChild.map((child: any) => child.id),
        checkedKeys,
        isEqual
      );
      const key = _checkedKeys[0];
      const keyIndex = checkedKeys.indexOf(key);

      if (keyIndex !== -1) {
        checkedKeys = checkedKeys.filter((item) => item !== key);
        deleteItem = tagGropChild.find((child: any) => child.id === key);
      } else {
        resetUserCount(node, true, false);
      }
    }
    const keyIndex = checkedKeys.indexOf(dealtKey(basePath, node, tabType));

    // 更新node节点选中状态
    // 如果key不在被选中的数组中，则添加
    const _nextCheckedKeys =
      keyIndex === -1
        ? [...checkedKeys, dealtKey(basePath, node, tabType)]
        : [
          ...checkedKeys.slice(0, keyIndex),
          ...checkedKeys.slice(keyIndex + 1),
        ];
    // updateNode必须在setTreeState之前调用，更新nextTreeState内数据
    const result = updateNode(node, deleteItem);
    setTreeState({ ...nextTreeState, checkedKeys: _nextCheckedKeys });
    return result;
  };

  /**
   * 取消传入的keys的选中状态
   * @param itemList
   * @param type 根据type直接从对应的list中删除，未传则去部门，组织，人员，标签，分组列表中遍历删除
   * 删除单个时，type是node.type；删除组时，type是group.type
   */
  const delKeys = (itemList: ItreeItem[], type?: NodeType) => {
    let checkedKeys = treeState.checkedKeys;
    const { basePath } = treeState;

    let nextTreeState = { ...treeState };

    for (const treeItem of itemList) {
      const keyIndex = checkedKeys.indexOf(
        dealtKeyByType(basePath, treeItem, type)
      );
      const { id: key } = treeItem;
      if (keyIndex !== -1) {
        checkedKeys = checkedKeys
          .slice(0, keyIndex)
          .concat(checkedKeys.slice(keyIndex + 1));
      }
      // 如果传入了type，则直接从type对应的list中删除
      if (type) {
        const [list, listKey] = getListByType(type, nextTreeState);
        const keyIndex = list.findIndex((item: ItreeItem) => {
          return item.id === key;
        });

        nextTreeState = {
          ...nextTreeState,
          [listKey]: list.slice(0, keyIndex).concat(list.slice(keyIndex + 1)),
        };
      } else {
        // 没传type就只能一个一个找着删了
        [
          'deptInfoList',
          'userInfoList',
          'equipmentInfoList',
          'tvInfoList',
          'maternalInfoList',
          'cameraInfoList',
          'workGroupInfoList',
          'tagInfoList',
          'groupInfoList',
        ].some((listKey) => {
          // @ts-ignore
          const infoList: ItreeItem[] = nextTreeState[listKey];
          const nextInfoList = infoList.filter(({ id }) => id !== key);
          if (nextInfoList.length !== infoList.length) {
            // @ts-ignore
            nextTreeState[listKey] = nextInfoList;
          }
        });
      }
    }
    setTreeState({ ...nextTreeState, checkedKeys });
  };

  // 清除所有所选项
  const clear = () => {
    treeState.checkedKeys = [];
    treeState.deptInfoList = [];
    treeState.userInfoList = [];
    treeState.equipmentInfoList = [];
    treeState.tvInfoList = [];
    treeState.maternalInfoList = [];
    treeState.cameraInfoList = [];
    treeState.workGroupInfoList = [];
    treeState.tagInfoList = [];
    treeState.customerTagInfoList = [];
    treeState.customerManagerInfoList = [];
    treeState.groupTagInfoList = [];
    treeState.circlesTagInfoList = [];
    treeState.contentTagInfoList = [];
    treeState.groupInfoList = [];
    treeState.userCount = {
      deptCount: 0,
      equipmentCount: 0,
      tvCount: 0,
      cameraCount: 0,
      workGroupCount: 0,
      maternalCount: 0,
      tagCount: 0,
      customerTagCount: 0,
      customerManagerCount: 0,
      groupTagCount: 0,
      circlesTagCount: 0,
      contentTagCount: 0,
      groupCount: 0,
    };

    setTreeState({
      ...treeState,
    });
  };

  // 设置人员数量
  const setUserCount = (userCount: any) => {
    setTreeState((treeState) => {
      return {
        ...treeState,
        userCount,
      };
    });
  };
  // 设置path
  const setBasePath = (basePath: any) => {
    setTreeState((treeState) => {
      return {
        ...treeState,
        basePath,
      };
    });
  };

  /**
   * 请求后重新计算用户人数
   * @param item 操作的节点
   * @param checked 节点被选中还是删除判断
   * @param isRequest 需要请求获取人数，否则仅计算当前选中的部门及节点数量
   */
  const resetUserCount = (
    item: ItreeItem,
    checked: boolean,
    isRequest = true
  ) => {
    const { userCount, requestParams } = treeState;

    const selectCountRequestList: any = [];

    const selectNodeList = [{ contactType: item.contactType, id: item.id }];

    selectCountRequestList.push({ selectNodeList, type: item.type });
    // 如果需要请求获取人数，则请求
    if (isRequest) {
      // tslint:disable-next-line: no-floating-promises
      net
        .request(`${URL()}/select/component/getUserCount`, {
          method: 'POST',
          data: {
            category: requestParams?.category,
            selectCountRequestList,
          },
        })
        .then((res) => {
          const data = res.data;

          for (const item of data) {
            switch (item.type) {
              case 'DEPT':
                userCount.deptCount = resultCount(
                  checked,
                  userCount.deptCount,
                  item.userCount
                );
                break;
              case 'EQUIPMENT':
                userCount.equipmentCount = resultCount(
                  checked,
                  userCount.equipmentCount,
                  item.userCount
                );
                break;
              case 'TV':
                userCount.tvCount = resultCount(
                  checked,
                  userCount.tvCount,
                  item.userCount
                );
                break;
              case 'CAMERA':
                userCount.cameraCount = resultCount(
                  checked,
                  userCount.cameraCount,
                  item.userCount
                );
                break;
              case 'WORK_GROUP':
                userCount.workGroupCount = resultCount(
                  checked,
                  userCount.workGroupCount,
                  item.userCount
                );
                break;
              case 'MATERNAL':
                userCount.maternalCount = resultCount(
                  checked,
                  userCount.maternalCount,
                  item.userCount
                );
                break;

              case 'TAG':
                userCount.tagCount = resultCount(
                  checked,
                  userCount.tagCount,
                  item.userCount
                );
                break;
              case 'CUSTOMER_TAG':
                userCount.customerTagCount = resultCount(
                  checked,
                  userCount.customerTagCount,
                  item.userCount
                );
                break;
              case 'CUSTOMER_MANAGER_USER':
                userCount.customerManagerCount = resultCount(
                  checked,
                  userCount.customerManagerCount,
                  item.userCount
                );
                break;
              case 'GROUP_TAG':
                userCount.groupTagCount = resultCount(
                  checked,
                  userCount.groupTagCount,
                  item.userCount
                );
                break;
              case 'CIRCLES_TAG':
                userCount.circlesTagCount = resultCount(
                  checked,
                  userCount.circlesTagCount,
                  item.userCount
                );
                break;
              case 'CONTENT_TAG':
                userCount.contentTagCount = resultCount(
                  checked,
                  userCount.contentTagCount,
                  item.userCount
                );
                break;
              case 'GROUP':
                userCount.groupCount = resultCount(
                  checked,
                  userCount.groupCount,
                  item.userCount
                );
                break;
            }
          }
          setUserCount(userCount);
        });
      return;
    }
    switch (item.type) {
      case 'DEPT':
        userCount.deptCount = resultCount(checked, userCount.deptCount, 1);
        break;
      case 'EQUIPMENT':
        userCount.equipmentCount = resultCount(
          checked,
          userCount.equipmentCount,
          1
        );
        break;
      case 'TV':
        userCount.tvCount = resultCount(checked, userCount.tvCount, 1);
        break;
      case 'CAMERA':
        userCount.cameraCount = resultCount(checked, userCount.cameraCount, 1);
        break;
      case 'WORK_GROUP':
        userCount.workGroupCount = resultCount(
          checked,
          userCount.workGroupCount,
          1
        );
        break;
      case 'MATERNAL':
        userCount.maternalCount = resultCount(
          checked,
          userCount.maternalCount,
          1
        );
        break;

      case 'TAG':
        userCount.tagCount = resultCount(checked, userCount.tagCount, 1);
        break;

      case 'CUSTOMER_TAG':
        userCount.customerTagCount = resultCount(
          checked,
          userCount.customerTagCount,
          1
        );
        break;
      case 'CUSTOMER_MANAGER_USER':
        userCount.customerManagerCount = resultCount(
          checked,
          userCount.customerManagerCount,
          1
        );
        break;

      case 'GROUP_TAG':
        userCount.groupTagCount = resultCount(
          checked,
          userCount.groupTagCount,
          1
        );
        break;
      case 'CIRCLES_TAG':
        userCount.circlesTagCount = resultCount(
          checked,
          userCount.circlesTagCount,
          1
        );
        break;
      case 'CONTENT_TAG':
        userCount.contentTagCount = resultCount(
          checked,
          userCount.contentTagCount,
          1
        );
        break;
      case 'GROUP':
        userCount.groupCount = resultCount(checked, userCount.groupCount, 1);
        break;

      default:
        break;
    }

    setUserCount(userCount);
  };

  useDefaultValue(staticProps, {
    setUserCount,
    getUserCount,
    setSelectedData,
  });

  const handleOk = useCallback(() => {
    const {
      deptInfoList,
      userInfoList,
      equipmentInfoList,
      tvInfoList,
      maternalInfoList,
      cameraInfoList,
      workGroupInfoList,
      groupInfoList,
      tagInfoList,
      customerTagInfoList,
      customerManagerInfoList,
      groupTagInfoList,
      circlesTagInfoList,
      contentTagInfoList,
      isSaveSelectSignature,
      selectSignature,
      onOk,
      showTabList,
      requestParams,
      orgRelAnalysisRange,
    } = treeState;

    const isinnerdeptuser =
      showTabList?.find((item) => item === 'innerContacts') &&
      requestParams?.selectTypeList.find((_: any) => _ === 'dept_user');
    /**
     * 保存快照参数格式化，主要是为了把之前组装的key还原
     * @param list 存储在treeState中的各种list
     */
    const formatParam = (list: IlistItem[]) => {
      const finalList: any[] = [];
      for (const item of list) {
        const obj: any = {};

        obj.id = item.id;
        obj.name = showNameFunc(item, !!isinnerdeptuser);
        obj.type = item.type;
        if (item.orgId) {
          obj.orgId = item.orgId;
        }

        if (item.orgName) {
          obj.orgName = item.orgName;
        }

        if (item.contactType) {
          obj.contactType = item.contactType;
        }
        if (item.extendedAttribute) {
          obj.extendedAttribute = item.extendedAttribute;
        }

        if (item.childDelete) {
          obj.childDelete = item.childDelete;
        }
        if (item.noTagLabelPermission) {
          obj.noTagLabelPermission = item.noTagLabelPermission;
        }

        finalList.push(obj);
      }
      return finalList;
    };

    // 保存参数
    const params: IsaveResultParams = {
      deptInfoList: formatParam(deptInfoList),
      userInfoList: formatParam(userInfoList),
      groupInfoList: formatParam(groupInfoList),
      tagInfoList: formatParam(tagInfoList),
      customerTagInfoList: formatParam(customerTagInfoList),
      customerManagerInfoList: formatParam(customerManagerInfoList),
      groupTagInfoList: formatParam(groupTagInfoList),
      circlesTagInfoList: formatParam(circlesTagInfoList),
      contentTagInfoList: formatParam(contentTagInfoList),
      equipmentInfoList: formatParam(equipmentInfoList),
      tvInfoList: formatParam(tvInfoList),
      maternalInfoList: formatParam(maternalInfoList),
      cameraInfoList: formatParam(cameraInfoList),
      workGroupInfoList: formatParam(workGroupInfoList),
      id: null,
    };

    // 如果不需要保存快照，则直接返回结果
    if (!isSaveSelectSignature) {
      onOk({
        deptInfoList: params.deptInfoList,
        userInfoList: params.userInfoList,
        tagInfoList: params.tagInfoList,
        customerManagerInfoList: params.customerManagerInfoList,
        customerTagInfoList: params.customerTagInfoList,
        groupTagInfoList: params.groupTagInfoList,
        circlesTagInfoList: params.circlesTagInfoList,
        contentTagInfoList: params.contentTagInfoList,
        groupInfoList: params.groupInfoList,
        equipmentInfoList: params.equipmentInfoList,
        tvInfoList: params.tvInfoList,
        maternalInfoList: params.maternalInfoList,
        cameraInfoList: params.cameraInfoList,
        workGroupInfoList: params.workGroupInfoList,
      });
      return;
    }

    // 如果有selectSignature字端，则是更新，把原来的selectSignature作为id传回服务端
    if (selectSignature) {
      params.id = selectSignature;
    }

    // 配置行政组织解析参数orgRelAnalysisRange
    if (orgRelAnalysisRange) {
      params.orgRelRange = orgRelAnalysisRange;
    }

    // tslint:disable-next-line: no-floating-promises
    net
      .request(`${URL()}/select/component/result`, {
        method: 'POST',
        data: {
          ...(requestParams || {}),
          ...(params || {}),
        },
      })
      .then((result) => {
        onOk({
          selectSignature: result.data,
          deptInfoList: params.deptInfoList,
          userInfoList: params.userInfoList,
          tagInfoList: params.tagInfoList,
          customerTagInfoList: params.customerTagInfoList,
          customerManagerInfoList: params.customerManagerInfoList,
          groupTagInfoList: params.groupTagInfoList,
          circlesTagInfoList: params.circlesTagInfoList,
          contentTagInfoList: params.contentTagInfoList,
          groupInfoList: params.groupInfoList,
          equipmentInfoList: params.equipmentInfoList,
          tvInfoList: params.tvInfoList,
          maternalInfoList: params.maternalInfoList,
          cameraInfoList: params.cameraInfoList,
          workGroupInfoList: params.workGroupInfoList,
        });
      });
  }, [treeState]);

  return {
    loading,
    resultLoading,
    treeState,
    setBasePath,
    setSelectedData,
    setRequest,
    updateCheckedNode,
    delKeys,
    clear,
    setTreeData,
    setUserCount,
    resetUserCount,
    getTreeRoot,
    getSearchResult,
    loadData,
    getUserCount,
    handleOk,
  };
};

export default useTree;
