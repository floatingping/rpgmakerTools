

const vueJsTools = new Vue({
    el: "#jsTools",
    data: {
        keyWordSelecterIn: `name:"test",
    age:5 ,
    money: 3 ,`,
        regexp: `/\\s*:.*,/`,
        keyWordSelecterOut: "",
        classKeys: "name\nage\nmoney",
        jsClass: "",
        formatSrcData: `Alice
Bob 
Carol`,
        formatCallbacks: [
            "str=> `${str.trim()}`",
            "str=> `${str.trim()},`",
            "str=> `'${str.trim()}',`",
            "str=> `${str.replaceAll(/s*:.*,/g, '')}`",
            `s=>{
    return s
        .replaceAll(/s*:.*,/g, "")
        .trim();
}`
        ],
        formatDistData: "",
        formatComboIndexs: "3,0",
        excelToTableSrc: `Name\tAge\tCity
Alice\t30\tNew York
Bob\t25\tLos Angeles
Carol\t28\tChicago`,
        excelToTableDist: ""
    },
    methods: {
        seelctKeywords: function () {
            if (!this.regexp) return alert("bad regexp");
            if (!/^\/.*\/$/.test(this.regexp)) return alert("bad regexp");
            this.keyWordSelecterOut = this.keyWordSelecterIn
                .replaceAll(new RegExp(this.regexp.substring(1, this.regexp.length - 1), "g"), "")
                .replaceAll(/\n\s+/g, "\n");
        },
        generate: function () {
            const keys = this.classKeys.replaceAll("\r\n", "\n")
                .split("\n")
                .filter(s => (s?.trim() ?? "") !== "");
            const constructorData = keys.reduce((a, c) => `${a}        this._${c}=${c};\n`, "");
            const geters = keys.reduce((a, c) => `${a}    get ${c}(){ return this._${c}; }\n`, "");
            const setters = keys.reduce((a, c) => `${a}    set ${c}(val){ this._${c}=val; }\n`, "");

            this.jsClass = `class JSClass{
    constructor({${keys.join(",")}}) {
${constructorData}
    }

${geters}
${setters}
}`;
        },
        convertDataWithFormatRules: function (arrayString, formatStrings) {
            const formatRule = s => formatStrings.reduce((a, c) => eval(c)(a), s);
            return arrayString.map(formatRule);
        },
        executeFormat: function (idxsFormatCallbacks) {
            try {
                this.formatDistData = this.convertDataWithFormatRules(
                    this.formatSrcData.split("\n"),
                    idxsFormatCallbacks.map(i => this.formatCallbacks[i])
                ).join("\n");
            }
            catch (e) {
                console.error(e);
                alert("fortmat fail!");
            }
        },
        addFormatRule: function (idxFormatCallbacks) {
            this.formatCallbacks.splice(idxFormatCallbacks + 1, 0, "");
        },
        executeComboFormater: function () {
            try {
                const ruleIdxs = this.formatComboIndexs.split(",").map(s => Number(s.trim()));
                this.executeFormat(ruleIdxs);
            }
            catch (e) {
                console.error(e);
                alert("comboFormater fail!");
            }
        },
        excelToHtmlTable(lines) {
            const trimLines = lines.split("\n").map(l => l.trim()).filter(l => l);

            let headers;

            const thead = "<thead>" + trimLines.filter((_, i) => i === 0).map(l => {
                headers = l.split("\t").map(cell => `<th>${cell.trim()}</th>`);
                return `<tr>${headers.join("")}</tr>`;
            }) + "</thead>";

            const tbody = "<tbody>" + trimLines.filter((_, i) => i > 0).map(l => {
                const cells = l.split("\t").map(cell => `<td>${cell.trim()}</td>`);

                const remainCells = [];



                for (let i = cells.length; i < headers.length; i++) {
                    remainCells.push("<td></td>");
                }

                return `<tr>${cells.concat(remainCells).join("")}</tr>`;
            }).join("") + "</tbody>";

            return `<table border="1">\n${thead}\n${tbody}\n</table>`;
        },
        onBtnExcelToHtmlTableClick() {
            this.excelToTableDist = this.excelToHtmlTable(this.excelToTableSrc);
        }
    }
});