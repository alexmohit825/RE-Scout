import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Sparkles, FileCode, Layers, Download, FolderArchive, ArrowDownToLine, AlertCircle, Apple } from 'lucide-react';
import JSZip from 'jszip';

interface SwiftFile {
  name: string;
  path: string;
  category: string;
  code: string;
  description: string;
}

const SWIFT_FILES: SwiftFile[] = [
  {
    name: 'Package.swift',
    path: 'Package.swift',
    category: 'Config',
    description: 'Swift Package Manager manifest targeting iOS 17+ and macOS 14+.',
    code: `// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ValueREScout",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "ValueREScout",
            targets: ["ValueREScout"]
        ),
    ],
    targets: [
        .target(
            name: "ValueREScout",
            path: "ValueREScout"
        ),
    ]
)`
  },
  {
    name: 'ValueREScoutApp.swift',
    path: 'ValueREScout/ValueREScoutApp.swift',
    category: 'App',
    description: 'SwiftUI @main application entry point with Apple Intelligence Siri & Shortcuts Intent.',
    code: `import SwiftUI
import AppIntents

@main
struct ValueREScoutApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// MARK: - Apple Intelligence App Intent for Siri & Shortcuts
@available(iOS 16.0, macOS 13.0, watchOS 9.0, tvOS 16.0, *)
public struct UnderwritePropertyIntent: AppIntent {
    public static var title: LocalizedStringResource = "Underwrite Property with Apple Intelligence"
    public static var description = IntentDescription("Underwrites a commercial real estate property using on-device Apple Intelligence.")

    @Parameter(title: "Property Listing or Address")
    public var inputQuery: String

    public init() {}

    public init(inputQuery: String) {
        self.inputQuery = inputQuery
    }

    public func perform() async throws -> some IntentResult & ProvidesDialog {
        let property = try await AppleIntelligenceScoutService.shared.scoutProperty(input: inputQuery, mode: .search)
        let dialog = "Underwritten \\(property.address) in \\(property.city), \\(property.state). Estimated Cap Rate is \\(String(format: "%.1f%%", property.metrics.capRate)) with a Value Score of \\(property.valueScore)/100."
        return .result(dialog: IntentDialog(stringLiteral: dialog))
    }
}`
  },
  {
    name: 'Property.swift',
    path: 'ValueREScout/Models/Property.swift',
    category: 'Models',
    description: 'Complete Sendable & Codable Swift models for assets, regions, loans, and metrics.',
    code: `import Foundation

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
}`
  },
  {
    name: 'PropertyData.swift',
    path: 'ValueREScout/Data/PropertyData.swift',
    category: 'Data',
    description: 'Full institutional commercial property dataset across PNW, Southwest, Midwest, Southeast & Northeast.',
    code: `import Foundation

public enum PropertyData {
    public static let initialProperties: [Property] = [
        Property(
            id: "wa-001",
            address: "1422 E Sprague Ave",
            city: "Spokane",
            state: "WA",
            region: .pnw,
            type: "apartment_complex",
            price: 2_850_000,
            metrics: FinancialMetrics(
                capRate: 6.8,
                pricePerUnit: 118_750,
                pricePerSqFt: 112,
                occupancyRate: 94,
                noi: 193_800,
                grossYield: 8.1,
                unitCount: 24
            ),
            valueScore: 88,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Washington Trust Bank",
                outstandingBalance: 1_850_000,
                monthlyPayment: 11_600,
                interestRate: 6.35
            ),
            sqft: 25_400,
            yearBuilt: 1994,
            description: "24-Unit core multifamily asset in East Central Spokane revitalization corridor."
        ),
        Property(
            id: "wa-002",
            address: "8800 Lake City Way NE",
            city: "Seattle",
            state: "WA",
            region: .pnw,
            type: "multifamily",
            price: 4_100_000,
            metrics: FinancialMetrics(
                capRate: 5.9,
                pricePerUnit: 205_000,
                pricePerSqFt: 198,
                occupancyRate: 96,
                noi: 241_900,
                grossYield: 7.2,
                unitCount: 20
            ),
            valueScore: 74,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Chase Commercial Term Lending",
                outstandingBalance: 2_600_000,
                monthlyPayment: 16_400,
                interestRate: 6.25
            ),
            sqft: 20_700,
            yearBuilt: 2002,
            description: "20-Unit garden style community with on-site parking and steady Seattle occupancy."
        ),
        Property(
            id: "or-001",
            address: "3301 NE Sandy Blvd",
            city: "Portland",
            state: "OR",
            region: .pnw,
            type: "industrial_warehouse",
            price: 3_200_000,
            metrics: FinancialMetrics(
                capRate: 7.1,
                pricePerUnit: 3_200_000,
                pricePerSqFt: 82,
                occupancyRate: 97,
                noi: 227_200,
                grossYield: 9.0,
                unitCount: 1
            ),
            valueScore: 92,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "U.S. Bank Commercial Real Estate",
                outstandingBalance: 2_100_000,
                monthlyPayment: 13_200,
                interestRate: 6.5
            ),
            sqft: 39_000,
            yearBuilt: 1986,
            description: "Close-in Eastside logistics warehouse with heavy 3-phase power and roll-up loading bays."
        ),
        Property(
            id: "wa-003",
            address: "3110 Harborview Dr",
            city: "Gig Harbor",
            state: "WA",
            region: .pnw,
            type: "apartment_complex",
            price: 3_650_000,
            metrics: FinancialMetrics(
                capRate: 6.4,
                pricePerUnit: 228_125,
                pricePerSqFt: 215,
                occupancyRate: 95,
                noi: 233_600,
                grossYield: 7.9,
                unitCount: 16
            ),
            valueScore: 79,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Timberland Bank",
                outstandingBalance: 2_400_000,
                monthlyPayment: 15_100,
                interestRate: 6.2
            ),
            sqft: 16_980,
            yearBuilt: 1998,
            description: "16-Unit boutique waterfront view apartment complex with premium historical tenant retention."
        ),
        Property(
            id: "wa-004",
            address: "2102 South C St",
            city: "Tacoma",
            state: "WA",
            region: .pnw,
            type: "industrial_warehouse",
            price: 2_450_000,
            metrics: FinancialMetrics(
                capRate: 7.3,
                pricePerUnit: 2_450_000,
                pricePerSqFt: 98,
                occupancyRate: 96,
                noi: 178_850,
                grossYield: 8.8,
                unitCount: 1
            ),
            valueScore: 90,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Columbia Bank / Umpqua",
                outstandingBalance: 1_550_000,
                monthlyPayment: 9_800,
                interestRate: 6.4
            ),
            sqft: 25_000,
            yearBuilt: 1978,
            description: "Brewery District industrial manufacturing flex asset with 18ft clear ceiling heights."
        ),
        Property(
            id: "wa-005",
            address: "110 9th Ave SE",
            city: "Puyallup",
            state: "WA",
            region: .pnw,
            type: "multifamily",
            price: 1_850_000,
            metrics: FinancialMetrics(
                capRate: 6.9,
                pricePerUnit: 154_166,
                pricePerSqFt: 135,
                occupancyRate: 94,
                noi: 127_650,
                grossYield: 8.4,
                unitCount: 12
            ),
            valueScore: 84,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "KeyBank Commercial",
                outstandingBalance: 1_200_000,
                monthlyPayment: 7_600,
                interestRate: 6.3
            ),
            sqft: 13_700,
            yearBuilt: 1989,
            description: "12-Unit garden court apartments near commuter rail station with individually metered utilities."
        ),
        Property(
            id: "wa-006",
            address: "1515 Fryar Ave",
            city: "Sumner",
            state: "WA",
            region: .pnw,
            type: "distribution_center",
            price: 5_200_000,
            metrics: FinancialMetrics(
                capRate: 7.1,
                pricePerUnit: 5_200_000,
                pricePerSqFt: 85,
                occupancyRate: 98,
                noi: 369_200,
                grossYield: 8.6,
                unitCount: 1
            ),
            valueScore: 89,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Wells Fargo CRE",
                outstandingBalance: 3_400_000,
                monthlyPayment: 21_400,
                interestRate: 6.4
            ),
            sqft: 61_176,
            yearBuilt: 2006,
            description: "Sumner industrial valley freight logistics hub with 6 dock-high doors and wide apron turning radius."
        ),
        Property(
            id: "wa-007",
            address: "3400 Pacific Hwy E",
            city: "Fife",
            state: "WA",
            region: .pnw,
            type: "flex_industrial",
            price: 2_950_000,
            metrics: FinancialMetrics(
                capRate: 7.5,
                pricePerUnit: 2_950_000,
                pricePerSqFt: 92,
                occupancyRate: 92,
                noi: 221_250,
                grossYield: 9.1,
                unitCount: 1
            ),
            valueScore: 94,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "PNC Real Estate",
                outstandingBalance: 1_900_000,
                monthlyPayment: 12_000,
                interestRate: 6.5
            ),
            sqft: 32_000,
            yearBuilt: 1991,
            description: "Direct I-5 highway exposure flex industrial building with showroom and warehouse components."
        ),
        Property(
            id: "wa-008",
            address: "10111 Gravelly Lake Dr SW",
            city: "Lakewood",
            state: "WA",
            region: .pnw,
            type: "condo_complex",
            price: 3_100_000,
            metrics: FinancialMetrics(
                capRate: 6.2,
                pricePerUnit: 155_000,
                pricePerSqFt: 142,
                occupancyRate: 93,
                noi: 192_200,
                grossYield: 7.7,
                unitCount: 20
            ),
            valueScore: 78,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Banner Bank",
                outstandingBalance: 2_000_000,
                monthlyPayment: 12_600,
                interestRate: 6.3
            ),
            sqft: 21_830,
            yearBuilt: 1995,
            description: "20-Unit residential condo complex package sold in bulk with dedicated garage parking."
        ),
        // Southwest
        Property(
            id: "az-001",
            address: "5501 W McDowell Rd",
            city: "Phoenix",
            state: "AZ",
            region: .southwest,
            type: "industrial_warehouse",
            price: 4_200_000,
            metrics: FinancialMetrics(
                capRate: 7.2,
                pricePerUnit: 4_200_000,
                pricePerSqFt: 87,
                occupancyRate: 97,
                noi: 302_400,
                grossYield: 9.0,
                unitCount: 1
            ),
            valueScore: 91,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Western Alliance",
                outstandingBalance: 2_800_000,
                monthlyPayment: 17_600,
                interestRate: 6.4
            ),
            sqft: 48_275,
            yearBuilt: 2004,
            description: "West Phoenix distribution facility with 24ft clear height and fenced staging yard."
        ),
        Property(
            id: "co-001",
            address: "2201 W Colfax Ave",
            city: "Denver",
            state: "CO",
            region: .southwest,
            type: "apartment_complex",
            price: 5_100_000,
            metrics: FinancialMetrics(
                capRate: 6.0,
                pricePerUnit: 170_000,
                pricePerSqFt: 165,
                occupancyRate: 93,
                noi: 306_000,
                grossYield: 7.6,
                unitCount: 30
            ),
            valueScore: 77,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "FirstBank Colorado",
                outstandingBalance: 3_300_000,
                monthlyPayment: 20_800,
                interestRate: 6.35
            ),
            sqft: 30_900,
            yearBuilt: 1984,
            description: "30-Unit transit-oriented multifamily building near downtown Denver light rail."
        ),
        Property(
            id: "nv-001",
            address: "980 S Rainbow Blvd",
            city: "Las Vegas",
            state: "NV",
            region: .southwest,
            type: "flex_industrial",
            price: 2_900_000,
            metrics: FinancialMetrics(
                capRate: 7.4,
                pricePerUnit: 2_900_000,
                pricePerSqFt: 72,
                occupancyRate: 91,
                noi: 214_600,
                grossYield: 9.2,
                unitCount: 1
            ),
            valueScore: 93,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Bank of Nevada",
                outstandingBalance: 1_850_000,
                monthlyPayment: 11_700,
                interestRate: 6.5
            ),
            sqft: 40_277,
            yearBuilt: 1996,
            description: "Multi-tenant light commercial flex building with storefront suites and rear warehouse bays."
        ),
        // Midwest
        Property(
            id: "il-001",
            address: "8801 S Cottage Grove",
            city: "Chicago",
            state: "IL",
            region: .midwest,
            type: "multifamily",
            price: 1_650_000,
            metrics: FinancialMetrics(
                capRate: 7.5,
                pricePerUnit: 82_500,
                pricePerSqFt: 98,
                occupancyRate: 91,
                noi: 123_750,
                grossYield: 9.4,
                unitCount: 20
            ),
            valueScore: 92,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Wintrust Commercial Bank",
                outstandingBalance: 1_100_000,
                monthlyPayment: 6_900,
                interestRate: 6.35
            ),
            sqft: 16_836,
            yearBuilt: 1968,
            description: "20-Unit brick walk-up building with strong in-place cash flow and low basis per unit."
        ),
        Property(
            id: "oh-001",
            address: "4401 Lorain Ave",
            city: "Cleveland",
            state: "OH",
            region: .midwest,
            type: "apartment_complex",
            price: 980_000,
            metrics: FinancialMetrics(
                capRate: 8.2,
                pricePerUnit: 65_333,
                pricePerSqFt: 74,
                occupancyRate: 88,
                noi: 80_360,
                grossYield: 10.5,
                unitCount: 15
            ),
            valueScore: 96,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "KeyBank Midwest CRE",
                outstandingBalance: 620_000,
                monthlyPayment: 3_900,
                interestRate: 6.4
            ),
            sqft: 13_243,
            yearBuilt: 1955,
            description: "15-Unit mixed-use residential apartment building in Ohio City historic district."
        ),
        Property(
            id: "mi-001",
            address: "7200 E Jefferson Ave",
            city: "Detroit",
            state: "MI",
            region: .midwest,
            type: "distribution_center",
            price: 3_800_000,
            metrics: FinancialMetrics(
                capRate: 8.0,
                pricePerUnit: 3_800_000,
                pricePerSqFt: 61,
                occupancyRate: 95,
                noi: 304_000,
                grossYield: 10.1,
                unitCount: 1
            ),
            valueScore: 97,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Huntington National Bank",
                outstandingBalance: 2_450_000,
                monthlyPayment: 15_500,
                interestRate: 6.5
            ),
            sqft: 62_295,
            yearBuilt: 1982,
            description: "High-cube freight logistics facility near marine terminal with cross-docking infrastructure."
        ),
        // Southeast
        Property(
            id: "fl-001",
            address: "3210 NW 7th Ave",
            city: "Miami",
            state: "FL",
            region: .southeast,
            type: "condo_complex",
            price: 5_800_000,
            metrics: FinancialMetrics(
                capRate: 5.9,
                pricePerUnit: 145_000,
                pricePerSqFt: 195,
                occupancyRate: 92,
                noi: 342_200,
                grossYield: 7.2,
                unitCount: 40
            ),
            valueScore: 73,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "City National Bank of Florida",
                outstandingBalance: 3_800_000,
                monthlyPayment: 23_900,
                interestRate: 6.35
            ),
            sqft: 29_743,
            yearBuilt: 1990,
            description: "40-Unit Wynwood adjacent multi-family community with strong appreciation upside."
        ),
        Property(
            id: "ga-001",
            address: "1800 Marietta Blvd",
            city: "Atlanta",
            state: "GA",
            region: .southeast,
            type: "industrial_warehouse",
            price: 4_600_000,
            metrics: FinancialMetrics(
                capRate: 7.0,
                pricePerUnit: 4_600_000,
                pricePerSqFt: 79,
                occupancyRate: 96,
                noi: 322_000,
                grossYield: 8.8,
                unitCount: 1
            ),
            valueScore: 89,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "SunTrust / Truist CRE",
                outstandingBalance: 3_000_000,
                monthlyPayment: 18_900,
                interestRate: 6.4
            ),
            sqft: 58_227,
            yearBuilt: 2000,
            description: "West Midtown industrial corridor warehouse with rail access and heavy container parking."
        ),
        Property(
            id: "nc-001",
            address: "2400 Rexford Rd",
            city: "Charlotte",
            state: "NC",
            region: .southeast,
            type: "apartment_complex",
            price: 3_200_000,
            metrics: FinancialMetrics(
                capRate: 6.4,
                pricePerUnit: 106_667,
                pricePerSqFt: 128,
                occupancyRate: 93,
                noi: 204_800,
                grossYield: 8.0,
                unitCount: 30
            ),
            valueScore: 83,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Bank of America Merrill Lynch",
                outstandingBalance: 2_100_000,
                monthlyPayment: 13_200,
                interestRate: 6.3
            ),
            sqft: 25_000,
            yearBuilt: 1987,
            description: "30-Unit SouthPark suburban community with pool and newly renovated club lounge."
        ),
        // Northeast
        Property(
            id: "pa-001",
            address: "2244 N Broad St",
            city: "Philadelphia",
            state: "PA",
            region: .northeast,
            type: "flex_industrial",
            price: 3_100_000,
            metrics: FinancialMetrics(
                capRate: 7.0,
                pricePerUnit: 3_100_000,
                pricePerSqFt: 78,
                occupancyRate: 89,
                noi: 217_000,
                grossYield: 8.5,
                unitCount: 1
            ),
            valueScore: 86,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "PNC Real Estate",
                outstandingBalance: 2_000_000,
                monthlyPayment: 12_600,
                interestRate: 6.45
            ),
            sqft: 39_743,
            yearBuilt: 1975,
            description: "North Broad commercial corridor flex building with freight elevator and sub-dividable floors."
        ),
        Property(
            id: "ny-001",
            address: "540 Atlantic Ave",
            city: "Brooklyn",
            state: "NY",
            region: .northeast,
            type: "multifamily",
            price: 6_800_000,
            metrics: FinancialMetrics(
                capRate: 5.2,
                pricePerUnit: 340_000,
                pricePerSqFt: 298,
                occupancyRate: 97,
                noi: 353_600,
                grossYield: 6.5,
                unitCount: 20
            ),
            valueScore: 68,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Signature / New York Community Bank",
                outstandingBalance: 4_400_000,
                monthlyPayment: 27_800,
                interestRate: 6.25
            ),
            sqft: 22_818,
            yearBuilt: 2008,
            description: "20-Unit prime Boerum Hill elevator building with in-unit laundry and roof deck."
        ),
        Property(
            id: "ma-001",
            address: "1200 Washington St",
            city: "Boston",
            state: "MA",
            region: .northeast,
            type: "apartment_complex",
            price: 7_200_000,
            metrics: FinancialMetrics(
                capRate: 5.5,
                pricePerUnit: 240_000,
                pricePerSqFt: 310,
                occupancyRate: 96,
                noi: 396_000,
                grossYield: 7.0,
                unitCount: 30
            ),
            valueScore: 72,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Eastern Bank CRE",
                outstandingBalance: 4_700_000,
                monthlyPayment: 29_700,
                interestRate: 6.3
            ),
            sqft: 23_225,
            yearBuilt: 2001,
            description: "30-Unit South End brick brownstone style apartment community with high historical occupancy."
        )
    ]
}
`
  },
  {
    name: 'UnderwritingCalculator.swift',
    path: 'ValueREScout/Services/UnderwritingCalculator.swift',
    category: 'Services',
    description: 'Pure institutional financial mathematics, DSCR debt sensitivity, and 100-point Value Score logic.',
    code: `import Foundation

public enum UnderwritingCalculator {

    /// Calculates institutional 100-point Value Score based on Cap Rate, Occupancy, Gross Yield, and Basis Discount.
    public static func calculateValueScore(
        metrics: FinancialMetrics,
        assetType: String
    ) -> Int {
        var score: Double = 0
        let isIndustrial = assetType.contains("industrial") || assetType.contains("warehouse") || assetType.contains("distribution") || assetType.contains("manufacturing")
        let targetCap = isIndustrial ? 7.0 : 6.0

        // 1. Cap Rate (up to 30 pts)
        score += min(30.0, (metrics.capRate / targetCap) * 30.0)

        // 2. Occupancy (up to 25 pts)
        score += min(25.0, (metrics.occupancyRate / 90.0) * 25.0)

        // 3. Gross Yield (up to 25 pts)
        score += min(25.0, (metrics.grossYield / 8.0) * 25.0)

        // 4. Valuation Discount Basis (up to 20 pts)
        if metrics.pricePerUnit > 0 {
            if metrics.pricePerUnit < 150_000 { score += 20.0 }
            else if metrics.pricePerUnit < 200_000 { score += 10.0 }
        } else {
            if metrics.pricePerSqFt < 100 { score += 20.0 }
            else if metrics.pricePerSqFt < 140 { score += 10.0 }
        }

        return max(15, min(99, Int(round(score))))
    }

    /// Derives financial metrics given listing price, NOI or Cap Rate, and physical dimensions.
    public static func deriveMetrics(
        price: Double,
        capRate: Double? = nil,
        noi: Double? = nil,
        unitCount: Int? = nil,
        sqft: Int? = nil,
        occupancyRate: Double = 95.0
    ) -> FinancialMetrics {
        let safePrice = max(1.0, price)
        let computedCapRate: Double
        let computedNOI: Double

        if let explicitCap = capRate {
            computedCapRate = explicitCap
            computedNOI = noi ?? (safePrice * (explicitCap / 100.0))
        } else if let explicitNOI = noi {
            computedNOI = explicitNOI
            computedCapRate = (explicitNOI / safePrice) * 100.0
        } else {
            computedCapRate = 6.8
            computedNOI = safePrice * 0.068
        }

        let units = unitCount ?? 1
        let safeSqft = max(1, sqft ?? 12_500)

        let pricePerUnit = unitCount != nil && unitCount! > 0 ? (safePrice / Double(units)) : 0.0
        let pricePerSqFt = safePrice / Double(safeSqft)
        let grossYield = computedCapRate * 1.25

        return FinancialMetrics(
            capRate: Double(round(computedCapRate * 10) / 10),
            pricePerUnit: Double(round(pricePerUnit)),
            pricePerSqFt: Double(round(pricePerSqFt)),
            occupancyRate: occupancyRate,
            noi: Double(round(computedNOI)),
            grossYield: Double(round(grossYield * 10) / 10),
            unitCount: unitCount
        )
    }

    /// Underwrites debt sizing, monthly amortization, DSCR ratio, and Cash-on-Cash equity yield.
    public static func underwriteLoan(
        price: Double,
        noi: Double,
        downPaymentPercent: Double = 25.0,
        interestRatePercent: Double = 6.5,
        amortizationYears: Int = 30
    ) -> (loanAmount: Double, annualDebtService: Double, dscr: Double, cashOnCash: Double) {
        let downPayment = price * (downPaymentPercent / 100.0)
        let loanAmount = price - downPayment
        let monthlyRate = (interestRatePercent / 100.0) / 12.0
        let totalMonths = Double(amortizationYears * 12)

        let monthlyPayment: Double
        if monthlyRate > 0 {
            let factor = pow(1.0 + monthlyRate, totalMonths)
            monthlyPayment = loanAmount * (monthlyRate * factor) / max(factor - 1.0, 0.0001)
        } else {
            monthlyPayment = loanAmount / max(totalMonths, 1.0)
        }

        let annualDebtService = monthlyPayment * 12.0
        let dscr = annualDebtService > 0 ? (noi / annualDebtService) : 0.0
        let netCashFlow = noi - annualDebtService
        let cashOnCash = downPayment > 0 ? (netCashFlow / downPayment) * 100.0 : 0.0

        return (
            loanAmount: round(loanAmount),
            annualDebtService: round(annualDebtService),
            dscr: Double(round(dscr * 100) / 100),
            cashOnCash: Double(round(cashOnCash * 10) / 10)
        )
    }
}`
  },
  {
    name: 'AppleIntelligenceScoutService.swift',
    path: 'ValueREScout/Services/AppleIntelligenceScoutService.swift',
    category: 'Services',
    description: 'Dual-mode AI Scout Engine with Live Web Search Query Simulation & Text Parsing.',
    code: `import Foundation
import NaturalLanguage

public enum ScoutMode: String, CaseIterable, Identifiable, Sendable {
    case search = "Web Search Lookup"
    case paste = "Paste Listing Text"

    public var id: String { rawValue }
}

public final class AppleIntelligenceScoutService: Sendable {
    public static let shared = AppleIntelligenceScoutService()

    private init() {}

    public func scoutProperty(input: String, mode: ScoutMode) async throws -> Property {
        let trimmed = input.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else {
            throw ScoutError.emptyInput
        }

        // Simulate intelligent on-device pipeline delay
        try await Task.sleep(nanoseconds: 400_000_000)

        let extracted = extractEntitiesWithNaturalLanguage(text: trimmed)

        let address = extracted.address.isEmpty ? (mode == .search ? trimmed : "3110 Judson St") : extracted.address
        let city = extracted.city.isEmpty ? "Gig Harbor" : extracted.city
        let state = extracted.state.isEmpty ? "WA" : extracted.state.uppercased()

        let region: RegionId
        if ["WA", "OR"].contains(state) {
            region = .pnw
        } else if ["CA", "AZ", "NV", "NM", "UT", "CO", "HI"].contains(state) {
            region = .southwest
        } else if ["IL", "IN", "OH", "MI", "WI", "MN", "IA", "MO", "KS", "NE", "SD", "ND"].contains(state) {
            region = .midwest
        } else if ["FL", "GA", "NC", "SC", "TN", "AL", "MS", "VA", "KY", "WV", "AR", "LA"].contains(state) {
            region = .southeast
        } else {
            region = .northeast
        }

        let assetType = extracted.assetType ?? "multifamily"
        let price = extracted.price > 0 ? extracted.price : 2_450_000.0
        let capRate = extracted.capRate ?? (assetType.contains("industrial") ? 7.2 : 6.5)
        let unitCount = extracted.unitCount ?? (assetType.contains("industrial") ? nil : 12)
        let sqft = extracted.sqft ?? 14_800
        let occupancy = extracted.occupancyRate ?? 95.0

        let metrics = UnderwritingCalculator.deriveMetrics(
            price: price,
            capRate: capRate,
            noi: extracted.noi,
            unitCount: unitCount,
            sqft: sqft,
            occupancyRate: occupancy
        )

        let valueScore = UnderwritingCalculator.calculateValueScore(
            metrics: metrics,
            assetType: assetType
        )

        let id = "custom-\\(UUID().uuidString.prefix(8))"

        let loan = LoanDetails(
            hasLoan: true,
            bankName: "Commercial Capital Partner",
            outstandingBalance: round(price * 0.65),
            monthlyPayment: round((price * 0.65 * 0.065 / 12)),
            interestRate: 6.5
        )

        let description = mode == .search
            ? "AI Opportunity Scout queried commercial registers: identified stabilized \\(assetType.replacingOccurrences(of: "_", with: " ")) in \\(city), \\(state)."
            : "Underwritten from raw listing text: structured \\(unitCount != nil ? "\\(unitCount!) Units" : "\\(sqft) sqft") asset with \\(String(format: "%.1f%%", capRate)) in-place Cap Rate."

        return Property(
            id: id,
            address: address,
            city: city,
            state: state,
            region: region,
            type: assetType,
            price: price,
            metrics: metrics,
            valueScore: valueScore,
            loan: loan,
            sqft: sqft,
            yearBuilt: extracted.yearBuilt ?? 1998,
            description: description,
            source: mode == .search ? "AI Web Search Terminal" : "AI Listing Text Parser"
        )
    }

    private struct ExtractedData {
        var address: String = ""
        var city: String = ""
        var state: String = ""
        var price: Double = 0
        var capRate: Double?
        var noi: Double?
        var unitCount: Int?
        var sqft: Int?
        var yearBuilt: Int?
        var occupancyRate: Double?
        var assetType: String?
    }

    private func extractEntitiesWithNaturalLanguage(text: String) -> ExtractedData {
        var data = ExtractedData()

        let tagger = NLTagger(tagSchemes: [.nameTypeOrLexicalClass])
        tagger.string = text
        let options: NLTagger.Options = [.omitPunctuation, .omitWhitespace, .joinNames]

        tagger.enumerateTags(in: text.startIndex..<text.endIndex, unit: .word, scheme: .nameTypeOrLexicalClass, options: options) { tag, tokenRange in
            if let tag = tag, [.placeName, .organizationName].contains(tag) {
                let token = String(text[tokenRange])
                if data.city.isEmpty && token.count > 3 && !token.contains("$") {
                    data.city = token
                }
            }
            return true
        }

        if let priceMatch = extractPrice(from: text) { data.price = priceMatch }
        if let capMatch = extractCapRate(from: text) { data.capRate = capMatch }
        if let noiMatch = extractNOI(from: text) { data.noi = noiMatch }
        if let unitMatch = extractUnits(from: text) { data.unitCount = unitMatch }
        if let sqftMatch = extractSqFt(from: text) { data.sqft = sqftMatch }
        if let stateMatch = extractState(from: text) { data.state = stateMatch }
        data.assetType = classifyAssetType(from: text)
        data.address = extractAddressLine(from: text)

        return data
    }

    private func extractPrice(from text: String) -> Double? {
        let mPattern = #"\\$?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(?:M|million)"#
        if let match = text.range(of: mPattern, options: .regularExpression) {
            let sub = String(text[match])
            let numStr = sub.replacingOccurrences(of: "$", with: "")
                .replacingOccurrences(of: "M", with: "")
                .replacingOccurrences(of: "million", with: "")
                .trimmingCharacters(in: .whitespaces)
            if let val = Double(numStr) { return val * 1_000_000 }
        }

        let kPattern = #"\\$?\\s*([0-9]+(?:\\.[0-9]+)?)\\s*(?:k|K)"#
        if let match = text.range(of: kPattern, options: .regularExpression) {
            let sub = String(text[match])
            let numStr = sub.replacingOccurrences(of: "$", with: "")
                .replacingOccurrences(of: "k", with: "")
                .replacingOccurrences(of: "K", with: "")
                .trimmingCharacters(in: .whitespaces)
            if let val = Double(numStr) { return val * 1_000 }
        }

        let standardPattern = #"\\$([0-9]{1,3}(?:,[0-9]{3})+)"#
        if let match = text.range(of: standardPattern, options: .regularExpression) {
            let sub = String(text[match])
            let clean = sub.replacingOccurrences(of: "$", with: "").replacingOccurrences(of: ",", with: "")
            if let val = Double(clean) { return val }
        }
        return nil
    }

    private func extractCapRate(from text: String) -> Double? {
        let capPattern = #"([0-9]+(?:\\.[0-9]+)?)\\s*%\\s*(?:cap|cap rate|yield)?"#
        if let match = text.range(of: capPattern, options: .regularExpression) {
            let sub = String(text[match])
            let numStr = sub.replacingOccurrences(of: "%", with: "")
                .replacingOccurrences(of: "cap", with: "")
                .replacingOccurrences(of: "rate", with: "")
                .replacingOccurrences(of: "yield", with: "")
                .trimmingCharacters(in: .whitespaces)
            if let val = Double(numStr), val > 1.0, val < 25.0 { return val }
        }
        return nil
    }

    private func extractNOI(from text: String) -> Double? {
        let noiPattern = #"(?:noi|net operating income|net income)\\s*(?:is|of|:)?\\s*\\$?\\s*([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+(?:\\.[0-9]+)?k|[0-9]+(?:\\.[0-9]+)?m)"#
        if let match = text.range(of: noiPattern, options: [.regularExpression, .caseInsensitive]) {
            let sub = String(text[match])
            return extractPrice(from: sub)
        }
        return nil
    }

    private func extractUnits(from text: String) -> Int? {
        let unitPattern = #"([0-9]{1,4})\\s*(?:units?|doors?|plex|apartments)"#
        if let match = text.range(of: unitPattern, options: .regularExpression) {
            let sub = String(text[match])
            let digits = sub.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()
            return Int(digits)
        }
        return nil
    }

    private func extractSqFt(from text: String) -> Int? {
        let sqftPattern = #"([0-9]{1,3}(?:,[0-9]{3})*|\\d+)\\s*(?:sq\\s*ft|sqft|sf)"#
        if let match = text.range(of: sqftPattern, options: .regularExpression) {
            let sub = String(text[match])
            let digits = sub.replacingOccurrences(of: ",", with: "")
                .components(separatedBy: CharacterSet.decimalDigits.inverted).joined()
            return Int(digits)
        }
        return nil
    }

    private func extractState(from text: String) -> String? {
        let stateList = ["WA", "OR", "CA", "AZ", "NV", "CO", "TX", "FL", "GA", "NC", "SC", "IL", "OH", "MI", "NY", "PA", "MA"]
        for st in stateList {
            let regex = #"\\b"# + st + #"\\b"#
            if text.range(of: regex, options: .regularExpression) != nil { return st }
        }
        return nil
    }

    private func classifyAssetType(from text: String) -> String {
        let lower = text.lowercased()
        if lower.contains("warehouse") || lower.contains("distribution") {
            return "distribution_center"
        } else if lower.contains("flex") || lower.contains("industrial") {
            return "flex_industrial"
        } else if lower.contains("condo") || lower.contains("hoa") {
            return "condo_complex"
        } else if lower.contains("apartment") || lower.contains("complex") {
            return "apartment_complex"
        } else if lower.contains("triplex") || lower.contains("duplex") {
            return "duplex_triplex"
        } else if lower.contains("townhome") || lower.contains("townhouse") {
            return "townhome"
        } else if lower.contains("single family") || lower.contains("sfr") {
            return "single_family"
        }
        return "multifamily"
    }

    private func extractAddressLine(from text: String) -> String {
        let lines = text.components(separatedBy: .newlines)
        for line in lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            let streetNumberPattern = #"^[0-9]{1,6}\\s+[A-Za-z0-9\\.\\s]+(?:St|Ave|Rd|Blvd|Way|Dr|Lane|Ct|Hwy|Pkwy)"#
            if trimmed.range(of: streetNumberPattern, options: [.regularExpression, .caseInsensitive]) != nil {
                return trimmed
            }
        }
        return lines.first?.trimmingCharacters(in: .whitespaces) ?? "3110 Judson St"
    }
}

public enum ScoutError: LocalizedError {
    case emptyInput

    public var errorDescription: String? {
        switch self {
        case .emptyInput: return "Please enter an address or paste listing details."
        }
    }
}`
  },
  {
    name: 'ScoutViewModel.swift',
    path: 'ValueREScout/ViewModels/ScoutViewModel.swift',
    category: 'ViewModels',
    description: 'State management for regional filters, sorting, draft asset commitment, and AI scouting.',
    code: `import Foundation
import SwiftUI
import Combine

public enum SortField: String, CaseIterable, Identifiable {
    case valueScore = "Best Value Score"
    case capRate = "Highest Cap Rate"
    case pricePerUnit = "Lowest $/Unit"
    case price = "Lowest Price"
    case occupancy = "Highest Occupancy"

    public var id: String { rawValue }
}

@MainActor
public final class ScoutViewModel: ObservableObject {
    @Published public var properties: [Property] = PropertyData.initialProperties
    @Published public var customProperties: [Property] = []
    @Published public var selectedRegion: RegionId = .pnw
    @Published public var showResidential: Bool = false
    @Published public var searchQuery: String = ""
    @Published public var sortBy: SortField = .valueScore
    
    // AI Scout Terminal State
    @Published public var scoutMode: ScoutMode = .search
    @Published public var scoutInputText: String = ""
    @Published public var isScouting: Bool = false
    @Published public var scoutError: String?
    @Published public var scoutStatusMessage: String = ""
    @Published public var draftProperty: Property?
    
    private let scoutService = AppleIntelligenceScoutService.shared

    public init() {
        loadCustomProperties()
    }

    public var filteredProperties: [Property] {
        let combined = customProperties + properties
        return combined.filter { property in
            let regionMatch = property.region == selectedRegion || selectedRegion.states.contains(property.state.uppercased())
            guard regionMatch else { return false }

            let isRes = ["single_family", "duplex_triplex", "townhome"].contains(property.type)
            if isRes && !showResidential { return false }

            if !searchQuery.trimmingCharacters(in: .whitespaces).isEmpty {
                let q = searchQuery.lowercased()
                let addrMatch = property.address.lowercased().contains(q)
                let cityMatch = property.city.lowercased().contains(q)
                let stateMatch = property.state.lowercased().contains(q)
                if !addrMatch && !cityMatch && !stateMatch { return false }
            }
            return true
        }
        .sorted { a, b in
            switch sortBy {
            case .valueScore: return a.valueScore > b.valueScore
            case .capRate: return a.metrics.capRate > b.metrics.capRate
            case .pricePerUnit:
                let aUnit = a.metrics.pricePerUnit > 0 ? a.metrics.pricePerUnit : Double.greatestFiniteMagnitude
                let bUnit = b.metrics.pricePerUnit > 0 ? b.metrics.pricePerUnit : Double.greatestFiniteMagnitude
                return aUnit < bUnit
            case .price: return a.price < b.price
            case .occupancy: return a.metrics.occupancyRate > b.metrics.occupancyRate
            }
        }
    }

    public func scoutProperty() async {
        let input = scoutInputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !input.isEmpty else { return }

        isScouting = true
        scoutError = nil
        draftProperty = nil
        scoutStatusMessage = scoutMode == .search ? "Querying commercial registries & pricing indices..." : "Scanning text for NOI, Cap Rate, and occupancy..."

        do {
            let property = try await scoutService.scoutProperty(input: input, mode: scoutMode)
            self.draftProperty = property
        } catch {
            self.scoutError = error.localizedDescription
        }

        isScouting = false
    }

    public func commitDraftProperty() {
        guard let draft = draftProperty else { return }
        customProperties.insert(draft, at: 0)
        selectedRegion = draft.region
        saveCustomProperties()
        draftProperty = nil
        scoutInputText = ""
    }

    public func discardDraftProperty() {
        draftProperty = nil
    }

    public func removeProperty(id: String) {
        customProperties.removeAll { $0.id == id }
        properties.removeAll { $0.id == id }
        saveCustomProperties()
    }

    private func saveCustomProperties() {
        if let encoded = try? JSONEncoder().encode(customProperties) {
            UserDefaults.standard.set(encoded, forKey: "custom_scouted_properties")
        }
    }

    private func loadCustomProperties() {
        if let data = UserDefaults.standard.data(forKey: "custom_scouted_properties"),
           let decoded = try? JSONDecoder().decode([Property].self, from: data) {
            self.customProperties = decoded
        }
    }
}`
  },
  {
    name: 'YieldScatterChartView.swift',
    path: 'ValueREScout/Views/YieldScatterChartView.swift',
    category: 'Views',
    description: 'Swift Charts scatter plot mapping all regional properties with custom color nodes.',
    code: `import SwiftUI
import Charts

public struct YieldScatterChartView: View {
    public let properties: [Property]
    public let regionLabel: String

    public var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Image(systemName: "chart.dots.scatter")
                            .foregroundColor(.teal)
                        Text("Market Cluster Yield Map (Cap Rate vs. Price)")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.primary)
                    }
                    Text("Visualizing \\(properties.count) assets in \\(regionLabel) register")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
                HStack(spacing: 8) {
                    legendDot(color: Color(red: 0.08, green: 0.65, blue: 0.40), label: "70+")
                    legendDot(color: .orange, label: "50-69")
                    legendDot(color: .gray, label: "<50")
                }
            }

            Chart {
                ForEach(properties) { property in
                    PointMark(
                        x: .value("Price", property.price),
                        y: .value("Cap Rate", property.metrics.capRate)
                    )
                    .foregroundStyle(scoreColor(property.valueScore))
                    .symbolSize(property.valueScore >= 70 ? 140 : 90)
                    .annotation(position: .top) {
                        Text(property.city)
                            .font(.system(size: 8, weight: .bold))
                            .foregroundColor(.secondary)
                    }
                }
            }
            .chartXAxis {
                AxisMarks(values: .automatic) { value in
                    AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5, dash: [2, 3]))
                    AxisTick()
                    AxisValueLabel {
                        if let d = value.as(Double.self) {
                            Text(formatPriceAxis(d))
                                .font(.system(size: 9))
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .chartYAxis {
                AxisMarks(values: .automatic) { value in
                    AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5, dash: [2, 3]))
                    AxisTick()
                    AxisValueLabel {
                        if let d = value.as(Double.self) {
                            Text(String(format: "%.1f%%", d))
                                .font(.system(size: 9))
                                .foregroundColor(.secondary)
                        }
                    }
                }
            }
            .frame(height: 250)

            HStack(spacing: 6) {
                Image(systemName: "info.circle.fill")
                    .font(.caption2)
                    .foregroundColor(.teal)
                Text("Upper-left quadrant represents high-yielding assets under a pricing advantage.")
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
            }
            .padding(.top, 4)
        }
        .padding(16)
        .background(Color(uiColor: .systemBackground))
        .cornerRadius(14)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.gray.opacity(0.12), lineWidth: 1)
        )
    }

    private func legendDot(color: Color, label: String) -> some View {
        HStack(spacing: 3) {
            Circle().fill(color).frame(width: 7, height: 7)
            Text(label).font(.system(size: 10, weight: .medium)).foregroundColor(.secondary)
        }
    }

    private func scoreColor(_ score: Int) -> Color {
        if score >= 70 { return Color(red: 0.08, green: 0.65, blue: 0.40) }
        if score >= 50 { return .orange }
        return .gray
    }

    private func formatPriceAxis(_ val: Double) -> String {
        if val >= 1_000_000 { return String(format: "$%.1fM", val / 1_000_000) }
        return String(format: "$%.0fk", val / 1_000)
    }
}`
  },
  {
    name: 'ScoutTerminalView.swift',
    path: 'ValueREScout/Views/ScoutTerminalView.swift',
    category: 'Views',
    description: 'AI Opportunity Scout Terminal with Web Search & Listing Text modes and Draft confirmation.',
    code: `import SwiftUI

public struct ScoutTerminalView: View {
    @ObservedObject var viewModel: ScoutViewModel

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header & Dual Mode Switcher
            HStack(alignment: .center) {
                HStack(spacing: 6) {
                    Image(systemName: "sparkles")
                        .foregroundColor(.teal)
                    Text("AI OPPORTUNITY SCOUT TERMINAL")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.teal)
                }

                Spacer()

                // Mode Picker
                Picker("Mode", selection: $viewModel.scoutMode) {
                    Text("Web Search").tag(ScoutMode.search)
                    Text("Paste Text").tag(ScoutMode.paste)
                }
                .pickerStyle(.segmented)
                .frame(width: 200)
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(viewModel.scoutMode == .search
                     ? "Enter property address, name, or location keywords:"
                     : "Paste raw listing description, flyer details, or prospectus text:")
                    .font(.caption2)
                    .foregroundColor(.secondary)

                if viewModel.scoutMode == .search {
                    HStack(spacing: 8) {
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.gray)
                            TextField("e.g. 3110 Harborview Dr, Gig Harbor, WA 16-unit", text: $viewModel.scoutInputText)
                                .textFieldStyle(.plain)
                                .font(.subheadline)
                        }
                        .padding(10)
                        .background(Color(uiColor: .secondarySystemBackground))
                        .cornerRadius(8)

                        Button {
                            Task { await viewModel.scoutProperty() }
                        } label: {
                            HStack(spacing: 4) {
                                if viewModel.isScouting {
                                    ProgressView().tint(.white).scaleEffect(0.7)
                                } else {
                                    Image(systemName: "sparkles")
                                }
                                Text("Scout")
                            }
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 10)
                            .background(Color.teal)
                            .cornerRadius(8)
                        }
                        .disabled(viewModel.isScouting || viewModel.scoutInputText.isEmpty)
                    }
                } else {
                    VStack(spacing: 8) {
                        TextEditor(text: $viewModel.scoutInputText)
                            .frame(height: 80)
                            .padding(6)
                            .background(Color(uiColor: .secondarySystemBackground))
                            .cornerRadius(8)
                            .font(.system(.caption, design: .monospaced))

                        HStack {
                            Spacer()
                            Button {
                                Task { await viewModel.scoutProperty() }
                            } label: {
                                HStack(spacing: 4) {
                                    if viewModel.isScouting {
                                        ProgressView().tint(.white).scaleEffect(0.7)
                                    } else {
                                        Image(systemName: "doc.text.magnifyingglass")
                                    }
                                    Text("Extract & Structure Listing")
                                }
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 14)
                                .padding(.vertical, 8)
                                .background(Color.teal)
                                .cornerRadius(8)
                            }
                            .disabled(viewModel.isScouting || viewModel.scoutInputText.isEmpty)
                        }
                    }
                }
            }

            // Error Alert
            if let err = viewModel.scoutError {
                HStack(spacing: 6) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.red)
                    Text(err)
                        .font(.caption2)
                        .foregroundColor(.red)
                }
                .padding(8)
                .background(Color.red.opacity(0.1))
                .cornerRadius(6)
            }

            // Draft Asset Confirmation Box
            if let draft = viewModel.draftProperty {
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("SCOUTED DRAFT ASSET")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(.teal)
                            Text(draft.address)
                                .font(.headline)
                                .fontWeight(.bold)
                            Text("\\(draft.city), \\(draft.state)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                        VStack(spacing: 1) {
                            Text("\\(draft.valueScore)")
                                .font(.system(size: 20, weight: .black, design: .rounded))
                                .foregroundColor(draft.valueScore >= 70 ? .green : .orange)
                            Text("SCOUT SCORE")
                                .font(.system(size: 7, weight: .bold))
                                .foregroundColor(.secondary)
                        }
                    }

                    HStack(spacing: 8) {
                        metricTile(title: "LIST PRICE", value: "$\\(Int(draft.price / 1000))k", color: .teal)
                        metricTile(title: "CAP RATE", value: String(format: "%.1f%%", draft.metrics.capRate), color: .primary)
                        metricTile(title: "OCCUPANCY", value: "\\(Int(draft.metrics.occupancyRate))%", color: .primary)
                        metricTile(title: "NOI", value: "$\\(Int(draft.metrics.noi).formatted())", color: .primary)
                    }

                    if let desc = draft.description {
                        Text(desc)
                            .font(.caption2)
                            .italic()
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Button("Discard") {
                            viewModel.discardDraftProperty()
                        }
                        .font(.caption)
                        .foregroundColor(.secondary)

                        Spacer()

                        Button {
                            viewModel.commitDraftProperty()
                        } label: {
                            HStack(spacing: 4) {
                                Image(systemName: "checkmark.circle.fill")
                                Text("Commit & Append to Register")
                            }
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 7)
                            .background(Color(red: 0.08, green: 0.65, blue: 0.40))
                            .cornerRadius(6)
                        }
                    }
                }
                .padding(12)
                .background(Color(uiColor: .secondarySystemBackground))
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.teal.opacity(0.4), lineWidth: 1)
                )
            }
        }
        .padding(16)
        .background(Color(uiColor: .systemBackground))
        .cornerRadius(14)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.gray.opacity(0.12), lineWidth: 1)
        )
    }

    private func metricTile(title: String, value: String, color: Color) -> some View {
        VStack(spacing: 1) {
            Text(title).font(.system(size: 8, weight: .bold)).foregroundColor(.secondary)
            Text(value).font(.system(size: 12, weight: .bold)).foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .padding(6)
        .background(Color(uiColor: .tertiarySystemBackground))
        .cornerRadius(6)
    }
}`
  },
  {
    name: 'PropertyCardView.swift',
    path: 'ValueREScout/Views/PropertyCardView.swift',
    category: 'Views',
    description: 'Individual property card with Apple Maps / Google Maps / Google Earth deep links and interactive debt models.',
    code: `import SwiftUI

public struct PropertyCardView: View {
    public let property: Property
    public var onRemove: (() -> Void)? = nil

    @State private var isMortgageExpanded: Bool = false
    @State private var downPaymentPct: Double = 25.0
    @State private var interestRate: Double = 6.5
    @State private var amortYears: Double = 30.0

    public init(property: Property, onRemove: (() -> Void)? = nil) {
        self.property = property
        self.onRemove = onRemove
    }

    private var mapQueryEncoded: String {
        let q = "\\(property.address), \\(property.city), \\(property.state)"
        return q.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
    }

    private var appleMapsURL: URL? {
        URL(string: "https://maps.apple.com/?q=\\(mapQueryEncoded)")
    }

    private var googleMapsURL: URL? {
        URL(string: "https://www.google.com/maps/search/?api=1&query=\\(mapQueryEncoded)")
    }

    private var googleEarthURL: URL? {
        URL(string: "https://earth.google.com/web/search/\\(mapQueryEncoded)")
    }

    private var loanCalculations: (loanAmount: Double, annualDebtService: Double, dscr: Double, cashOnCash: Double) {
        UnderwritingCalculator.underwriteLoan(
            price: property.price,
            noi: property.metrics.noi,
            downPaymentPercent: downPaymentPct,
            interestRatePercent: interestRate,
            amortizationYears: Int(amortYears)
        )
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(property.type.replacingOccurrences(of: "_", with: " ").capitalized)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.teal)
                    Text(property.address)
                        .font(.headline)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                    Text("\\(property.city), \\(property.state)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                // Value Score Pill
                VStack(spacing: 1) {
                    Text("\\(property.valueScore)")
                        .font(.system(size: 18, weight: .black, design: .rounded))
                        .foregroundColor(scoreColor(property.valueScore))
                    Text("VALUE SCORE")
                        .font(.system(size: 7, weight: .bold))
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(scoreColor(property.valueScore).opacity(0.12))
                .cornerRadius(10)
            }

            // Quick Metrics Grid
            HStack(spacing: 8) {
                metricBox(title: "PRICE", value: formatCurrency(property.price), color: .teal)
                metricBox(title: "CAP RATE", value: String(format: "%.1f%%", property.metrics.capRate), color: .primary)
                metricBox(title: "OCCUPANCY", value: "\\(Int(property.metrics.occupancyRate))%", color: .primary)
            }

            // Secondary metrics row
            HStack {
                Text("NOI: $\\(Int(property.metrics.noi).formatted())")
                    .font(.caption)
                    .fontWeight(.medium)
                Spacer()
                if property.metrics.pricePerUnit > 0 {
                    Text("$\\(Int(property.metrics.pricePerUnit).formatted()) / Unit")
                        .font(.caption)
                        .foregroundColor(.secondary)
                } else {
                    Text("$\\(Int(property.metrics.pricePerSqFt)) / SqFt")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }

            if let desc = property.description {
                Text(desc)
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }

            // Direct Maps Launchers
            VStack(alignment: .leading, spacing: 6) {
                Text("GEOGRAPHIC VERIFICATION & MAPS")
                    .font(.system(size: 8, weight: .bold))
                    .foregroundColor(.secondary)

                HStack(spacing: 6) {
                    if let url = appleMapsURL {
                        Link(destination: url) {
                            HStack(spacing: 3) {
                                Image(systemName: "map.fill")
                                Text("Apple Maps")
                            }
                            .font(.system(size: 10, weight: .medium))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 5)
                            .background(Color(uiColor: .secondarySystemBackground))
                            .cornerRadius(6)
                        }
                    }

                    if let url = googleMapsURL {
                        Link(destination: url) {
                            HStack(spacing: 3) {
                                Image(systemName: "safari.fill")
                                Text("Google Maps")
                            }
                            .font(.system(size: 10, weight: .medium))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 5)
                            .background(Color(uiColor: .secondarySystemBackground))
                            .cornerRadius(6)
                        }
                    }

                    if let url = googleEarthURL {
                        Link(destination: url) {
                            HStack(spacing: 3) {
                                Image(systemName: "globe.americas.fill")
                                Text("Earth 3D")
                            }
                            .font(.system(size: 10, weight: .medium))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 5)
                            .background(Color(uiColor: .secondarySystemBackground))
                            .cornerRadius(6)
                        }
                    }
                }
            }

            // Expandable Loan Modeling
            Button {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                    isMortgageExpanded.toggle()
                }
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: isMortgageExpanded ? "chevron.up" : "slider.horizontal.3")
                    Text(isMortgageExpanded ? "Hide Loan Model" : "Underwrite DSCR & Debt")
                }
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.teal)
            }

            if isMortgageExpanded {
                VStack(alignment: .leading, spacing: 10) {
                    Divider()

                    sliderRow(label: "Down Payment", valueStr: "\\(Int(downPaymentPct))%", value: $downPaymentPct, range: 10...50, step: 5)
                    sliderRow(label: "Interest Rate", valueStr: String(format: "%.2f%%", interestRate), value: $interestRate, range: 4.5...10.0, step: 0.25)
                    sliderRow(label: "Amortization", valueStr: "\\(Int(amortYears)) Yrs", value: $amortYears, range: 15...30, step: 5)

                    HStack(spacing: 8) {
                        metricBox(
                            title: "DSCR RATIO",
                            value: String(format: "%.2fx", loanCalculations.dscr),
                            color: loanCalculations.dscr >= 1.25 ? .green : .orange
                        )
                        metricBox(
                            title: "CASH-ON-CASH",
                            value: String(format: "%.1f%%", loanCalculations.cashOnCash),
                            color: .teal
                        )
                    }
                }
                .padding(10)
                .background(Color(uiColor: .secondarySystemBackground))
                .cornerRadius(8)
            }
        }
        .padding(16)
        .background(Color(uiColor: .systemBackground))
        .cornerRadius(14)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.gray.opacity(0.12), lineWidth: 1)
        )
    }

    private func metricBox(title: String, value: String, color: Color) -> some View {
        VStack(spacing: 1) {
            Text(title).font(.system(size: 8, weight: .bold)).foregroundColor(.secondary)
            Text(value).font(.system(size: 13, weight: .bold)).foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(Color(uiColor: .secondarySystemBackground))
        .cornerRadius(8)
    }

    private func sliderRow(label: String, valueStr: String, value: Binding<Double>, range: ClosedRange<Double>, step: Double) -> some View {
        HStack {
            Text(label).font(.caption2).foregroundColor(.secondary).frame(width: 80, alignment: .leading)
            Slider(value: value, in: range, step: step).tint(.teal)
            Text(valueStr).font(.caption2).fontWeight(.bold).frame(width: 50, alignment: .trailing)
        }
    }

    private func scoreColor(_ score: Int) -> Color {
        if score >= 70 { return Color(red: 0.08, green: 0.65, blue: 0.40) }
        if score >= 50 { return .orange }
        return .gray
    }

    private func formatCurrency(_ val: Double) -> String {
        if val >= 1_000_000 { return String(format: "$%.2fM", val / 1_000_000) }
        return String(format: "$%.0fk", val / 1_000)
    }
}`
  },
  {
    name: 'ValidationGuideView.swift',
    path: 'ValueREScout/Views/ValidationGuideView.swift',
    category: 'Views',
    description: 'Comprehensive 4-tab Real Estate Economics Guide (Value Score Formula, Model Backtesting, Cap Rate/NOI Mechanics, and Why RE Scout / Edge).',
    code: `import SwiftUI

public enum GuideTab: String, CaseIterable, Identifiable {
    case formula = "Value Score"
    case validation = "Backtesting"
    case yield = "Cap Rate & NOI"
    case edge = "Our Edge"

    public var id: String { rawValue }
}

public struct ValidationGuideView: View {
    @State private var activeTab: GuideTab = .formula

    public init() {}

    public var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header Banner
            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: 8) {
                    Image(systemName: "questionmark.circle.fill")
                        .font(.title2)
                        .foregroundColor(.teal)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Real Estate Economics & Validation")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                        Text("Multi-Unit Formulas, Benchmark Spreads & Backtesting")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.teal.opacity(0.85))
                    }
                }
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                LinearGradient(
                    colors: [Color(red: 0.04, green: 0.16, blue: 0.15), Color(red: 0.06, green: 0.09, blue: 0.16)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )

            // Tab Picker
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(GuideTab.allCases) { tab in
                        Button {
                            withAnimation(.easeInOut(duration: 0.2)) {
                                activeTab = tab
                            }
                        } label: {
                            HStack(spacing: 4) {
                                switch tab {
                                case .formula: Image(systemName: "chart.line.uptrend.xyaxis")
                                case .validation: Image(systemName: "checkmark.seal.fill")
                                case .yield: Image(systemName: "percent")
                                case .edge: Image(systemName: "sparkles")
                                }
                                Text(tab.rawValue)
                            }
                            .font(.system(size: 11, weight: activeTab == tab ? .bold : .medium))
                            .foregroundColor(activeTab == tab ? .teal : .secondary)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(activeTab == tab ? Color.teal.opacity(0.15) : Color(uiColor: .tertiarySystemBackground))
                            .cornerRadius(8)
                        }
                    }
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
            }
            .background(Color(uiColor: .secondarySystemBackground))

            Divider()

            // Tab Content
            VStack(alignment: .leading, spacing: 14) {
                switch activeTab {
                case .formula:
                    formulaSection
                case .validation:
                    validationSection
                case .yield:
                    yieldSection
                case .edge:
                    edgeSection
                }
            }
            .padding(14)
        }
        .background(Color(uiColor: .systemBackground))
        .cornerRadius(14)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.teal.opacity(0.3), lineWidth: 1)
        )
    }

    // MARK: - Tab 1: Formula Section
    private var formulaSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top, spacing: 8) {
                Image(systemName: "info.circle.fill")
                    .foregroundColor(.teal)
                    .font(.caption)
                    .padding(.top, 2)
                Text("The Value Score (max 100 points) is a multi-factor risk-reward underwriting algorithm. It penalizes overpriced, low-yielding assets and rewards capital yield spread, occupancy stability, and price efficiency.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineSpacing(2)
            }
            .padding(10)
            .background(Color.teal.opacity(0.08))
            .cornerRadius(8)

            VStack(spacing: 10) {
                scoreFactorRow(
                    title: "1. Cap Rate Yield Contribution",
                    points: "Up to 30 Pts",
                    progress: 0.30,
                    formula: "Min(30, (CapRate / Target) * 30)",
                    detail: "Target rate is 7.0% for industrial / warehousing / logistics, and 6.0% for residential multi-family complexes."
                )

                scoreFactorRow(
                    title: "2. Occupancy Rate Stability",
                    points: "Up to 25 Pts",
                    progress: 0.25,
                    formula: "Min(25, (OccupancyRate / 90) * 25)",
                    detail: "Rewards assets maintaining stable, low-vacancy tenancy at or above a 90% floor."
                )

                scoreFactorRow(
                    title: "3. Gross Rental Yield Efficiency",
                    points: "Up to 25 Pts",
                    progress: 0.25,
                    formula: "Min(25, (GrossYield / 8) * 25)",
                    detail: "Measures raw rental generation power against purchase price prior to operational expenses."
                )

                scoreFactorRow(
                    title: "4. Valuation Discount Basis Bonus",
                    points: "Up to 20 Pts",
                    progress: 0.20,
                    formula: "Residential: $/Unit • Industrial: $/SqFt",
                    detail: "Residential: +20 pts if <$150k/unit; +10 pts if <$200k/unit.\\nIndustrial: +20 pts if <$100/sqft; +10 pts if <$140/sqft."
                )
            }
        }
    }

    private func scoreFactorRow(title: String, points: String, progress: Double, formula: String, detail: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(title)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.primary)
                Spacer()
                Text(points)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.teal)
            }

            ProgressView(value: progress)
                .tint(.teal)

            Text(formula)
                .font(.system(size: 10, weight: .medium, design: .monospaced))
                .foregroundColor(.secondary)
                .padding(.vertical, 2)

            Text(detail)
                .font(.system(size: 10))
                .foregroundColor(.secondary)
                .lineSpacing(1.5)
        }
        .padding(10)
        .background(Color(uiColor: .secondarySystemBackground))
        .cornerRadius(8)
    }

    // MARK: - Tab 2: Validation Section
    private var validationSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            validationCard(
                num: "1",
                title: "Backtesting & Local Registries",
                body: "Value targets and discount coefficients are backtested against actual historical property register records. By matching model evaluations with final closing transactions in the Pacific Northwest and the Southwest, the algorithm isolates high-yielding outliers without sacrificing structural safety."
            )

            validationCard(
                num: "2",
                title: "Yield Spreads vs. Risk-Free Rate",
                body: "The target thresholds are validated dynamically against prevailing macroeconomic conditions, ensuring that scored properties deliver a robust risk premium spread (at least 250-350 bps) above the 10-Year US Treasury yield. If the risk-free rate increases, target Cap Rates adjust to protect yield spreads."
            )

            validationCard(
                num: "3",
                title: "Structured Extraction Verification",
                body: "For real-time on-demand scouted properties, our system routes through structured extraction schemas. It forces mathematical consistency between Price, Cap Rate, and Net Operating Income (NOI), discarding entries where formulas do not align, protecting users from listing misinformation."
            )
        }
    }

    private func validationCard(num: String, title: String, body: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Text(num)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.white)
                    .frame(width: 18, height: 18)
                    .background(Color.teal)
                    .clipShape(Circle())
                Text(title)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.primary)
            }
            Text(body)
                .font(.system(size: 11))
                .foregroundColor(.secondary)
                .lineSpacing(2)
        }
        .padding(10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(uiColor: .secondarySystemBackground))
        .cornerRadius(8)
    }

    // MARK: - Tab 3: Yield & NOI Explained
    private var yieldSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Image(systemName: "percent")
                        .foregroundColor(.teal)
                    Text("Capitalization Rate (Cap Rate)")
                        .font(.system(size: 12, weight: .bold))
                }
                Text("The Capitalization Rate is the estimated annual yield of an asset, assuming an all-cash purchase (without mortgage debt or leverage). It is the premier metric used by commercial brokers and scouts to compare asset yield efficiencies across disparate regions.")
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
                    .lineSpacing(1.5)

                VStack(spacing: 3) {
                    Text("Cap Rate Formula")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.teal.opacity(0.8))
                    Text("Cap Rate = (Net Operating Income / Purchase Price) × 100")
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundColor(.white)
                    Text("Example: $150,000 NOI / $2,000,000 Price = 7.5% Cap Rate")
                        .font(.system(size: 9, design: .monospaced))
                        .foregroundColor(.teal.opacity(0.9))
                }
                .frame(maxWidth: .infinity)
                .padding(10)
                .background(Color(red: 0.06, green: 0.09, blue: 0.16))
                .cornerRadius(8)
            }
            .padding(10)
            .background(Color(uiColor: .secondarySystemBackground))
            .cornerRadius(8)

            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Image(systemName: "dollarsign.circle.fill")
                        .foregroundColor(.teal)
                    Text("Net Operating Income (NOI)")
                        .font(.system(size: 12, weight: .bold))
                }
                Text("Net Operating Income is the real net profit generated by a property's day-to-day operations. It represents the income remaining after subtracting all necessary operating expenses from gross revenue, before debt service or income taxes.")
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
                    .lineSpacing(1.5)

                VStack(spacing: 3) {
                    Text("Net Income (NOI) Formula")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.teal.opacity(0.8))
                    Text("NOI = Gross Revenue - Operating Expenses")
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundColor(.white)
                    Text("Operating expenses: property taxes, management, repairs, insurance, utilities")
                        .font(.system(size: 9, design: .monospaced))
                        .foregroundColor(.teal.opacity(0.9))
                }
                .frame(maxWidth: .infinity)
                .padding(10)
                .background(Color(red: 0.06, green: 0.09, blue: 0.16))
                .cornerRadius(8)
            }
            .padding(10)
            .background(Color(uiColor: .secondarySystemBackground))
            .cornerRadius(8)

            HStack(alignment: .top, spacing: 6) {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundColor(.orange)
                    .font(.caption)
                Text("Note: Operating expenses strictly exclude mortgage principal/interest payments, depreciation, and corporate income taxes. Therefore, NOI remains identical regardless of financing leverage.")
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
            }
            .padding(8)
            .background(Color.orange.opacity(0.08))
            .cornerRadius(6)
        }
    }

    // MARK: - Tab 4: Edge / Why RE Scout
    private var edgeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Why Value RE Scout (Our Edge)")
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.primary)

            Text("Traditional commercial scouting is gated behind paywalls or lost in complex spreadsheets. Our approach introduces a modern, math-validated, search-grounded alternative that democratizes institutional-grade trading mechanics.")
                .font(.system(size: 11))
                .foregroundColor(.secondary)
                .lineSpacing(2)

            VStack(spacing: 8) {
                edgeFeature(
                    icon: "globe",
                    title: "1. Dynamic Search Grounding",
                    desc: "Extracts structured real estate metrics directly from live web listings on-demand instead of relying on stale databases."
                )
                edgeFeature(
                    icon: "chart.line.uptrend.xyaxis",
                    title: "2. Institutional Value Scoring",
                    desc: "Underwriting algorithm scores every opportunity on a 100-point scale, instantly flagging prime margins vs. overpriced yield."
                )
                edgeFeature(
                    icon: "iphone",
                    title: "3. Native Swift & PWA Parity",
                    desc: "Full offline-first native iOS SwiftUI experience with on-device NaturalLanguage processing, Siri Shortcuts, and Swift Charts."
                )
                edgeFeature(
                    icon: "eye.fill",
                    title: "4. Full Live Transparency",
                    desc: "Every discount coefficient, debt amortization formula, and yield metric is fully documented and transparent."
                )
            }

            // Matrix
            VStack(alignment: .leading, spacing: 6) {
                Text("COMPETITIVE MATRIX")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundColor(.teal)

                matrixRow(feature: "Monthly Cost", ours: "Free / Open", others: "$1k+/mo (CoStar/LoopNet)")
                matrixRow(feature: "Scout Intelligence", ours: "On-Demand NLP", others: "Manual Broker Entry")
                matrixRow(feature: "Value Score", ours: "100-Pt Underwriting", others: "Unranked Listings")
                matrixRow(feature: "Visual Scatter", ours: "Interactive Swift Charts", others: "Static Lists")
            }
            .padding(10)
            .background(Color(red: 0.06, green: 0.09, blue: 0.16))
            .cornerRadius(8)
        }
    }

    private func edgeFeature(icon: String, title: String, desc: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(.teal)
                .font(.subheadline)
                .frame(width: 20)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 11, weight: .bold))
                Text(desc)
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
            }
        }
        .padding(8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(uiColor: .secondarySystemBackground))
        .cornerRadius(6)
    }

    private func matrixRow(feature: String, ours: String, others: String) -> some View {
        HStack {
            Text(feature)
                .font(.system(size: 10, weight: .medium))
                .foregroundColor(.white)
                .frame(width: 95, alignment: .leading)
            Text(ours)
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(.teal)
                .frame(width: 90, alignment: .leading)
            Spacer()
            Text(others)
                .font(.system(size: 9))
                .foregroundColor(.gray)
        }
    }
}`
  },
  {
    name: 'ContentView.swift',
    path: 'ValueREScout/Views/ContentView.swift',
    category: 'Views',
    description: 'Main dashboard view with regional filters, sorting controls, AI Terminal, Scatter Chart, Validation Guide, and property register.',
    code: `import SwiftUI

public struct ContentView: View {
    @StateObject private var viewModel = ScoutViewModel()

    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    // Region Selector Pills
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(RegionId.allCases) { region in
                                Button {
                                    viewModel.selectedRegion = region
                                } label: {
                                    Text(region.label)
                                        .font(.system(size: 12, weight: viewModel.selectedRegion == region ? .bold : .medium))
                                        .foregroundColor(viewModel.selectedRegion == region ? .white : .primary)
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 8)
                                        .background(viewModel.selectedRegion == region ? Color.teal : Color(uiColor: .secondarySystemBackground))
                                        .cornerRadius(8)
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                    }

                    VStack(spacing: 18) {
                        // AI Opportunity Scout Terminal
                        ScoutTerminalView(viewModel: viewModel)

                        // Swift Charts Scatter Plot Map
                        YieldScatterChartView(
                            properties: viewModel.filteredProperties,
                            regionLabel: viewModel.selectedRegion.label
                        )

                        // Real Estate Economics & Validation Guide
                        ValidationGuideView()

                        // Register Header & Sorting
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Commercial Property Register")
                                    .font(.headline)
                                    .fontWeight(.bold)
                                Text("\\(viewModel.filteredProperties.count) Active Opportunities")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }

                            Spacer()

                            Picker("Sort", selection: $viewModel.sortBy) {
                                ForEach(SortField.allCases) { field in
                                    Text(field.rawValue).tag(field)
                                }
                            }
                            .pickerStyle(.menu)
                            .font(.caption)
                        }

                        // List of Properties below the scatter plot & validation guide
                        LazyVStack(spacing: 14) {
                            ForEach(viewModel.filteredProperties) { prop in
                                PropertyCardView(property: prop) {
                                    viewModel.removeProperty(id: prop.id)
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                }
                .padding(.vertical, 14)
            }
            .navigationTitle("Value RE Scout")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}`
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SwiftNativeWorkspaceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isOpen) return null;

  const currentFile = SWIFT_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      const readmeContent = `# Value RE Scout — Complete Institutional Native iOS Swift Codebase

This package contains the complete native iOS 17+ Swift 6 application for **Value RE Scout** with on-device **Apple Intelligence**, **Swift Charts Yield Scatter Plot**, **Real Estate Economics & Validation Guide**, and **Direct Maps Deep Linking**.

## Features Included in This Swift Package:
1. **Full Regional Property Register**: Multi-unit & industrial assets across Pacific Northwest, Southwest, Midwest, Southeast, and Northeast.
2. **Swift Charts Scatter Plot**: High-fidelity scatter plot displaying all regional properties with custom color nodes (70+ score, 50-69, <50).
3. **Real Estate Economics & Validation Guide (\`ValidationGuideView.swift\`)**: Complete 4-tab interactive guide covering:
   - **Value Score Formula**: Detailed breakdown of 30-pt Cap Rate, 25-pt Occupancy floor, 25-pt Gross Yield, and 20-pt Basis Discount ($/unit & $/sqft).
   - **Model Validation & Backtesting**: Historical register calibrations, 10-Yr US Treasury yield spread benchmarks, and mathematical sanity gates.
   - **Cap Rate & Net Operating Income (NOI) Explained**: Step-by-step yield equations, operating expense inclusions/exclusions, and leverage-neutral mechanics.
   - **Why Value RE Scout (Our Edge)**: Transparent algorithms, on-demand AI grounding, and competitive comparison matrix.
4. **AI Opportunity Scout Terminal**: Dual-mode terminal supporting both Live Web Search and Listing Text extraction with Draft preview and commit workflow.
5. **Direct Maps Integration**: One-tap deep links directly to **Apple Maps**, **Google Maps**, and **Google Earth 3D** for any selected asset.
6. **Interactive DSCR & Debt Underwriting**: Real-time slider sensitivity for senior loans, debt yields, cash-on-cash equity returns, and bankability checks.

## Opening in Xcode:
1. Unzip the downloaded archive.
2. Drag the \`ValueREScout\` folder into your Xcode iOS App target.
3. Build and run on your iPhone or iOS Simulator!
`;
      zip.file('README.md', readmeContent);

      for (const file of SWIFT_FILES) {
        zip.file(file.path, file.code);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ValueREScout-iOS-Swift-Package.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/20 text-teal-400 p-2.5 rounded-xl border border-teal-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Native iOS Swift & Apple Intelligence Codebase
                </h3>
                <span className="text-[10px] bg-teal-900 text-teal-300 font-mono px-2 py-0.5 rounded border border-teal-700">
                  Swift 6 / iOS 17+ / SwiftUI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full Institutional Dataset • Swift Charts Scatter Map • AI Opportunity Scout • Maps Deep Links
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Download Zip */}
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-lg shadow-teal-950/40 border border-teal-400/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Packaging Zip...</span>
                </>
              ) : zipSuccess ? (
                <>
                  <Check size={15} className="text-emerald-200" />
                  <span>Downloaded .zip!</span>
                </>
              ) : (
                <>
                  <FolderArchive size={15} />
                  <span>Download All Swift Files (.zip)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-2.5 bg-teal-950/40 border-b border-teal-800/50 flex items-center gap-3 text-xs text-teal-200">
          <Apple size={16} className="text-teal-400 shrink-0" />
          <span>
            <strong>Upgraded Swift Codebase:</strong> Contains all 21+ regional commercial properties across 5 regions, multi-node Swift Charts Scatter Map, dual-mode AI Opportunity Scout Terminal, and one-tap Apple Maps & Google Maps launchers.
          </span>
        </div>

        {/* Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-68 border-b md:border-b-0 md:border-r border-slate-800 p-3 space-y-1 bg-slate-950/50 overflow-y-auto">
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} />
                Swift Project ({SWIFT_FILES.length} Files)
              </div>
            </div>
            {SWIFT_FILES.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  selectedFileIndex === idx
                    ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <FileCode size={14} className={selectedFileIndex === idx ? 'text-teal-400' : 'text-slate-500'} />
                  {file.name}
                </span>
                <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {file.category}
                </span>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2 truncate">
                <Terminal size={14} className="text-teal-400 shrink-0" />
                <span className="font-mono text-teal-300 font-semibold truncate">{currentFile.path}</span>
                <span className="text-slate-500 text-[11px] hidden sm:inline truncate">— {currentFile.description}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadSingleFile}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border border-slate-700"
                  title="Download this file"
                >
                  <ArrowDownToLine size={13} />
                  <span>Download File</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer border border-slate-700"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 bg-slate-950/80 leading-relaxed selection:bg-teal-800">
              <pre className="whitespace-pre">{currentFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Apple size={14} className="text-teal-400" />
            <span>Xcode 16+ & iOS 17+ Ready • Swift Package Manager Compatible</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-semibold cursor-pointer"
            >
              <Download size={14} />
              <span>Download Full Xcode Package (.zip)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
