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
}

const SelectPane: React.FunctionComponent<PropTypes> = (props: PropTypes) => {
  const treeContext = useContext(TREE_CONTEXT);
  const { selectType, showUserDeptName, selectPaneProps, selectTypeList } =
    props;
  const { treeState, delKeys, setUserCount, resetUserCount } = treeContext;
  const {
    deptInfoList,
    orgInfoList,
    userInfoList,
    tagInfoList,
    groupInfoList,
    equipmentInfoList,
    tvInfoList,
    cameraInfoList,
    workGroupInfoList,
    maternalInfoList,
    orgRelInfoList,
    userCount,
  } = treeState;
  console.log(selectTypeList, 'selectTypeList');

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
        case 'ORG': // 分组和组织放在一起展示，因此清空的时候两个一起清空
          userCount.groupCount = 0;
          userCount.orgCount = 0;
          break;
        case 'TAG':
          userCount.tagCount = 0;
          break;
        case 'ORG_REL':
          userCount.orgRelCount = 0;
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
      unit: '人',
      itemList: userInfoList,
    };
    groupList.push(groupItem);
  }
  if (equipmentInfoList?.length) {
    const equipmentItem = {
      title: '设备',
      type: 'EQUIPMENT',
      unit: '个',
      count: userCount.equipmentCount || 0,
      itemList: equipmentInfoList,
    };
    groupList.push(equipmentItem);
  }
  if (tvInfoList?.length) {
    const tvItem = {
      title: '广告电视',
      type: 'TV',
      unit: '个',
      count: userCount.tvCount || 0,
      itemList: tvInfoList,
    };
    groupList.push(tvItem);
  }
  if (cameraInfoList?.length) {
    const tvItem = {
      title: '摄像头',
      type: 'CAMERA',
      unit: '个',
      count: userCount.cameraCount || 0,
      itemList: cameraInfoList,
    };
    groupList.push(tvItem);
  }
  if (workGroupInfoList?.length) {
    const tvItem = {
      title: '告警群',
      type: 'WORK_GROUP',
      unit: '个',
      count: userCount.workGroupCount || 0,
      itemList: workGroupInfoList,
    };
    groupList.push(tvItem);
  }
  if (maternalInfoList?.length) {
    const maternalItem = {
      title: '人员',
      type: 'MATERNAL',
      unit: '人',
      count: userCount.maternalCount || 0,
      itemList: maternalInfoList,
    };
    groupList.push(maternalItem);
  }
  if (deptInfoList?.length) {
    const groupItem = {
      title: '部门',
      type: 'DEPT',
      unit: '人',
      count: userCount.deptCount || 0,
      itemList: deptInfoList,
      ...selectPaneProps?.dept,
    };
    groupList.push(groupItem);
  }

  // 选中的组织或分组，统一放到组织中
  if (orgInfoList?.length) {
    const orgItem = {
      title: '组织',
      type: 'ORG',
      unit: '人',
      count: userCount.orgCount || 0,
      itemList: orgInfoList,
    };
    groupList.push(orgItem);
  }

  // 选中的分组
  if (groupInfoList?.length) {
    const groupItem = {
      title: '互连微信群',
      type: 'GROUP',
      unit: '人',
      count: userCount.groupCount || 0,
      itemList: groupInfoList,
    };
    groupList.push(groupItem);
  }

  if (tagInfoList?.length) {
    const groupItem = {
      // title: '标签2',
      title: selectTypeList.indexOf('targ') > -1 ? '客户标签' : '群标签',
      type: 'TAG',
      unit: '人',
      count: userCount.tagCount || 0,
      itemList: tagInfoList,
    };
    groupList.push(groupItem);
  }

  if (orgRelInfoList?.length) {
    const schoolList = orgRelInfoList?.filter(
      (parameter: any) => parameter?.nodeType === 'SCHOOL'
    );
    if (schoolList.length > 0) {
      const orgRelSchoolItem = {
        title: '已选学校',
        type: 'SCHOOL',
        unit: '组',
        count: schoolList.length || 0,
        itemList: schoolList,
      };
      groupList.push(orgRelSchoolItem);
    }

    const regulatoryList = orgRelInfoList?.filter(
      (parameter: any) => parameter?.nodeType === 'REGULATORY'
    );
    if (regulatoryList?.length > 0) {
      const orgRelRegulatoryItem = {
        title: '已选教育局及下属学校',
        type: 'REGULATORY',
        unit: '组',
        count: regulatoryList.length || 0,
        itemList: regulatoryList,
      };
      groupList.push(orgRelRegulatoryItem);
    }
  }

  return (
    <div className="select-pane-wrap">
      <SelectedShowPane
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
