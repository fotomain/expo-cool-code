import Animated from "react-native-reanimated";
import {Button} from "react-native-paper";

const LeftOverlay = (props: any) => {
    return (<Animated.View style={[props.leftOverlay, props.leftOverlayStyle]}>
            <Button mode="contained" onPress={() => props.onRemove()}>
                Archive1
            </Button>
            <Button mode="contained" onPress={() => props.resetCard()}>
                Cancel1
            </Button>
        </Animated.View>
    )
};

export default LeftOverlay