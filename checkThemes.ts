/**
 * 检查主题是否存在.
 *
 */

const fs = require('fs');
const path = require('path')
const clone = require('git-clone');
const themesRoot = __dirname + path.sep + "themes" + path.sep;
const hexo_config = __dirname + path.sep + "_config.yml";
const YAML = require('yaml')

interface Theme {
    /**
     * 主题的名字.
     */
    name: string,
    /**
     * git 的链接 https.
     */
    repo: string;


}


/**
 * 待用的主题列表.
 */
const Themes: Array<Theme> = [
    {
        name: "hexo-theme-matery",
        repo: "https://github.com/blinkfox/hexo-theme-matery.git"
    }
];


// 使用的主题
function getUserTheme(): Theme | string {
    const fileSync: string = fs.readFileSync(hexo_config, {encoding: 'utf8'});
    let parse = YAML.parse(fileSync);
    let theme: string = parse['theme'];
    console.assert(theme != undefined);
    console.info("user specific theme, name: %s", theme);
    let available: Theme[] = Themes.filter(x => x.name === theme);
    console.assert(available.length > 0, "no theme config exists for : %s", theme);
    return available.length > 0 ? available[0] : theme;
}

let userTheme: Theme | string = getUserTheme();
console.info("using theme: %o", userTheme);

/**
 * 解析并下载主题依赖.
 * @param theme 主题
 */
function resolveUserTheme(theme: Theme | string): Promise<void> {
    if (typeof theme === 'string') {
        const moduleName = "hexo-theme-" + theme;
        return new Promise<void>((resolve) => {
            console.info("using node_modules : %s", moduleName)
            resolve( );
        });
    }
    const name = (theme as Theme).name;
    const repo = (theme as Theme).repo;
    const path = themesRoot + name;
    return checkFileExists(path).then((exists: boolean) => {
        if (exists) {
            console.info("themes exists %s", name);
            return;
        }
        // load matery
        clone(repo, path, {}, function (error: Error) {
            if (error) {
                console.error("themes download fails,name: %s, error: %o", name, error);
            } else {
                console.info("themes download success, name: %s", name);
            }
        })
    })
}

/**
 * 检查文件是否存在.
 * @param path 路径
 */
function checkFileExists(path: string) {
    return fs.promises.access(path, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
}

Promise.all([resolveUserTheme(userTheme)])




