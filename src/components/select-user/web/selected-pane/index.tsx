import React, { useContext, useCallback } from 'react';
import SelectedShowPane from '../../../../components/selected-show-pane';
import { IgroupItem } from '../../../../components/selected-show-pane/interface';
import { TREE_CONTEXT } from '../../select-user';
import { ItreeItem } from '../../interface';
import './index.less';

interface PropTypes {
  selectType: 'user' | 'dept'; // 可选节点列表
  showUserDeptName?: boolean; // 是否展示用户的 deptName
  selectPaneProps?: any; // 已选分类文案支持自定义
  selectTypeList?: any; // 类型
  noTagLabelPermission?: boolean;
}

const SelectPane: React.FunctionComponent<PropTypes> = (props: PropTypes) => {
  const treeContext = useContext(TREE_CONTEXT);
  const {
    selectType,
    showUserDeptName,
    selectPaneProps,
    noTagLabelPermission,
  } = props;
  const { treeState, delKeys, setUserCount, resetUserCount } = treeContext;
  const {
    deptInfoList,
    userInfoList,
    tagInfoList,
    customerTagInfoList,
    customerManagerInfoList,
    groupTagInfoList,
    circlesTagInfoList,
    contentTagInfoList,
    groupInfoList,
    equipmentInfoList,
    tvInfoList,
    cameraInfoList,
    workGroupInfoList,
    maternalInfoList,
    userCount,
  } = treeState;

  // 删除单个items
  const delItem = useCallback(
    (item: ItreeItem, group: IgroupItem) => {
      delKeys([item], item.type);

      // selectType为user时 需要请求获取人数，否则仅计算当前选中的部门及节点数量
      resetUserCount(item, false, selectType === 'user');
    },
    [delKeys, resetUserCount]
  );

  // 删除一个分组
  const delGroup = useCallback(
    (group: any) => {
      const { itemList } = group;
      if (itemList.length === 0) return;
      delKeys(itemList, group.type);

      switch (group.type) {
        case 'DEPT':
          userCount.deptCount = 0;
          break;
        case 'EQUIPMENT':
          userCount.equipmentCount = 0;
          break;
        case 'TV':
          userCount.tvCount = 0;
          break;
        case 'CAMERA':
          userCount.cameraCount = 0;
          break;
        case 'WORK_GROUP':
          userCount.workGroupCount = 0;
          break;
        case 'MATERNAL':
          userCount.maternalCount = 0;
          break;
        case 'GROUP':
          userCount.groupCount = 0;
          break;
        case 'TAG':
          userCount.tagCount = 0;
          break;
        case 'CUSTOMER_TAG':
          userCount.customerTagCount = 0;
          break;
        case 'CUSTOMER_MANAGER_USER':
          userCount.customerManagerCount = 0;
          break;
        case 'GROUP_TAG':
          userCount.groupTagCount = 0;
          break;
        case 'CIRCLES_TAG':
          userCount.circlesTagCount = 0;
          break;
        case 'CONTENT_TAG':
          userCount.contentTagCount = 0;
          break;
      }
      setUserCount(userCount);
    },
    [delKeys, setUserCount]
  );

  const groupList = [];

  if (userInfoList?.length) {
    const groupItem = {
      title: '人员',
      type: 'USER',
      itemList: userInfoList,
    };
    groupList.push(groupItem);
  }
  if (equipmentInfoList?.length) {
    const equipmentItem = {
      title: '设备',
      type: 'EQUIPMENT',
      count: userCount.equipmentCount || 0,
      itemList: equipmentInfoList,
    };
    groupList.push(equipmentItem);
  }
  if (tvInfoList?.length) {
    const tvItem = {
      title: '广告电视',
      type: 'TV',
      count: userCount.tvCount || 0,
      itemList: tvInfoList,
    };
    groupList.push(tvItem);
  }
  if (cameraInfoList?.length) {
    const tvItem = {
      title: '摄像头',
      type: 'CAMERA',
      count: userCount.cameraCount || 0,
      itemList: cameraInfoList,
    };
    groupList.push(tvItem);
  }
  if (workGroupInfoList?.length) {
    const tvItem = {
      title: '告警群',
      type: 'WORK_GROUP',
      count: userCount.workGroupCount || 0,
      itemList: workGroupInfoList,
    };
    groupList.push(tvItem);
  }
  if (maternalInfoList?.length) {
    const maternalItem = {
      title: '人员',
      type: 'MATERNAL',
      count: userCount.maternalCount || 0,
      itemList: maternalInfoList,
    };
    groupList.push(maternalItem);
  }
  if (deptInfoList?.length) {
    const groupItem = {
      title: '部门',
      type: 'DEPT',
      count: userCount.deptCount || 0,
      itemList: deptInfoList,
      ...selectPaneProps?.dept,
    };
    groupList.push(groupItem);
  }

  if (groupInfoList?.length) {
    const groupItem = {
      title: '互连微信群',
      type: 'GROUP',
      count: userCount.groupCount || 0,
      itemList: groupInfoList,
    };
    groupList.push(groupItem);
  }

  if (customerTagInfoList?.length) {
    const groupItem = {
      title: '客户标签',
      type: 'CUSTOMER_TAG',
      count: userCount.customerTagCount || 0,
      itemList: customerTagInfoList,
    };
    groupList.push(groupItem);
  }
  if (customerManagerInfoList?.length) {
    const groupItem = {
      title: '虚拟客户经理',
      type: 'CUSTOMER_MANAGER_USER',
      count: userCount.customerManagerCount || 0,
      itemList: customerManagerInfoList,
    };
    groupList.push(groupItem);
  }
  if (groupTagInfoList?.length) {
    const groupItem = {
      title: '群标签',
      type: 'GROUP_TAG',
      count: userCount.groupTagCount || 0,
      itemList: groupTagInfoList,
    };
    groupList.push(groupItem);
  }
  if (circlesTagInfoList?.length) {
    const groupItem = {
      title: '圈子标签',
      type: 'CIRCLES_TAG',
      count: userCount.circlesTagCount || 0,
      itemList: circlesTagInfoList,
    };
    groupList.push(groupItem);
  }
  if (contentTagInfoList?.length) {
    const groupItem = {
      title: '内容标签',
      type: 'CONTENT_TAG',
      count: userCount.contentTagCount || 0,
      itemList: contentTagInfoList,
    };
    groupList.push(groupItem);
  }

  return (
    <div className="select-pane-wrap">
      <SelectedShowPane
        noTagLabelPermission={noTagLabelPermission}
        showUserDeptName={showUserDeptName}
        groupList={groupList}
        unit={selectType === 'user' ? '人' : ''} // selectType为user时单位为人，非user时则为部门及节点不展示单位
        delItem={delItem}
        delGroup={delGroup}
      />
    </div>
  );
};

export default SelectPane;
