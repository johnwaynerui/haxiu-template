const rp = require('request-promise');
const opn = require('opn');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const host = '{{host}}';
const port = '{{port}}';
const resourcePath = '{{resourcePath}}{{name}}';
const templatePath = '{{templatePath}}{{name}}';
const codeUrl = `${host}:${port}/v1/authorize`;
const tokenUrl = `${host}:${port}/v1/validate`;
const uploadUrl = `${host}:${port}/v1/upload`;
let info = deployInfo() || {};
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

let exists = fs.existsSync || path.existsSync;

let mkdir = function(dirPath) {
    if (exists(dirPath)) {
        return;
    }
    dirPath.split('/').reduce((prev, next) => {
        if (prev && !exists(prev)) {
            fs.mkdirSync(prev)
        }
        return path.join(prev, next)
    });
    if (!exists(dirPath)) {
        fs.mkdirSync(dirPath)
    }
}
let write = function(filePath, data) {
    if (!exists(filePath)) {
        mkdir(path.dirname(filePath))
    }
    fs.writeFileSync(filePath, data);
}
function deployInfo(options) { // 把用户名和token写到项目根目录下
    var conf = path.join(path.resolve(__dirname, '..'), 'token.json');
    if (arguments.length) { // setter
        return options && write(conf, JSON.stringify(options, null, 2));
    } else { // getter
        let ret = null;
        try {
            ret = require(conf);
        } catch (e) {

        }
        return ret;
    }
}
function requireToken() {
    return inquirer.prompt({
        name: 'code',
        message: 'Please enter your code...',
        required: true
    }).then((answers) => {
        info.code = answers.code;
        // 取得code,然后进行验证
        return rp({
            method: 'POST',
            uri: `${tokenUrl}`,
            form: {
                email: info.email,
                code: info.code
            }
        }).then((res) => {
            res = JSON.parse(res);
            info.token = res.data.token;
            deployInfo(info);
        })
    })
}
function requireEmail() {
    return inquirer.prompt({ // 输入邮箱提示
        name: 'email',
        message: 'Please enter your email address to get a token...',
        validate: (input) => {
            return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(input)
        },
        required: true
    }).then((anwsers) => {
        info.email = anwsers.email; 
        deployInfo(info);// 保存邮箱地址
        // 获取code
        return rp({
            method: 'POST',
            uri: `${codeUrl}`,
            form: {
                email: info.email
            }
        }).then((res) => {
            // res = JSON.parse(res);
            console.log('We\'ve already sent the code to your email.')
            return requireToken();
        })
    });
}
 /**
 * 判断文件是否是静态资源
 * @param  {[type]}  str [description]
 * @return {Boolean}     [description]
 */
function isResource (str) {
    return /\.css|\.js|\.png|\.jpg|\.jpeg|\.gif|\.json|\.woff2|\.eot|\.ttf|\.otf|\.woff/.test(str);
}

function upload(assets) {
    let names = Object.keys(assets).sort();
    return Promise.all(names.map((name) => {
            return new Promise((resolve, reject) => {
                // 如果文件没更新或者是hmr生成的文件，就不用推送到开发机了
                if (!assets[name].emitted || /hot-update/.test(name)) {
                    resolve({
                        'errno': 0,
                        'data': {}
                    });
                } else {
                    // 取得文件内容
                    let content = assets[name].source();
                    content = Buffer.isBuffer(content) ? content : new Buffer(content);
                    // 静态资源和模板文件的存放路径和端口不同
                    let to = isResource(name) ? `${resourcePath}/` : '';
                    if (!to) {
                        to = `${templatePath}/`;
                    }
                    to = to + name;
                    rp.post({
                            url: `${uploadUrl}`,
                            formData: {
                                to: to,
                                token: info.token || 's',
                                email: info.email || 's',
                                file: {
                                    value: content,
                                    options: {
                                        filename: name
                                    }
                                }
                            }
                        })
                        .then((body) => {
                            let ret = JSON.parse(body);
                            if (ret.errno === 100302 || ret.errno === 100305 || ret.errno === 100503) {
                                reject(ret);
                            } else if (ret.errno === 0) {// 上传成功了
                                console.log(`${name}  >>  ${to}`);
                                resolve(ret);
                            }
                        }).catch((body) => {
                            let ret = JSON.parse(body);
                            reject(ret);
                        });
                }
            })
        }));
}
function WebpackHttpDeployPlugin() {
    let _this = this;
    this.afterEmit = function(compilation, next) {
        let publicPath = (compilation.options.output && compilation.options.output.publicPath) || '';
        let assets = compilation.assets;
        upload(assets).then((res) => { // 全都发送成功
            next();
            openBrowser('{{site}}/{{name}}');
        }).catch((ret) => { // 发送失败
            if (ret.errno && ret.errno === 100302 || ret.errno === 100305) { // 需要验证
                requireEmail().then(() => {
                    upload(assets)
                    .then(() => {// 终于发送成功啦
                        next();
                        openBrowser('{{site}}/{{name}}');
                    })
                    .catch((res) => {// 彻底失败了
                        console.log(res)
                        console.log(`failed to deploy assets to ${uploadUrl}`);
                        return;
                    });
                })
            }
            else if (ret.errno === 100503) {
                console.log(ret);
            }
        });
    }
}
WebpackHttpDeployPlugin.prototype.apply = function (compiler) {
    compiler.plugin('after-emit', this.afterEmit);
}
module.exports = WebpackHttpDeployPlugin;