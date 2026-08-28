import SwiftUI
import Charts

public struct YieldScatterChartView: View {
    public let properties: [Property]
    public let regionLabel: String

    public var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Label("Market Cluster Yield Map", systemImage: "chart.dots.scatter")
                        .font(.headline)
                        .foregroundColor(.primary)
                    Text("Cap Rate vs. Price efficiency for \(regionLabel)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                // Legend
                HStack(spacing: 8) {
                    legendDot(color: .green, label: "70+")
                    legendDot(color: .orange, label: "50-69")
                    legendDot(color: .gray, label: "<50")
                }
            }

            // Scatter Chart with Swift Charts
            Chart {
                ForEach(properties) { property in
                    PointMark(
                        x: .value("Price", property.price),
                        y: .value("Cap Rate", property.metrics.capRate)
                    )
                    .foregroundStyle(scoreColor(property.valueScore))
                    .symbolSize(property.valueScore >= 70 ? 120 : 80)
                    .annotation(position: .top) {
                        Text(property.city)
                            .font(.system(size: 8, weight: .semibold))
                            .foregroundColor(.secondary)
                    }
                }
            }
            .chartXAxis {
                AxisMarks(values: .automatic) { value in
                    if let price = value.as(Double.self) {
                        AxisValueLabel {
                            Text(price >= 1_000_000 ? String(format: "$%.1fM", price / 1_000_000) : String(format: "$%.0fk", price / 1_000))
                                .font(.system(size: 9))
                        }
                    }
                    AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5, dash: [2, 2]))
                }
            }
            .chartYAxis {
                AxisMarks(values: .automatic) { value in
                    if let cap = value.as(Double.self) {
                        AxisValueLabel {
                            Text(String(format: "%.1f%%", cap))
                                .font(.system(size: 9))
                        }
                    }
                    AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5, dash: [2, 2]))
                }
            }
            .frame(height: 240)
            .padding(.vertical, 8)

            // Insights Note
            HStack(alignment: .top, spacing: 6) {
                Image(systemName: "info.circle.fill")
                    .font(.caption2)
                    .foregroundColor(.teal)
                    .padding(.top, 1)
                Text("Upper-left quadrant represents high-yielding assets under a pricing advantage (optimal investment value).")
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
            }
            .padding(8)
            .background(Color(uiColor: .secondarySystemBackground))
            .cornerRadius(8)
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
            Circle()
                .fill(color)
                .frame(width: 6, height: 6)
            Text(label)
                .font(.system(size: 9))
                .foregroundColor(.secondary)
        }
    }

    private func scoreColor(_ score: Int) -> Color {
        if score >= 70 { return .green }
        if score >= 50 { return .orange }
        return .gray
    }
}
