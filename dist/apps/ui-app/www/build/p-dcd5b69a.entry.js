import{r,h as a}from"./p-faee4f07.js";let e=class{constructor(a){r(this,a)}normalize(r){return r?r.substr(0,1).toUpperCase()+r.substr(1).toLowerCase():""}render(){if(this.match&&this.match.params.name)return a("div",{class:"app-profile"},a("p",null,"Hello! My name is ",this.normalize(this.match.params.name),". My name was passed in through a route param!"))}};e.style=".app-profile{padding:10px}";export{e as app_profile}