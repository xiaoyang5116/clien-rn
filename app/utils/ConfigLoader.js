
import fs from "react-native-fs";
import { DEBUG_MODE } from "../constants/_others";

export async function loadConfig(path, cb) {
    if (DEBUG_MODE) {
        const uri = `http://localhost:8081/${path}`;
        return fetch(uri)
            .then(r => r.text(uri))
            .then(cb);
    } else {
        // 仅对安卓有效，iOS待处理
        return fs.readFileAssets(path, "utf8")
            .then(cb);
    }
}