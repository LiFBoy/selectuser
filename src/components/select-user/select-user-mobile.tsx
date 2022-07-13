import React, { useState, useCallback, useContext, useEffect } from 'react';
import SelectPannel from './mobile/select-pannel';
import SelectSearchResult from './mobile/select-search-result';
import SelectFooter from './mobile/select-footer';
import './index.less';
import { Modal, Toast } from 'antd-mobile';
import { SearchBar } from 'antd-mobile-v5';
import net from '../../services/index';
import SelectedPane from './mobile/selected-pane';
import { IlistItem, SelectUserCountRequestItem } from './interface';
import { IsaveResultParams, PropTypes, IdefaultValue } from './interface';
import { TREE_CONTEXT } from './select-user';
import classnames from 'classnames';
import { URL } from '../../utils/api';
import lback from './l-back.svg';

const SelectUserMobile: React.FunctionComponent<PropTypes> = ({
  defaultValue,
  dialogProps = {},
  visible = false,
  multiple = true,
  onOk,
  onCancel,
  getCheckedNodes,
  getTotalCount,
  basePath = 'mobile',
  selectSignature = '',
  isSaveSelectSignature = true,
  requestParams = { campusType: 'base_school_type' },
  showTabList,
  selectType = 'user',
  unCheckableNodeType = [],
  searchPlaceholder = '搜索姓名、部门名称、手机号',
  onlyLeafCheckable = false,
  orgRelAnalysisRange,
  ...others
}) => {
  // 当前的搜索字段
  const [searchValue, setSearchValue] = useState<string>('');
  // 当前的搜索结果
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchTab, setSearchTab] = useState<string>('all');

  const [modal1, setModal] = useState<boolean>(false);

  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);

  const {
    treeState,
    setBasePath,
    setCorpidAppId,
    setSelectedData,
    setUserCount,
    clear,
    setRequest,
  } = treeContext;

  // 当搜索的tab改变
  const onSearchTabChange = (nextTab: any) => {
    const { key } = nextTab;
    setSearchTab(key);
    const params = {
      keyword: searchValue,
      types: key === 'all' ? showTabList : [key],
      ...requestParams,
    };
    getSearchResult(params);
  };

  useEffect(() => {
    clear();
    setBasePath(basePath);
    setCorpidAppId({ appId: others?.appId, corpid: others?.corpid });
  }, []);

  useEffect(() => {
    /**
     * 对defaultValue或者请求获取的数据源进行处理
     * @param data
     */
    // if (!visible) return;
    function resolveData(data: IdefaultValue) {
      const {
        deptInfoList = [],
        userInfoList = [],
        tagInfoList = [],
        customerTagInfoList = [],
        groupTagInfoList = [],
        circlesTagInfoList = [],
        contentTagInfoList = [],
        groupInfoList = [],
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

      selectCountRequestList = [deptObject, tagObject, groupObject];

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
        };
        setUserCount(count);
      } else {
        // 获取已选用户总人数
        getUserCount(selectCountRequestList, userInfoList);
      }

      /**
       * @param list
       */
      const generateKey = (list: IlistItem[]) => {
        list.forEach((item: IlistItem) => {
          checkedKeys.push(item.id);
        });
      };

      generateKey(deptInfoList);
      generateKey(userInfoList);
      generateKey(tagInfoList);
      generateKey(customerTagInfoList);
      generateKey(groupTagInfoList);
      generateKey(contentTagInfoList);
      generateKey(circlesTagInfoList);
      generateKey(groupInfoList);

      // 更新
      setSelectedData({
        deptInfoList,
        userInfoList,
        tagInfoList,
        customerTagInfoList,
        groupTagInfoList,
        contentTagInfoList,
        circlesTagInfoList,
        groupInfoList,
        checkedKeys,
      });
    }

    // 如果传入了默认值
    if (defaultValue) {
      // 处理默认值
      resolveData(defaultValue);
    }

    // if (selectSignature) {
    //   // 拉取数据并更新treeState中的已选数据
    //   // tslint:disable-next-line: no-floating-promises

    //   net
    //     .request(
    //       `${URL()}/select/component/result?corpid=${others?.corpid}&appId=${
    //         others?.appId
    //       }`,
    //       {
    //         method: 'POST',
    //         data: {
    //           selectSignature,
    //           ...requestParams,
    //         },
    //       }
    //     )
    //     .then((result: any) => {
    //       if (result.data) {
    //         resolveData(result.data);
    //         if (typeof getCheckedNodes === 'function') {
    //           getCheckedNodes({
    //             ...result.data,
    //             selectSignature: result.data.id,
    //           });
    //         }
    //       }
    //       // 处理响应数据
    //     });
    // }
  }, [selectSignature, visible]);

  // 获取用户人数
  const getUserCount = (selectCountRequestList: any, userInfoList: any) => {
    // tslint:disable-next-line: no-floating-promises
    net
      .request(
        `/select/compent/getUserCount?corpid=${others?.corpid}&appId=${others?.appId}`,
        {
          method: 'POST',
          data: {
            corpId: requestParams?.corpId,
            selectCountRequestList,
          },
        }
      )
      .then((res) => {
        const data = res.data;
        const count = {
          deptCount: 0,
          tagCount: 0,
          customerTagCount: 0,
          groupTagCount: 0,
          circlesTagCount: 0,
          contentTagCount: 0,
          groupCount: 0,
          userCount: 0,
        };

        for (const item of data) {
          switch (item.type) {
            case 'DEPT':
              count.deptCount = item.deptCount;
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
            case 'GROUP_TAG':
              count.groupTagCount = item.groupTagCount;
              break;
            case 'CIRCLES_TAG':
              count.circlesTagCount = item.circlesTagCount;
              break;
            case 'CONTENT_TAG':
              count.contentTagCount = item.contentTagCount;
              break;
            default:
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

  const handleOk = useCallback(() => {
    setRequest(true);
    /**
     * 保存快照参数格式化，主要是为了把之前组装的key还原
     * @param list 存储在treeState中的各种list
     */
    const formatParam = (list: IlistItem[]) => {
      const finalList: any[] = [];
      for (const item of list) {
        const obj: any = {};

        obj.id = item.id;
        obj.name = item.name;

        if (item.orgId) {
          obj.orgId = item.orgId;
        }

        if (item.orgName) {
          obj.orgName = item.orgName;
        }

        if (item.contactType) {
          obj.contactType = item.contactType;
        }

        if (item?.nodeType) {
          obj.nodeType = item.nodeType;
        }

        finalList.push(obj);
      }
      return finalList;
    };

    const {
      deptInfoList,
      userInfoList,
      groupInfoList,
      tagInfoList,
      customerTagInfoList,
      groupTagInfoList,
      circlesTagInfoList,
      contentTagInfoList,
      userCount,
      equipmentInfoList,
    } = treeState;

    let totalCount = userInfoList?.length || 0; // 已选总数
    for (const key in userCount) {
      totalCount += userCount[key] || 0;
    }
    userCount.userCount = userInfoList?.length || 0;

    // 保存参数
    const params: IsaveResultParams = {
      deptInfoList: formatParam(deptInfoList),
      userInfoList: formatParam(userInfoList),
      groupInfoList: formatParam(groupInfoList),
      tagInfoList: formatParam(tagInfoList),
      customerTagInfoList: formatParam(customerTagInfoList),
      groupTagInfoList: formatParam(groupTagInfoList),
      circlesTagInfoList: formatParam(circlesTagInfoList),
      contentTagInfoList: formatParam(contentTagInfoList),
      equipmentInfoList: formatParam(equipmentInfoList),
      id: null,
      totalCount,
    };

    // 如果不需要保存快照，则直接返回结果
    if (!isSaveSelectSignature) {
      onOk({
        deptInfoList: params.deptInfoList,
        userInfoList: params.userInfoList,
        tagInfoList: params.tagInfoList,
        customerTagInfoList: params.customerTagInfoList,
        groupTagInfoList: params.groupTagInfoList,
        circlesTagInfoList: params.circlesTagInfoList,
        contentTagInfoList: params.contentTagInfoList,
        groupInfoList: params.groupInfoList,
        totalCount: params.totalCount,
        equipmentInfoList: params.equipmentInfoList,
        count: userCount,
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
          ...params,
          ...requestParams,
        },
      })
      .then((result) => {
        setRequest(false);

        onOk({
          selectSignature: result.data,
          deptInfoList: params.deptInfoList,
          userInfoList: params.userInfoList,
          tagInfoList: params.tagInfoList,
          customerTagInfoList: params.customerTagInfoList,
          groupTagInfoList: params.groupTagInfoList,
          circlesTagInfoList: params.circlesTagInfoList,
          contentTagInfoList: params.contentTagInfoList,
          groupInfoList: params.groupInfoList,
          equipmentInfoList: params.equipmentInfoList,
          totalCount: params.totalCount,
          count: userCount,
        });
      });
  }, [onOk, treeState]);

  // 请求获取搜索结果
  const getSearchResult = (params: any) => {
    Toast.loading('加载中…', 0);
    // tslint:disable-next-line: no-floating-promises
    net
      .request(`${URL()}/select/component/search`, {
        method: 'POST',
        data: params,
      })
      .then((res) => {
        Toast.hide();
        const data = res.data;
        setSearchResult(data);
      })
      .catch(() => {
        Toast.hide();
      })
      .finally(() => {
        Toast.hide();
      });
  };

  return (
    <>
      {visible && (
        <div className="selected-mobile-model">
          <div
            className={classnames('select-user-mobile', {
              'select-user-mobile-visible': !!visible,
            })}
          >
            <div className="left-pane">
              <div className="ss-mobile-title-bar">
                <div className="btn-wrap" onClick={() => onCancel()}>
                  <img src={lback} alt="" />
                </div>
                <div className="title-wrap">选择对象</div>
              </div>
              <div className="column-top">
                <SearchBar
                  // value={searchValue}
                  onCancel={() => {
                    setSearchValue('');
                  }}
                  onSearch={(value) => {
                    const params = {
                      keyword: value.replace(/\s+/g, ''),
                      types: searchTab === 'all' ? showTabList : [searchTab],
                      ...requestParams,
                    };
                    getSearchResult(params);
                    setSearchValue(value.replace(/\s+/g, ''));
                  }}
                  // onChange={(value) => setSearchValue(value)}
                  className="search"
                  placeholder="请输入关键词进行搜索"
                  showCancelButton
                />
              </div>

              {searchValue && !!searchResult ? (
                <SelectSearchResult
                  searchResult={searchResult}
                  multiple={multiple}
                  search={searchValue}
                  searchTab={searchTab}
                  selectType={selectType}
                  onSearchTabChange={onSearchTabChange}
                  showTabList={showTabList}
                />
              ) : (
                <>
                  <SelectPannel
                    visible={visible}
                    showTabList={showTabList}
                    multiple={multiple}
                    selectType={selectType}
                    basePath={basePath}
                    requestParams={requestParams}
                    unCheckableNodeType={unCheckableNodeType}
                    onlyLeafCheckable={onlyLeafCheckable}
                    {...others}
                  />
                </>
              )}
            </div>
            <SelectFooter
              onOk={handleOk}
              className="mobile-footer"
              open={() => setModal(true)}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              searchResult={searchResult}
            />
            {
              <Modal
                className="selected-model"
                visible={modal1}
                transparent
                maskClosable={false}
                footer={[
                  {
                    text: '确定',
                    style: 'primary',
                    onPress: () => {
                      setModal(false);
                    },
                  },
                ]}
              >
                <SelectedPane
                  setModal={setModal}
                  showUserDeptName={requestParams?.strictUser}
                  selectType={selectType}
                />
              </Modal>
            }
          </div>
        </div>
      )}
    </>
  );
};

export default SelectUserMobile;
