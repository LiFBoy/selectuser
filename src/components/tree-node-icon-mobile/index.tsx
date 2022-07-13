import React from 'react';
import './index.less';
import icon_dept from './b-dept.svg';
import icon_group from './b-group.svg';
import icon_org from './b-org.svg';
import icon_tag from './b-tag.svg';
import icon_user from './b-user.svg';

// 标签
export const TagIcon: React.FunctionComponent = () => {
  return (
    <img src={icon_tag} className="user-center-tree-node-icon" />
    // <span className="user-center-tree-node-icon select-user-icon-tag-mobile" />
  );
};

// 用户
export const UserIcon: React.FunctionComponent = () => {
  return (
    <img src={icon_user} className="user-center-tree-node-icon" />
    // <span className="user-center-tree-node-icon select-user-icon-user-mobile" />
  );
};

// 内部通讯录
export const InternalIcon: React.FunctionComponent = () => {
  return (
    <img src={icon_dept} className="user-center-tree-node-icon" />
    // <span className="user-center-tree-node-icon select-user-icon-internal-mobile" />
  );
};

// 组织
export const OrgIcon: React.FunctionComponent = () => {
  return (
    <img src={icon_org} className="user-center-tree-node-icon" />
    // <span className="user-center-tree-node-icon select-user-icon-org-mobile" />
  );
};
// 群
export const GroupIcon: React.FunctionComponent = () => {
  return (
    // <span className="user-center-tree-node-icon select-user-icon-org-mobile" />
    <img src={icon_group} className="user-center-tree-node-icon" />
  );
};

// 部门
export const DeptIcon: React.FunctionComponent = () => {
  return (
    <img src={icon_dept} className="user-center-tree-node-icon" />
    // <span className="user-center-tree-node-icon select-user-icon-dept-mobile" />
  );
};

// 行政组织
export const OrgRelIcon: React.FunctionComponent = () => {
  return (
    <img src={icon_org} className="user-center-tree-node-icon" />
    //  <span className="user-center-tree-node-icon select-user-icon-org-rel-mobile" />
  );
};

export type IconType =
  | 'org'
  | 'ORG'
  | 'internal'
  | 'group'
  | 'user'
  | 'USER'
  | 'DEPT'
  | 'dept'
  | 'tag'
  | 'TAG';

const iconMap: {
  [iconType in IconType]: React.ComponentType;
} = {
  org: OrgIcon,
  dept: DeptIcon,
  internal: InternalIcon,
  group: GroupIcon,
  tag: TagIcon,
  user: UserIcon,
  USER: UserIcon,
  ORG: OrgIcon,
  DEPT: DeptIcon,
  TAG: TagIcon,
};

export default iconMap;
