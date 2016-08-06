;(function(win, doc) {

    // 已加载模块
    var loaded = {},

        // 已加载列表
        loadList = {},

        // 加载中的模块
        loadingFiles = {},

        // 内部配置文件
        config = {
            // 是否自动加载核心库
            autoLoad: true,
            js_version: '',
            css_version: '',

            // 加载延迟
            timeout: 6000,

            // 核心库
            coreLib: [],

            /* 模块依赖
             * {
             *  moduleName: {
             *      path: 'URL',
             *      type:'js|css',
             *      requires:['moduleName1', 'fileURL']
             *  }
             * }
             */
            mods: {}
        },

        jsSelf = (function() {
            var files = doc.getElementsByTagName('script');
            return files[files.length - 1];
        })(),

        // 全局模块
        globalList = [],

        // 外部参数
        extConfig,

        // domready回调堆栈
        readyList = [],

        // DOM Ready
        isReady = false,

        // 模块间的公共数据 
        publicData = {},

        // 公共数据回调堆栈 
        publicDataStack = {},

        isArray = function(e) {
            return e.constructor === Array;
        },

        getMod = function(e) {
            var mods = config.mods,
                mod;
            if (typeof e === 'string') {
                mod = (mods[e]) ? mods[e] : {
                    path: e.indexOf('.js') == -1 && e.indexOf('.css') == -1 ? (config.root + e + '.js' + (config.js_version)) : e
                };
            } else {
                mod = e;
            }
            return mod;
        },

        load = function(url, type, charset, cb) {
            var wait, n, t, img,

            done = function() {
                    loaded[url] = 1;
                    cb && cb(url);
                    cb = null;
                    win.clearTimeout(wait);
                };

            if (!url) {
                return;
            }

            if (loaded[url]) {
                loadingFiles[url] = false;
                if (cb) {
                    cb(url);
                }
                return;
            }

            if (loadingFiles[url]) {
                setTimeout(function() {
                    load(url, type, charset, cb);
                }, 10);
                return;
            }

            loadingFiles[url] = true;

            wait = win.setTimeout(function() {
                /* 目前延时回调处理，超时后如果有延时回调，执行回调，然后继续等
                 * 延时回调的意义是log延时长的URI，这个处理不属于加载器本身的功能移到外部
                 * 没有跳过是为了避免错误。
                 */
                if (config.timeoutCallback) {
                    try {
                        config.timeoutCallback(url);
                    } catch (ex) {}
                }
            }, config.timeout);

            t = type || url.toLowerCase().split(/\./).pop().replace(/[\?#].*/, '');

            if (t === 'js') {
                n = doc.createElement('script');
                n.setAttribute('type', 'text/javascript');
                n.setAttribute('src', url);
                n.setAttribute('async', true);
            } else if (t === 'css') {
                n = doc.createElement('link');
                n.setAttribute('type', 'text/css');
                n.setAttribute('rel', 'stylesheet');
                n.setAttribute('href', url);
            }

            if (charset) {
                n.charset = charset;
            }

            if (t === 'css') {
                // 暂不判断css错误
                // img = new Image();
                // img.onerror = function() {
                //   done();
                //   img.onerror = null;
                //   img = null;
                // }
                // img.src = url;
                setTimeout(function() {
                    done();
                }, 0);      
            } else {
                //if (t === 'js') {
                // firefox, safari, chrome, ie9下加载失败触发
                // 如果文件是404, 会比timeout早触发onerror。目前不处理404，只处理超时
                n.onerror = function() {
                    done();
                    n.onerror = null;
                };

                // ie6~8通过创建vbscript可以识别是否加载成功。
                // 但这样需先测试性加载再加载影响性能。即使没成功加载而触发cb，顶多报错，没必要杜绝这种报错
                // ie6~9下加载成功或失败，firefox, safari, opera下加载成功触发
                n.onload = n.onreadystatechange = function() {
                    var url;
                    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                        setTimeout(function() {
                            done();
                        }, 0);            
                        n.onload = n.onreadystatechange = null;
                    }
                };
            }

            jsSelf.parentNode.insertBefore(n, jsSelf);
        },

        // 加载依赖论文件(顺序)
        loadDeps = function(deps, cb) {
            var mods = config.mods,
                id, m, mod, i = 0,
                len;

            id = deps.join('');
            len = deps.length;

            if (loadList[id]) {
                cb();
                return;
            }
            function callback(mod) {
                if (!--len) {
                    loadList[id] = 1;
                    cb();
                }
            }

            for (; m = deps[i++];) {
                mod = getMod(m);
                if (mod.requires) {
                    loadDeps(mod.requires, (function(mod) {
                        return function() {
                            load(mod.path, mod.type, mod.charset, function(){
                                mod && mod.init && mod.init();
                                return callback(mod);
                            });
                        };
                    })(mod));
                } else {
                    load(mod.path, mod.type, mod.charset, (function(mod) {
                        return function() {
                            mod && mod.init && mod.init();
                            return callback(mod);
                        }
                    })(mod));
                }
            }
        },

        // @win window reference
        // @fn function reference
        contentLoaded = function(fn) {
            var done = false,
                top = true,
                doc = win.document,
                root = doc.documentElement,
                add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
                rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
                pre = doc.addEventListener ? '' : 'on',

                init = function(e) {
                    if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                    (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                    if (!done && (done = true)) fn.call(win, e.type || e);
                },

                poll = function() {
                    try {
                        root.doScroll('left');
                    } catch (e) {
                        setTimeout(poll, 50);
                        return;
                    }
                    init('poll');
                };

            if (doc.readyState == 'complete') fn.call(win, 'lazy');
            else {
                if (doc.createEventObject && root.doScroll) {
                    try {
                        top = !win.frameElement;
                    } catch (e) {}
                    if (top) {
                        poll();
                    }
                }
                doc[add](pre + 'DOMContentLoaded', init, false);
                doc[add](pre + 'readystatechange', init, false);
                win[add](pre + 'load', init, false);
            }
        },

        fireReadyList = function() {
            var list;
            while (list = readyList.shift()) {
                d.apply(null, list);
            }
        },

        d = function() {
            var args = [].slice.call(arguments),
                fn, id;
            var defer = $.Deferred();

            // 加载核心库
            if (config.autoLoad && config.coreLib.length && !loadList[config.coreLib.join('')]) {
                loadDeps(config.coreLib, function() {
                    d.apply(null, args);
                    defer.resolve();
                });
                return;
            }

            // 加载全局库
            if (globalList.length && !loadList[globalList.join('')]) {
                loadDeps(globalList, function() {
                    d.apply(null, args);
                    defer.resolve();
                });
                return;
            }

            if (typeof args[args.length - 1] === 'function') {
                fn = args.pop();
            }

            id = args.join('');

            if ((args.length === 0 || loadList[id]) && fn) {
                fn();
                defer.resolve();
                return;
            }

            loadDeps(args, function() {
                loadList[id] = 1;
                fn && fn();
                defer.resolve();
            });
            return defer.promise();
        };

    d.add = d.define = function(sName, oConfig) {
        if (!sName || !oConfig || !oConfig.path) {
            return;
        }
        config.mods[sName] = oConfig;
    };

    d.delay = function() {
        var args = [].slice.call(arguments),
            delay = args.shift();
        win.setTimeout(function() {
            d.apply(this, args);
        }, delay);
    };

    d.global = function() {
        var args = isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments);
        globalList = globalList.concat(args);
    };

    d.ready = function() {
        var args = [].slice.call(arguments);
        if (isReady) {
            return d.apply(this, args);
        }
        readyList.push(args);
    };

    d.css = function(s) {
        var css = doc.getElementById('do-inline-css');
        if (!css) {
            css = doc.createElement('style');
            css.type = 'text/css';
            css.id = 'do-inline-css';
            jsSelf.parentNode.insertBefore(css, jsSelf);
        }

        if (css.styleSheet) {
            css.styleSheet.cssText = css.styleSheet.cssText + s;
        } else {
            css.appendChild(doc.createTextNode(s));
        }
    };

    d.setData = d.setPublicData = function(prop, value) {
        var cbStack = publicDataStack[prop];

        publicData[prop] = value;

        if (!cbStack) {
            return;
        }

        while (cbStack.length > 0) {
            (cbStack.pop()).call(this, value);
        }
    };

    d.getData = d.getPublicData = function(prop, cb) {
        if (publicData[prop]) {
            cb(publicData[prop]);
            return;
        }

        if (!publicDataStack[prop]) {
            publicDataStack[prop] = [];
        }

        publicDataStack[prop].push(function(value) {
            cb(value);
        });
    };

    d.setConfig = function(n, v) {
        config[n] = v;
        return d;
    };

    d.getConfig = function(n) {
        return config[n];
    };


    // 初始外部配置
    extConfig = jsSelf.getAttribute('data-cfg-autoload');
    if (extConfig) {
        config.autoLoad = (extConfig.toLowerCase() === 'true') ? true : false;
    }

    extConfig = jsSelf.getAttribute('data-cfg-corelib');
    if (extConfig) {
        config.coreLib = extConfig.split(',');
    }

    if (typeof Do !== 'undefined') {
        globalList = Do.global.mods;
        config.mods = Do.mods;
        //readyList = Do.actions;
        var act; 
        if(Do.actions){
            while (act = Do.actions.shift()) {
                d.apply(null, act);
            }
        }
        delete Do;
    }

    win.Do = d;

    contentLoaded(function() {
        isReady = true;
        fireReadyList();
    });

})(window, document);