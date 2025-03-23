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

interface AlertDialogProps {
    visible: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

const AlertDialog = ({ visible, title, message, onClose }: AlertDialogProps) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent={true}
            hardwareAccelerated={true}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={styles.dialogContainer}>
                            {title && <Text style={styles.title}>{title}</Text>}
                            <Text style={styles.message}>{message}</Text>
                            <View style={styles.separator} />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonText}>Đồng ý</Text>
                            </TouchableOpacity>
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 20,
        paddingHorizontal: 16,
        color: '#333',
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
    button: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    buttonText: {
        color: '#FF0000',
        fontSize: 16,
        fontWeight: '400',
    },
});

export default AlertDialog;
