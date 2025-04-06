export interface Province {
    ProvinceID: number;
    ProvinceName: string;
    CountryID: number;
    ProvinceEncode: string;
    RegionID: number;
    AreaID: number;
    CanUpdateCOD: boolean;
    Status: number;
    CreatedIP: string;
    CreatedEmployee: number;
    CreatedSource: string;
    CreatedDate: string;
    UpdatedIP: string;
    UpdatedEmployee: number;
    UpdatedSource: string;
    UpdatedDate: string;
}

export interface District {
    DistrictID: number;
    ProvinceID: number;
    DistrictName: string;
    Code: string;
    Type: number;
    SupportType: number;
    NameExtension: string[];
    IsEnable: number;
    UpdatedBy: number;
    CreatedAt: string;
    UpdatedAt: string;
    CanUpdateCOD: boolean;
    Status: number;
    PickType: number;
    DeliverType: number;
    WhiteListClient: {
        From: any[];
        To: any[];
        Return: any[];
    };
    WhiteListDistrict: {
        From: any | null;
        To: any | null;
    };
    ReasonCode: string;
    ReasonMessage: string;
    OnDates: string[];
    UpdatedEmployee: number;
    UpdatedSource: string;
    UpdatedDate: string;
}

export interface Ward {
    WardCode: string;
    DistrictID: number;
    WardName: string;
    NameExtension: string[];
    IsEnable: number;
    CanUpdateCOD: boolean;
    UpdatedBy: number;
    CreatedAt: string;
    UpdatedAt: string;
    SupportType: number;
    PickType: number;
    DeliverType: number;
    WhiteListClient: {
        From: any[];
        To: any[];
        Return: any[];
    };
    WhiteListWard: {
        From: any | null;
        To: any | null;
    };
    Status: number;
    ReasonCode: string;
    ReasonMessage: string;
    OnDates: any | null;
    UpdatedEmployee: number;
    UpdatedSource: string;
    UpdatedDate: string;
}
