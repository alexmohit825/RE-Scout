import SwiftUI

public struct ContentView: View {
    @StateObject private var viewModel = ScoutViewModel()

    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    // Header Banner with Status
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Label("Value RE Scout", systemImage: "building.2.crop.circle.fill")
                                .font(.title2)
                                .fontWeight(.black)
                                .foregroundColor(.white)

                            Spacer()

                            HStack(spacing: 4) {
                                Image(systemName: "apple.intelligence")
                                    .font(.caption2)
                                Text("Apple Intelligence")
                                    .font(.system(size: 10, weight: .bold))
                            }
                            .foregroundColor(.teal)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.white.opacity(0.12))
                            .cornerRadius(8)
                        }

                        Text("Commercial Multi-Unit & Industrial Yield Underwriter")
                            .font(.caption)
                            .foregroundColor(Color.white.opacity(0.85))
                    }
                    .padding(18)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(
                        LinearGradient(
                            colors: [Color(red: 0.02, green: 0.20, blue: 0.18), Color(red: 0.05, green: 0.35, blue: 0.30)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .cornerRadius(16)

                    // Economics & Validation Guide
                    ValidationGuideView()

                    // Apple Intelligence Scout Terminal
                    ScoutTerminalView(viewModel: viewModel)

                    // Region Selector Filter
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Active Regional Registers")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.secondary)
                            .textCase(.uppercase)

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(RegionId.allCases) { region in
                                    Button {
                                        viewModel.selectedRegion = region
                                    } label: {
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(region.label)
                                                .font(.system(size: 12, weight: viewModel.selectedRegion == region ? .bold : .medium))
                                            Text(region.states.joined(separator: ", "))
                                                .font(.system(size: 9))
                                                .opacity(0.8)
                                        }
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 8)
                                        .background(viewModel.selectedRegion == region ? Color(red: 0.05, green: 0.35, blue: 0.32) : Color(uiColor: .secondarySystemBackground))
                                        .foregroundColor(viewModel.selectedRegion == region ? .white : .primary)
                                        .cornerRadius(10)
                                    }
                                }
                            }
                        }
                    }

                    // Search, Sort & Residential Toggle
                    VStack(spacing: 10) {
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.secondary)
                            TextField("Search address, city, state...", text: $viewModel.searchQuery)
                                .font(.subheadline)
                        }
                        .padding(10)
                        .background(Color(uiColor: .secondarySystemBackground))
                        .cornerRadius(10)

                        HStack {
                            Picker("Sort By", selection: $viewModel.sortBy) {
                                ForEach(SortField.allCases) { opt in
                                    Text(opt.rawValue).tag(opt)
                                }
                            }
                            .pickerStyle(.menu)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color(uiColor: .secondarySystemBackground))
                            .cornerRadius(8)

                            Spacer()

                            Toggle("Residential", isOn: $viewModel.showResidential)
                                .font(.caption)
                                .toggleStyle(.button)
                                .tint(Color(red: 0.05, green: 0.35, blue: 0.32))
                        }
                    }

                    // Yield Scatter Chart Map (Swift Charts)
                    if !viewModel.filteredProperties.isEmpty {
                        YieldScatterChartView(
                            properties: viewModel.filteredProperties,
                            regionLabel: viewModel.selectedRegion.label
                        )
                    }

                    // Properties List
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Properties (\(viewModel.filteredProperties.count))")
                                .font(.headline)
                                .fontWeight(.bold)

                            Spacer()

                            if !viewModel.customProperties.isEmpty {
                                Text("\(viewModel.customProperties.count) AI Scouted")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.teal)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color.teal.opacity(0.1))
                                    .cornerRadius(6)
                            }
                        }

                        if viewModel.filteredProperties.isEmpty {
                            VStack(spacing: 8) {
                                Text("No properties found matching filters.")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(40)
                            .background(Color(uiColor: .secondarySystemBackground))
                            .cornerRadius(12)
                        } else {
                            ForEach(viewModel.filteredProperties) { prop in
                                let isCustom = viewModel.customProperties.contains(where: { $0.id == prop.id })
                                PropertyCardView(
                                    property: prop,
                                    onRemove: isCustom ? { viewModel.removeProperty(id: prop.id) } : nil
                                )
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            }
            .navigationBarTitleDisplayMode(.inline)
            .background(Color(uiColor: .systemGroupedBackground))
        }
    }
}
