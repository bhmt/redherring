import promisify from "./promisify";

const rh_whitelist_storage = "rh_whitelist_storage";

class Storage {
    constructor() {
      this.storage = this._promisify()
    }

    _promisify() {
        return (chrome) ?
        {
            get: promisify(chrome.storage.local, "get"),
            set: promisify(chrome.storage.local, "set") 
        }
        : browser.storage.local;
    };

    async get_whitelist() {
        let data = await this.storage.get(rh_whitelist_storage);
        return (!data.rh_whitelist_storage)
        ? []
        : data.rh_whitelist_storage;
    };

    set_whitelist(whitelist) {
        this.storage.set({ rh_whitelist_storage: whitelist })
    }
}

const storage = new Storage()
export default storage;
