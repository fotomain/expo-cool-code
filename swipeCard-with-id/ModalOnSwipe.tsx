import {StyleSheet, View} from "react-native";
import {Button, Modal, useTheme} from "react-native-paper";

import TextMi from "@/mi/ui/screens/sendemail/TextMi";

const ModalOnSwipe = (props: any) => {
    const {
        visible, onDismiss, onPressYes, onPressCancel,
        buttonYesText,
        buttonCancelText,
        questionText
    } = props;

    const {colors} = useTheme();

    return (
        <Modal
            visible={visible}
            onDismiss={() => onDismiss()}
            contentContainerStyle={stylesModal.modal}
            style={{flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center"}}
        >
            <View testID={'modalWindow'} style={{width: 300}}>
                <TextMi t1 style={{marginBottom: 16}}>
                    {questionText}
                </TextMi>
                <View style={stylesModal.modalButtons}>
                    <Button onPress={() => {
                        onPressCancel()
                    }}>
                        {buttonCancelText}
                    </Button>
                    <Button
                        mode="contained"
                        // buttonColor="#b71c1c"
                        buttonColor={colors.error}
                        textColor={colors.onError}
                        onPress={onPressYes}
                    >
                        {buttonYesText}
                    </Button>
                </View>
            </View>
        </Modal>

    )
};

const stylesModal = StyleSheet.create({
    modal: {
        maxWidth: 360,
        backgroundColor: 'white',
        padding: 24,
        margin: 24,
        borderRadius: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },

});

export default ModalOnSwipe