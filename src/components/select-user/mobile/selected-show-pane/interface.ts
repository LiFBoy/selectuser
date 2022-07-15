export interface ItreeItem {
  id: string;
  key: string;
  name: string;
  title: any;
  label: any;
  orgId?: string;
  type?:
    | 'DEPT' // 部门
    | 'EQUIPMENT' //  设备
    | 'TV' //  广告电视
    | 'CAMERA' //  摄像头
    | 'WORK_GROUP' //  告警群
    | 'MATERNAL' //  母婴
    | 'TAG' // 标签
    | 'CUSTOMER_TAG' // 标签
    | 'GROUP_TAG' // 标签
    | 'CIRCLES_TAG' // 标签
    | 'CONTENT_TAG' // 标签
    | 'GROUP'; // 分组
  userCount?: number;
  children?: [];
  checkable?: boolean;
  isLeaf?: boolean;
  icon?: any;
  contactType?: string;
  count?: number;
  // 只在下属组织人员信息中出现
  fullName?: string;
  deptName?: string;
}

// 展示分组
export interface IgroupItem {
  title: string;
  unit: string;
  type: string;
  count?: number;
  itemList: ItreeItem[];
}

// 已选展示组件props
export interface PropType {
  showUserDeptName?: boolean; // 是否展示用户的 deptName
  groupList: any[];
  unit: string; // 计量单位
  delGroup: (group: IgroupItem) => void; // 删除分组，参数为被删除的分组
  delItem: (item: ItreeItem, group: IgroupItem) => void; // 删除items，参数为被删除的item，以及item所属的group
  setModal: (visible: boolean) => void;
}
