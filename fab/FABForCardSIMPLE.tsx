import {View} from "react-native";
import {FAB, Text} from "react-native-paper";
import {stylesFab} from "@/mi/ui/posts/list/card/stylesFab";
import {useSelector} from "react-redux";

const FABForCardComponent = (props: any) => {

    const uxui = useSelector((state: any) => state.uxuiState);

    const {isOpen, setIsOpen} = props;

    return (
        <View style={stylesFab.fabContainer}>
            {isOpen && (
                <>
                    <View style={stylesFab.row}>
                        <Text style={stylesFab.labelStyle}>Share WatsApp</Text>
                        <FAB
                            size={uxui.fabForCardSize}
                            style={stylesFab.fab}

                            icon="email"
                            onPress={() => {
                                console.log("Email pressed");
                                setIsOpen(false)
                            }}
                        />
                    </View>
                    <FAB
                        size={uxui.fabForCardSize}
                        style={[stylesFab.fab, stylesFab.middleFab]}
                        small
                        icon="bell"
                        onPress={() => {
                            console.log("Bell pressed");
                            setIsOpen(false)
                        }}
                    />
                </>
            )}
            <FAB
                size={"small"}
                style={stylesFab.fab}
                icon={isOpen ? "close" : "plus"}
                onPress={() => setIsOpen(!isOpen)}
            />
        </View>
    )
};

export default FABForCardComponent