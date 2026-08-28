import Foundation

/// Pure underwriting & financial modeling engine for commercial & residential real estate.
public enum UnderwritingCalculator {

    /// Calculates the Value Score (0–100) based on Cap Rate, Price per Unit/SqFt, and Occupancy.
    ///
    /// Weights:
    /// - Cap Rate Yield Weight: 50%
    /// - Price Discount Weight: 30%
    /// - Occupancy Health Weight: 20%
    public static func calculateValueScore(
        price: Double,
        metrics: FinancialMetrics,
        assetType: String
    ) -> Int {
        // 1. Cap Rate component (0 - 50 points)
        // Baseline 4% (0 pts), Target 8%+ (50 pts)
        let capRateNormalized = max(0.0, min(1.0, (metrics.capRate - 4.0) / 4.5))
        let capScore = capRateNormalized * 50.0

        // 2. Price Discount / Valuation Component (0 - 30 points)
        let isResidential = ["single_family", "duplex_triplex", "townhome"].contains(assetType)
        let priceScore: Double
        if isResidential {
            // Evaluated on Price per SqFt relative to typical $300/sqft
            let ppsf = metrics.pricePerSqFt > 0 ? metrics.pricePerSqFt : 250.0
            let ppsfFactor = max(0.0, min(1.0, (400.0 - ppsf) / 250.0))
            priceScore = ppsfFactor * 30.0
        } else {
            // Evaluated on Price per Unit relative to typical $180,000/unit
            let ppu = metrics.pricePerUnit > 0 ? metrics.pricePerUnit : 150_000.0
            let ppuFactor = max(0.0, min(1.0, (250_000.0 - ppu) / 150_000.0))
            priceScore = ppuFactor * 30.0
        }

        // 3. Occupancy Health (0 - 20 points)
        // Baseline 80% (0 pts), 100% (20 pts)
        let occNormalized = max(0.0, min(1.0, (metrics.occupancyRate - 80.0) / 20.0))
        let occScore = occNormalized * 20.0

        let total = Int(round(capScore + priceScore + occScore))
        return max(15, min(98, total))
    }

    /// Derives complete financial metrics given price, NOI or Cap Rate, and physical dimensions.
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
            // Default 6.8% market assumption
            computedCapRate = 6.8
            computedNOI = safePrice * 0.068
        }

        let units = unitCount ?? 1
        let safeSqft = max(1, sqft ?? 2000)

        let pricePerUnit = safePrice / Double(max(1, units))
        let pricePerSqFt = safePrice / Double(safeSqft)
        let grossYield = computedCapRate * 1.35 // typical operating expense ratio assumption ~35%

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

    /// Calculates Debt Service Coverage Ratio (DSCR) & Cash-on-Cash Return
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
            monthlyPayment = loanAmount * (monthlyRate * pow(1 + monthlyRate, totalMonths)) / (pow(1 + monthlyRate, totalMonths) - 1)
        } else {
            monthlyPayment = loanAmount / totalMonths
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
}
