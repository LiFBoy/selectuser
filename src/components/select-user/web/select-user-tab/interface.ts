export interface PropTypes {
  onTabChange: (current: any) => void;
  showTabList: TabTypes[];
  activeKey: TabTypes | '';
}

export type TabTypes =
  | 'innerContacts' // 内部通讯录
  | 'maternalContacts' // 母婴通讯录
  | 'disabledHomeContacts' // 残疾人之家
  | 'equipmentContacts' // 资产通讯录
  | 'memberContacts' // 居民
  | 'memberDeptContacts' // 社区通讯录
  | 'customerTagContacts' // 客户标签
  | 'groupTagContacts' // 群标签
  | 'circlesTagContacts' // 圈子标签
  | 'contentTagContacts' // 内容标签
  | 'groupContacts'; // 企微互联群
