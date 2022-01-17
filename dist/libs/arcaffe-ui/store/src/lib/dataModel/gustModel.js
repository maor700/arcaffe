export class GustModel {
  constructor(appDB, name) {
    this.appDB = appDB;
    this.name = name;
  }
  myMaterials() {
    return this.appDB.materials.where({ ownerApp: this.name });
  }
  mySources() {
    return this.appDB.sources.where({ ownerApp: this.name });
  }
  myIframs() {
    return this.appDB.iframes.where({ ownerApp: this.name });
  }
}
