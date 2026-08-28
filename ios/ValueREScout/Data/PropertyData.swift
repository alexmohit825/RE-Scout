import Foundation

public enum PropertyData {
    public static let initialProperties: [Property] = [
        Property(
            id: "pnw-1",
            address: "3110 Judson St",
            city: "Gig Harbor",
            state: "WA",
            region: .pnw,
            type: "multifamily",
            price: 1_450_000,
            metrics: FinancialMetrics(
                capRate: 7.8,
                pricePerUnit: 181_250,
                pricePerSqFt: 245,
                occupancyRate: 100,
                noi: 113_100,
                grossYield: 10.2,
                unitCount: 8
            ),
            valueScore: 88,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Timberland Bank",
                outstandingBalance: 980_000,
                monthlyPayment: 6_200,
                interestRate: 6.25
            ),
            sqft: 5_918,
            yearBuilt: 1988,
            description: "8-Unit harbor view multi-family asset with full historical occupancy.",
            latitude: 47.3293,
            longitude: -122.5801
        ),
        Property(
            id: "pnw-2",
            address: "1420 NW Gilman Blvd",
            city: "Issaquah",
            state: "WA",
            region: .pnw,
            type: "flex_industrial",
            price: 2_890_000,
            metrics: FinancialMetrics(
                capRate: 7.4,
                pricePerUnit: 2_890_000,
                pricePerSqFt: 215,
                occupancyRate: 95,
                noi: 213_860,
                grossYield: 9.8,
                unitCount: 1
            ),
            valueScore: 82,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "KeyBank CRE",
                outstandingBalance: 1_850_000,
                monthlyPayment: 11_400,
                interestRate: 6.1
            ),
            sqft: 13_440,
            yearBuilt: 1999,
            description: "Prime Eastside light industrial facility with grade-level roll-up bays.",
            latitude: 47.5412,
            longitude: -122.0520
        ),
        Property(
            id: "pnw-3",
            address: "8840 SW Canyon Rd",
            city: "Portland",
            state: "OR",
            region: .pnw,
            type: "multifamily",
            price: 3_250_000,
            metrics: FinancialMetrics(
                capRate: 7.1,
                pricePerUnit: 203_125,
                pricePerSqFt: 220,
                occupancyRate: 94,
                noi: 230_750,
                grossYield: 9.4,
                unitCount: 16
            ),
            valueScore: 78,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Umpqua Bank",
                outstandingBalance: 2_100_000,
                monthlyPayment: 13_100,
                interestRate: 6.4
            ),
            sqft: 14_772,
            yearBuilt: 1994,
            description: "16-Unit garden style multi-family community with stable in-place cash flow.",
            latitude: 45.5035,
            longitude: -122.7667
        ),
        Property(
            id: "sw-1",
            address: "2410 E McDowell Rd",
            city: "Phoenix",
            state: "AZ",
            region: .southwest,
            type: "industrial_warehouse",
            price: 2_450_000,
            metrics: FinancialMetrics(
                capRate: 7.6,
                pricePerUnit: 2_450_000,
                pricePerSqFt: 148,
                occupancyRate: 100,
                noi: 186_200,
                grossYield: 10.1,
                unitCount: 1
            ),
            valueScore: 84,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Western Alliance",
                outstandingBalance: 1_600_000,
                monthlyPayment: 9_900,
                interestRate: 6.3
            ),
            sqft: 16_550,
            yearBuilt: 2002,
            description: "Distribution warehouse with dual dock-high doors in Phoenix logistics corridor.",
            latitude: 33.4658,
            longitude: -112.0298
        ),
        Property(
            id: "mw-1",
            address: "1520 W Grand Ave",
            city: "Chicago",
            state: "IL",
            region: .midwest,
            type: "multifamily",
            price: 1_850_000,
            metrics: FinancialMetrics(
                capRate: 8.2,
                pricePerUnit: 154_166,
                pricePerSqFt: 175,
                occupancyRate: 96,
                noi: 151_700,
                grossYield: 11.2,
                unitCount: 12
            ),
            valueScore: 91,
            loan: LoanDetails(
                hasLoan: true,
                bankName: "Wintrust Bank",
                outstandingBalance: 1_200_000,
                monthlyPayment: 7_500,
                interestRate: 6.2
            ),
            sqft: 10_570,
            yearBuilt: 1978,
            description: "12-Unit brick multi-family with high cap rate and value-add rent bump upside.",
            latitude: 41.8914,
            longitude: -87.6658
        )
    ]
}
