import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import CustomButton from '@/src/components/CustomButton'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const width = Dimensions.get('window').width

const ButtonSort = ({ sort, setSort, open, setOpen }
    : { sort: string, setSort: (sort: string) => void, open: boolean, setOpen: (open: boolean) => void }) => {

    const handleSort = (value: string) => {
        setSort(value)
        setOpen(false)
    }

    return (
        <>
            <CustomButton
                title='Sắp xếp'
                variant='ghost'
                leftIcon={<MaterialCommunityIcons name='sort' size={24} color='black' />}
                textStyle={{ color: 'black' }}
                style={{ flex: 1 }}
                onPress={() => setOpen(!open)}
            />
            {open && (
                <View style={styles.dropdown}>
                    <TouchableOpacity style={styles.option} onPress={() => handleSort('price-asc')}>
                        <Text style={{ fontWeight: sort === 'price-asc' ? 'bold' : 'normal' }}>
                            Giá: Thấp đến cao
                        </Text>
                        {sort === 'price-asc' &&
                            <MaterialCommunityIcons name='check' size={16} color='black' />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => handleSort('price-desc')}>
                        <Text style={{ fontWeight: sort === 'price-desc' ? 'bold' : 'normal' }}>
                            Giá: Cao đến thấp
                        </Text>
                        {sort === 'price-desc' && <MaterialCommunityIcons name='check' size={16} color='black' />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => handleSort('newest')}>
                        <Text style={{ fontWeight: sort === 'newest' ? 'bold' : 'normal' }}>
                            Mới nhất
                        </Text>
                        {sort === 'newest' && <MaterialCommunityIcons name='check' size={16} color='black' />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => handleSort('popular')}>
                        <Text style={{ fontWeight: sort === 'popular' ? 'bold' : 'normal' }}>
                            Phổ biến nhất
                        </Text>
                        {sort === 'popular' && <MaterialCommunityIcons name='check' size={16} color='black' />}
                    </TouchableOpacity>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        top: '101%',
        left: 0,
        backgroundColor: 'white',
        borderRadius: 8,
        width: width,
        zIndex: 1000
    },
    option: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E3E5E5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

export default ButtonSort