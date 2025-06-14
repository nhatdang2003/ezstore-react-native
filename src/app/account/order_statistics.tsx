import React, { useState, useEffect } from 'react';
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
    ActivityIndicator,
} from 'react-native';
import Animated, { FadeInRight, FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DatePicker from '../../components/Datepicker';
import { COLOR } from '../../constants/color';
import { FONT } from '@/src/constants/font';
import { getUserOrderStatistics, getUserOrderMonthlyChart, getUserOrderStatusChart, getOrderHistoryStatisticUser } from '@/src/services/order.service';
import {
    OrderStatisticsSummaryRequest,
    OrderStatisticsSummaryResponse,
    MonthlySpendingChartResponse,
    StatusSpendingChartResponse,
    OrderHistory,
} from '@/src/types/order.type';

// Simple Bar Chart Component
const SimpleBarChart = ({ data, maxValue }: { data: any[], maxValue: number }) => {
    return (
        <View style={styles.simpleChart}>
            <View style={styles.chartArea}>
                {data.map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                        <Text style={styles.barValue}>{item.value.toFixed(1)}M</Text>
                        <View 
                            style={[
                                styles.bar, 
                                { 
                                    height: (item.value / maxValue) * 150,
                                    backgroundColor: item.frontColor 
                                }
                            ]} 
                        />
                        <Text style={styles.barLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Simple Line Chart Component
const SimpleLineChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const width = Dimensions.get('window').width - 100;
    const chartHeight = 120;

    const formatChartDate = (label: string) => {
        const [month, day] = label.split('/');
        return `${day}/${month}`;
    };
    
    return (
        <View style={styles.simpleChart}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[styles.lineChartContainer, { width: Math.max(width, data.length * 60) }]}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.linePointContainer}>
                            <Text style={styles.lineValue}>
                                {(item.value / 1000000).toFixed(1)}M
                            </Text>
                            <View 
                                style={[
                                    styles.lineBar,
                                    { 
                                        height: (item.value / maxValue) * chartHeight,
                                    }
                                ]}
                            />
                            <Text style={styles.lineLabel}>{formatChartDate(item.label)}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const OrderStatistics = () => {
    const router = useRouter();
    const [showDateRangePicker, setShowDateRangePicker] = useState(false);
    const [chartType, setChartType] = useState('month'); // 'month', 'status'
    const [loading, setLoading] = useState(false);
    const [chartLoading, setChartLoading] = useState(false);
    const [statistics, setStatistics] = useState<OrderStatisticsSummaryResponse | null>(null);
    const [monthlyChartData, setMonthlyChartData] = useState<MonthlySpendingChartResponse | null>(null);
    const [statusChartData, setStatusChartData] = useState<StatusSpendingChartResponse | null>(null);

    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [orders, setOrders] = useState<OrderHistory[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersPage, setOrdersPage] = useState(0);
    const [hasMoreOrders, setHasMoreOrders] = useState(true);
    const ORDERS_PAGE_SIZE = 100;

    // Set default date range to the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const [startDate, setStartDate] = useState(sixMonthsAgo);
    const [endDate, setEndDate] = useState(today);

    // Status colors
    const statusColors = {
        'PENDING': '#FFB800',     // Vàng đậm - Chờ xác nhận
        'PROCESSING': '#FF9500',  // Cam - Đang xử lý
        'SHIPPING': '#007AFF',    // Xanh dương - Đang giao hàng
        'DELIVERED': '#34C759',   // Xanh lá - Đã giao hàng
        'RETURNED': '#FF3B30',    // Đỏ - Đã hoàn trả
        'CANCELLED': '#8E8E93',   // Xám - Đã hủy
        'TOTAL': COLOR.PRIMARY,   // Đen - Tổng
    };

    // Format date for API request
    const formatDateForAPI = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    // Fetch statistics from API
    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setChartLoading(true);

            const request: OrderStatisticsSummaryRequest = {
                startDate: formatDateForAPI(startDate),
                endDate: formatDateForAPI(endDate)
            };

            // Fetch all data in parallel
            const [statsResponse, monthlyResponse, statusResponse] = await Promise.all([
                getUserOrderStatistics(request),
                getUserOrderMonthlyChart(request),
                getUserOrderStatusChart(request)
            ]);

            setStatistics(statsResponse.data || null);
            setMonthlyChartData(monthlyResponse.data || null);
            setStatusChartData(statusResponse.data || null);
        } catch (error) {
            console.error('Error fetching order statistics:', error);
        } finally {
            setLoading(false);
            setChartLoading(false);
        }
    };

    // Replace fetchOrders function with the new implementation using getOrderHistoryStatisticUser
    const fetchOrders = async (refresh = true) => {
        try {
            setOrdersLoading(true);
            const pageToFetch = refresh ? 0 : ordersPage;

            // Use getOrderHistoryStatisticUser instead of getUserOrders
            const response = await getOrderHistoryStatisticUser({
                page: pageToFetch,
                size: ORDERS_PAGE_SIZE,
                status: selectedStatus,
                startDate: formatDateForAPI(startDate),
                endDate: formatDateForAPI(endDate)
            });

            if (response.data) {
                if (refresh) {
                    setOrders(response.data.data || []);
                    setOrdersPage(0);
                } else {
                    setOrders([...orders, ...(response.data.data || [])]);
                    setOrdersPage(pageToFetch + 1);
                }

                const totalPages = response.data.meta?.pages || 1;
                const currentPageNumber = response.data.meta?.page || 0;
                setHasMoreOrders(currentPageNumber < totalPages - 1);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setOrdersLoading(false);
        }
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchStatistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Add this effect
    useEffect(() => {
        if (startDate && endDate) {
            fetchOrders();
        }
    }, [selectedStatus, startDate, endDate]);

    // Calculate statistics for cards
    const calculateStatistics = () => {
        if (!statistics) {
            return [
                { id: 1, title: 'Chờ xác nhận', icon: 'clock-outline', count: 0, amount: 0, color: statusColors['PENDING'] },
                { id: 2, title: 'Đang xử lý', icon: 'clipboard-text-outline', count: 0, amount: 0, color: statusColors['PROCESSING'] },
                { id: 3, title: 'Đang giao hàng', icon: 'truck-delivery-outline', count: 0, amount: 0, color: statusColors['SHIPPING'] },
                { id: 4, title: 'Đã giao hàng', icon: 'check-circle-outline', count: 0, amount: 0, color: statusColors['DELIVERED'] },
                { id: 5, title: 'Tổng đơn hàng', icon: 'shopping-outline', count: 0, amount: 0, color: statusColors['TOTAL'] },
            ];
        }

        return [
            {
                id: 1,
                title: 'Chờ xác nhận',
                icon: 'clock-outline',
                count: statistics.statusBreakdown.pending.count,
                amount: statistics.statusBreakdown.pending.amount,
                color: statusColors['PENDING']
            },
            {
                id: 2,
                title: 'Đang xử lý',
                icon: 'clipboard-text-outline',
                count: statistics.statusBreakdown.processing.count,
                amount: statistics.statusBreakdown.processing.amount,
                color: statusColors['PROCESSING']
            },
            {
                id: 3,
                title: 'Đang giao hàng',
                icon: 'truck-delivery-outline',
                count: statistics.statusBreakdown.shipping.count,
                amount: statistics.statusBreakdown.shipping.amount,
                color: statusColors['SHIPPING']
            },
            {
                id: 4,
                title: 'Đã giao hàng',
                icon: 'check-circle-outline',
                count: statistics.statusBreakdown.delivered.count,
                amount: statistics.statusBreakdown.delivered.amount,
                color: statusColors['DELIVERED']
            },
            {
                id: 5,
                title: 'Tổng đơn hàng',
                icon: 'shopping-outline',
                count: statistics?.totalOrderCount || 0,
                amount: statistics?.totalAmount || 0,
                color: statusColors['TOTAL']
            },
        ];
    };

    // Generate chart data based on API response
    const generateChartData = () => {
        return {
            monthlyData: monthlyChartData && monthlyChartData.labels && monthlyChartData.values ? 
                monthlyChartData.labels.map((label, index) => ({
                    value: monthlyChartData.values[index] || 0,
                    label: label,
                    dataPointText: `${(monthlyChartData.values[index] || 0).toLocaleString('vi-VN')}₫`
                })) : [],
            barData: statusChartData ? [
                {
                    value: (statusChartData.pending || 0) / 1000000,
                    label: 'Chờ xác nhận',
                    frontColor: statusColors['PENDING'],
                    topLabelComponent: () => (
                        <Text style={{ fontSize: 10, textAlign: 'center' }}>
                            {((statusChartData.pending || 0) / 1000000).toFixed(1)}M
                        </Text>
                    )
                },
                {
                    value: (statusChartData.processing || 0) / 1000000,
                    label: 'Đang xử lý',
                    frontColor: statusColors['PROCESSING'],
                    topLabelComponent: () => (
                        <Text style={{ fontSize: 10, textAlign: 'center' }}>
                            {((statusChartData.processing || 0) / 1000000).toFixed(1)}M
                        </Text>
                    )
                },
                {
                    value: (statusChartData.shipping || 0) / 1000000,
                    label: 'Đang giao',
                    frontColor: statusColors['SHIPPING'],
                    topLabelComponent: () => (
                        <Text style={{ fontSize: 10, textAlign: 'center' }}>
                            {((statusChartData.shipping || 0) / 1000000).toFixed(1)}M
                        </Text>
                    )
                },
                {
                    value: (statusChartData.delivered || 0) / 1000000,
                    label: 'Đã giao',
                    frontColor: statusColors['DELIVERED'],
                    topLabelComponent: () => (
                        <Text style={{ fontSize: 10, textAlign: 'center' }}>
                            {((statusChartData.delivered || 0) / 1000000).toFixed(1)}M
                        </Text>
                    )
                }
            ] : []
        };
    };

    // Text helper functions
    const getStatusText = (status: string) => {
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

    const getStatusShortText = (status: string) => {
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

    const formatDate = (dateString: Date | string) => {
        const date = new Date(dateString);
        return date?.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' });
    };

    const formattedDateRange = () => {
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const formatCurrency = (amount: number) => {
        return amount?.toLocaleString('vi-VN');
    };

    // Get calculated values
    const currentStats = calculateStatistics();
    const chartData = generateChartData();
    const totalSpending = statistics?.totalAmount || 0;

    // Handle date range change and apply
    const handleApplyDateRange = () => {
        setShowDateRangePicker(false);
        fetchStatistics();
    };

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
                <Text style={styles.headerTitle}>Thống kê chi tiêu</Text>
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

                    {loading ? (
                        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
                    ) : (
                        <>
                            <Text style={styles.totalSpendingAmount}>
                                {formatCurrency(totalSpending)}₫
                            </Text>

                            <Text style={styles.totalSpendingSubtitle}>
                                {statistics?.totalOrderCount || 0} đơn hàng trong thời gian đã chọn
                            </Text>
                        </>
                    )}
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
                {loading ? (
                    <ActivityIndicator size="large" color={COLOR.PRIMARY} style={styles.contentLoader} />
                ) : (
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
                                    <MaterialCommunityIcons name={item.icon as any} size={24} color="#fff" />
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
                )}

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
                    {chartLoading ? (
                        <ActivityIndicator size="large" color={COLOR.PRIMARY} style={styles.contentLoader} />
                    ) : !monthlyChartData && !statusChartData ? (
                        <View style={styles.noDataContainer}>
                            <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
                            <Text style={styles.noDataText}>Không có dữ liệu biểu đồ cho khoảng thời gian đã chọn</Text>
                        </View>
                    ) : chartType === 'month' ? (
                        <>
                            <View style={styles.chartExplanationContainer}>
                                <Ionicons name="information-circle-outline" size={20} color={COLOR.PRIMARY} />
                                <Text style={styles.chartExplanation}>
                                    Biểu đồ thể hiện tổng chi tiêu theo từng tháng trong khoảng thời gian đã chọn
                                </Text>
                            </View>
                            {monthlyChartData && monthlyChartData.labels && monthlyChartData.labels.length > 0 ? (
                                <SimpleLineChart data={chartData.monthlyData} />
                            ) : (
                                <View style={styles.noDataContainer}>
                                    <Text style={styles.noDataText}>Không có dữ liệu cho khoảng thời gian đã chọn</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <>
                            <View style={styles.chartExplanationContainer}>
                                <Ionicons name="information-circle-outline" size={20} color={COLOR.PRIMARY} />
                                <Text style={styles.chartExplanation}>
                                    Biểu đồ thể hiện tổng chi tiêu theo trạng thái đơn hàng (triệu đồng)
                                </Text>
                            </View>
                            {statusChartData ? (
                                <SimpleBarChart 
                                    data={chartData.barData} 
                                    maxValue={Math.max(...chartData.barData.map(item => item.value))} 
                                />
                            ) : (
                                <View style={styles.noDataContainer}>
                                    <Text style={styles.noDataText}>Không có dữ liệu cho khoảng thời gian đã chọn</Text>
                                </View>
                            )}
                        </>
                    )}
                </Animated.View>

                {/* Orders Section */}
                <Text style={styles.sectionTitle}>Danh sách đơn hàng</Text>

                {/* Status Filter */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.statusFilterScrollView}
                    contentContainerStyle={styles.statusFilterContainer}>

                    <TouchableOpacity
                        style={[
                            styles.statusFilter,
                            selectedStatus === null && styles.statusFilterActive
                        ]}
                        onPress={() => setSelectedStatus(null)}>
                        <Text style={[
                            styles.statusFilterText,
                            selectedStatus === null && styles.statusFilterTextActive
                        ]}>Tất cả</Text>
                    </TouchableOpacity>

                    {['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'RETURNED', 'CANCELLED'].map(status => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.statusFilter,
                                selectedStatus === status && styles.statusFilterActive,
                                { borderColor: statusColors[status as keyof typeof statusColors] }
                            ]}
                            onPress={() => setSelectedStatus(status === selectedStatus ? null : status)}>
                            <Text style={[
                                styles.statusFilterText,
                                selectedStatus === status && styles.statusFilterTextActive,
                                { color: selectedStatus === status ? '#fff' : statusColors[status as keyof typeof statusColors] }
                            ]}>
                                {getStatusText(status)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.orderListContainer}>
                    {ordersLoading && ordersPage === 0 ? (
                        <ActivityIndicator size="large" color={COLOR.PRIMARY} style={styles.contentLoader} />
                    ) : orders.length === 0 ? (
                        <View style={styles.noDataContainer}>
                            <Ionicons name="receipt-outline" size={48} color="#ccc" />
                            <Text style={styles.noDataText}>Không có đơn hàng nào trong khoảng thời gian đã chọn</Text>
                        </View>
                    ) : (
                        <>
                            {orders.map((order, index) => (
                                <TouchableOpacity
                                    key={order.id}
                                    style={styles.orderItem}
                                    onPress={() => router.navigate({
                                        pathname: "/account/order_details",
                                        params: { orderId: order.id }
                                    })}>
                                    <View style={styles.orderTopSection}>
                                        <View style={styles.orderNumberContainer}>
                                            <Text style={styles.orderNumberLabel}>Đơn hàng #{order.code}</Text>
                                            <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
                                        </View>
                                        <View style={[
                                            styles.statusBadge,
                                            { backgroundColor: statusColors[order.status as keyof typeof statusColors] }
                                        ]}>
                                            <Text style={styles.statusBadgeText}>{getStatusShortText(order.status)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.orderMiddleSection}>
                                        <Text style={styles.productCount}>{order.lineItems?.length} sản phẩm</Text>
                                        <Text style={styles.totalAmount}>{formatCurrency(order.total)}đ</Text>
                                    </View>

                                    <View style={styles.orderBottomSection}>
                                        <View style={styles.orderDateContainer}>
                                            <Ionicons name="time-outline" size={16} color="#666" />
                                            <Text style={styles.orderDetailText}>
                                                {new Date(order.orderDate)?.toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Text>
                                        </View>

                                        <View style={styles.viewDetailContainer}>
                                            <Text style={styles.viewDetailText}>Xem chi tiết</Text>
                                            <Ionicons name="chevron-forward" size={16} color={COLOR.PRIMARY} />
                                        </View>
                                    </View>

                                </TouchableOpacity>
                            ))}

                            {hasMoreOrders && (
                                <TouchableOpacity
                                    style={styles.loadMoreButton}
                                    onPress={() => fetchOrders(false)}
                                    disabled={ordersLoading}>
                                    {ordersLoading ? (
                                        <ActivityIndicator size="small" color={COLOR.PRIMARY} />
                                    ) : (
                                        <Text style={styles.loadMoreText}>Xem thêm đơn hàng</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>

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
                                onPress={handleApplyDateRange}
                            >
                                <Text style={styles.applyButtonText}>Áp dụng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView >
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
    loader: {
        marginVertical: 20,
    },
    contentLoader: {
        marginVertical: 30,
    },
    statusFilterScrollView: {
        marginBottom: 16,
    },
    statusFilterContainer: {
        paddingRight: 16,
    },
    statusFilter: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    statusFilterActive: {
        backgroundColor: COLOR.PRIMARY,
        borderColor: COLOR.PRIMARY,
    },
    statusFilterText: {
        fontSize: 14,
        fontWeight: '500',
    },
    statusFilterTextActive: {
        color: '#fff',
    },
    orderListContainer: {
        marginBottom: 16,
    },
    orderItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    orderTopSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderNumberContainer: {
        flex: 1,
    },
    orderNumberLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.TEXT,
    },
    orderDate: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#fff',
    },
    orderMiddleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    productCount: {
        fontSize: 14,
        color: '#666',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR.PRIMARY,
    },
    orderBottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderDetailText: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    viewDetailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewDetailText: {
        fontSize: 14,
        color: COLOR.PRIMARY,
        marginRight: 4,
    },
    orderDivider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 12,
    },
    loadMoreButton: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadMoreText: {
        fontSize: 14,
        color: COLOR.PRIMARY,
        fontWeight: '500',
    },
    simpleChart: {
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
    chartArea: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 180,
        paddingHorizontal: 16,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    bar: {
        width: 30,
        backgroundColor: COLOR.PRIMARY,
        borderRadius: 4,
        marginVertical: 8,
    },
    barValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLOR.TEXT,
        marginBottom: 4,
    },
    barLabel: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    lineChartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 220,
        paddingBottom: 20,
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    linePointContainer: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    lineBar: {
        width: 30,
        backgroundColor: COLOR.TEXT,
        borderRadius: 4,
        marginVertical: 4,
        alignSelf: 'flex-end',
    },
    lineValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLOR.TEXT,
        marginBottom: 4,
    },
    lineLabel: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
        maxWidth: 40,
    },
});

export default OrderStatistics;
