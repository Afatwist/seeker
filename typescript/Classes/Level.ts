/** Класс файлов уровня.
 * Содержит все данные уровня.
 * Позволяет обновлять и сохранять данные уровня.
 */
export class Level {
   /** количество стандартных уровней */
   static count: number = 11;
   [key: string]: any
   id: number = 1 // id уровня совпадает с названием
   title: string = '' // название уровня
   author: string = '' // автор
   description: string = '' // описание
   game_series: string = '' // номер серии, в которую входит уровень или none
   game_difficulty: string = '' // сложность игры
   date: string = ''

   graphics_set: string = 'standard' //набор графики, сейчас только standard
   game_mode: string[] = [] // режим игры: boulder_dash или лабиринт

   board = {
      size: {
         rows: 1,
         cols: 1,
      },
      data: <IDataForCoord[]>[]
   }

   protection: ProtectionCode = [1, 1, 1]

   constructor(data?: ILevelData) {
      if (!data) return this;
      this.id = data.id || Level.levelIdNext();
      this.title = data.title || 'Название';
      this.author = data.author || 'Автор';
      this.description = data.description || '';
      this.game_series = data.game_series || 'none';
      this.game_difficulty = data.game_difficulty || 'normal'
      this.date = data.date || (new Date).toLocaleDateString();

      this.graphics_set = data.graphics_set || 'standard';
      this.game_mode = data.game_mode || ['boulder_dash'];

      this.board.size.rows = data.board?.size.rows || 1;
      this.board.size.cols = data.board?.size.cols || 1;
      this.board.data = data.board?.data || [];
      /* 
            if (!this.protectionCheck(data.protection)) {
               alert("Данные в файле были повреждены! Выберете другой файл.");
               window.history.back();
            } */
   }


   /** Создает уровень по данными из формы */
   createForm(formData: FormData): void {
      let RowCount = Number(formData.get('row'));
      let ColCount = Number(formData.get('col'));
      formData.delete('row');
      formData.delete('col');

      this.setBoardSize(RowCount, ColCount);
      this.#freeBoardGenerator();
      this.#setBoardInfo(formData);
   }

   /** Обновляет уровень данными из формы */
   updateData(formData: FormData): this {
      for (const key of formData.keys()) {

         if (!this.hasOwnProperty(key)) {
            alert(`Такого значения: "${key}" в уровне нет!`)
            console.error(`Input: имя: "${key}" введенное значение: ${formData.getAll(key)}`);
            break;
         } else {
            if (key === 'game_mode') {
               this.game_mode = formData.getAll('game_mode') as string[];
            } else this[key] = formData.get(key) as string;
         }


      }
      return this;
   }

   /** Задает основную информацию о поле из форм создать или изменить поле */
   #setBoardInfo(formData: FormData) {
      for (const key of formData.keys()) {

         if (!this.hasOwnProperty(key)) {
            alert(`Такого значения: "${key}" в уровне нет!`)
            console.error(`Input: имя: "${key}" введенное значение: ${formData.getAll(key)}`);
            break;
         }

         if (key === 'game_mode') {
            this.game_mode = formData.getAll(key) as string[];
         } else this[key] = formData.get(key);
      }
   }

   /** Задать/изменить размеры игрового поля 
    * @param rows - количество рядов на поле
    * @param cols - количество колонок на поле
    */
   setBoardSize(rows: number, cols: number): void {
      this.board.size.rows = rows;
      this.board.size.cols = cols;
   }

   /** Сохранить данные о клетке 
    * @param cell - клетка на игровом поле 
    */
   setBoardData(cell: HTMLDivElement): void {
      this.board.data.push({
         "coord": {
            "row": +cell.dataset.row!,
            "col": +cell.dataset.col!
         },
         "cell": {
            "type": cell.dataset.type!,
            "class": [...cell.classList],
         },
         "item": this.#getItem(cell)
      });
   }

   /** Получить предмет из клетки 
    * @param cell - клетка на игровом поле 
    */
   #getItem(cell: HTMLDivElement): IDataItem | false {
      if (cell.children.length > 0) {
         let child = cell.children[0] as HTMLDivElement;
         return {
            "type": child.dataset.type!,
            "class": [...child.classList]
         }
      }
      return false;
   }

   /** Сохранить файл */
   fileSave() {
      this.protection = this.#protectionMake()
      // Создание файла для сохранения
      const file = new Blob(
         [JSON.stringify(this)], {
         type: 'application/json'
      });

      // временный путь к файлу
      let link = URL.createObjectURL(file);

      // создание временной ссылки на файл и имитация клика
      let aTemp = document.createElement('a');
      aTemp.setAttribute('href', link);
      aTemp.setAttribute('download', `${this.id}_update.json`);
      aTemp.click();
      URL.revokeObjectURL(link);
      aTemp.remove();
   }

   /** получить следующий id для создания уровня */
   static levelIdNext(): number {
      return this.count + 1
   }

   /** Создает пустое поле при создании уровня */
   #freeBoardGenerator() {
      for (let r = 1; r <= this.board.size.rows; r++) {
         for (let c = 1; c <= this.board.size.cols; c++) {
            let cell: IDataForCoord = {
               "coord": {
                  "row": r,
                  "col": c
               },
               "cell": { "type": 'free', "class": ['cell', 'free'] },
               "item": false
            }

            this.board.data.push(cell);
         }
      }
   }

   /** Проверяет файл на наличие изменений
    * true - файл не поврежден
    * false - файл был поврежден
    */
   protectionCheck(protectionCode: ProtectionCode): boolean {
      let [key, hash, factor] = protectionCode;
      let levelHash = this.#protectionMake(key, factor)[1];

      return levelHash === hash;
   }

   /** Создает хэш данных для защиты от изменений
    * @param key ключ к коду
    * @param factor множитель кода
    * @returns [key, hash, factor]
    */
   #protectionMake(key: number | null = null, factor: number | null = null): ProtectionCode {
      let hash = 0;
      key = key || Math.floor(Math.random() * 50) + 2
      factor = factor || Math.floor(Math.random() * 5) + 1

      let str = JSON.stringify(this);

      for (let i = 0; i < str.length; i++) {
         hash = (((hash << key) - hash) + str.charCodeAt(i)) * factor;
      }

      hash &= hash;

      return [key, ((hash / 2) - key - factor), factor]
   }
}