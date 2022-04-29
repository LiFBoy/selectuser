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

// 部门
export const DeptIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-dept" />;
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

// 行政区划
export const XzqhIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-xzqh" />;
};

// 设备
export const EqumentIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-equment" />
  );
};
// 设备
export const HouseIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-house" />;
};

// 根节点
export const RootIcon: React.FunctionComponent = () => {
  return <span className="user-center-tree-node-icon select-user-icon-root" />;
};

// 社区
export const CommunityIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-community" />
  );
};
// 资源
export const ResourceIcon: React.FunctionComponent = () => {
  return (
    <span className="user-center-tree-node-icon select-user-icon-resource" />
  );
};

export type IconType =
  | 'root'
  | 'province'
  | 'country'
  | 'area'
  | 'equipment'
  | 'city'
  | 'street'
  | 'community'
  | 'resource'
  | 'resource_group'
  | 'village'
  | 'building'
  | 'cell'
  | 'house'
  | 'org'
  | 'dept'
  | 'group'
  | 'tag'
  | 'tag-label'
  | 'tag-group'
  | 'user';

const iconMap: {
  [iconType in IconType]: React.ComponentType;
} = {
  org: OrgIcon,
  dept: DeptIcon,
  root: RootIcon,
  province: XzqhIcon,
  country: XzqhIcon,
  city: XzqhIcon,
  area: XzqhIcon,
  street: XzqhIcon,
  community: CommunityIcon,
  resource: ResourceIcon,
  resource_group: ResourceIcon,
  building: HouseIcon,
  cell: HouseIcon,
  village: HouseIcon,
  house: HouseIcon,
  group: GroupIcon,
  tag: TagIcon,
  'tag-group': TagGroupIcon,
  'tag-label': TagIcon,
  user: UserIcon,
  equipment: EqumentIcon,
};

export default iconMap;
