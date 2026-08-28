import SwiftUI

public struct PropertyDossierPDFView: View {
    public let property: Property
    public let loanModel: (loanAmount: Double, annualDebtService: Double, dscr: Double, cashOnCash: Double, debtYield: Double)
    public let parcelData: OpenParcelRegistryService.ParcelRecord?

    public init(
        property: Property,
        loanModel: (loanAmount: Double, annualDebtService: Double, dscr: Double, cashOnCash: Double, debtYield: Double),
        parcelData: OpenParcelRegistryService.ParcelRecord? = nil
    ) {
        self.property = property
        self.loanModel = loanModel
        self.parcelData = parcelData
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Document Header
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 6) {
                        Image(systemName: "building.2.crop.circle.fill")
                            .font(.title3)
                            .foregroundColor(Color(red: 0.05, green: 0.35, blue: 0.30))
                        Text("RE SCOUT")
                            .font(.system(size: 18, weight: .black, design: .rounded))
                            .tracking(1.5)
                            .foregroundColor(Color(red: 0.02, green: 0.20, blue: 0.18))
                    }
                    Text("INSTITUTIONAL UNDERWRITING MEMORANDUM")
                        .font(.system(size: 9, weight: .heavy))
                        .tracking(1.2)
                        .foregroundColor(.secondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text("CONFIDENTIAL")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.red.opacity(0.8))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.red.opacity(0.1))
                        .cornerRadius(4)
                    Text("Generated: \(Date().formatted(date: .abbreviated, time: .shortened))")
                        .font(.system(size: 8))
                        .foregroundColor(.secondary)
                }
            }

            Divider()

            // Executive Summary Banner
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(property.address)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.primary)
                    Text("\(property.city), \(property.state) • \(property.region.label) • \(property.type.replacingOccurrences(of: "_", with: " ").capitalized)")
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                }

                Spacer()

                // Value Score Callout
                VStack(spacing: 1) {
                    Text("\(property.valueScore)")
                        .font(.system(size: 24, weight: .black, design: .rounded))
                        .foregroundColor(scoreColor(property.valueScore))
                    Text("VALUE SCORE")
                        .font(.system(size: 7, weight: .bold))
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(scoreColor(property.valueScore).opacity(0.12))
                .cornerRadius(8)
            }
            .padding(12)
            .background(Color(uiColor: .secondarySystemBackground))
            .cornerRadius(8)

            // Valuation & Core Financial Metrics Grid
            VStack(alignment: .leading, spacing: 8) {
                Text("1. ACQUISITION & RETURN SUMMARY")
                    .font(.system(size: 11, weight: .heavy))
                    .foregroundColor(Color(red: 0.05, green: 0.35, blue: 0.30))

                Grid(horizontalSpacing: 16, verticalSpacing: 10) {
                    GridRow {
                        pdfMetricCell(title: "Asking Price", value: formatCurrency(property.price), highlight: true)
                        pdfMetricCell(title: "In-Place Cap Rate", value: String(format: "%.2f%%", property.metrics.capRate), highlight: true)
                        pdfMetricCell(title: "Net Operating Income (NOI)", value: formatCurrency(property.metrics.noi))
                    }
                    GridRow {
                        pdfMetricCell(title: "Price per Unit", value: property.metrics.pricePerUnit > 0 ? formatCurrency(property.metrics.pricePerUnit) : "N/A")
                        pdfMetricCell(title: "Price per Sq Ft", value: "$\(Int(property.metrics.pricePerSqFt))/SF")
                        pdfMetricCell(title: "Gross Yield", value: String(format: "%.1f%%", property.metrics.grossYield))
                    }
                    GridRow {
                        pdfMetricCell(title: "In-Place Occupancy", value: "\(Int(property.metrics.occupancyRate))%")
                        pdfMetricCell(title: "Total Units", value: property.metrics.unitCount != nil ? "\(property.metrics.unitCount!) Units" : "N/A")
                        pdfMetricCell(title: "Gross Building Area", value: property.sqft != nil ? "\(property.sqft!) SF" : "N/A")
                    }
                }
                .padding(10)
                .background(Color(uiColor: .secondarySystemBackground).opacity(0.5))
                .cornerRadius(8)
            }

            // Institutional Debt & Sensitivity Analysis
            VStack(alignment: .leading, spacing: 8) {
                Text("2. DEBT SIZING & SENSITIVITY MODEL")
                    .font(.system(size: 11, weight: .heavy))
                    .foregroundColor(Color(red: 0.05, green: 0.35, blue: 0.30))

                Grid(horizontalSpacing: 16, verticalSpacing: 10) {
                    GridRow {
                        pdfMetricCell(title: "Loan Amount (Sized)", value: formatCurrency(loanModel.loanAmount))
                        pdfMetricCell(title: "DSCR Ratio", value: String(format: "%.2fx", loanModel.dscr), highlight: true)
                        pdfMetricCell(title: "Cash-on-Cash Return", value: String(format: "%.1f%%", loanModel.cashOnCash), highlight: true)
                    }
                    GridRow {
                        pdfMetricCell(title: "Annual Debt Service", value: formatCurrency(loanModel.annualDebtService))
                        pdfMetricCell(title: "Debt Yield (NOI / Loan)", value: String(format: "%.1f%%", loanModel.debtYield))
                        pdfMetricCell(title: "Bankability Rating", value: loanModel.dscr >= 1.25 ? "Class-A Bankable" : "Elevated Risk")
                    }
                }
                .padding(10)
                .background(Color(uiColor: .secondarySystemBackground).opacity(0.5))
                .cornerRadius(8)
            }

            // GIS, Tax & Environmental Risk
            if let p = parcelData {
                VStack(alignment: .leading, spacing: 8) {
                    Text("3. MUNICIPAL GIS & TAX PARCEL DATA")
                        .font(.system(size: 11, weight: .heavy))
                        .foregroundColor(Color(red: 0.05, green: 0.35, blue: 0.30))

                    Grid(horizontalSpacing: 16, verticalSpacing: 10) {
                        GridRow {
                            pdfMetricCell(title: "Assessor Parcel Number (APN)", value: p.apn)
                            pdfMetricCell(title: "Zoning Designation", value: p.zoning)
                            pdfMetricCell(title: "Flood Hazard Zone", value: p.floodZone)
                        }
                        GridRow {
                            pdfMetricCell(title: "Total Assessed Value", value: formatCurrency(p.totalAssessedValue))
                            pdfMetricCell(title: "Annual Property Tax", value: formatCurrency(p.annualTax))
                            pdfMetricCell(title: "Environmental Status", value: p.environmentalStatus)
                        }
                    }
                    .padding(10)
                    .background(Color(uiColor: .secondarySystemBackground).opacity(0.5))
                    .cornerRadius(8)
                }
            }

            if let desc = property.description {
                VStack(alignment: .leading, spacing: 4) {
                    Text("4. FIELD SCOUT NOTES & THESIS")
                        .font(.system(size: 11, weight: .heavy))
                        .foregroundColor(Color(red: 0.05, green: 0.35, blue: 0.30))
                    Text(desc)
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                        .padding(8)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(uiColor: .secondarySystemBackground).opacity(0.5))
                        .cornerRadius(6)
                }
            }

            Spacer()

            // Footer
            VStack(spacing: 4) {
                Divider()
                HStack {
                    Text("RE Scout Engine • On-Device Neural Intelligence")
                        .font(.system(size: 8))
                        .foregroundColor(.secondary)
                    Spacer()
                    Text("Strictly for Underwriting Assessment • Page 1 of 1")
                        .font(.system(size: 8))
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(32)
        .frame(width: 595, height: 842) // Standard A4 Point dimensions
        .background(Color.white)
    }

    private func pdfMetricCell(title: String, value: String, highlight: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(title)
                .font(.system(size: 8, weight: .semibold))
                .foregroundColor(.secondary)
            Text(value)
                .font(.system(size: 12, weight: highlight ? .black : .bold))
                .foregroundColor(highlight ? Color(red: 0.05, green: 0.35, blue: 0.30) : .primary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func scoreColor(_ score: Int) -> Color {
        if score >= 70 { return Color(red: 0.08, green: 0.65, blue: 0.40) }
        if score >= 50 { return Color.orange }
        return Color.red.opacity(0.85)
    }

    private func formatCurrency(_ val: Double) -> String {
        if val >= 1_000_000 {
            return String(format: "$%.2fM", val / 1_000_000)
        }
        return String(format: "$%.0fk", val / 1_000)
    }
}
