const rp = require('request-promise');
const opn = require('opn');
let cache = {

};
// 只执行一遍的方法
function once(fn, context) {
    let result;
    return function () {
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    }
}
let openBrowser = once(function (url) {
    opn(url);
});
 /**
 * 判断文件是否是静态资源
 * @param  {[type]}  str [description]
 * @return {Boolean}     [description]
 */
function isResource (str) {
    return /\.css|\.js|\.png|\.jpg|\.jpeg|\.gif|\.json/.test(str);
}
function WebpackHttpDeployPlugin() {
    let _this = this;
    this.afterEmit = function (compilation, next) {
        let publicPath = (compilation.options.output && compilation.options.output.publicPath) || '';
        let assets = compilation.assets;
        let names = Object.keys(assets).sort();
        let promises = names.map((name) => {
            // 如果文件没更新或者是hmr生成的文件，就不用推送到开发机了
            if (!assets[name].emitted || /hot-update/.test(name)) {
                return Promise.resolve();
            }
            // 取得文件内容
            let content = assets[name].source();
            content = Buffer.isBuffer(content) ? content : new Buffer(content);
            // 静态资源和模板文件的存放路径和端口不同
            let to = isResource(name) ? 'resource/webpack-demo/' : '';
            let port = 8087;
            if (!to) {
                to = 'smarty/template/page/webpack-demo/';
                port = 8083;
            }
            to = to + name;
            return rp.post({
                url: `{{host}}:${port}/receiver.php`,
                formData: {
                    to: to,
                    file: {
                        value: content,
                        options: {
                            filename: name
                        }
                    }
                }
            })
            .then((body) => {
                if (body === '0') {
                    console.log(`${name}  >>  ${to}`);
                }
                else {
                    console.log(`failed to deploy file ${name}`);
                }
            });
        });
        // 所有资源发送完毕
        Promise.all(promises)
            .then(() => {
                next();
                openBrowser('http://www.hao123.com/WebpackDemo');
            });
    }
}
WebpackHttpDeployPlugin.prototype.apply = function (compiler) {
    compiler.plugin('after-emit', this.afterEmit);
}
module.exports = WebpackHttpDeployPlugin;