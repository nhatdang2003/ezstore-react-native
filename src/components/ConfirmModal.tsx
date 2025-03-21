import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';

interface ConfirmDialogProps {
    visible: boolean;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDialog = ({ visible, message, onCancel, onConfirm }: ConfirmDialogProps) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onCancel}
            statusBarTranslucent={true}
            hardwareAccelerated={true}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={styles.dialogContainer}>
                            <Text style={styles.message}>{message}</Text>
                            <View style={styles.separator} />
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onCancel}
                                >
                                    <Text style={styles.cancelButtonText}>Không</Text>
                                </TouchableOpacity>
                                <View style={styles.buttonSeparator} />
                                <TouchableOpacity
                                    style={[styles.button, styles.confirmButton]}
                                    onPress={onConfirm}
                                >
                                    <Text style={styles.confirmButtonText}>Đồng ý</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContainer: {
        width: Dimensions.get('window').width - 80,
        backgroundColor: 'white',
        borderRadius: 16,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    buttonContainer: {
        flexDirection: 'row',
        height: 50,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSeparator: {
        width: 1,
        backgroundColor: '#E5E5E5',
    },
    cancelButton: {
        borderBottomLeftRadius: 16,
    },
    confirmButton: {
        borderBottomRightRadius: 16,
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
    },
    confirmButtonText: {
        color: '#FF0000',
        fontSize: 16,
    },
});

export default ConfirmDialog;