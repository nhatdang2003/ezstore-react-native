import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Modal,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Animated, { FadeInRight, FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DatePicker from '../../components/Datepicker';
import { COLOR } from '../../constants/color';
import { FONT } from '@/src/constants/font';

// Mock data với đơn vị VNĐ
const orderData = [
    { id: 'ĐH-7829', date: '2023-06-15', amount: 2989000, status: 'DELIVERED' },
    { id: 'ĐH-7830', date: '2023-06-18', amount: 2069000, status: 'SHIPPING' },
    { id: 'ĐH-7831', date: '2023-06-20', amount: 3439000, status: 'PENDING' },
    { id: 'ĐH-7832', date: '2023-06-22', amount: 1725000, status: 'DELIVERED' },
    { id: 'ĐH-7833', date: '2023-06-25', amount: 4599000, status: 'PROCESSING' },
    { id: 'ĐH-7834', date: '2023-06-27', amount: 1380000, status: 'SHIPPING' },
    { id: 'ĐH-7835', date: '2023-06-30', amount: 2989000, status: 'RETURNED' },
    { id: 'ĐH-7836', date: '2023-07-05', amount: 1890000, status: 'DELIVERED' },
    { id: 'ĐH-7837', date: '2023-07-12', amount: 3250000, status: 'DELIVERED' },
    { id: 'ĐH-7838', date: '2023-07-18', amount: 2450000, status: 'PROCESSING' },
    { id: 'ĐH-7839', date: '2023-07-25', amount: 1780000, status: 'PENDING' },
    { id: 'ĐH-7840', date: '2023-08-02', amount: 3600000, status: 'DELIVERED' },
    { id: 'ĐH-7841', date: '2023-08-10', amount: 2100000, status: 'SHIPPING' },
    { id: 'ĐH-7842', date: '2023-08-15', amount: 1950000, status: 'DELIVERED' },
];

const OrderStatistics = () => {
    const router = useRouter();
    const [activeStatusFilter, setActiveStatusFilter] = useState('Tất cả');
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [chartType, setChartType] = useState('month'); // 'month', 'status'

    // Set default date range to the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setDate(1);

    const [startDate, setStartDate] = useState(sixMonthsAgo);
    const [endDate, setEndDate] = useState(today);

    const statusFilters = ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Đang giao hàng', 'Đã giao hàng', 'Đã hoàn trả'];

    // Status colors with better contrasting colors
    const statusColors = {
        'PENDING': '#FFB800',     // Vàng đậm - Chờ xác nhận
        'PROCESSING': '#FF9500',  // Cam - Đang xử lý
        'SHIPPING': '#007AFF',    // Xanh dương - Đang giao hàng
        'DELIVERED': '#34C759',   // Xanh lá - Đã giao hàng
        'RETURNED': '#FF3B30',    // Đỏ - Đã hoàn trả
        'CANCELLED': '#8E8E93',   // Xám - Đã hủy
        'TOTAL': COLOR.PRIMARY,   // Đen - Tổng
    };

    // Filter orders by date range
    const filterOrdersByDateRange = () => {
        return orderData.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startDate && orderDate <= endDate;
        });
    };

    // Filter orders by status and date range
    const getFilteredOrders = () => {
        const dateFilteredOrders = filterOrdersByDateRange();

        if (activeStatusFilter === 'Tất cả') {
            return dateFilteredOrders;
        } else {
            return dateFilteredOrders.filter(
                order => getStatusText(order.status).toLowerCase() === activeStatusFilter.toLowerCase()
            );
        }
    };

    // Calculate statistics based on filtered orders
    const calculateStatistics = () => {
        const filteredOrders = getFilteredOrders();

        // Group by status and calculate totals - exclude RETURNED orders
        const stats = {
            'PENDING': { count: 0, amount: 0 },
            'PROCESSING': { count: 0, amount: 0 },
            'SHIPPING': { count: 0, amount: 0 },
            'DELIVERED': { count: 0, amount: 0 },
            'TOTAL': { count: 0, amount: 0 }
        };

        filteredOrders.forEach(order => {
            const status = order.status.toUpperCase();
            // Skip returned orders completely
            if (status === 'RETURNED') return;

            if (stats[status]) {
                stats[status].count += 1;
                stats[status].amount += order.amount;
            }

            // Add to total
            stats['TOTAL'].count += 1;
            stats['TOTAL'].amount += order.amount;
        });

        return [
            { id: 1, title: 'Chờ xác nhận', icon: 'clock-outline', count: stats['PENDING'].count, amount: stats['PENDING'].amount, color: statusColors['PENDING'] },
            { id: 2, title: 'Đang xử lý', icon: 'clipboard-text-outline', count: stats['PROCESSING'].count, amount: stats['PROCESSING'].amount, color: statusColors['PROCESSING'] },
            { id: 3, title: 'Đang giao hàng', icon: 'truck-delivery-outline', count: stats['SHIPPING'].count, amount: stats['SHIPPING'].amount, color: statusColors['SHIPPING'] },
            { id: 4, title: 'Đã giao hàng', icon: 'check-circle-outline', count: stats['DELIVERED'].count, amount: stats['DELIVERED'].amount, color: statusColors['DELIVERED'] },
            { id: 5, title: 'Tổng đơn hàng', icon: 'shopping-outline', count: stats['TOTAL'].count, amount: stats['TOTAL'].amount, color: statusColors['TOTAL'] },
        ];
    };

    // Generate chart data based on filtered orders
    const generateChartData = () => {
        const filteredOrders = filterOrdersByDateRange();

        // For monthly chart - Group orders by month and sum amounts
        const monthlyData = {};
        filteredOrders.forEach(order => {
            const orderDate = new Date(order.date);
            const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    amount: 0,
                    count: 0,
                    label: `${orderDate.getMonth() + 1}/${orderDate.getFullYear().toString().substr(2)}`
                };
            }
            // Only add amount for non-returned orders in the monthly chart
            if (order.status.toUpperCase() !== 'RETURNED') {
                monthlyData[monthKey].amount += order.amount;
            }
            monthlyData[monthKey].count += 1;
        });

        // Sort months chronologically
        const sortedMonthKeys = Object.keys(monthlyData).sort();
        const monthLabels = sortedMonthKeys.map(key => monthlyData[key].label);
        const monthAmounts = sortedMonthKeys.map(key => monthlyData[key].amount);
        const monthCounts = sortedMonthKeys.map(key => monthlyData[key].count);

        // For status data - Group by status
        const statusTotals = {
            'PENDING': 0,
            'PROCESSING': 0,
            'SHIPPING': 0,
            'DELIVERED': 0
        };

        filteredOrders.forEach(order => {
            const status = order.status.toUpperCase();
            // Skip returned orders
            if (status === 'RETURNED') return;
            if (statusTotals[status] !== undefined) {
                statusTotals[status] += order.amount;
            }
        });

        return {
            monthlyData: {
                labels: monthLabels,
                datasets: [
                    {
                        data: monthAmounts,
                        color: () => 'rgba(0, 0, 0, 0.8)', // solid black line
                        strokeWidth: 2
                    },
                ],
                legend: ["Chi tiêu tháng (VNĐ)"]
            },
            barData: {
                labels: ['Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao'],
                datasets: [
                    {
                        data: [
                            statusTotals['PENDING'] / 1000000 || 0,
                            statusTotals['PROCESSING'] / 1000000 || 0,
                            statusTotals['SHIPPING'] / 1000000 || 0,
                            statusTotals['DELIVERED'] / 1000000 || 0
                        ],
                        colors: [
                            () => statusColors['PENDING'],
                            () => statusColors['PROCESSING'],
                            () => statusColors['SHIPPING'],
                            () => statusColors['DELIVERED']
                        ]
                    }
                ],
                legend: ["Triệu đồng"]
            }
        };
    };

    const getStatusColor = (status) => {
        return statusColors[status.toUpperCase()] || COLOR.PRIMARY;
    };

    const getStatusText = (status) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'PROCESSING': return 'Đang xử lý';
            case 'SHIPPING': return 'Đang giao hàng';
            case 'DELIVERED': return 'Đã giao hàng';
            case 'RETURNED': return 'Đã hoàn trả';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    const getStatusShortText = (status) => {
        switch (status.toUpperCase()) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'PROCESSING': return 'Đang xử lý';
            case 'SHIPPING': return 'Đang giao';
            case 'DELIVERED': return 'Đã giao';
            case 'RETURNED': return 'Hoàn trả';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' });
    };

    const formattedDateRange = () => {
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return amount.toLocaleString('vi-VN');
    };

    // Calculate total spending for display in header
    const calculateTotalSpending = () => {
        const stats = calculateStatistics();
        const totalItem = stats.find(item => item.title === 'Tổng đơn hàng');
        return totalItem ? totalItem.amount : 0;
    };

    // Get current statistics and chart data
    const currentStats = calculateStatistics();
    const chartData = generateChartData();
    const totalSpending = calculateTotalSpending();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin đơn hàng</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Total spending card */}
                <View style={styles.totalSpendingCard}>
                    <View style={styles.totalSpendingHeader}>
                        <Text style={styles.totalSpendingTitle}>Tổng chi tiêu</Text>
                        <TouchableOpacity
                            style={styles.dateRangeButtonSmall}
                            onPress={() => setShowDateRangePicker(true)}
                        >
                            <Ionicons name="calendar-outline" size={16} color="#fff" />
                            <Text style={styles.dateRangeTextSmall}>{formattedDateRange()}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.totalSpendingAmount}>
                        {formatCurrency(totalSpending)}₫
                    </Text>

                    <Text style={styles.totalSpendingSubtitle}>
                        {currentStats[4].count} đơn hàng trong thời gian đã chọn
                    </Text>
                </View>

                {/* Hướng dẫn sử dụng */}
                <View style={styles.tipsContainer}>
                    <View style={styles.tipsHeader}>
                        <Ionicons name="bulb-outline" size={20} color="#FF9500" />
                        <Text style={styles.tipsTitle}>Mẹo sử dụng</Text>
                    </View>
                    <Text style={styles.tipsText}>• Chạm vào biểu tượng lịch để thay đổi khoảng thời gian</Text>
                    <Text style={styles.tipsText}>• Chuyển đổi giữa biểu đồ tháng và trạng thái để xem theo góc nhìn khác nhau</Text>
                    <Text style={styles.tipsText}>• Truy cập trang Đơn hàng để xem chi tiết từng đơn</Text>
                </View>

                {/* Order Summary Cards */}
                <Text style={styles.sectionTitle}>Tổng quan đơn hàng</Text>
                <FlatList
                    data={currentStats.filter(item => item.title !== 'Tổng đơn hàng')}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.summaryContainer}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <Animated.View
                            entering={FadeInRight.delay(index * 100).springify()}
                            style={[styles.summaryCard, { borderColor: `${item.color}40` }]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                                <MaterialCommunityIcons name={item.icon} size={24} color="#fff" />
                            </View>
                            <Text style={styles.summaryTitle}>{item.title}</Text>
                            <View style={styles.summaryDataRow}>
                                <Ionicons name="document-text-outline" size={16} color="#666" />
                                <Text style={styles.summaryCount}>{item.count} đơn</Text>
                            </View>
                            <View style={styles.summaryDataRow}>
                                <Ionicons name="wallet-outline" size={16} color="#666" />
                                <Text style={[styles.summaryAmount, { color: item.color }]}>
                                    {formatCurrency(item.amount)}₫
                                </Text>
                            </View>
                        </Animated.View>
                    )}
                />

                {/* Spending Chart Toggle */}
                <View style={styles.chartHeaderContainer}>
                    <Text style={styles.sectionTitle}>Biểu đồ chi tiêu</Text>
                    <View style={styles.chartToggleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.chartToggleButton,
                                chartType === 'month' && styles.chartToggleButtonActive
                            ]}
                            onPress={() => setChartType('month')}
                        >
                            <FontAwesome name="line-chart" size={16} color={chartType === 'month' ? 'white' : COLOR.PRIMARY} />
                            <Text style={[
                                styles.chartToggleText,
                                chartType === 'month' && styles.chartToggleTextActive
                            ]}>
                                Theo tháng
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.chartToggleButton,
                                chartType === 'status' && styles.chartToggleButtonActive
                            ]}
                            onPress={() => setChartType('status')}
                        >
                            <FontAwesome name="bar-chart" size={16} color={chartType === 'status' ? 'white' : COLOR.PRIMARY} />
                            <Text style={[
                                styles.chartToggleText,
                                chartType === 'status' && styles.chartToggleTextActive
                            ]}>
                                Theo trạng thái
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Spending Chart */}
                <Animated.View
                    entering={FadeIn.delay(300)}
                    style={styles.chartContainer}
                >
                    {chartType === 'month' ? (
                        // Line Chart - Monthly spending
                        chartData.monthlyData.labels.length > 0 ? (
                            <>
                                <View style={styles.chartExplanationContainer}>
                                    <MaterialCommunityIcons name="information-outline" size={18} color="#666" />
                                    <Text style={styles.chartExplanation}>
                                        Biểu đồ thể hiện tổng chi tiêu theo tháng
                                    </Text>
                                </View>
                                <LineChart
                                    data={chartData.monthlyData}
                                    width={Dimensions.get('window').width - 40}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: '#FFFFFF',
                                        backgroundGradientFrom: '#FFFFFF',
                                        backgroundGradientTo: '#FFFFFF',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(10, 10, 10, ${opacity})`,
                                        labelColor: (opacity = 1) => COLOR.TEXT,
                                        style: {
                                            borderRadius: 16,
                                        },
                                        propsForDots: {
                                            r: '5',
                                            strokeWidth: '2',
                                            stroke: COLOR.PRIMARY,
                                        },
                                        propsForBackgroundLines: {
                                            strokeDasharray: '', // Solid lines
                                            stroke: '#E0E0E0',
                                            strokeWidth: 1
                                        },
                                        formatYLabel: (value) => {
                                            const val = parseInt(value);
                                            if (val >= 1000000) return `${(val / 1000000).toFixed(0)}tr`;
                                            if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                                            return value;
                                        }
                                    }}
                                    bezier
                                    style={styles.chart}
                                    withVerticalLabels={true}
                                    withHorizontalLabels={true}
                                    withDots={true}
                                    withShadow={false}
                                    withInnerLines={true}
                                    withOuterLines={true}
                                    fromZero={true}
                                    segments={4}
                                />
                            </>
                        ) : (
                            <View style={styles.noDataContainer}>
                                <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
                                <Text style={styles.noDataText}>Không có dữ liệu trong khoảng thời gian này</Text>
                            </View>
                        )
                    ) : (
                        // Bar Chart - Spending by status
                        <>
                            <View style={styles.chartExplanationContainer}>
                                <MaterialCommunityIcons name="information-outline" size={18} color="#666" />
                                <Text style={styles.chartExplanation}>
                                    Chi tiêu theo trạng thái đơn hàng (đơn vị: triệu đồng)
                                </Text>
                            </View>

                            {/* Bar chart legend for better readability */}
                            <View style={styles.barChartLegendContainer}>
                                {['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED'].map((status, index) => (
                                    <View key={status} style={styles.barChartLegendItem}>
                                        <View style={[styles.barChartLegendColor, { backgroundColor: statusColors[status] }]} />
                                        <Text style={styles.barChartLegendText}>
                                            {index + 1}. {getStatusShortText(status)}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <BarChart
                                data={{
                                    labels: ['1', '2', '3', '4'], // Numbered to save space
                                    datasets: chartData.barData.datasets
                                }}
                                width={Dimensions.get('window').width - 40}
                                height={220}
                                yAxisLabel=""
                                yAxisSuffix=" tr"
                                chartConfig={{
                                    backgroundColor: '#FFFFFF',
                                    backgroundGradientFrom: '#FFFFFF',
                                    backgroundGradientTo: '#FFFFFF',
                                    decimalPlaces: 1,
                                    color: (opacity = 1, index) => {
                                        const statuses = ['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED'];
                                        return index !== undefined ?
                                            statusColors[statuses[index]] :
                                            `rgba(10, 10, 10, ${opacity})`;
                                    },
                                    labelColor: (opacity = 1) => COLOR.TEXT,
                                    style: {
                                        borderRadius: 16,
                                    },
                                    barPercentage: 0.7,
                                    propsForBackgroundLines: {
                                        strokeDasharray: '', // Solid lines
                                        stroke: '#E0E0E0',
                                        strokeWidth: 1
                                    }
                                }}
                                style={styles.chart}
                                showValuesOnTopOfBars={true}
                                fromZero={true}
                                withInnerLines={true}
                                segments={4}
                            />
                        </>
                    )}
                </Animated.View>

                {/* Date Range Picker Modal */}
                <Modal
                    visible={showDateRangePicker}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowDateRangePicker(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Chọn khoảng thời gian</Text>
                                <TouchableOpacity onPress={() => setShowDateRangePicker(false)}>
                                    <Ionicons name="close" size={24} color={COLOR.PRIMARY} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.datePickersContainer}>
                                <View style={styles.datePickerWrapper}>
                                    <Text style={styles.datePickerLabel}>Từ ngày</Text>
                                    <DatePicker
                                        value={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        maximumDate={endDate}
                                        iconColor={COLOR.PRIMARY}
                                    />
                                </View>

                                <View style={styles.datePickerWrapper}>
                                    <Text style={styles.datePickerLabel}>Đến ngày</Text>
                                    <DatePicker
                                        value={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        minimumDate={startDate}
                                        maximumDate={new Date()}
                                        iconColor={COLOR.PRIMARY}
                                    />
                                </View>
                            </View>

                            <View style={styles.dateRangePresets}>
                                <Text style={styles.presetsTitle}>Khoảng thời gian nhanh</Text>
                                <View style={styles.presetsGrid}>
                                    <TouchableOpacity
                                        style={styles.presetButton}
                                        onPress={() => {
                                            const today = new Date();
                                            setStartDate(today);
                                            setEndDate(today);
                                        }}
                                    >
                                        <Text style={styles.presetText}>Hôm nay</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.presetButton}
                                        onPress={() => {
                                            const today = new Date();
                                            const lastWeek = new Date(today);
                                            lastWeek.setDate(today.getDate() - 6);
                                            setStartDate(lastWeek);
                                            setEndDate(today);
                                        }}
                                    >
                                        <Text style={styles.presetText}>7 ngày qua</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.presetButton}
                                        onPress={() => {
                                            const today = new Date();
                                            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                                            setStartDate(firstDay);
                                            setEndDate(today);
                                        }}
                                    >
                                        <Text style={styles.presetText}>Tháng này</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.presetButton}
                                        onPress={() => {
                                            const today = new Date();
                                            const sixMonths = new Date(today);
                                            sixMonths.setMonth(today.getMonth() - 6);
                                            setStartDate(sixMonths);
                                            setEndDate(today);
                                        }}
                                    >
                                        <Text style={styles.presetText}>6 tháng qua</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={() => setShowDateRangePicker(false)}
                            >
                                <Text style={styles.applyButtonText}>Áp dụng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 30,
    },
    header: {
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontFamily: FONT.LORA_MEDIUM,
        fontSize: 18,
    },
    placeholder: {
        width: 24,
    },
    totalSpendingCard: {
        backgroundColor: COLOR.PRIMARY,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 6,
    },
    totalSpendingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    totalSpendingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    totalSpendingAmount: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    totalSpendingSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    tipsContainer: {
        marginTop: 8,
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#FFFAF0',
        borderLeftWidth: 3,
        borderLeftColor: '#FF9500',
    },
    tipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF9500',
        marginLeft: 8,
    },
    tipsText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    dateRangeButtonSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    dateRangeTextSmall: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 4,
    },
    dateRangeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: COLOR.BACKGROUND,
    },
    dateRangeText: {
        flex: 1,
        fontSize: 14,
        color: COLOR.PRIMARY,
        fontWeight: '500',
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: COLOR.TEXT,
    },
    summaryContainer: {
        marginBottom: 24,
    },
    summaryCard: {
        width: 140,
        padding: 12,
        marginRight: 12,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: COLOR.TEXT,
    },
    summaryDataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    summaryCount: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
        color: COLOR.TEXT,
    },
    summaryAmount: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    chartHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chartToggleContainer: {
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLOR.PRIMARY,
        marginBottom: 16
    },
    chartToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
    },
    chartToggleButtonActive: {
        backgroundColor: COLOR.PRIMARY,
    },
    chartToggleText: {
        fontSize: 12,
        color: COLOR.PRIMARY,
        marginLeft: 4,
    },
    chartToggleTextActive: {
        color: '#FFFFFF',
    },
    chartContainer: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    chartExplanationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 8,
        paddingVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: COLOR.PRIMARY,
    },
    chartExplanation: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    barChartLegendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    barChartLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        marginBottom: 8,
        width: '45%',
    },
    barChartLegendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    barChartLegendText: {
        fontSize: 12,
        color: '#666',
    },
    statusBreakdownContainer: {
        marginTop: 16,
    },
    statusBreakdownItem: {
        marginBottom: 12,
    },
    statusBreakdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusBreakdownTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLOR.TEXT,
    },
    statusBreakdownAmount: {
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.TEXT,
    },
    datePickersContainer: {
        marginBottom: 20,
    },
    datePickerWrapper: {
        marginBottom: 16,
    },
    datePickerLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: COLOR.TEXT,
    },
    dateRangePresets: {
        marginBottom: 20,
    },
    presetsTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
        color: COLOR.TEXT,
    },
    presetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    presetButton: {
        width: '48%',
        backgroundColor: COLOR.BACKGROUND,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    presetText: {
        fontSize: 14,
        color: COLOR.TEXT,
    },
    applyButton: {
        backgroundColor: COLOR.PRIMARY,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    noDataText: {
        fontSize: 14,
        color: '#999',
        marginTop: 12,
        textAlign: 'center',
    },
})

export default OrderStatistics;
