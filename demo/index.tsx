// demo entry
// @author yves <yves@come-future.com>
// @create 2020/08/18 10:31

import React from 'react';
import ReactDOM from 'react-dom';
import * as basic from './basic.story';
import './index.less';

const demoSets = { basic };
function Demo() {
  return (
    <>
      {Object.entries(demoSets).map(([demoSetName, demoSet]) => {
        return (
          <div key={demoSetName}>
            <h2>{demoSetName}</h2>
            {Object.entries(demoSet).map(([demoVarName, demoContent]) => (
              <div
                key={demoVarName}
                className="demo-container"
                data-title={demoContent.storyName || demoVarName}
              >
                {demoContent()}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
