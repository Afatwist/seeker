import { Main } from "./Main.js";

/** Контролирует текущие размеры поля и выдает предупреждение, если что-то не так */
export class BoardSize {
    /** Минимальное количество рядов на поле: 1 */
    static readonly minRow: number = 1;
    /** Минимальное количество колонок на поле: 1 */
    static readonly minCol: number = 1;
    /** Минимальное количество клеток на поле: 10 */
    static readonly minCell: number = 10;
    /** Максимальное количество рядов на поле: 100 */
    static readonly maxRow: number = 100;
    /** Максимальное количество колонок на поле: 100 */
    static readonly maxCol: number = 100;
    /** максимальное количество клеток на поле: 5000 */
    static readonly maxCell: number = 5000;


    /** Ряды на поле */
    static #rows: HTMLCollectionOf<HTMLDivElement>;
    /** Колонки на поле */
    static #cols: HTMLCollectionOf<HTMLDivElement>;
    /** Клетки на поле */
    static #cells: HTMLCollectionOf<HTMLDivElement>;



    /** Подготовка данных */
    static init(): void {
        this.#rows = document.getElementsByClassName('row') as HTMLCollectionOf<HTMLDivElement>;
        this.#cells = document.getElementsByClassName('cell') as HTMLCollectionOf<HTMLDivElement>;
        /** Количество колонок соответствует количеству верхних кнопок */
        this.#cols = document.getElementsByClassName('control-button-top') as HTMLCollectionOf<HTMLDivElement>;
    }

    /** Проверяет текущие размеры поля, и если они не правильные, 
     * то запрещает действие и показывает уведомление.
     * 
     * На поле должно быть:
     * * минимум: 10 клеток, 1 ряд и 1 колонка
     * * максимум: 5000 клеток, 100 рядов или 100 колонок 
     *  @returns 
     * - true - было предупреждение и действие запрещено;
     * - false - предупреждения нет, действие разрешено;
    */
    static check(): boolean {
        let message: string[] = [];

        /** клетки доступные для перемещения игрока */
        let cellCount = [...this.#cells].filter(cell => cell.dataset.type !== 'none').length;
        /** Количество колонок соответствует количеству верхних кнопок */
        let colCount = this.#cols.length;
        /** Количество рядов */
        let rowCount = this.#rows.length;

        /*  При добавлении нового ряда или колонки, нужно убедиться, 
            что сумма существующих клеток и добавляемых к ним будет меньше 5000.

                При добавлении нового ряда, на поле добавятся новые клетки в количестве
                равном количеству колонок в этом ряду.
                При добавлении колонки, добавится клеток по количеству рядов.

            При удалении клетки, ряда или колонки, убедиться, что количество оставшихся клеток
            будет больше 10.
        */


        /* Проверки на минимальные размеры поля */
        if (cellCount <= 10 && Main.ACTION?.type === 'cell-clear') {
            message.push('На поле должно быть минимум 10 клеток доступных для перемещения игрока!');
        }


        if (Main.ACTION?.type === 'row-remove') {
            if (rowCount === 1) message.push('На поле должен быть минимум один ряд!');
            if (cellCount - colCount < 10)
                message.push(`На поле может быть минимум 10 клеток, 
            при удалении ряда останется: ${cellCount - colCount}!`);
        }

        if (Main.ACTION?.type === 'col-remove') {
            if (colCount === 100) message.push('На поле должна быть минимум одна колонка!');
            if (cellCount - rowCount < 100)
                message.push(`На поле может быть минимум 10 клеток,
            при удалении колонки останется: ${cellCount - rowCount}!`);
        }



        /* Проверки на максимальные размеры поля */

        if (Main.ACTION?.type === 'row-add') {
            if (rowCount >= 100) message.push('На поле может быть максимум сто рядов!');
            if (cellCount + colCount > 5000)
                message.push(`На поле может быть максимум 5000 клеток, 
            при добавлении ряда получится: ${cellCount + colCount}!`);
        }

        if (Main.ACTION?.type === 'col-add') {
            if (colCount >= 100) message.push('На поле может быть максимум сто колонок!');
            if (cellCount + rowCount > 5000)
                message.push(`На поле может быть максимум 5000 клеток,
            при добавлении колонки получится: ${cellCount + rowCount}!`);
        }



        /* Вывод результата */
        if (message.length) {
            alert(message.join(" \n"));
            return true;
        }
        return false;
    }
}