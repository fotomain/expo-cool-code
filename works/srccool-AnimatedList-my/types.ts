import {SharedValue} from 'react-native-reanimated';

export const isDebug = false

export type TItem = {
    id: number;
    backgroundColor?: string;
    mediaPostGUID: string;
    mediaPostOwnerGUID: string;
    imageSrc: string;
};

export type TListItem = {
    item: TItem;

    onDragEnd: (p:any)=>void;
    songNumber: number;
    isDragging: SharedValue<number>;
    draggedItemId: SharedValue<NullableNumber>;
    currentPositions: SharedValue<TSongPositions>;
    scrollUp: () => void;
    scrollDown: () => void;
    scrollY: SharedValue<number>;
    isDragInProgress: SharedValue<boolean>;
    PUNKTUM_LIST_GLOBAL_HEIGHT: number;
    PUNKTUM_HEIGHT: number;
};

export type TSongPositions = {
    [key: number]: {
        updatedIndex: number;
        updatedTop: number;
    };
};

export type NullableNumber = null | number;