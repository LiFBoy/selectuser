import React from 'react';
import './index.less';

// 标签
export const TagIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-tag" />;
};

// 用户
export const UserIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-user" />;
};

// 分组
export const GroupIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-group" />;
};

// 组织
export const OrgIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-org" />;
};

// 组织根节点
export const OrgRootIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-org-root" />
  );
};

// 部门
export const DeptIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-dept" />;
};
// 设备
export const EQUIPMENTICON: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-dept" />;
};
// tv
export const TVCON: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-dept" />;
};
export const MATERNALCON: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-dept" />;
};

// 权限
export const PermissionIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-permission" />
  );
};

// 权限根节点
export const PermissionRootIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-permission-root" />
  );
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
  permission: PermissionIcon,
  user: UserIcon,
  permissionRoot: PermissionRootIcon,
  orgRoot: OrgRootIcon,
  USER: UserIcon,
  ORG: OrgIcon,
  DEPT: DeptIcon,
  EQUIPMENT: EQUIPMENTICON,
  TV: TVCON,
  CAMERA: TVCON,
  MATERNAL: MATERNALCON,
  WORK_GROUP: MATERNALCON,
  GROUP_DEPT: GroupIcon,
  ORG_REL: OrgRelIcon,
  GROUP: GroupIcon,
  TAG: TagIcon,
  TAG_GROUP: TagIcon,
  orgRel: OrgRelIcon,
  REGULATORY: OrgRelIcon,
  SCHOOL: OrgIcon,
};

export default iconMap;
