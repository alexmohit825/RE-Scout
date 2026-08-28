import Foundation

public enum RegionId: String, Codable, CaseIterable, Identifiable, Sendable {
    case pnw = "pnw"
    case southwest = "southwest"
    case midwest = "midwest"
    case southeast = "southeast"
    case northeast = "northeast"

    public var id: String { rawValue }

    public var label: String {
        switch self {
        case .pnw: return "Washington & Oregon"
        case .southwest: return "Southwest"
        case .midwest: return "Midwest"
        case .southeast: return "Southeast"
        case .northeast: return "Northeast"
        }
    }

    public var states: [String] {
        switch self {
        case .pnw: return ["WA", "OR"]
        case .southwest: return ["CA", "AZ", "NV", "NM", "UT", "CO", "HI"]
        case .midwest: return ["IL", "IN", "OH", "MI", "WI", "MN", "IA", "MO", "KS", "NE", "SD", "ND"]
        case .southeast: return ["FL", "GA", "NC", "SC", "TN", "AL", "MS", "VA", "KY", "WV", "AR", "LA"]
        case .northeast: return ["NY", "PA", "NJ", "MA", "CT", "RI", "VT", "NH", "ME", "DE", "MD", "DC"]
        }
    }

    public var description: String {
        switch self {
        case .pnw: return "Pacific Northwest — Seattle, Portland, Spokane, Eugene"
        case .southwest: return "Western Sun Belt — Phoenix, Las Vegas, Denver, SoCal"
        case .midwest: return "Heartland — Chicago, Columbus, Detroit, Minneapolis"
        case .southeast: return "Sun Belt South — Atlanta, Miami, Charlotte, Nashville"
        case .northeast: return "East Coast — NYC, Boston, Philly, Baltimore, DC"
        }
    }
}

public enum AssetCategory: String, Codable, Sendable {
    case primary
    case residential
}

public enum AssetTypeId: String, Codable, CaseIterable, Identifiable, Sendable {
    case multifamily = "multifamily"
    case apartmentComplex = "apartment_complex"
    case condoComplex = "condo_complex"
    case industrialWarehouse = "industrial_warehouse"
    case flexIndustrial = "flex_industrial"
    case lightManufacturing = "light_manufacturing"
    case distributionCenter = "distribution_center"
    case singleFamily = "single_family"
    case duplexTriplex = "duplex_triplex"
    case townhome = "townhome"

    public var id: String { rawValue }

    public var label: String {
        switch self {
        case .multifamily: return "Multi-Family (5+ units)"
        case .apartmentComplex: return "Apartment Complex"
        case .condoComplex: return "Condo / HOA Complex"
        case .industrialWarehouse: return "Industrial / Warehouse"
        case .flexIndustrial: return "Flex Industrial Space"
        case .lightManufacturing: return "Light Manufacturing"
        case .distributionCenter: return "Distribution / Logistics"
        case .singleFamily: return "Single Family (SFR)"
        case .duplexTriplex: return "Duplex / Triplex"
        case .townhome: return "Townhome / Townhouse"
        }
    }

    public var category: AssetCategory {
        switch self {
        case .singleFamily, .duplexTriplex, .townhome:
            return .residential
        default:
            return .primary
        }
    }
}

public struct FinancialMetrics: Codable, Hashable, Sendable {
    public var capRate: Double
    public var pricePerUnit: Double
    public var pricePerSqFt: Double
    public var occupancyRate: Double
    public var noi: Double
    public var grossYield: Double
    public var unitCount: Int?

    public init(
        capRate: Double,
        pricePerUnit: Double,
        pricePerSqFt: Double,
        occupancyRate: Double,
        noi: Double,
        grossYield: Double,
        unitCount: Int? = nil
    ) {
        self.capRate = capRate
        self.pricePerUnit = pricePerUnit
        self.pricePerSqFt = pricePerSqFt
        self.occupancyRate = occupancyRate
        self.noi = noi
        self.grossYield = grossYield
        self.unitCount = unitCount
    }
}

public struct LoanDetails: Codable, Hashable, Sendable {
    public var hasLoan: Bool
    public var bankName: String?
    public var outstandingBalance: Double?
    public var monthlyPayment: Double?
    public var interestRate: Double?

    public init(
        hasLoan: Bool,
        bankName: String? = nil,
        outstandingBalance: Double? = nil,
        monthlyPayment: Double? = nil,
        interestRate: Double? = nil
    ) {
        self.hasLoan = hasLoan
        self.bankName = bankName
        self.outstandingBalance = outstandingBalance
        self.monthlyPayment = monthlyPayment
        self.interestRate = interestRate
    }
}

public struct Property: Identifiable, Codable, Hashable, Sendable {
    public var id: String
    public var address: String
    public var city: String
    public var state: String
    public var region: RegionId
    public var type: String
    public var price: Double
    public var metrics: FinancialMetrics
    public var valueScore: Int
    public var loan: LoanDetails?
    public var sqft: Int?
    public var yearBuilt: Int?
    public var description: String?
    public var source: String?

    public init(
        id: String,
        address: String,
        city: String,
        state: String,
        region: RegionId,
        type: String,
        price: Double,
        metrics: FinancialMetrics,
        valueScore: Int,
        loan: LoanDetails? = nil,
        sqft: Int? = nil,
        yearBuilt: Int? = nil,
        description: String? = nil,
        source: String? = nil
    ) {
        self.id = id
        self.address = address
        self.city = city
        self.state = state
        self.region = region
        self.type = type
        self.price = price
        self.metrics = metrics
        self.valueScore = valueScore
        self.loan = loan
        self.sqft = sqft
        self.yearBuilt = yearBuilt
        self.description = description
        self.source = source
    }
}
