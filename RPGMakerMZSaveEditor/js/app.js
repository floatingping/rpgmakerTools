


class MZSaveEditor {
    constructor() {

    }

    loadSave(data) {
        this._saveData = data;
        return this._saveData;
    }

    unpackData() {
        const actors = this._saveData.actors._data
            .map(a => {
                return a
                    ? {
                        name: a._name,
                        profile: a._profile,
                        exp: a._exp[a._classId],
                        hp: a._hp,
                        mp: a._mp,

                        plusMHP: a._paramPlus[0],
                        plusMMP: a._paramPlus[1],
                        plusAtk: a._paramPlus[2],
                        plusDef: a._paramPlus[3],
                        plusMat: a._paramPlus[4],
                        plusMdf: a._paramPlus[5],
                        plusAgi: a._paramPlus[6],
                        plusLuk: a._paramPlus[7]
                    }
                    : null;
            });

        return {
            actors: actors,
            gold: this._saveData.party._gold,
            weapons: this._saveData.party._weapons,
            armors: this._saveData.party._armors,
            items: this._saveData.party._items
        };
    }

    setActorProps(actorId, {
        name,
        profile,
        exp,
        hp,
        mp
    }) {
        const actor = this._saveData.actors._data[actorId];
        actor._name = name;
        actor._profile = profile;
        actor._exp[actor._classId] = exp;
        actor._hp = hp;
        actor._mp = mp;

        return this;
    }

    setActorParamPlus(actorId, {
        mhp,
        mmp,
        atk,
        def,
        mat,
        mdf,
        agi,
        luk
    }) {
        const paramPlus = this._saveData.actors._data[actorId]._paramPlus;
        paramPlus[0] = mhp ?? 0; //mhp
        paramPlus[1] = mmp ?? 0; //mmp
        paramPlus[2] = atk ?? 0; //atk
        paramPlus[3] = def ?? 0; //def
        paramPlus[4] = mat ?? 0; //mat
        paramPlus[5] = mdf ?? 0; //mdf
        paramPlus[6] = agi ?? 0; //agi
        paramPlus[7] = luk ?? 0; //luk
        return this;
    }

    setGold(gold) {
        this._saveData.party._gold = gold;
        return this;
    }

    setWeapons(weapons) {
        this._saveData.party._weapons = weapons;
        return this;
    }
    setArmors(armors) {
        this._saveData.party._armors = armors;
        return this;
    }
    setItems(items) {
        this._saveData.party._items = items;
        return this;
    }

    _getTimeStamp() {
        const time = new Date();
        return time.getFullYear()
            + `${time.getMonth() + 1}`.padStart(2, "0")
            + `${time.getDate()}`.padStart(2, "0")
            + "_"
            + `${time.getHours()}`.padStart(2, "0")
            + `${time.getMinutes()}`.padStart(2, "0") + `${time.getSeconds()}`.padStart(2, "0");
    }

    _downloadAsFile(fileName, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    async exportSaveDataAsync(fileName) {
        const zipContent = await StorageManager.objectToJson(this._saveData)
            .then(json => StorageManager.jsonToZip(json));

        this._downloadAsFile(`${this._getTimeStamp()}_${fileName}`, zipContent);
    }
}




const mzSaveEditor = new MZSaveEditor();

const vm = new Vue({
    el: "#app",
    data: {
        _saveFileName: "",
        actors: [],
        weaponsJson: "",
        armorsJson: "",
        itemsJson: "",
        gold: null
    },
    mounted() {
        //
    },
    methods: {
        loadMZSaveFile: async function (fileName, file) {
            this._saveFileName = fileName;

            const json = await StorageManager.zipToJson(file);
            const data = await StorageManager.jsonToObject(json);

            mzSaveEditor.loadSave(data);

            const {
                actors,
                gold,
                weapons,
                armors,
                items
            } = mzSaveEditor.unpackData();

            this.actors = actors;
            this.gold = gold;
            this.weaponsJson = this.toJsonString(weapons);
            this.armorsJson = this.toJsonString(armors);
            this.itemsJson = this.toJsonString(items);
        },
        getAll99Object: function () {
            const result = {};
            for (let i = 1; i <= 999; i++) {
                result[i] = 99;
            }
            return result;
        },
        obtainWeapons99() {
            this.weaponsJson = this.toJsonString(this.getAll99Object());
        },
        obtainArmors99() {
            this.armorsJson = this.toJsonString(this.getAll99Object());
        },
        obtainItems99() {
            this.itemsJson = this.toJsonString(this.getAll99Object());
        },
        toJsonString: function (aObj) {
            return JSON.stringify(aObj, null, 2);
        },
        toObj: function (json) {
            return JSON.parse(json);
        },
        exportSaveDataAsync: function () {

            this.actors.forEach((actor, actorId) => {
                if (!actor) return;
                mzSaveEditor.setActorProps(actorId, {
                    name: actor.name,
                    profile: actor.profile,
                    exp: actor.exp,
                    hp: actor.hp,
                    mp: actor.mp
                });

                mzSaveEditor.setActorParamPlus(actorId, {
                    mhp: actor.plusMHP,
                    mmp: actor.plusMMP,
                    atk: actor.plusAtk,
                    def: actor.plusDef,
                    mat: actor.plusMat,
                    mdf: actor.plusMdf,
                    agi: actor.plusAgi,
                    luk: actor.plusLuk
                });
            });

            mzSaveEditor.setGold(this.gold);
            mzSaveEditor.setWeapons(this.toObj(this.weaponsJson));
            mzSaveEditor.setArmors(this.toObj(this.armorsJson));
            mzSaveEditor.setItems(this.toObj(this.itemsJson));

            return mzSaveEditor.exportSaveDataAsync(this._saveFileName);
        }
    }
});





document.getElementById("mzfileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            vm.loadMZSaveFile(file.name, e.target.result);
        };
        reader.readAsText(file);
    }
});