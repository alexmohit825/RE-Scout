import SwiftUI
import MapKit

public struct PropertyCardView: View {
    public let property: Property
    public var onRemove: (() -> Void)? = nil

    @State private var isMortgageExpanded: Bool = false
    @State private var isParcelExpanded: Bool = false
    @State private var downPaymentPct: Double = 25.0
    @State private var interestRate: Double = 6.5
    @State private var amortYears: Double = 30.0
    @State private var parcelData: OpenParcelRegistryService.ParcelRecord? = nil
    @State private var isLoadingParcel: Bool = false
    @State private var exportedPDFURL: URL? = nil
    @State private var isSharePresented: Bool = false

    public init(property: Property, onRemove: (() -> Void)? = nil) {
        self.property = property
        self.onRemove = onRemove
    }

    private var loanCalculations: (loanAmount: Double, annualDebtService: Double, dscr: Double, cashOnCash: Double, debtYield: Double) {
        let res = UnderwritingCalculator.underwriteLoan(
            price: property.price,
            noi: property.metrics.noi,
            downPaymentPercent: downPaymentPct,
            interestRatePercent: interestRate,
            amortizationYears: Int(amortYears)
        )
        let debtYield = res.loanAmount > 0 ? (property.metrics.noi / res.loanAmount) * 100.0 : 0.0
        return (
            loanAmount: res.loanAmount,
            annualDebtService: res.annualDebtService,
            dscr: res.dscr,
            cashOnCash: res.cashOnCash,
            debtYield: Double(round(debtYield * 10) / 10)
        )
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header: Address + Value Score Badge
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 6) {
                        Text(property.address)
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.primary)

                        if let src = property.source, src.contains("Apple Intelligence") {
                            Image(systemName: "apple.intelligence")
                                .font(.caption)
                                .foregroundColor(.teal)
                        }
                    }

                    Text("\(property.city), \(property.state) • \(property.type.replacingOccurrences(of: "_", with: " ").capitalized)")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                Spacer()

                // Value Score Pill
                VStack(spacing: 2) {
                    Text("\(property.valueScore)")
                        .font(.system(size: 18, weight: .black, design: .rounded))
                        .foregroundColor(scoreColor(property.valueScore))
                    Text("VALUE SCORE")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(scoreColor(property.valueScore).opacity(0.12))
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(scoreColor(property.valueScore).opacity(0.3), lineWidth: 1)
                )
            }

            // Key Metrics Banner
            HStack {
                VStack(alignment: .leading, spacing: 1) {
                    Text("Asking Price").font(.caption2).foregroundColor(.secondary)
                    Text(formatCurrency(property.price)).font(.title3).fontWeight(.heavy)
                }

                Spacer()

                VStack(alignment: .center, spacing: 1) {
                    Text("In-Place Cap").font(.caption2).foregroundColor(.secondary)
                    Text(String(format: "%.1f%%", property.metrics.capRate)).font(.title3).fontWeight(.heavy)
                        .foregroundColor(.teal)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 1) {
                    Text("In-Place NOI").font(.caption2).foregroundColor(.secondary)
                    Text(formatCurrency(property.metrics.noi)).font(.title3).fontWeight(.heavy)
                }
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 14)
            .background(Color.scoutSecondaryBackground)
            .cornerRadius(10)

            // Secondary Metric Chips
            HStack(spacing: 8) {
                metricChip(label: "Price/Unit", value: formatCurrency(property.metrics.pricePerUnit))
                metricChip(label: "Price/SF", value: "$\(Int(property.metrics.pricePerSqFt))/sf")
                metricChip(label: "Occupancy", value: "\(Int(property.metrics.occupancyRate))%")
                if let units = property.metrics.unitCount {
                    metricChip(label: "Units", value: "\(units)")
                }
            }

            if let desc = property.description {
                Text(desc)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }

            // Interactive Action Buttons
            HStack(spacing: 8) {
                // Toggle Mortgage Calculator Sheet
                Button {
                    withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                        isMortgageExpanded.toggle()
                        ScoutHaptic.triggerLight()
                    }
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: isMortgageExpanded ? "chevron.up.circle.fill" : "slider.horizontal.3")
                        Text(isMortgageExpanded ? "Hide Loan Model" : "Underwrite DSCR & Debt")
                    }
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.teal)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.teal.opacity(0.12))
                    .cornerRadius(8)
                }

                // Municipal GIS Parcel Inspector
                Button {
                    withAnimation(.spring()) {
                        isParcelExpanded.toggle()
                        if isParcelExpanded && parcelData == nil {
                            Task {
                                isLoadingParcel = true
                                parcelData = await OpenParcelRegistryService.shared.fetchParcelRecord(
                                    for: property.id,
                                    city: property.city,
                                    state: property.state
                                )
                                isLoadingParcel = false
                            }
                        }
                    }
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "map.fill")
                        Text("GIS & Zoning")
                    }
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.primary)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.scoutSecondaryBackground)
                    .cornerRadius(8)
                }

                // Export 1-Page PDF Tear Sheet
                Button {
                    if let url = PDFExportService.shared.exportUnderwritingPDF(
                        property: property,
                        loanModel: loanCalculations,
                        parcelData: parcelData
                    ) {
                        self.exportedPDFURL = url
                        self.isSharePresented = true
                    }
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "doc.text.fill")
                        Text("PDF Memo")
                    }
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.teal)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.teal.opacity(0.12))
                    .cornerRadius(8)
                }

                Spacer()

                // Remove Button (if custom)
                if let onRemove = onRemove {
                    Button(role: .destructive, action: onRemove) {
                        Image(systemName: "trash")
                            .font(.caption)
                            .foregroundColor(.red.opacity(0.8))
                    }
                    .padding(6)
                }
            }
            .sheet(isPresented: $isSharePresented) {
                if let url = exportedPDFURL {
                    ShareSheetRepresentable(activityItems: [url])
                }
            }

            // Expanded Mortgage & DSCR Underwriting Panel
            if isMortgageExpanded {
                VStack(alignment: .leading, spacing: 12) {
                    Divider()

                    Text("Institutional Debt Underwriting & Sensitivity")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.primary)

                    // Sliders
                    VStack(spacing: 8) {
                        sliderRow(label: "Down Payment", valueStr: "\(Int(downPaymentPct))%", value: $downPaymentPct, range: 10...50, step: 5)
                        sliderRow(label: "Interest Rate", valueStr: String(format: "%.2f%%", interestRate), value: $interestRate, range: 4.5...10.0, step: 0.25)
                        sliderRow(label: "Amortization", valueStr: "\(Int(amortYears)) Yrs", value: $amortYears, range: 15...30, step: 5)
                    }

                    // Result Grid
                    HStack(spacing: 8) {
                        resultBox(
                            title: "DSCR Ratio",
                            value: String(format: "%.2fx", loanCalculations.dscr),
                            color: loanCalculations.dscr >= 1.25 ? .green : (loanCalculations.dscr >= 1.0 ? .orange : .red),
                            caption: loanCalculations.dscr >= 1.25 ? "Lender Bankable" : "High Default Risk"
                        )
                        resultBox(
                            title: "Cash-on-Cash",
                            value: String(format: "%.1f%%", loanCalculations.cashOnCash),
                            color: .teal,
                            caption: "Net Equity Yield"
                        )
                        resultBox(
                            title: "Debt Yield",
                            value: String(format: "%.1f%%", loanCalculations.debtYield),
                            color: .primary,
                            caption: "NOI / Loan Size"
                        )
                    }

                    HStack {
                        Text("Annual Debt Service:")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                        Text(formatCurrency(loanCalculations.annualDebtService))
                            .font(.caption2)
                            .fontWeight(.bold)
                        Spacer()
                        Text("Loan Amount:")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                        Text(formatCurrency(loanCalculations.loanAmount))
                            .font(.caption2)
                            .fontWeight(.bold)
                    }
                }
                .padding(12)
                .background(Color.scoutSecondaryBackground)
                .cornerRadius(10)
                .transition(.opacity.combined(with: .move(edge: .top)))
            }

            // Expanded GIS & Municipal Parcel Panel
            if isParcelExpanded {
                VStack(alignment: .leading, spacing: 8) {
                    Divider()
                    HStack {
                        Label("Municipal Tax Parcel & GIS Record", systemImage: "building.columns.fill")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.primary)
                        Spacer()
                        if isLoadingParcel {
                            ProgressView().scaleEffect(0.7)
                        }
                    }

                    if let p = parcelData {
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Text("APN:").font(.caption2).foregroundColor(.secondary)
                                Text(p.apn).font(.caption2).fontWeight(.mono)
                                Spacer()
                                Text("Zoning:").font(.caption2).foregroundColor(.secondary)
                                Text(p.zoning).font(.caption2).fontWeight(.semibold)
                            }
                            HStack {
                                Text("Assessed Value:").font(.caption2).foregroundColor(.secondary)
                                Text(formatCurrency(p.totalAssessedValue)).font(.caption2).fontWeight(.semibold)
                                Spacer()
                                Text("Annual Property Tax:").font(.caption2).foregroundColor(.secondary)
                                Text(formatCurrency(p.annualTax)).font(.caption2).fontWeight(.semibold)
                            }
                            HStack {
                                Text("Flood Hazard:").font(.caption2).foregroundColor(.secondary)
                                Text(p.floodZone).font(.caption2).foregroundColor(.green)
                            }
                        }
                    }
                }
                .padding(10)
                .background(Color.scoutSecondaryBackground)
                .cornerRadius(8)
            }
        }
        .padding(16)
        .background(Color.scoutBackground)
        .cornerRadius(14)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.gray.opacity(0.12), lineWidth: 1)
        )
    }

    private func metricChip(label: String, value: String) -> some View {
        VStack(spacing: 1) {
            Text(label).font(.system(size: 8, weight: .semibold)).foregroundColor(.secondary)
            Text(value).font(.system(size: 11, weight: .bold)).foregroundColor(.primary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 5)
        .background(Color.scoutSecondaryBackground)
        .cornerRadius(6)
    }

    private func sliderRow(label: String, valueStr: String, value: Binding<Double>, range: ClosedRange<Double>, step: Double) -> some View {
        HStack {
            Text(label).font(.caption2).foregroundColor(.secondary).frame(width: 85, alignment: .leading)
            Slider(value: value, in: range, step: step)
                .tint(.teal)
            Text(valueStr).font(.caption2).fontWeight(.bold).frame(width: 55, alignment: .trailing)
        }
    }

    private func resultBox(title: String, value: String, color: Color, caption: String) -> some View {
        VStack(spacing: 2) {
            Text(title).font(.system(size: 8, weight: .bold)).foregroundColor(.secondary)
            Text(value).font(.system(size: 13, weight: .heavy)).foregroundColor(color)
            Text(caption).font(.system(size: 7)).foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(6)
        .background(Color.scoutTertiaryBackground)
        .cornerRadius(6)
    }

    private func scoreColor(_ score: Int) -> Color {
        if score >= 70 { return Color(red: 0.08, green: 0.65, blue: 0.40) }
        if score >= 50 { return Color.orange }
        return Color.red.opacity(0.8)
    }

    private func formatCurrency(_ val: Double) -> String {
        if val >= 1_000_000 {
            return String(format: "$%.2fM", val / 1_000_000)
        }
        return String(format: "$%.0fk", val / 1_000)
    }
}

#if os(iOS)
public struct ShareSheetRepresentable: UIViewControllerRepresentable {
    public let activityItems: [Any]
    public var applicationActivities: [UIActivity]? = nil

    public func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: activityItems, applicationActivities: applicationActivities)
    }

    public func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}
#else
public struct ShareSheetRepresentable: View {
    public let activityItems: [Any]
    public var body: some View { Text("Sharing available on iOS.") }
}
#endif
