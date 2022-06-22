/* eslint-disable no-console */
import React, { useState } from 'react';
import { Button } from 'antd';
import { action } from './utils';
import SelectUser, { PropTypes } from '../src/components/select-user';
import SelectUserResult from '../src/components/select-user/web/select-user-result';

export const MethodInvoke2 = () => {
  const show = () => {
    SelectUser.show({
      multiple: false,
      selectType: 'dept',

      userOrigin: 'http://gateway.dev.suosihulian.com/user-center',
      // searchPlaceholder: '请输入群主或群名称进行搜索',
      requestParams: {
        selectTypeList: ['dept'],
      },
      isSaveSelectSignature: false,
      showTabList: ['disabledHomeContacts'],
      onOk: (data) => {
        console.log('onOk data', data);
        const { selectSignature } = data;
        // setSelectSignature(selectSignature);
        // setVisible(false);
      },
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
      visible: true,
      multiple: true,
      selectType: 'dept',
      showTabList: ['customerTagContacts'],
      dialogProps: {
        title: '标签',
      },
      // true 无限制 false 注明不可修改并禁用
      noTagLabelPermission: false,
      searchPlaceholder: '请输入标签名称进行搜索',
      userOrigin: 'http://gateway.dev.suosihulian.com/user-center',
      requestParams: {
        selectTypeList: ['group_tag'],
        // 仅在tab为标签时生效，0全部，1运营，2系统 tagTypeList?: ['0', '1', '2'];
        tagTypeList: [0],
        noTagLabelPermission: false,
      },

      // target: 'tool',
      // modalWidth: 300,
      // onlyLeafCheckable: true,
      isSaveSelectSignature: false,

      // wrapperKey: 'tagInfoList',

      // selectSignature: '',
      // onOk(data) {
      //   console.log('onOk data', data);
      //   const { selectSignature } = data;
      //   setSelectSignature(selectSignature);
      //   setVisible(false);
      // },
      // onCancel() {
      //   setVisible(false);
      // },
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
    selectType: 'dept',
    unCheckableNodeType: ['ORG'],
    searchPlaceholder: '请输入姓名或手机号进行搜索',
    dialogProps: {
      title: '选人组件',
    },
    userOrigin: 'http://gateway.dev.suosihulian.com/user-center',
    showTabList: ['innerContacts'],
    requestParams: {
      // strictUser: true,
      selectTypeList: ['dept'],
    },

    // onlyLeafCheckable: true,
    isSaveSelectSignature: true,

    selectSignature: '3001001001000006-202206221655897867496',
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
      <Button onClick={show}>内部通讯录1</Button>
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
    multiple: true,
    selectType: 'dept',
    showTabList: ['maternalContacts'],
    dialogProps: {
      title: '标签',
    },
    searchPlaceholder: '请输入标签名称进行搜索',
    userOrigin: 'http://gateway.dev.suosihulian.com/user-center',
    requestParams: {
      selectTypeList: ['user'],
    },
    // target: 'tool',
    // modalWidth: 300,
    // onlyLeafCheckable: true,
    isSaveSelectSignature: true,

    // selectSignature: '3001001001000006-cb94f644c7384e9db6bef86fa1228758',
    onOk(data) {
      console.log('onOk data', data);
      const { selectSignature } = data;
      setSelectSignature(selectSignature);
      setVisible(false);
    },
    onCancel() {
      setVisible(false);
    },
  };

  return (
    <>
      <Button onClick={show}>标签</Button>
      {visible && <SelectUser {...props} />}
    </>
  );
};
JSX2.storyName = 'JSX 中使用选人组件';

export const JSX10 = () => {
  const [visible, setVisible] = useState(false);
  const [selectSignature, setSelectSignature] = useState('');
  const show = () => {
    setVisible(true);
  };
  const props: PropTypes = {
    visible,
    multiple: true,
    selectType: 'dept',
    noTagLabelPermission: false,
    showTabList: ['customerTagContacts'],
    dialogProps: {
      title: '标签',
    },
    searchPlaceholder: '请输入标签名称进行搜索',
    userOrigin: 'http://gateway.dev.suosihulian.com/user-center',
    requestParams: {
      selectTypeList: ['tag'],
      tagTypeList: [0],
      noTagLabelPermission: false,
    },
    // target: 'tool',
    // modalWidth: 300,
    // onlyLeafCheckable: true,
    isSaveSelectSignature: true,
    // defaultValue: {
    //   customerTagInfoList: [
    //     {
    //       id: '1526430948989280258',
    //       name: '测试运营标签',
    //       type: 'CUSTOMER_TAG',
    //       contactType: 9,
    //       childDelete: true,
    //       noTagLabelPermission: true,
    //     },
    //   ],
    // },
    // selectSignature: '3001001001000006-202206221655897369692',
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
      <Button onClick={show}>标签10</Button>
      <SelectUser {...props} />
    </>
  );
};
JSX10.storyName = 'JSX 中使用选人组件';

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
    userOrigin: 'http://gateway.dev.suosihulian.com/user-center',
    requestParams: {
      // camera equipment tv
      selectTypeList: ['equipment'],
    },
    isSaveSelectSignature: true,
    // selectSignature: '3001001001000006-821519e77a59435494612498d95380c2',
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
    basePath: 'mobile',
    selectType: 'user',
    unCheckableNodeType: ['ORG'],
    isSaveSelectSignature: true,
    showTabList: ['innerContacts'],
    onlyLeafCheckable: true,
    // selectSignature: '3001001001000006-202205291653834732160',
    dialogProps: {
      title: '选人组件',
    },
    searchPlaceholder: '请搜索',
    requestParams: {
      selectTypeList: ['user'],
      // contactType: 1,
    },
    userOrigin: 'http://gateway.dev.suosihulian.com/user-center',
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
    selectType: 'dept',
    unCheckableNodeType: ['TAG_GROUP'],
    isSaveSelectSignature: true,
    showTabList: ['groupContacts'],
    // selectSignature: '3001001001000006-202205301653841789432',
    dialogProps: {
      title: '选人组件',
    },
    noTagLabelPermission: true,
    userOrigin: 'http://gateway.dev.suosihulian.com/user-center',
    requestParams: {
      selectTypeList: ['group'],
      // 仅在tab为标签时生效，0全部，1运营，2系统 tagTypeList?: ['0', '1', '2'];
      tagTypeList: [0],
      noTagLabelPermission: true,
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
