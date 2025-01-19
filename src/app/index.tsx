import { View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import Input from '@/src/components/Input'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomButton from '@/src/components/CustomButton';
import { COLOR } from '@/src/constants/color';
import Checkbox from '@/src/components/Checkbox';

const WelcomeScreen = () => {
    const router = useRouter()
    const [input, setInput] = useState({
        email: '',
        password: '',
        remember: false
    })

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
        </View>
    )
}

export default WelcomeScreen