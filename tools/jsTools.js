

const vueJsTools = new Vue({
    el: "#jsTools",
    data: {
        keyWordSelecterIn: `name:"test",
    age:5 ,
    money: 3 ,`,
        regexp: `/\\s*:.*,/`,
        keyWordSelecterOut: "",
        classKeys: "name\nage\nmoney",
        jsClass: ""
    },
    methods: {
        seelctKeywords: function () {
            if (!this.regexp) return alert("bad regexp");
            if (!/^\/.*\/$/.test(this.regexp)) return alert("bad regexp");
            this.keyWordSelecterOut = this.keyWordSelecterIn
                .replaceAll(new RegExp(this.regexp.substring(1, this.regexp.length - 1), "g"), "")
                .replaceAll(/\n\s+/g,"\n");
        },
        generate: function () {
            const keys = this.classKeys.replaceAll("\r\n", "\n")
                .split("\n")
                .filter(s => (s?.trim() ?? "") !== "");
            const constructorData = keys.reduce((a, c) => `${a}this._${c}=${c};\n`, "");
            const geters = keys.reduce((a, c) => `${a}get ${c}(){ return this._${c}; }\n`, "");
            const setters = keys.reduce((a, c) => `${a}set ${c}(val){ this._${c}=val; }\n`, "");

            this.jsClass = `class JSClass{
    constructor({${keys.join(",")}}) {
${constructorData}
    }
${geters}
${setters}
}`;
        }
    }
});