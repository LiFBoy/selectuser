/* eslint-disable no-console */
import React, { useState } from 'react';
import { Button } from 'antd';
import { action } from './utils';
import SelectUser, { PropTypes } from '../src/components/select-user';
import SelectUserResult from '../src/components/select-user/web/select-user-result';

export const MethodInvoke2 = () => {
  const show = () => {
    SelectUser.show({
      multiple: true,
      selectType: 'dept',
      dialogProps: {
        title: '选对象',
      },
      userOrigin: '//gateway.community-dev.easyj.top/user-center',
      searchPlaceholder: '请输入群主或群名称进行搜索',
      requestParams: {
        selectTypeList: ['work_group'],
      },
      isSaveSelectSignature: true,
      showTabList: ['groupContacts'],
      onOk: action('onOk'),
      onCancel: action('onCancel'),
      getCheckedNodes(data) {
        console.log('getCheckedNodes data', data);
      },
      getTotalCount(data) {
        console.log('getTotalCount data', data);
      },
    });
  };
  return <Button onClick={show}>告警群</Button>;
};

MethodInvoke2.storyName = '告警群';

export const MethodInvoke = () => {
  const show = () => {
    SelectUser.show({
      multiple: true,
      selectType: 'dept',
      dialogProps: {
        title: '选人组件',
      },
      userOrigin: '//gateway.community-dev.easyj.top/user-center',
      searchPlaceholder: '请输入姓名或手机号进行搜索',

      requestParams: {
        selectTypeList: ['user'],
      },
      isSaveSelectSignature: true,
      // selectSignature: '3001001001000005-0f1b3ef353474c2aba8f13be9d50cdee',
      // selectSignature: '3001001001000005-ff5b213e99a64b49ab3d6ef2ce37fe1f',
      showTabList: ['maternalContacts'],
      onOk: action('onOk'),
      onCancel: action('onCancel'),
      getCheckedNodes(data) {
        console.log('getCheckedNodes data', data);
      },
      getTotalCount(data) {
        console.log('getTotalCount data', data);
      },
    });
  };
  return <Button onClick={show}>唤起选人组件</Button>;
};

MethodInvoke.storyName = '使用 SelectUser.show 唤起选人组件';

export const JSX = () => {
  const [visible, setVisible] = useState(false);
  const [selectSignature, setSelectSignature] = useState('');
  const show = () => {
    setVisible(true);
  };
  const props: PropTypes = {
    visible,
    multiple: true,
    selectType: 'user',
    unCheckableNodeType: ['ORG'],
    searchPlaceholder: '请输入姓名或手机号进行搜索',
    dialogProps: {
      title: '选人组件',
    },
    userOrigin: '//gateway.community-dev.easyj.top/user-center',
    showTabList: ['innerContacts'],
    requestParams: {
      strictUser: true,
      selectTypeList: ['user', 'dept'],
    },
    isSaveSelectSignature: true,

    selectSignature: '',
    onOk(data) {
      console.log('onOk data', data);
      const { selectSignature } = data;
      setSelectSignature(selectSignature);
      setVisible(false);
    },
    onCancel() {
      setVisible(false);
    },
    getCheckedNodes(data) {
      console.log('getCheckedNodes data', data);
    },
    getTotalCount(data) {
      console.log('getTotalCount data', data);
    },
  };

  return (
    <>
      <Button onClick={show}>内部通讯录</Button>
      <SelectUser {...props} />
    </>
  );
};
JSX.storyName = 'JSX 中使用选人组件';

export const JSX2 = () => {
  const [visible, setVisible] = useState(false);
  const [selectSignature, setSelectSignature] = useState('');
  const show = () => {
    setVisible(true);
  };
  const props: PropTypes = {
    visible,
    multiple: false,
    selectType: 'dept',
    showTabList: ['tagContacts'],
    dialogProps: {
      title: '标签',
    },
    searchPlaceholder: '请输入标签名称进行搜索',
    userOrigin: '//gateway.community-dev.easyj.top/user-center',
    requestParams: {
      selectTypeList: ['tag'],
    },
    // onlyLeafCheckable: true,
    isSaveSelectSignature: true,
    selectSignature: '',
    onOk(data) {
      console.log('onOk data', data);
      const { selectSignature } = data;
      setSelectSignature(selectSignature);
      setVisible(false);
    },
    onCancel() {
      setVisible(false);
    },
    getCheckedNodes(data) {
      console.log('getCheckedNodes data', data);
    },
    getTotalCount(data) {
      console.log('getTotalCount data', data);
    },
  };

  return (
    <>
      <Button onClick={show}>标签</Button>
      <SelectUser {...props} />
    </>
  );
};
JSX2.storyName = 'JSX 中使用选人组件';

export const JSX3 = () => {
  const [visible, setVisible] = useState(false);
  const [selectSignature, setSelectSignature] = useState('');
  const show = () => {
    setVisible(true);
  };
  const props: PropTypes = {
    visible,
    multiple: true,
    selectType: 'dept',
    showTabList: ['equipmentContacts'],
    dialogProps: {
      title: 'tv',
    },
    searchPlaceholder: '请输入设备编码进行搜素',
    userOrigin: '//gateway.community-dev.easyj.top/user-center',
    requestParams: {
      selectTypeList: ['camera'],
    },
    isSaveSelectSignature: true,
    selectSignature: '',
    onOk(data) {
      console.log('onOk data', data);
      const { selectSignature } = data;
      setSelectSignature(selectSignature);
      setVisible(false);
    },
    onCancel() {
      setVisible(false);
    },
    getCheckedNodes(data) {
      console.log('getCheckedNodes data', data);
    },
    getTotalCount(data) {
      console.log('getTotalCount data', data);
    },
  };

  return (
    <>
      <Button onClick={show}>摄像头</Button>
      <SelectUser {...props} />
    </>
  );
};
JSX3.storyName = '摄像头';

export const MOBILE = () => {
  const [visible, setVisible] = useState(false);
  const [selectSignature, setSelectSignature] = useState('');
  const show = () => {
    setVisible(!visible);
  };

  const [visible2, setVisible2] = useState(false);
  const [selectSignature2, setSelectSignature2] = useState('');
  const show2 = () => {
    setVisible2(!visible2);
  };

  const [visible3, setVisible3] = useState(false);
  const [selectSignature3, setSelectSignature3] = useState('');
  const show3 = () => {
    setVisible3(!visible2);
  };

  const props: PropTypes = {
    visible,
    multiple: true,
    corpid: 'ww82eccfe49dd5fb65',
    appId: 47,
    selectType: 'user',
    unCheckableNodeType: ['ORG'],
    isSaveSelectSignature: true,
    showTabList: ['innerContacts'],
    selectSignature: '3001001001000006-821519e77a59435494612498d95380c2',
    dialogProps: {
      title: '选人组件',
    },
    searchPlaceholder: '请搜索',
    requestParams: {
      selectTypeList: ['user'],
    },
    userOrigin: '//gateway.community-dev.easyj.top/user-center',
    onOk(data) {
      console.log('onOk data', data);
      const { selectSignature } = data;
      setSelectSignature(selectSignature);

      setVisible(false);
    },
    onCancel() {
      setVisible(false);
    },
    // getCheckedNodes(data) {
    //   console.log('getCheckedNodes data', data);
    // },
    // getTotalCount(data) {
    //   console.log('getTotalCount data', data);
    // },
  };
  const props2: PropTypes = {
    visible: visible2,
    multiple: true,
    corpid: 'ww82eccfe49dd5fb65',
    appId: 51,
    selectType: 'group',
    isSaveSelectSignature: false,
    showTabList: ['groupContacts'],
    // selectSignature: selectSignature2,
    dialogProps: {
      title: '选人组件',
    },
    userOrigin: '//gateway.community-dev.easyj.top/user-center',
    requestParams: {
      // strictUser: true,
      selectTypeList: ['user', 'member', 'group'],
    },
    onOk(data) {
      console.log('onOk data111', data);
      const { selectSignature } = data;
      setSelectSignature2(selectSignature);

      setVisible2(false);
    },
    onCancel() {
      setVisible2(false);
    },
  };

  return (
    <div
      style={{
        width: '375px',
        height: '412px',
        border: '1px solid #000',
        background: 'F6F6F6',
        borderRadius: '2px',
      }}
    >
      <Button onClick={show}>唤起选人组件2</Button>
      <SelectUser {...props} basePath="mobile" />

      <Button onClick={show2}>唤起选人组件2</Button>
      <SelectUser {...props2} basePath="mobile" />
    </div>
  );
};
MOBILE.storyName = '移动端选人组件';
