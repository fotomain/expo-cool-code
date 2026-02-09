import Animated from "react-native-reanimated";
import {Button} from "react-native-paper";

const LeftOverlay = (props: any) => {
    return (<Animated.View style={[props.leftOverlayStatic, props.leftOverlayStyle]}>
            <Button mode="contained" onPress={() => props.onArchive()}>
                Archive
            </Button>
            <Button mode="contained" onPress={() => props.onCancel()}>
                Cancel
            </Button>
        </Animated.View>
    )
};

export default LeftOverlay