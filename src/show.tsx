import React from 'react';
import ReactDOM from 'react-dom';
import { SelectUserFuncArgProps, Value } from '../src/components/select-user/interface';
import SelectUser from '../src/components/select-user';

export default function show(config: SelectUserFuncArgProps) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  // eslint-disable-next-line no-use-before-define
  let currentConfig = {
    ...config,
    onOk: (value: Value) => {
      if (!config.onOk && typeof close === 'function') {
        close();
      }
      const returnedValue = config.onOk(value);
      if (returnedValue && typeof returnedValue.then === 'function') {
        confirmLoading();
        // tslint:disable-next-line: no-floating-promises
        returnedValue.then(close);
      } else {
        typeof close === 'function' && close();
      }
    },
    onCancel: () => {
      config.onCancel && config.onCancel();
      typeof close === 'function' && close();
    },
    visible: true,
  };

  function render({ ...props }: any) {
    /**
     * https://github.com/ant-design/ant-design/issues/23623
     * Sync render blocks React event. Let's make this async.
     */
    setTimeout(() => {
      ReactDOM.render(<SelectUser {...props} />, div);
    });
  }

  function confirmLoading() {
    currentConfig = {
      ...currentConfig,
      dialogProps: {
        ...(currentConfig?.dialogProps || {}),
        confirmLoading: true,
      },
    };
    render(currentConfig);
  }

  function close() {
    currentConfig = {
      ...currentConfig,
      visible: false,
      dialogProps: {
        ...(currentConfig?.dialogProps || {}),
        confirmLoading: false,
      },
    };
    render(currentConfig);
  }

  render(currentConfig);

  return {
    destroy: close,
  };
}
