const { override, addWebpackAlias, addPostcssPlugins, fixBabelImports,  overrideDevServer } = require("customize-cra");
const path = require("path");

// 跨域配置
const devServerConfig = () => config => {
    return {
        ...config,
        // 服务开启gzip
        compress: true,
        proxy: {
            '/goapi': {
                target: `http://1.117.56.35:8888/goapi`,
                changeOrigin: true,
                secure: false,
            },
        }
    }
}

module.exports = {
    webpack: override(
        //增加路径别名的处理
        addWebpackAlias({
            '@': path.resolve(__dirname, './src')
        }),
        fixBabelImports(
            'imports',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true
            }
        ),
        addPostcssPlugins([require('tailwindcss')])
    ),
    devServer: overrideDevServer(
        (config) => {
            config.headers = config.headers || {}
            config.headers['Access-Control-Allow-Origin'] = '*'
            return config
        },

        devServerConfig()
    )
};