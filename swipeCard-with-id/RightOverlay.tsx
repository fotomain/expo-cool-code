import Animated from "react-native-reanimated";
import {Button} from "react-native-paper";

const RightOverlay = (props: any) => {
    return (
        <Animated.View style={[props.rightOverlay, props.rightOverlayStyle]}>
            <Button
                mode="contained"
                buttonColor="#b71c1c"
                onPress={() => props.onRemove()}
            >
                Delete
            </Button>
            <Button mode="contained" onPress={() => props.resetCard()}>
                Cancel
            </Button>

        </Animated.View>

    )
};

export default RightOverlay