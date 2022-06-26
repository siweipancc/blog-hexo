import {Dirent} from "fs";

const fs = require('fs');
const path = require('path')

/**
 * 移除各个主题下的 config.
 */
function clean(): Promise<void> {
    return fs.promises.access(__dirname + path.sep + 'themes')
        .then(() => true)
        .catch(() => false)
        .then((exist: boolean) => {
            if (!exist) {
                return "1";
            }
            let files: Dirent[] = fs.readdirSync(__dirname + path.sep + 'themes', {withFileTypes: true});
            let dirents = files.filter(x => x.isDirectory());
            for (let file of dirents) {
                const themePath = __dirname + path.sep + 'themes' + path.sep + file.name;
                for (let fileName of fs.readdirSync(themePath).filter((x: string) => x === '_config.yml')) {
                    let configPath = themePath + path.sep + fileName;
                    fs.unlinkSync(configPath);
                    console.info("file deleted, path: %s", configPath);
                }
            }
        })
}


clean();
export {}
