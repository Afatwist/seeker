export class Level {
    static count = 11;
    id = 1;
    title = '';
    author = '';
    description = '';
    game_series = '';
    game_difficulty = '';
    date = '';
    graphics_set = 'standard';
    game_mode = [];
    board = {
        size: {
            rows: 1,
            cols: 1,
        },
        data: []
    };
    protection = [1, 1, 1];
    constructor(data) {
        if (!data)
            return this;
        this.id = data.id || Level.levelIdNext();
        this.title = data.title || 'Название';
        this.author = data.author || 'Автор';
        this.description = data.description || '';
        this.game_series = data.game_series || 'none';
        this.game_difficulty = data.game_difficulty || 'normal';
        this.date = data.date || (new Date).toLocaleDateString();
        this.graphics_set = data.graphics_set || 'standard';
        this.game_mode = data.game_mode || ['boulder_dash'];
        this.board.size.rows = data.board?.size.rows || 1;
        this.board.size.cols = data.board?.size.cols || 1;
        this.board.data = data.board?.data || [];
    }
    createForm(formData) {
        let RowCount = Number(formData.get('row'));
        let ColCount = Number(formData.get('col'));
        formData.delete('row');
        formData.delete('col');
        this.setBoardSize(RowCount, ColCount);
        this.#freeBoardGenerator();
        this.#setBoardInfo(formData);
    }
    updateData(formData) {
        for (const key of formData.keys()) {
            if (!this.hasOwnProperty(key)) {
                alert(`Такого значения: "${key}" в уровне нет!`);
                console.error(`Input: имя: "${key}" введенное значение: ${formData.getAll(key)}`);
                break;
            }
            else {
                if (key === 'game_mode') {
                    this.game_mode = formData.getAll('game_mode');
                }
                else
                    this[key] = formData.get(key);
            }
        }
        return this;
    }
    #setBoardInfo(formData) {
        for (const key of formData.keys()) {
            if (!this.hasOwnProperty(key)) {
                alert(`Такого значения: "${key}" в уровне нет!`);
                console.error(`Input: имя: "${key}" введенное значение: ${formData.getAll(key)}`);
                break;
            }
            if (key === 'game_mode') {
                this.game_mode = formData.getAll(key);
            }
            else
                this[key] = formData.get(key);
        }
    }
    setBoardSize(rows, cols) {
        this.board.size.rows = rows;
        this.board.size.cols = cols;
    }
    setBoardData(cell) {
        this.board.data.push({
            "coord": {
                "row": +cell.dataset.row,
                "col": +cell.dataset.col
            },
            "cell": {
                "type": cell.dataset.type,
                "class": [...cell.classList],
            },
            "item": this.#getItem(cell)
        });
    }
    #getItem(cell) {
        if (cell.children.length > 0) {
            let child = cell.children[0];
            return {
                "type": child.dataset.type,
                "class": [...child.classList]
            };
        }
        return false;
    }
    fileSave() {
        this.protection = this.#protectionMake();
        const file = new Blob([JSON.stringify(this)], {
            type: 'application/json'
        });
        let link = URL.createObjectURL(file);
        let aTemp = document.createElement('a');
        aTemp.setAttribute('href', link);
        aTemp.setAttribute('download', `${this.id}_update.json`);
        aTemp.click();
        URL.revokeObjectURL(link);
        aTemp.remove();
    }
    static levelIdNext() {
        return this.count + 1;
    }
    #freeBoardGenerator() {
        for (let r = 1; r <= this.board.size.rows; r++) {
            for (let c = 1; c <= this.board.size.cols; c++) {
                let cell = {
                    "coord": {
                        "row": r,
                        "col": c
                    },
                    "cell": { "type": 'free', "class": ['cell', 'free'] },
                    "item": false
                };
                this.board.data.push(cell);
            }
        }
    }
    protectionCheck(protectionCode) {
        let [key, hash, factor] = protectionCode;
        let levelHash = this.#protectionMake(key, factor)[1];
        return levelHash === hash;
    }
    #protectionMake(key = null, factor = null) {
        let hash = 0;
        key = key || Math.floor(Math.random() * 50) + 2;
        factor = factor || Math.floor(Math.random() * 5) + 1;
        let str = JSON.stringify(this);
        for (let i = 0; i < str.length; i++) {
            hash = (((hash << key) - hash) + str.charCodeAt(i)) * factor;
        }
        hash &= hash;
        return [key, ((hash / 2) - key - factor), factor];
    }
}
//# sourceMappingURL=Level.js.map