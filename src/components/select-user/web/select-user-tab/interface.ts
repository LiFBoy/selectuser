export interface PropTypes {
  onTabChange: (current: any) => void;
  showTabList: TabTypes[];
  activeKey: TabTypes | '';
}

export type TabTypes =
  | 'dept' // 部门
  | 'group' // 下属组织
  | 'innerContacts' // 内部通讯录
  | 'maternalContacts' // 母婴通讯录
  | 'disabledHomeContacts' // 残疾人之家
  | 'equipmentContacts' // 资产通讯录
  | 'memberContacts' // 居民
  | 'memberDeptContacts' // 社区通讯录
  | 'schoolContacts' // 家校通讯录
  | 'tagContacts' // 标签
  | 'orgRel' // 行政组织-精准推送
  | 'groupContacts';
