import {StyleSheet} from 'react-native';
import {Color_Pallete, SONG_WIDTH} from '../constants';

export const styles:any=(p:any)=>{return StyleSheet.create({
    itemContainer: {
        height: p.PUNKTUM_HEIGHT,
        width: SONG_WIDTH,
        flexDirection: 'row',
        position: 'absolute',
        borderWidth:1,
        borderColor:"white",
    },
    imageContainer: {
        height: p.PUNKTUM_HEIGHT,
        width: '20%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '3%',
    },
    descriptionContainer: {
        width: '60%',
        justifyContent: 'space-evenly',
    },
    description1: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Color_Pallete.crystal_white,
    },
    description2: {color: Color_Pallete.silver_storm},
    draggerContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    marginBottom: {
        marginBottom: 5,
    },
    dragger: {
        width: '30%',
        height: 2,
        backgroundColor: Color_Pallete.crystal_white,
    },
    image: {
        height: p.PUNKTUM_HEIGHT - 20,
        width: '97%',
    },
})};
