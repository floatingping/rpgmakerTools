


class ClassesFinder {
    constructor() {
    }

    reset(classes) {
        this._classes = classes;
        this._chain = [];

        Object.keys(classes).forEach(k => {
            this._addChain(classes[k], k);
        });
    }


    _addChain(aObj, chain) {
        this._chain.push(chain);
        Object.keys(aObj.Childs).forEach(k => {
            this._addChain(aObj.Childs[k], `${chain}.${k}`);
        });
    }

    findMethod(className, methodName) {
        return this._chain
            .filter(c => c.endsWith(className))
            .reduce((a, c) => a.concat(this._getMethod(c, methodName)), []);
    }

    _getMethod(chain, methodName) {
        const allChains = [];
        chain.split(".").reduce((a, c) => {
            a.push(c);
            allChains.push(a.join("."))
            return a;
        }, []);

        return allChains.filter(c => getObj(this._classes, c).Methods.some(isMatch))
            .reduce((a, c) => {
                a.push(`${c}.prototype.${getObj(this._classes, c).Methods.find(isMatch)}`)
                return a;
            }, [])

        function getObj(aObj, k) {
            return k.split(".").reduce((a, c) => a.Childs[c], { Childs: aObj });
        }

        function isMatch(m) {
            return m.split("(")[0] == methodName;
        }
    }
}

const aClassesFinder = new ClassesFinder();

class ClassToShow {
    constructor(className, methodName, list) {
        this._className = className;
        this._methodName = methodName;
        this._list = list;
    }
    get className() {
        return this._className;
    }
    get methodName() {
        return this._methodName;
    }
    getList() {
        const result = this._list.slice(0)
            .reverse()
            .reduce((a, c) => `${a}${c}\r`, "");
        return result;
    }
}

const vm = new Vue({
    el: "#app",
    data: {
        urlClassJson: "https://raw.githubusercontent.com/floatingping/rpgmakerTools/master/JSClassRealizer/Release/mz_classes_v1.4.0_1.json",
        classNameToFind: "Window_Command",
        methodNameToFind: "initialize",
        foundRecord: []
    },
    mounted: function () {
        this.$nextTick(() => {
            this.getClassJson(this.urlClassJson, classJson => {
                aClassesFinder.reset(classJson);
            });
        });
    },
    methods: {
        getClassJson: function (url, callback) {
            fetch(url)
                .then((response) => {
                    response.json().then(data => callback(data));
                })
                .catch(e => {
                    alert("error!");
                    throw e;
                });
        },
        findClassMethod: function () {
            if (!this.classNameToFind || !this.methodNameToFind) {
                alert("not empty!");
                return;
            }
            const list = aClassesFinder.findMethod(this.classNameToFind, this.methodNameToFind);
            this.foundRecord.unshift(new ClassToShow(this.classNameToFind, this.methodNameToFind, list))
        }
    }
});


