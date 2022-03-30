import React, { useContext, useEffect, useState, useRef } from 'react';
import { TREE_CONTEXT } from '../../../select-user/select-user';
import classnames from 'classnames';
import { Button } from 'antd-mobile-v5';

const SelectFooter = (props: any) => {
  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);
  const checkedKeysRef = useRef<any>(0);
  const [textbtn, setTextbtn] = useState<string>('确定');
  const {
    open,
    calssName,
    searchValue,
    setSearchValue,
    onOk,
    selectType,
    searchResult,
  } = props;
  const searchValueRef = useRef<string>(searchValue);
  const { treeState, resultLoading } = treeContext;
  const { userCount, userInfoList } = treeState;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let totalCount = 0;
    for (const i in userCount) {
      if (i !== 'userCount') {
        totalCount += userCount[i];
      }
    }
    setTotalCount(totalCount + userInfoList?.length);
  });

  // useEffect(() => {
  //   setSearchCheckValue(() => checkedKeys.length);
  // }, [searchValue]);

  // useEffect(() => {
  //   // 非搜索模式下进行操作
  //   if (!searchValue) {
  //     if (checkedKeys.length === 0) {
  //       setDisablebtn(true);
  //     } else {
  //       setDisablebtn(false);
  //     }
  //     return;
  //   }

  //   if (checkedKeys.length === 0 || searchCheckValue === checkedKeys.length) {
  //     setDisablebtn(true);
  //   } else {
  //     setDisablebtn(false);
  //   }
  // }, [
  //   checkedKeys,
  //   checkedKeys.length,
  //   searchValueRef,
  //   checkedKeysRef,
  //   searchValue,
  // ]);

  // useEffect(() => {
  //   if (searchValue && searchResult) {
  //     setTextbtn('完成搜索');
  //   } else {
  //     setTextbtn('确定');
  //   }
  //   if (searchValueRef.current !== searchValue && !!searchValue) {
  //     searchValueRef.current = searchValue;
  //   }
  // }, [searchValue, checkedKeysRef, searchResult]);

  const handleClick = () => {
    setSearchValue('');
    // setTotalCount(0);
    onOk();
    // if (!searchValue) {
    //   onOk();
    // }
    // setSearchValue('');
  };

  return (
    <div className={classnames('select-footer', calssName)}>
      <div className="box">
        <div className="num" onClick={open}>
          <span>已选</span>
          <span>{totalCount}</span>
          {totalCount > 0 && selectType === 'user' && <span>人</span>}
        </div>
        <div className="customebtn" onClick={handleClick}>
          <Button
            loading={resultLoading}
            color="primary"
            className="footer-btn"
          >
            {textbtn}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectFooter;
