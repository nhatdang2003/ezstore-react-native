import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import Input from '@/src/components/Input'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomButton from '@/src/components/CustomButton';
import { COLOR } from '@/src/constants/color';
import Checkbox from '@/src/components/Checkbox';
import DatePicker from '../components/Datepicker';
import Select from '../components/Select';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


const WelcomeScreen = () => {
    const [input, setInput] = useState({
        email: '',
        password: '',
        remember: false
    })
    const [date, setDate] = useState(new Date())
    const [selectedValue, setSelectedValue] = useState('');

    const options = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
    ];
    console.log(selectedValue)
    console.log(date)

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <Input onChangeText={(text) => setInput({ ...input, email: text })} value={input.email} placeholder='Email'
                leftIcon={<MaterialCommunityIcons name="email-outline" size={24} color="black" />}
            />
            <Input onChangeText={(text) => setInput({ ...input, password: text })} value={input.password} placeholder='Mật khẩu'
                leftIcon={<MaterialCommunityIcons name="lock-outline" size={24} color="black" />}
                type='password'
            />
            <CustomButton onPress={() => alert('hello')} title='Đăng nhập' variant='filled'
                style={{ backgroundColor: COLOR.PRIMARY }}
            />
            <View style={{ flexDirection: 'row', gap: 6 }}>
                <CustomButton style={{ flex: 1 }} variant='outlined'
                    onPress={() => { alert('gg') }}>
                    <MaterialCommunityIcons name="lock-outline" size={24} color="black" />
                </CustomButton>
                <CustomButton style={{ flex: 1 }} variant='outlined'
                    onPress={() => { alert('gg') }}>
                    <MaterialCommunityIcons name="lock-outline" size={24} color="black" />
                </CustomButton>
            </View>

            <Checkbox checked={input.remember} onCheck={(checked) => setInput({ ...input, remember: checked })}
                label='Ghi nhớ mật khẩu' />

            <DatePicker
                value={date}
                onChange={setDate}
            />

            <Select
                value={selectedValue}
                onChange={setSelectedValue}
                options={options}
                icon={<FontAwesome6 name="person" size={24} color="black" />}
                label="Select Option"
            />
        </View>
    )
}

export default WelcomeScreen