import { NodeType } from '../../../../components/select-user/interface';

const TAB_MAPS: any = {
  dept: '所属部门',
  group: '下属组织',
  innerContacts: '内部通讯录',
  equipmentContacts: '资产通讯录',
  memberContacts: '居民',
  memberDeptContacts: '社区通讯录',
  schoolContacts: '家校通讯录',
  groupContacts: '互连微信群',
  tagContacts: '标签',
  orgRel: '行政组织',
};

export interface ItreeItem {
  id: string;
  key: string;
  name: string;
  label: any;
  nodeType: NodeType;
  orgId?: string;
  type?:
    | 'DEPT' // 部门
    | 'GROUP_DEPT' //  虚拟部门
    | 'USER' // 个人
    | 'ORG' // 组织
    | 'TAG' // 标签
    | 'GROUP' // 分组
    | 'ORG_REL'; // 行政组织-精准推送业务
  deptType?:
    | 0 // 基础校区
    | 1; // 自定义校区
  userCount?: number;
  children?: ItreeItem[];
  checkable?: boolean;
  isLeaf?: boolean;
  icon?: any;
  contactType?: string;
  count?: number;
}

interface AccordionItem {
  key: string;
  children: ItreeItem[];
  icon: any;
}

import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { TREE_CONTEXT } from '../../select-user';
import PannelItem from '../pannel-item';
import Breadcrumb from '../Breadcrumb';
import useSelectExpand from '../../hooks/use-select-active';
import { Accordion, Toast } from 'antd-mobile';

import {
  TagIcon,
  DeptIcon,
  OrgIcon,
  InternalIcon,
  OrgRelIcon,
  GroupIcon,
} from '../../../tree-node-icon-mobile';

interface PropType {
  currentTab?: string; // 用当前选中的tab作为Tree组件的key，当切换tab时使Tree组件重新生成
  multiple: boolean;
  loadData: (node: any, currentTab: string) => Promise<void>;
  showTabList: any;
  getTree: any;
  corpid?: string | number;
  appId?: string | number;
  visible?: boolean;
  formatData: any;
  selectType: 'user' | 'dept';
}

const SchoolContacts: React.FunctionComponent<PropType> = (props: PropType) => {
  // 获取props
  const {
    multiple,
    selectType,
    loadData,
    showTabList,
    visible,
    getTree,
    formatData,
  } = props;
  // 获取treeContext
  const { treeState, setTreeData, clear } = useContext(TREE_CONTEXT);
  const { treeData = [] } = treeState || {};
  const [accordion, setAccordion] = useState<any>([]);
  const accordionRef = useRef<any>([]);

  const [currentTab, setCurrentTab] = useState<any>('');
  const [activeKey, setActiveKey] = useState<any>(
    showTabList || [
      'dept',
      'group',
      'innerContacts',
      'equipmentContacts',
      'schoolContacts',
      'tagContacts',
      'orgRel',
      'groupContacts',
    ]
  );
  const activeKeyRef = useRef<any>([]);
  const scrollDom = useRef<any>(null);
  const scrollRef = useRef<any>(0);

  const { breadcrumb, handleSelect, handleClickBreadcrumb } = useSelectExpand(
    loadData,
    currentTab,
    showTabList,
    accordion,
    setCurrentTab
  );

  const difference = (prearr: string[], arr: string[]) => {
    const set = new Set(arr);
    return prearr.filter((x: any) => !set.has(x));
  };

  useEffect(() => {
    if (breadcrumb.length) {
      setAccordion([]);
      return;
    }
    getSchoolContactsInitData(activeKey);
    const nextAccordion = showTabList.map((item: string) => {
      return {
        key: item,
        icon: <React.Fragment>{formatIcon(item)}</React.Fragment>,
      };
    });
    console.log(showTabList, 'showTabList');
    setAccordion(nextAccordion);
    accordionRef.current = nextAccordion;
    activeKeyRef.current = activeKey;
  }, [breadcrumb]);

  useEffect(() => {
    if (!visible) {
      setTreeData([]);
      clear();
    }
  }, [visible]);

  const onChange = useCallback(
    (keys: string[]) => {
      if (activeKeyRef.current.length > keys.length) {
        // 收起
        setActiveKey(keys);
        activeKeyRef.current = keys;
      } else {
        const tab = difference(keys, activeKeyRef.current);
        setCurrentTab(tab[0]);
        setActiveKey(keys);
        activeKeyRef.current = keys;
      }
    },
    [activeKey]
  );

  const panelChange = useCallback(
    (key: string, users: any) => {
      const nextAccordion = accordionRef.current;
      nextAccordion.map((item: AccordionItem) => {
        if (item.key === key) {
          item.children = users;
        }
      });
      setAccordion([...(nextAccordion || {})]);
      accordionRef.current = nextAccordion || '';
    },
    [accordion, accordionRef]
  );

  const formatIcon = (key: string) => {
    switch (key) {
      case 'dept': // 所属部门
        return <DeptIcon />;
      case 'group': // 下属组织
        return <OrgIcon />;
      case 'innerContacts': // 内部通讯录
      case 'equipmentContacts': // 内部通讯录
      case 'memberContacts': // 居民
      case 'memberDeptContacts': // 社区通讯录
      case 'schoolContacts': // 家校通讯录
        return <InternalIcon />;
      case 'groupContacts': // 家校通讯录
        return <GroupIcon />;
      case 'tagContacts': // 标签
        return <TagIcon />;
      case 'orgRel': // 行政组织-精准推送
        return <OrgRelIcon />;
      default:
    }
  };

  const getSchoolContactsInitData = (keys: string[]) => {
    Toast.loading('加载中', 0);
    Promise.all(keys.map((tab) => getTree(tab)))
      .then((data) => {
        Toast.hide();
        for (const item of data) {
          formatData(item.data, item.currentTab, true);
          if (showTabList.indexOf(item.currentTab) > -1) {
            panelChange(item.currentTab, item.data);
          }
        }
      })
      .catch(() => {
        Toast.hide();
      })
      .finally(() => {
        Toast.hide();
      });
  };

  useEffect(() => {
    if (currentTab) {
      const item = accordion.find(
        (node: AccordionItem) => node.key === currentTab
      );
      if (!item.children || item.children.length === 0) {
        getSchoolContactsInitData([currentTab]);
      }
    }
  }, [currentTab]);

  const handleScroll = (e: any) => {
    const y = e.target.scrollTop;
    if (y !== 0 && breadcrumb.length === 0) {
      scrollRef.current = y;
    }
  };

  useEffect(() => {
    scrollDom.current?.addEventListener('scroll', handleScroll);
    return () => scrollDom.current?.removeEventListener('scroll', handleScroll);
  });

  useEffect(() => {
    if (breadcrumb.length === 0) {
      scrollDom.current.scrollTop = scrollRef.current;
    } else {
      scrollDom.current.scrollTop = 0;
    }
  }, [breadcrumb, scrollRef]);
  console.log(accordion, 'accordion');
  return (
    <div className="scroll" ref={scrollDom}>
      <Breadcrumb
        accordion={accordion}
        tabmaps={TAB_MAPS}
        breadcrumb={breadcrumb}
        handleClickBreadcrumb={handleClickBreadcrumb}
        currentTab={currentTab}
      />
      {
        // 在首页无面包屑的情况执行如下逻辑
        accordion.length > 0 && (
          <Accordion
            className="my-accordion"
            activeKey={activeKey}
            onChange={onChange}
          >
            {accordion?.map((item: AccordionItem) => {
              return (
                <Accordion.Panel
                  key={item.key}
                  header={
                    <div className="tab-header">
                      <div className="icon">{item.icon}</div>
                      <div className="name">{TAB_MAPS[item.key]}</div>
                    </div>
                  }
                >
                  {item.children?.map((child: ItreeItem) => {
                    return (
                      <PannelItem
                        key={child.key}
                        accordion={accordion}
                        breadcrumb={breadcrumb}
                        selectType={selectType}
                        multiple={multiple}
                        currentTab={item.key}
                        handleSelect={handleSelect}
                        node={child}
                      />
                    );
                  })}
                </Accordion.Panel>
              );
            })}
          </Accordion>
        )
      }
      {breadcrumb.length > 0 &&
        (treeData.length > 0 ? (
          <div className="child-item class-name-item-container">
            {treeData.map((item: any) => {
              return (
                <PannelItem
                  accordion={accordion}
                  breadcrumb={breadcrumb}
                  key={item.key}
                  selectType={selectType}
                  multiple={multiple}
                  currentTab={currentTab}
                  node={item}
                  handleSelect={handleSelect}
                />
              );
            })}
          </div>
        ) : null)}
    </div>
  );
};

export default SchoolContacts;
