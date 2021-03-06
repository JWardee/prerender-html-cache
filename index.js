module.exports = class HtmlCache {
    constructor(cacheDir = global.scriptPath + '/cache', cacheKey = '-cache') {
        this.md5 = require('md5');
        this.fs = require('fs');

        this.shouldSave = false;
        this.cacheKey = cacheKey;
        this.cacheDir = cacheDir;
    }

    getCacheKey(url, type = 'html') {
        return this.cacheDir + '/' + this.md5(url) + this.cacheKey + '.' + type;
    }

    exists(url) {
        return this.fs.existsSync(this.getCacheKey(url));
    }

    get(url) {
        /** TODO: need to check when file was created and delete it if it's expired */

        let key = this.getCacheKey(url);

        return new Promise((resolve, reject) => {
            if (this.exists(url)) {
                this.fs.readFile(key, (error, buf) => {
                    error ? reject(error) : resolve(buf.toString());
                });
            } else {
                reject('Cache does not exist (' + url + ') (' + key + ')');
            }
        });
    }

    save(url, content) {
        return new Promise((resolve, reject) => {
            this.fs.writeFile(this.getCacheKey(url), content, (error) => {
                error ? reject(error) : resolve();
            });
        });
    }
}

let cache = new Cache();

module.exports = {
    requestReceived: (req, res, next) => {
        if (req.prerender.renderType === 'html') {
            if (cache.exists(req.prerender.url)) {
                console.log('Cache: hit');

                cache.get(req.prerender.url).then((content) => {
                    res.send(200, content);
                });
            } else {
                console.log('Cache: miss');
                cache.shouldSave = true;
                next();
            }
        } else {
            next();
        }
    },
    pageLoaded: (req, res, next) => {
        if (cache.shouldSave === true) {
            console.log('Cache: saving');
            cache.save(req.prerender.url, req.prerender.content).then(() => {
                cache.shouldSave = false;
                next();
            });
        } else {
            next();
        }
    }
};

