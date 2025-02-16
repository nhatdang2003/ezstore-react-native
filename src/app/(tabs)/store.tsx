import { View, Text, StyleSheet, TouchableWithoutFeedback, Pressable } from 'react-native'
import React from 'react'
import ButtonFilter from '@/src/components/ButtonFilter'
import ButtonSort from '@/src/components/ButtonSort'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const StoreScreen = () => {
    const [open, setOpen] = useState(false)
    const [sort, setSort] = useState('price-asc')
    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setOpen(false)
        })

        return unsubscribe
    }, [navigation])

    return (
        <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)}>
            {open && (
                <TouchableWithoutFeedback onPress={() => setOpen(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <ButtonFilter />
                    <View style={styles.divider} />
                    <ButtonSort sort={sort} setSort={setSort} open={open} setOpen={setOpen} />
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
        backgroundColor: 'white'
    },
    filterContainer: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E3E5E5',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E3E5E5'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
})

export default StoreScreen