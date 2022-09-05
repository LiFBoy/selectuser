import { ItreeItem } from '../../../select-user/interface';
import { TAB_MAPS } from '../../../../constants';
import empty02 from '../select-search-result/icon_empty_02.svg';
import './index.less';

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
import useSelectExpand from '../../hooks/use-select-m-active';
import { Accordion, Toast } from 'antd-mobile';

import {
  TagIcon,
  InternalIcon,
  GroupIcon,
} from '../../../tree-node-icon-mobile';

interface PropType {
  currentTab?: string; // 用当前选中的tab作为Tree组件的key，当切换tab时使Tree组件重新生成
  multiple: boolean;
  loadData: (node: any, currentTab: string) => Promise<void>;
  showTabList: any;
  getTree: any;
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
  const [activeKey, setActiveKey] = useState<any>(showTabList);
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
        icon: <>{formatIcon(item)}</>,
      };
    });

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
      case 'innerContacts': // 内部通讯录
      case 'maternalContacts': // 私域通讯录
        return <InternalIcon />;
      case 'groupContacts': // 企微互联群
        return <GroupIcon />;
      case 'customerTagContacts': // 客户标签
      case 'groupTagContacts': // 群标签
      case 'circlesTagContacts': // 圈子标签
      case 'contentTagContacts': // 内容标签
        return <TagIcon />;
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
  // console.log(accordion, 'accordion', treeState, 'treeState');
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
                  {item.children?.length > 0 &&
                    item.children?.map((child: ItreeItem) => {
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

                  {['groupContacts'].indexOf(showTabList[0]) > -1 &&
                    item.children?.length > 19 && (
                    <div className="more-m-text">
                        仅展示前20条数据，请输入更精确的搜索内容获取
                    </div>
                  )}
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
        ) : (
          <div className="empty-content">
            <div className="empty-img">
              <img src={empty02} alt="" />
            </div>
            <span>暂无内容</span>
          </div>
        ))}
    </div>
  );
};

export default SchoolContacts;
