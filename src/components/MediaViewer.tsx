import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Modal,
    Dimensions,
    FlatList
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface MediaItem {
    type: 'image' | 'video';
    url: string;
}

interface MediaViewerProps {
    mediaItems: MediaItem[];
    onRemove?: (index: number) => void;
    editable?: boolean;
}

const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    // Check if URL is not empty and is a valid URL string
    return url.trim().length > 0 && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://'));
};

const MediaViewer = ({ mediaItems, onRemove, editable = false }: MediaViewerProps) => {
    // Filter out invalid media items
    const validMediaItems = useMemo(() => {
        return mediaItems?.filter(item => isValidUrl(item.url)) || [];
    }, [mediaItems]);

    const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

    // Don't render anything if there are no valid media items
    if (validMediaItems.length === 0) {
        return null;
    }

    const renderMediaItem = ({ item }: { item: MediaItem }) => (
        <View style={styles.fullScreenMediaContainer}>
            {item.type === 'video' ? (
                <Video
                    source={{ uri: item.url }}
                    style={styles.fullScreenVideo}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={false}
                />
            ) : (
                <Image
                    source={{ uri: item.url }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                />
            )}
        </View>
    );

    return (
        <>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.mediaScroll}
            >
                {validMediaItems.map((item, index) => (
                    <TouchableOpacity
                        key={`media-${index}`}
                        onPress={() => setSelectedMediaIndex(index)}
                    >
                        <View style={styles.mediaPreviewContainer}>
                            {item.type === 'video' ? (
                                <Video
                                    source={{ uri: item.url }}
                                    style={styles.mediaPreview}
                                    useNativeControls
                                    resizeMode={ResizeMode.COVER}
                                    shouldPlay={false}
                                />
                            ) : (
                                <Image
                                    source={{ uri: item.url }}
                                    style={styles.mediaPreview}
                                />
                            )}
                            {editable && onRemove && (
                                <TouchableOpacity
                                    style={styles.removeMediaButton}
                                    onPress={() => onRemove(index)}
                                >
                                    <Ionicons name="close-circle" size={24} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal
                visible={selectedMediaIndex !== null}
                transparent={true}
                onRequestClose={() => setSelectedMediaIndex(null)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedMediaIndex(null)}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    <View style={styles.mediaCountContainer}>
                        <Text style={styles.mediaCountText}>
                            {selectedMediaIndex !== null ? `${selectedMediaIndex + 1}/${validMediaItems.length}` : ''}
                        </Text>
                    </View>

                    <FlatList
                        data={validMediaItems}
                        renderItem={renderMediaItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={selectedMediaIndex || 0}
                        getItemLayout={(data, index) => ({
                            length: screenWidth,
                            offset: screenWidth * index,
                            index,
                        })}
                        onScroll={e => {
                            const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                            setSelectedMediaIndex(newIndex);
                        }}
                        scrollEventThrottle={16}
                    />
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    mediaScroll: {
        flexGrow: 0,
    },
    mediaPreviewContainer: {
        marginRight: 8,
        position: 'relative',
    },
    mediaPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    removeMediaButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    fullScreenMediaContainer: {
        width: screenWidth,
        height: screenHeight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: screenWidth,
        height: screenHeight,
    },
    fullScreenVideo: {
        width: screenWidth,
        height: screenWidth * (9/16), // 16:9 aspect ratio
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        padding: 10,
    },
    mediaCountContainer: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
        padding: 10,
    },
    mediaCountText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MediaViewer; 