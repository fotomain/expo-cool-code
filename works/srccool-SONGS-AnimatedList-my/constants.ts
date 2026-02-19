import {Dimensions, Platform} from 'react-native';
import {isDebug, TSongPositions} from './types';

export const randomFunnyColor: any = () => {
    const r = Math.floor(Math.random() * 200 + 30);
    const g = Math.floor(Math.random() * 200 + 30);
    const b = Math.floor(Math.random() * 200 + 30);
    return `rgb(${r}, ${g}, ${b})`;
};

export const PUNKTUM_HEIGHT = 80;
export const SONG_WIDTH = 280;
export let SONGS = [
    {
        backgroundColor:randomFunnyColor(),
        id: 0,
        mediaPostGUID: 'Hymn for the Weekend',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2738ff7c3580d429c8212b9a3b6',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 1,
        mediaPostGUID: 'Paradise',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de0cd11d7b31c3bd1fd5983d',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 2,
        mediaPostGUID: 'Viva La Vida',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc: 'https://i.ytimg.com/vi/dvgZkm1xWPE/maxresdefault.jpg',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 3,
        mediaPostGUID: 'A Sky Full of Stars',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273e5a95573f1b91234630fd2cf',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 4,
        mediaPostGUID: 'Clocks',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 5,
        mediaPostGUID: 'The Scientist',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 6,
        mediaPostGUID: 'Dusk Till Dawn (feat. Sia)',
        mediaPostOwnerGUID: 'ZAYN, Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b27323852b7ef0ecfe29d38d97ee',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 7,
        mediaPostGUID: 'Titanium (feat. Sia)',
        mediaPostOwnerGUID: 'David Guetta, Sia',
        imageSrc:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnwB_jMjMFnQkQOPvENr-diiJfDWFripRHBMSdeaHZyA&s',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 8,
        mediaPostGUID: 'Chandelier',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273297b2c53224bd19162f526e3',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 9,
        mediaPostGUID: 'Unstoppable',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273754b2fddebe7039fdb912837',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 10,
        mediaPostGUID: 'Cheap Thrills',
        mediaPostOwnerGUID: 'Sia, Sean Paul',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2731e6901561bb0cd5697cbfded',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 11,
        mediaPostGUID: 'Elastic Heart',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2735d199c9f6e6562aafa5aa357',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 12,
        mediaPostGUID: 'Believer',
        mediaPostOwnerGUID: 'Imagine Dragons',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273156aeddf54ed40b1d9d30c9f',
    },
    {
        id: 13,
        mediaPostGUID: 'Let me love you',
        mediaPostOwnerGUID: 'DJ Snake, Justin Bieber',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273212d776c31027c511f0ee3bc',
    },
    {
        id: 14,
        mediaPostGUID: 'Lean On',
        mediaPostOwnerGUID: 'Major Lazer',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273548910835dbfaf3f79a1dc46',
    },
    {
        id: 15,
        mediaPostGUID: 'Taki Taki',
        mediaPostOwnerGUID: 'DJ Snake',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8',
    },
    {
        id: 16,
        mediaPostGUID: 'Hymn for the Weekend',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2738ff7c3580d429c8212b9a3b6',
    },
    {
        id: 17,
        mediaPostGUID: 'Paradise',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de0cd11d7b31c3bd1fd5983d',
    },
    {
        id: 18,
        mediaPostGUID: 'Viva La Vida',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc: 'https://i.ytimg.com/vi/dvgZkm1xWPE/maxresdefault.jpg',
    },
    {
        id: 19,
        mediaPostGUID: 'A Sky Full of Stars',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273e5a95573f1b91234630fd2cf',
    },
    {
        id: 20,
        mediaPostGUID: 'Clocks',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    },
    {
        id: 21,
        mediaPostGUID: 'The Scientist',
        mediaPostOwnerGUID: 'Coldplay',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
    },
    {
        id: 22,
        mediaPostGUID: 'Dusk Till Dawn (feat. Sia)',
        mediaPostOwnerGUID: 'ZAYN, Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b27323852b7ef0ecfe29d38d97ee',
    },
    {
        id: 23,
        mediaPostGUID: 'Titanium (feat. Sia)',
        mediaPostOwnerGUID: 'David Guetta, Sia',
        imageSrc:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnwB_jMjMFnQkQOPvENr-diiJfDWFripRHBMSdeaHZyA&s',
    },
    {
        id: 24,
        mediaPostGUID: 'Chandelier',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273297b2c53224bd19162f526e3',
    },
    {
        id: 25,
        mediaPostGUID: 'Unstoppable',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273754b2fddebe7039fdb912837',
    },
    {
        id: 26,
        mediaPostGUID: 'Cheap Thrills',
        mediaPostOwnerGUID: 'Sia, Sean Paul',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2731e6901561bb0cd5697cbfded',
    },
    {
        id: 27,
        mediaPostGUID: 'Elastic Heart',
        mediaPostOwnerGUID: 'Sia',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b2735d199c9f6e6562aafa5aa357',
    },
    {
        id: 28,
        mediaPostGUID: 'Believer',
        mediaPostOwnerGUID: 'Imagine Dragons',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273156aeddf54ed40b1d9d30c9f',
    },
    {
        id: 29,
        mediaPostGUID: 'Let me love you',
        mediaPostOwnerGUID: 'DJ Snake, Justin Bieber',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273212d776c31027c511f0ee3bc',
    },
    {
        id: 30,
        mediaPostGUID: 'Lean On',
        mediaPostOwnerGUID: 'Major Lazer',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273548910835dbfaf3f79a1dc46',
    },
    {
        backgroundColor:randomFunnyColor(),
        id: 31,
        mediaPostGUID: 'Taki Taki',
        mediaPostOwnerGUID: 'DJ Snake',
        imageSrc:
            'https://i.scdn.co/image/ab67616d0000b273e105c410a7b390c61a58cbf8',
    },
];


if(isDebug) console.log("SONGS",SONGS);

export const getInitialPositions = (p:any): TSongPositions => {
    let songPositions: TSongPositions = {}; //!!! NOT ARRAY BUT OBJECT
    for (let i = 0; i < p.data.length; i++) {
        songPositions[i] = { //TODO ??? songPositions[SONGS[i].id]
            updatedIndex: i,
            updatedTop: i * PUNKTUM_HEIGHT,};
    }
    return songPositions;
};

export const Color_Pallete = {
    metal_black: '#0E0C0A',
    night_shadow: '#1C1C1C',
    crystal_white: '#FFFFFF',
    silver_storm: '#808080',
};

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

export const ANIMATION_DURATION = 600;
export const MIN_BOUNDRY = 0;
export const MAX_BOUNDRY = (SONGS.length - 1) * PUNKTUM_HEIGHT;

export const EDGE_THRESHOLD = 40;
export const SCROLL_SPEED_OFFSET = isAndroid ? 2 : 3;
