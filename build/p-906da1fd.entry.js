import{r as t,g as e}from"./p-989e53c2.js";import{A as s}from"./p-96f6fd95.js";let i=class{constructor(e){t(this,e),this.titleSuffix="",this.pageTitle=""}updateDocumentTitle(){const t=this.el;t.ownerDocument&&(t.ownerDocument.title=`${this.pageTitle}${this.titleSuffix||""}`)}componentWillLoad(){this.updateDocumentTitle()}get el(){return e(this)}static get watchers(){return{pageTitle:["updateDocumentTitle"]}}};s.injectProps(i,["titleSuffix"]);export{i as stencil_route_title}