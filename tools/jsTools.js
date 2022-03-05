

const vueJsTools = new Vue({
    el: "#jsTools",
    data: {
        classKeys: "name\nage\nmoney",
        jsClass: ""
    },
    methods: {
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