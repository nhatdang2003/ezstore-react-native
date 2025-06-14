import axios from "@/src/services/instance_axios";
import { PaginatedResponse, Response } from "@/src/types/response.type";
import {
  OrderReviewRequest,
  OrderReviewResponse,
  ReviewUploadSignUrlReq,
  ReviewUploadSignUrlRes,
} from "@/src/types/review.type";
import {
  cancelOrderReq,
  CheckoutRes,
  MonthlySpendingChartResponse,
  OrderDetailRes,
  OrderHistory,
  OrderPreviewReq,
  OrderPreviewRes,
  OrderStatisticsSummaryRequest,
  OrderStatisticsSummaryResponse,
  StatusSpendingChartResponse,
} from "@/src/types/order.type";

export const getOrderDetail = (
  orderId: number
): Promise<Response<OrderDetailRes>> => {
  const url = `/api/v1/orders/user/${orderId}`;
  return axios.get(url);
};

export const getOrderPreview = (
  data: OrderPreviewReq
): Promise<Response<OrderPreviewRes>> => {
  const url = `api/v1/orders/preview`;
  return axios.post(url, data);
};

export const checkoutOrder = (
  data: OrderPreviewReq
): Promise<Response<CheckoutRes>> => {
  const url = `api/v1/orders/check-out`;
  return axios.post(url, data);
};

export const getOrderHistoryStatisticUser = ({
  page,
  size = 10,
  status,
  startDate,
  endDate,
}: any): Promise<PaginatedResponse<OrderHistory>> => {
  let url = `api/v1/orders/user?page=${page}&size=${size}&sort=createdAt,desc`;
  if (status) {
    url += `&filter=status~'${status}'`;
  }

  if (startDate) {
    url += `&filter=orderDate>:'${startDate}'`;
  }

  if (endDate) {
    url += `&filter=orderDate<:'${endDate}'`;
  }
  return axios.get(url);
};

export const getOrderHistoryUser = ({
  page,
  size = 10,
  status,
}: any): Promise<PaginatedResponse<OrderHistory>> => {
  let url = `api/v1/orders/user?page=${page}&size=${size}&sort=createdAt,desc`;
  if (status) {
    url += `&filter=status~'${status}'`;
  }
  return axios.get(url);
};

export const getOrderReviews = (
  orderId: number
): Promise<Response<OrderReviewResponse[]>> => {
  const url = `api/v1/orders/user/${orderId}/reviews`;
  return axios.get(url);
};

export const createOrderReview = (
  data: OrderReviewRequest
): Promise<Response<OrderReviewResponse>> => {
  const url = `api/v1/orders/user/reviews`;
  return axios.post(url, data);
};

export const updateOrderReview = (
  data: OrderReviewRequest
): Promise<Response<OrderReviewResponse>> => {
  const url = `api/v1/orders/user/reviews`;
  return axios.put(url, data);
};

export const getUserOrderStatistics = (
  data: OrderStatisticsSummaryRequest
): Promise<Response<OrderStatisticsSummaryResponse>> => {
  const url = `api/v1/orders/user/statistics`;
  return axios.post(url, data);
};

export const getUserOrderMonthlyChart = (
  data: OrderStatisticsSummaryRequest
): Promise<Response<MonthlySpendingChartResponse>> => {
  const url = `api/v1/orders/user/statistics/chart/line`;
  return axios.post(url, data);
};

export const getUserOrderStatusChart = (
  data: OrderStatisticsSummaryRequest
): Promise<Response<StatusSpendingChartResponse>> => {
  const url = `api/v1/orders/user/statistics/chart/bar`;
  return axios.post(url, data);
};

export const cancelOrder = (
  data: cancelOrderReq
): Promise<Response<void>> => {
  const url = `/api/v1/orders/user/cancel`;
  return axios.put(url, data);
};

export const getReviewUploadSignUrl = (
  data: ReviewUploadSignUrlReq
): Promise<Response<ReviewUploadSignUrlRes>> => {
  const url = `/api/v1/orders/user/reviews/upload`;
  return axios.post(url, data);
};
