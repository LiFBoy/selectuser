import { ModalProps } from 'antd/lib/modal';

export type NodeType =
  | 'USER'
  | 'DEPT'
  | 'EQUIPMENT'
  | 'TV'
  | 'CAMERA'
  | 'WORK_GROUP'
  | 'MATERNAL'
  | 'CUSTOMER_TAG'
  | 'GROUP_TAG'
  | 'CIRCLES_TAG'
  | 'CONTENT_TAG'
  | 'CUSTOMER_MANAGER_USER'
  | 'TAG'
  | 'GROUP';

export interface ListItem {
  id: string;
  // 名称
  name: string;
  // 用户数
  userCount?: number;
  // 类型（人 or 部门）
  type: 'dept' | 'user';
  isRoot: boolean;
  // 组织名称
  orgName?: string;
  // 所属部门 id（用于区分不同部门下的同一人）
  deptId?: string;
  // 所属部门名称（用于区分不同部门下的同一人）
  deptName?: string;
}

export interface ValueObj {
  // 快照 id，用于获取已有数据
  selectSignature?: string;
  // 当前所属组织 ID
  orgId?: string | number;
  // 人员列表
  userInfoList: IlistItem[];
  // 虚拟客户列表
  customerManagerInfoList?: IlistItem[];
  // 部门列表
  deptInfoList: IlistItem[];
  // 标签列表
  tagInfoList: IlistItem[];
  // 客户标签
  customerTagInfoList: IlistItem[];
  // 群标签
  groupTagInfoList: IlistItem[];
  // 圈子标签
  circlesTagInfoList: IlistItem[];
  // 内容标签
  contentTagInfoList: IlistItem[];
  // 群
  groupInfoList?: IlistItem[];
  // 相关告警群
  workGroupInfoList?: IlistItem[];
  // 设备
  equipmentInfoList?: IlistItem[];
  tvInfoList?: IlistItem[];
  cameraInfoList?: IlistItem[];
  maternalInfoList?: IlistItem[];
  totalCount?: number;
  count?: any;
}

export type Value = ValueObj;

export interface IdefaultValue {
  deptInfoList?: IlistItem[];
  userInfoList?: IlistItem[];
  customerManagerInfoList?: IlistItem[];
  tagInfoList?: IlistItem[];
  customerTagInfoList?: IlistItem[];
  groupTagInfoList?: IlistItem[];
  circlesTagInfoList?: IlistItem[];
  contentTagInfoList?: IlistItem[];
  groupInfoList?: IlistItem[];
  maternalInfoList?: IlistItem[];
  cameraInfoList?: IlistItem[];
  tvInfoList?: IlistItem[];
  equipmentInfoList?: IlistItem[];
}

export interface IlistItem {
  id: string;
  name: string;
  type?: string;
  orgId?: string;
  orgName?: string;
  contactType?: string;
  deptId?: string;
  extendedAttribute?: any;
  childDelete?: boolean;
  noTagLabelPermission?: boolean;
  // 所属部门名称（用于区分不同部门下的同一人）
  deptName?: string;
}

// 获取用户总数的请求参数
export interface SelectUserCountRequestItem {
  selectNodeList: {
    contactType: string;
    childDelete?: boolean;
    extendedAttribute?: any;
    type?: string;
    key?: string;
    id: string;
  }[];
  type: string;
}

export interface ItreeItem extends Omit<ListItem, 'type' | 'isRoot'> {
  key: string;
  title?: any;
  orgId?: string;
  // label?: string;
  type?: NodeType;
  childDelete?: boolean;
  // 直接子节点
  children?: ItreeItem[];
  // 是否可选中
  checkable?: boolean;
  // 是否叶子节点，默认为 false
  isLeaf?: boolean;
  // 当前节点所在层级的序号路径
  pos?: string;
  label?: any;
  // 只在下属组织人员信息中出现
  fullName?: string;
  // 图标
  icon?: any;
  parentId?: any;
  selectType?: any;
  contactType?: string;
  count?: number;
  labelPermission?: number;
  noTagLabelPermission?: boolean;
  labelGroupType?: string;
}

export interface PropTypes {
  // 显示时的初始数据，优先级低于 selectSignature。
  defaultValue?: IdefaultValue;
  // origin
  userOrigin?: string;
  target?: string;
  modalWidth?: number;
  noTagLabelPermission?: boolean;
  // 快照 id，用于获取已有数据
  selectSignature?: string;
  // 是否需要请求后台保存快照，true(默认): 在onOk的时候请求后台保存快照; false: 在onOk的时候仅返回当前选中的数据
  isSaveSelectSignature?: boolean;
  // 弹层是否显示
  visible: boolean;
  // 需要展示的 tab 选项列表，默认为当前组织类型下的所有 tab
  // 展示的选项卡列表
  showTabList?: (
    | 'innerContacts'
    | 'customerManagerContacts'
    | 'maternalContacts'
    | 'disabledHomeContacts'
    | 'memberContacts'
    | 'memberDeptContacts'
    | 'equipmentContacts'
    | 'customerTagContacts'
    | 'groupTagContacts'
    | 'circlesTagContacts'
    | 'contentTagContacts'
    | 'groupContacts'
  )[];
  onCancel?(): void;
  onOk(value: Value): void;
  // 选择模式：人 or 部门，默认 'user'
  selectType?: 'user' | 'dept';
  // 不可选节点类型, 不传默认全部可选
  unCheckableNodeType?: NodeType[];
  // 仅叶子节点可选, 搭配selectType使用, 默认为false
  // 当selectType为user时，仅可选人
  // 当selectType为dept时，仅可选部门叶子节点
  onlyLeafCheckable?: boolean;
  // 搜索框的提示文案，默认为 “搜索姓名、部门名称、手机号”
  searchPlaceholder?: string;
  // 是否多选，默认 true
  multiple?: boolean;
  // 透传给模态框的属性，如标题等，默认 {}
  dialogProps?: ModalProps;
  // 请求的基础路径，默认 'pc'
  basePath?: 'pc' | 'mobile';
  // 请求需要的额外参数
  requestParams?: {
    // 选择类型 只可选用户user,部门dept,组织org,分组group,标签tag
    selectTypeList?: any;

    // 仅在tab为标签时生效，0全部，1运营，2系统
    tagTypeList?: ['0', '1', '2'];

    category?: string; // 区分选人或选部门，只有选部门时才传
  };
  // 透传给右侧已选择组件的属性，如部门文案等，默认 {}
  selectPaneProps?: any;
  /**
   * 行政组织解析类型配置
   * 需配合isSaveSelectSignature使用，只有isSaveSelectSignature为true才会触发
   * orgRelUser => true 选择组织成员；false 选择组织
   * userTypeList => 1教师、2外聘、3学生、4毕业生
   */
  orgRelAnalysisRange?: {
    orgRelUser: boolean;
    userTypeList: number[];
  };

  getCheckedNodes?(value: Value): void;
  getTotalCount?(value: any): void;
}

export type SelectUserFuncArgProps = Omit<PropTypes, 'visible' | 'onOk'> & {
  onOk(value: Value): void | Promise<void>;
};

export type SelectUserFunc = (props: SelectUserFuncArgProps) => {
  destroy: () => void;
};

export interface SelectUserStaticFunctions {
  show: SelectUserFunc;
}

export interface IsaveResultParams {
  deptInfoList: any;
  userInfoList?: any;
  groupInfoList?: any;
  workGroupInfoList?: any;
  tagInfoList?: any;
  customerTagInfoList?: any;
  customerManagerInfoList?: any;
  groupTagInfoList?: any;
  circlesTagInfoList?: any;
  contentTagInfoList?: any;
  equipmentInfoList?: any;
  tvInfoList?: any;
  maternalInfoList?: any;
  cameraInfoList?: any;
  id: string | null;
  totalCount?: any;
  orgRelRange?: {
    orgRelUser: boolean;
    userTypeList: number[];
  };
}

interface ISelectNodeListItem {
  contactType: string;
  extendedAttribute?: any;
  childDelete?: boolean;
  type?: string;
  key?: string;
  id: string;
}

export interface SelectUserCountRequestItem {
  selectNodeList: ISelectNodeListItem[];
  type: string;
}
