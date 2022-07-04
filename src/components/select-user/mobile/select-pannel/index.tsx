import React, { useContext } from 'react';
import { TREE_CONTEXT } from '../../select-user';
import SchoolContacts from '../school-contacts';
import net from '../../../../services/index';
import { ItreeItem } from '../school-contacts';
import { NodeType } from '../../../select-user/interface';
import { Toast } from 'antd-mobile';
import { URL } from '../../../../utils/api';
interface IResult {
  code: number;
  data: {
    dataSource: [];
  };
  errorMsg: string | null;
  success: boolean;
}
interface Iprops {
  multiple: boolean; // 是否可以多选
  currentTab?: string;
  appId?: string | number;
  corpid?: string | number;
  basePath: string;
  visible?: boolean;
  showTabList: any;
  onlyLeafCheckable: boolean;
  selectType: 'dept' | 'user';
  unCheckableNodeType: NodeType[];
  requestParams?: {
    // 基础校区还是自定义校区
    campusType?: 'base_school_type' | 'custom_school_type';
    // 仅展示分组
    onlySelectGroup?: boolean;
    // 企业微信 id，移动端鉴权用
    corpId?: string;
    // 部门类型 家校通讯录基础校区下班级class/自定义校区下自定义班级custom_class
    deptTypeList?: any;
    // 仅在tab为下属组织时生效，'0' 虚拟节点|'1'实体节点
    nodeType?: '0' | '1';
    // 仅在tab为标签时生效，0个人标签，1通用标签，2系统标签，3员工系统标签
    tagTypeList?: ['0', '1', '2', '3'];
  };
}

const SelectPannel: React.FunctionComponent<Iprops> = (props: Iprops) => {
  const {
    multiple,
    basePath,
    requestParams,
    selectType,
    showTabList,
    onlyLeafCheckable,
    visible,
    unCheckableNodeType,
    ...ohters
  } = props;

  const { setTreeData } = useContext(TREE_CONTEXT);

  /**
   * 处理返回数据
   * @param {数据列表} list
   * @param {是否为根节点} isRoot
   */
  const formatData = (
    list: ItreeItem[],
    currentTab: string,
    isRoot?: boolean
  ) => {
    for (const item of list) {
      item.name = item.label;
      const initialName = item.label || '';
      // const interceptName = item.label; // funTransformationSubstr(item.label);

      // 根据类型生成带icon的label
      switch (item.type) {
        case 'TAG': // 标签需要展示标签下的人数
          item.label = (
            <>
              <span className="cf-select-user-tree-node">{initialName}</span>
              {/* <span className="cf-select-user-tree-node-num">
                {item.isLeaf ? ` (${item.count || 0})` : ''}
              </span> */}
            </>
          );
          break;
        case 'USER':
          item.label = (
            <div className="label-box">
              <div className="item-name-icon">
                {initialName.substring(initialName.length - 2)}
              </div>
              <div className="cf-select-user-node-wrapper" title={initialName}>
                <span className="cf-select-user-tree-node">{initialName}</span>
              </div>
            </div>
          );
          break;
        case 'GROUP':
        case 'GROUP_DEPT':
        case 'ORG_REL':
        case 'ORG':
        case 'DEPT':
          item.label = (
            <div className="cf-select-user-node-wrapper" title={initialName}>
              <span className="cf-select-user-tree-node">{initialName}</span>
            </div>
          );
          break;
        default:
      }

      item.checkable = true;

      // 如果获取的是跟节点,且是内部通讯录

      if (
        isRoot &&
        [
          'innerContacts',
          'customerTagContacts',
          'groupTagContacts',
          'circlesTagContacts',
          'contentTagContacts',
        ].indexOf(currentTab) > -1
      ) {
        item.checkable = false; // 内部通讯录的跟节点不允许被选择
      }

      if (
        (currentTab === 'innerContacts' ||
          currentTab === 'schoolContacts' ||
          currentTab === 'disabledHomeContacts' ||
          currentTab === 'maternalContacts') && // 在家校通迅录和内部通迅录
        item.type === 'DEPT' && // 如果节点类型为DEPT
        selectType === 'user'
      ) {
        // 且当前组件selectType为user
        item.isLeaf = false; // 则DEPT节点一律视为非叶子结点 (实际场景中DEPT节点下一定有子节点)
      } else if (
        (currentTab === 'innerContacts' ||
          currentTab === 'schoolContacts' ||
          currentTab === 'disabledHomeContacts' ||
          currentTab === 'maternalContacts') &&
        selectType === 'dept'
      ) {
        // 如果当前组件selectType为dept
        // 如果仅叶子节点可选
        if (onlyLeafCheckable && item.isLeaf === false) {
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

      // 如果只有叶子节点可选，且当前selectType为user，则非USER节点一律不可选
      if (onlyLeafCheckable && selectType === 'user' && item.type !== 'USER') {
        item.checkable = false;
      }

      if (item.children) {
        formatData(item.children, currentTab, false);
      }
    }
  };

  const getTree = (currentTab: string) => {
    Toast.loading('加载中…', 0);
    return new Promise((resolve) => {
      net
        .request(`${URL()}/select/component/${currentTab}`, {
          method: 'POST',
          data: {
            nodeType: null,
            orgId: null,
            parentId: null,
            ...requestParams,
            selectUser: selectType === 'user',
          },
        })
        .then((result: IResult) => {
          Toast.hide();
          if (result.success) {
            resolve({ currentTab, data: result.data });
          }
        })
        .catch(() => {
          Toast.hide();
        })
        .finally(() => {
          Toast.hide();
        });
    });
  };

  const loadData = (node: any, currentTab: string) => {
    Toast.loading('加载中', 0);
    const nodeProps = node;
    const item: ItreeItem = {
      id: nodeProps.key,
      label: nodeProps.label,
      name: nodeProps.name,
      key: nodeProps.key,
      type: nodeProps.type,
      nodeType: nodeProps?.nodeType,
      orgId: nodeProps.orgId,
      contactType: nodeProps.contactType,
    };
    return new Promise<void>((resolve) => {
      net
        .request(`${URL()}/select/component/${currentTab}`, {
          method: 'POST',
          data: {
            nodeType: item?.nodeType,
            orgId: item.orgId,
            parentId: item.key,
            ...requestParams,
            // 只有GROUP_DEPT / DEPT类型的节点下才有人的信息
            selectUser:
              selectType === 'user' &&
              (item.type === 'GROUP_DEPT' || item.type === 'DEPT'),
          },
        })
        .then((result: any) => {
          Toast.hide();
          if (result.success) {
            formatData(result.data, currentTab, false);
            setTreeData(result.data);
            resolve();
          }
        })
        .catch(() => {
          Toast.hide();
        })
        .finally(() => {
          Toast.hide();
        });
    });
  };

  return (
    <div className="select-area-pannel">
      <SchoolContacts
        visible={visible}
        loadData={loadData}
        selectType={selectType}
        multiple={multiple}
        showTabList={showTabList}
        getTree={getTree}
        formatData={formatData}
        {...ohters}
      />
    </div>
  );
};

export default SelectPannel;
