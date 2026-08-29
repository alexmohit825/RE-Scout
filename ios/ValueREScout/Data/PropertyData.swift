import Foundation

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
            description: "24-Unit core multifamily asset in East Central Spokane revitalization corridor.",
            latitude: 47.6588,
            longitude: -117.426
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
            description: "20-Unit garden style community with on-site parking and steady Seattle occupancy.",
            latitude: 47.6062,
            longitude: -122.3321
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
            description: "Close-in Eastside logistics warehouse with heavy 3-phase power and roll-up loading bays.",
            latitude: 45.5152,
            longitude: -122.6784
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
            description: "16-Unit boutique waterfront view apartment complex with premium historical tenant retention.",
            latitude: 47.3293,
            longitude: -122.5801
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
            description: "Brewery District industrial manufacturing flex asset with 18ft clear ceiling heights.",
            latitude: 47.2529,
            longitude: -122.4443
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
            description: "12-Unit garden court apartments near commuter rail station with individually metered utilities.",
            latitude: 47.1854,
            longitude: -122.2929
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
            description: "Sumner industrial valley freight logistics hub with 6 dock-high doors and wide apron turning radius.",
            latitude: 47.2032,
            longitude: -122.2415
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
            description: "Direct I-5 highway exposure flex industrial building with showroom and warehouse components.",
            latitude: 47.6062,
            longitude: -122.3321
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
            description: "20-Unit residential condo complex package sold in bulk with dedicated garage parking.",
            latitude: 47.6062,
            longitude: -122.3321
        ),
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
            description: "West Phoenix distribution facility with 24ft clear height and fenced staging yard.",
            latitude: 33.4484,
            longitude: -112.074
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
            description: "30-Unit transit-oriented multifamily building near downtown Denver light rail.",
            latitude: 39.7392,
            longitude: -104.9903
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
            description: "Multi-tenant light commercial flex building with storefront suites and rear warehouse bays.",
            latitude: 36.1699,
            longitude: -115.1398
        ),
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
            description: "20-Unit brick walk-up building with strong in-place cash flow and low basis per unit.",
            latitude: 41.8781,
            longitude: -87.6298
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
            description: "15-Unit mixed-use residential apartment building in Ohio City historic district.",
            latitude: 47.6062,
            longitude: -122.3321
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
            description: "High-cube freight logistics facility near marine terminal with cross-docking infrastructure.",
            latitude: 42.3314,
            longitude: -83.0458
        ),
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
            description: "40-Unit Wynwood adjacent multi-family community with strong appreciation upside.",
            latitude: 25.7617,
            longitude: -80.1918
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
            description: "West Midtown industrial corridor warehouse with rail access and heavy container parking.",
            latitude: 33.749,
            longitude: -84.388
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
            description: "30-Unit SouthPark suburban community with pool and newly renovated club lounge.",
            latitude: 35.2271,
            longitude: -80.8431
        ),
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
            description: "North Broad commercial corridor flex building with freight elevator and sub-dividable floors.",
            latitude: 39.9526,
            longitude: -75.1652
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
            description: "20-Unit prime Boerum Hill elevator building with in-unit laundry and roof deck.",
            latitude: 47.6062,
            longitude: -122.3321
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
            description: "30-Unit South End brick brownstone style apartment community with high historical occupancy.",
            latitude: 42.3601,
            longitude: -71.0589
        )
    ]
}
