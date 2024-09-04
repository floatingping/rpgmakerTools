

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
        actor._name = profile;
        actor._exp[actor._classId] = exp;
        actor._name = name;
        actor._name = hp;
        actor._name = mp;

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
