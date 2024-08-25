



// (() => {

//     SoundManager.loadSystemSound = () => { };

//     SoundManager.playSystemSound = () => { };

//     Scene_Title.prototype.playTitleMusic = () => { };

// })();






class MZSaveEditor {
    get saveData() { return this._saveData; }
    constructor() {

    }

    loadSave(data) {
        this._saveData = data;
        return this.saveData;
    }

    get1_999Weapons_Armors_Items_to99() {
        for (let i = 1; i <= 999; i++) {
            this._saveData.party._weapons[i] = 99;
        }

        for (let i = 1; i <= 999; i++) {
            this._saveData.party._armors[i] = 99;
        }

        for (let i = 1; i <= 999; i++) {
            this._saveData.party._items[i] = 99;
        }

        return this;
    }

    setGold(gold) {
        this._saveData.party._gold = gold;
        return this;
    }

    addActorParas(actorId, {
        mhp,
        mmp,
        atk,
        def,
        mat,
        mdf,
        agi,
        luk
    }) {
        aMZSaveEditor._saveData.actors._data[actorId]._paramPlus[0] += mhp ?? 0; //mhp
        aMZSaveEditor._saveData.actors._data[actorId]._paramPlus[1] += mmp ?? 0; //mmp
        aMZSaveEditor._saveData.actors._data[actorId]._paramPlus[2] += atk ?? 0; //atk
        aMZSaveEditor._saveData.actors._data[actorId]._paramPlus[3] += def ?? 0; //def
        aMZSaveEditor._saveData.actors._data[actorId]._paramPlus[4] += mat ?? 0; //mat
        aMZSaveEditor._saveData.actors._data[actorId]._paramPlus[5] += mdf ?? 0; //mdf
        aMZSaveEditor._saveData.actors._data[actorId]._paramPlus[6] += agi ?? 0; //agi
        aMZSaveEditor._saveData.actors._data[actorId]._paramPlus[7] += luk ?? 0; //luk
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

    async exportSaveData() {
        const fileName = `${this._getTimeStamp()}_${document.getElementById("fileInput").files[0].name}`;

        const zipContent = await StorageManager.objectToJson(this._saveData)
            .then(json => StorageManager.jsonToZip(json));

        this._downloadAsFile(fileName, zipContent);
    }
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {

            StorageManager.loadZip = function () {
                return Promise.resolve(e.target.result);
            };

            (async () => {
                const data = await StorageManager.loadObject();
                aMZSaveEditor.loadSave(data);
                console.log(aMZSaveEditor.saveData);
            })();

        };
        reader.readAsText(file);
    }
});

document.getElementById('setAllToDownload').addEventListener('click', function () {
    aMZSaveEditor
        .get1_999Weapons_Armors_Items_to99()
        .setGold(999999)
        .addActorParas(1, {
            mhp: 9999,
            mmp: 9999,
            atk: 999,
            def: 999,
            mat: 999,
            mdf: 999,
            agi: 999,
            luk: 999
        }).exportSaveData();
});

const aMZSaveEditor = new MZSaveEditor();

