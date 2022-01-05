import { BigmaManagerDB } from "./bigmaManagerModel/bigmaManagerDB";

export class GustModel {
    name: string;
    appDB: BigmaManagerDB;

    constructor(appDB: BigmaManagerDB, name: string) {
        this.appDB = appDB;
        this.name = name;
    }
    
    myMaterials() {
        return this.appDB.materials.where({ ownerApp: this.name })
    }
    mySources() {
        return this.appDB.sources.where({ ownerApp: this.name })
    }
    myIframs() {
        return this.appDB.iframes.where({ ownerApp: this.name })
    }
}