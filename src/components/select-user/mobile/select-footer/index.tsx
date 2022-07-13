import React, { useContext, useEffect, useState } from 'react';
import { TREE_CONTEXT } from '../../../select-user/select-user';
import classnames from 'classnames';
import { Button } from 'antd-mobile-v5';

const SelectFooter = (props: any) => {
  // 获取treeContext
  const treeContext = useContext(TREE_CONTEXT);
  const { open, calssName, setSearchValue, onOk, selectType } = props;

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

  const handleClick = () => {
    setSearchValue('');
    onOk();
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
            确定
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectFooter;
