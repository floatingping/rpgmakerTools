
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