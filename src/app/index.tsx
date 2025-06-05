import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { COLOR } from '@/src/constants/color';

const InitialLoadingScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
            <ActivityIndicator size="large" color={COLOR.PRIMARY} />
        </View>
    );
}

export default InitialLoadingScreen;