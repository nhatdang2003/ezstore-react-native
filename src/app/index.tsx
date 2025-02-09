import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import Input from '@/src/components/Input'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomButton from '@/src/components/CustomButton';
import { COLOR } from '@/src/constants/color';
import Checkbox from '@/src/components/Checkbox';
import DatePicker from '@/src/components/Datepicker';
import Select from '@/src/components/Select';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import OtpInput from '@/src/components/OtpInput';
import ProductCard from '@/src/components/ProductCard';
import Grid from '@/src/components/SectionHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionHeader from '@/src/components/SectionHeader';
import CategoryCarousel from '@/src/components/CategoryCarousel';
import HomeCarousel from '../components/HomeCarousel';
import CategoryCard from '@/src/components/CategoryCard';
const data = [
    {
        id: '1',
        image: 'https://via.placeholder.com/150',
        title: 'Product 1',
        price: 100,
        rating: 4.5,
        priceDiscount: 2000000,
    },
    {
        id: '2',
        image: 'https://via.placeholder.com/150',
        title: 'Product 2',
        price: 100,
        rating: 4.5,
        priceDiscount: 2000000,
    },
    {
        id: '3',
        image: 'https://via.placeholder.com/150',
        title: 'Product 3',
        price: 100,
        rating: 4.5,
        priceDiscount: 2000000,
    },
    {
        id: '4',
        image: 'https://via.placeholder.com/150',
        title: 'Product 4',
        price: 100,
        rating: 4.5,
        priceDiscount: 2000000,
    },
]

interface Category {
    id: string;
    title: string;
    image: string;
}

const categories: Category[] = [
    {
        id: '1',
        title: 'Quần jean',
        image: 'https://path-to-your-image/jean.jpg'
    },
    {
        id: '2',
        title: 'Chân váy',
        image: 'https://path-to-your-image/dress.jpg'
    },
    {
        id: '3',
        title: 'Áo sơ mi & Áo kiểu',
        image: 'https://path-to-your-image/shirt.jpg'
    },
    {
        id: '4',
        title: 'Áo sơ mi & Áo kiểu',
        image: 'https://path-to-your-image/shirt.jpg'
    },
    {
        id: '5',
        title: 'Áo sơ mi & Áo kiểu',
        image: 'https://path-to-your-image/shirt.jpg'
    },
    {
        id: '6',
        title: 'Áo sơ mi & Áo kiểu',
        image: 'https://path-to-your-image/shirt.jpg'
    },
];

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

    const [otp, setOtp] = useState('')
    console.log(selectedValue)
    console.log(date)
    console.log(otp)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
                <HomeCarousel />
                <CategoryCarousel />
                <SectionHeader title='Featured' onViewAll={() => { }} data={data} />
                <View style={{ height: 300 }} />
                <CategoryCard id='1' image='https://via.placeholder.com/150' title='Product 1' />
            </ScrollView>
        </SafeAreaView>

    )
}

export default WelcomeScreen