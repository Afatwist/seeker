/** Координаты клетки */
interface ICoordinates {
    /** Номер ряда */
    row: number
    /** Номер колонки */
    col: number
}

/** Положение игрового поля */
interface IBoardPosition {
    top: number;
    left: number;
}

/** Данные клетки */
interface ICellData {
    type: string
    class: string[]
}

/** Данные предмета */
interface IDataItem {
    /** Тип предмета */
    type: string
    /** Стили предмета */
    class: string[]
}

/** Данные Координат */
interface IDataForCoord {
    coord: ICoordinates;
    cell: ICellData;
    item: IDataItem | false;
}

/** Код защиты */
type ProtectionCode = [
    key: number | null,
    hash: number | null,
    factor: number | null
]

interface ILevelData {
    [key: string]: any
    id: number // id уровня совпадает с названием
    title: string // название уровня
    author: string // автор
    description: string // описание
    game_series: string // номер серии, в которую входит уровень или none
    game_difficulty: string // сложность игры
    date: string // дата создания уровня

    graphics_set: string //набор графики, сейчас только standard
    game_mode: string[] // режим игры: boulder_dash или лабиринт

    board: IBoardData;
    protection: ProtectionCode
}

/** Данные поля */
interface IBoardData {
    size: IBoardSize
    data: IDataForCoord[]
}

/** Размеры поля  */
interface IBoardSize {
    rows: number;
    cols: number
}

/** ID модели в списке моделей */
type ID = string | number

/** Тип клетки (ее dataset.type) */
type CellType = "none" | "free" | "ground" | "wall" | "die" | "finish-open" | "finish-close" | "start";

type ItemList = "stone" | "loot" | "enemy";

type ActionDirection = "up" | "down" | "left" | "right" | false;

interface IModel {
    element: HTMLDivElement
}

// function showId(id: string | number): void {
//     const cardTitle: HTMLSpanElement = document.getElementById('card')!;
//     cardTitle.innerText = id as unknown as string;
// }