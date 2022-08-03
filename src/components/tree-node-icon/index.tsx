import React from 'react';
import './index.less';

// 标签
export const TagIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-tag" />;
};
// 标签组
export const TagGroupIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-tag-group" />
  );
};

// 用户
export const UserIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-user" />;
};

// 群
export const GroupIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-group" />;
};

// 组织
export const OrgIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-org" />;
};

// 根节点
export const RootIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-root" />;
};

// 部门
export const DeptIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-dept" />;
};

// 设备
export const EQUIPMENTICON: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-equipment" />
  );
};

// 私域
export const MATERNALCON: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-user" />;
};

export type IconType =
  | 'org'
  | 'dept'
  | 'group'
  | 'tag'
  | 'user'
  | 'USER'
  | 'ROOT'
  | 'root'
  | 'ORG'
  | 'DEPT'
  | 'EQUIPMENT'
  | 'TV'
  | 'CAMERA'
  | 'MATERNAL'
  | 'WORK_GROUP'
  | 'GROUP'
  | 'TAG'
  | 'CUSTOMER_TAG'
  | 'GROUP_TAG'
  | 'CIRCLES_TAG'
  | 'CONTENT_TAG'
  | 'TAG_GROUP'
  | 'CUSTOMER_TAG_GROUP'
  | 'GROUP_TAG_GROUP'
  | 'CIRCLES_TAG_GROUP'
  | 'CONTENT_TAG_GROUP'
  | 'ORG_REL'
  | 'CUSTOMER_MANAGER_USER'
  | 'REGULATORY';

const iconMap: {
  [iconType in IconType]: React.ComponentType;
} = {
  org: OrgIcon,
  dept: DeptIcon,
  group: GroupIcon,
  tag: TagIcon,
  user: UserIcon,
  USER: UserIcon,
  CUSTOMER_MANAGER_USER: UserIcon,
  ROOT: RootIcon,
  root: RootIcon,
  ORG: OrgIcon,
  DEPT: DeptIcon,
  EQUIPMENT: EQUIPMENTICON,
  TV: EQUIPMENTICON,
  CAMERA: EQUIPMENTICON,
  MATERNAL: MATERNALCON,
  WORK_GROUP: GroupIcon,
  GROUP: GroupIcon,
  TAG: TagIcon,
  GROUP_TAG: TagIcon,
  CUSTOMER_TAG: TagIcon,
  CIRCLES_TAG: TagIcon,
  CONTENT_TAG: TagIcon,
  TAG_GROUP: TagGroupIcon,
  CUSTOMER_TAG_GROUP: TagGroupIcon,
  GROUP_TAG_GROUP: TagGroupIcon,
  CIRCLES_TAG_GROUP: TagGroupIcon,
  CONTENT_TAG_GROUP: TagGroupIcon,
  ORG_REL: undefined,
  REGULATORY: undefined,
};

export default iconMap;
