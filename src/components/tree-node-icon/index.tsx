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

// 母婴
export const MATERNALCON: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-user" />;
};

// 行政组织
export const OrgRelIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-orgRel-mobile" />
  );
};

export type IconType =
  | 'org'
  | 'dept'
  | 'group'
  | 'tag'
  | 'permission'
  | 'user'
  | 'permissionRoot'
  | 'orgRoot'
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
  | 'GROUP_DEPT'
  | 'GROUP'
  | 'TAG'
  | 'TAG_GROUP'
  | 'orgRel'
  | 'ORG_REL'
  | 'REGULATORY'
  | 'SCHOOL'; // 行政组织-精准推送业务

const iconMap: {
  [iconType in IconType]: React.ComponentType;
} = {
  org: OrgIcon,
  dept: DeptIcon,
  group: GroupIcon,
  tag: TagIcon,
  user: UserIcon,
  USER: UserIcon,
  ROOT: RootIcon,
  root: RootIcon,
  ORG: OrgIcon,
  DEPT: DeptIcon,
  EQUIPMENT: EQUIPMENTICON,
  TV: EQUIPMENTICON,
  CAMERA: EQUIPMENTICON,
  MATERNAL: MATERNALCON,
  WORK_GROUP: GroupIcon,
  GROUP_DEPT: GroupIcon,
  ORG_REL: OrgRelIcon,
  GROUP: GroupIcon,
  TAG: TagIcon,
  TAG_GROUP: TagGroupIcon,
  orgRel: OrgRelIcon,
  REGULATORY: OrgRelIcon,
  SCHOOL: OrgIcon,
};

export default iconMap;
