export interface ShippingProfile {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    wardId: number;
    ward: string;
    districtId: number;
    district: string;
    provinceId: number;
    province: string;
    default: boolean;
}

export interface ShippingProfileReq {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    wardId: number;
    ward: string;
    districtId: number;
    district: string;
    provinceId: number;
    province: string;
}

export interface ShippingProfileDefaultReq {
    shippingProfileId: number;
}
