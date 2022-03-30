// start script
// @author MOYAN <moyan@come-future.com>
// @create 2020/07/14 11:10

const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('../config/webpack.dev');
const PORT = +process.env.PORT || 8802;
const detectPort = require('detect-port');

process.on('unhandledRejection', (err) => {
  // 事件监听....
  throw err;
});

async function getOption() {
  try {
    let _port = await detectPort(PORT);
    if (_port !== PORT) {
      console.log(`端口号: ${PORT} 已经被占用，尝试使用端口号: ${_port}`);
    }
    return [
      {
        historyApiFallback: false,
        hot: true,
        host: '0.0.0.0',
        open: true,
        disableHostCheck: true,
        overlay: {
          warnings: false,
          errors: true,
        },
        openPage: `http://127.0.0.1:${_port}`,
        publicPath: '/',
        public: `http://127.0.0.1:${_port}`,
        headers: { 'Access-Control-Allow-Origin': '*' },
        proxy: {
          '/ss-api/portal': {
            enable: true,
            target: 'http://fe-workbench.community-dev.easyj.top/',
            changeOrigin: true,
            secure: false,
            onProxyReq: function (proxyReq) {
              proxyReq.setHeader(
                'Cookie',
                'orgId=a;userId=10515856cef747878a6e2daca94b1bd1'
              );
            },
          },
        },
      },
      _port,
    ];
  } catch (err) {
    console.log(err);
  }
}

async function start(devConfig) {
  const [options, port] = await getOption();
  const compiler = webpack(devConfig);
  const server = new webpackDevServer(compiler, options);

  server.listen(port, '127.0.0.1', () => {
    console.log(`dev server listening on ${port}`);
  });
}

start(webpackDevConfig);
