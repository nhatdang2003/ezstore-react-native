import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    FlatList,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { CANCEL_REASONS } from '@/src/constants/order';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLOR } from '@/src/constants/color';
import { FONT } from '@/src/constants/font';

interface CancelOrderModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CancelOrderModal = ({ visible, onClose, onConfirm, isLoading }: CancelOrderModalProps) => {
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [otherReason, setOtherReason] = useState('');

    const handleConfirm = () => {
        if (selectedReason === 'Lý do khác' && otherReason.trim()) {
            onConfirm(otherReason.trim());
        } else if (selectedReason) {
            onConfirm(selectedReason);
        }
    };

    const canConfirm = () => {
        if (selectedReason === 'Lý do khác') {
            return otherReason.trim().length > 0;
        }
        return selectedReason !== null;
    };

    const renderReasonItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[
                styles.reasonItem,
                selectedReason === item && styles.selectedReasonItem
            ]}
            onPress={() => setSelectedReason(item)}
        >
            <View style={styles.reasonTextContainer}>
                <Text style={styles.reasonText}>{item}</Text>
            </View>
            {selectedReason === item && (
                <MaterialCommunityIcons name="check" size={20} color={COLOR.PRIMARY} />
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Hủy đơn hàng</Text>
                        <TouchableOpacity onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.subtitle}>Chọn lý do hủy đơn hàng</Text>

                        <FlatList
                            data={CANCEL_REASONS}
                            renderItem={renderReasonItem}
                            keyExtractor={(item) => item}
                            style={styles.reasonsList}
                        />

                        {selectedReason === 'Lý do khác' && (
                            <View style={styles.otherReasonContainer}>
                                <TextInput
                                    style={styles.otherReasonInput}
                                    placeholder="Nhập lý do của bạn..."
                                    value={otherReason}
                                    onChangeText={setOtherReason}
                                    multiline={true}
                                    maxLength={200}
                                />
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={styles.cancelButtonText}>Quay lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirmButton,
                                (!canConfirm() || isLoading) && styles.disabledButton
                            ]}
                            onPress={handleConfirm}
                            disabled={!canConfirm() || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.confirmButtonText}>Tiếp tục</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: SCREEN_HEIGHT * 0.8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    title: {
        fontSize: 18,
        fontFamily: FONT.LORA_MEDIUM,
        color: '#333',
    },
    content: {
        padding: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    reasonsList: {
        maxHeight: 300,
    },
    reasonItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    selectedReasonItem: {
        backgroundColor: '#F8F8F8',
    },
    reasonTextContainer: {
        flex: 1,
    },
    reasonText: {
        fontSize: 15,
        color: '#333',
    },
    otherReasonContainer: {
        marginTop: 16,
    },
    otherReasonInput: {
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        padding: 12,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        gap: 12,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
    },
    confirmButton: {
        backgroundColor: COLOR.PRIMARY,
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 14,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
});

export default CancelOrderModal; 