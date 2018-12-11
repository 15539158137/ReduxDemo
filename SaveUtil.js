
let instance = null;
export default class SaveUtil {
    realm;
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    setRealm(realm) {
        this.realm = realm;
    }

    getRealm() {
        return this.realm;
    }



    static getInstance() {
        return new SaveUtil();
    }



}