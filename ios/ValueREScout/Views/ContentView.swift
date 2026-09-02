import SwiftUI

@MainActor
public struct ContentView: View {
    @State private var viewModel = ScoutViewModel()
    @State private var isMapSheetPresented: Bool = true
    @State private var showFiltersSheet: Bool = false
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared

    public init() {}

    public var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Main Display Content based on Display Mode
                Group {
                    switch viewModel.displayMode {
                    case .map:
                        mapHUDView
                    case .scatter:
                        scatterMatrixView
                    case .terminal:
                        terminalScoutView
                    case .list:
                        listDossierView
                    }
                }
            }
            .scoutInlineNavigationBar()
            .toolbar {
                #if os(iOS)
                ToolbarItem(placement: .topBarLeading) {
                    HStack(spacing: 6) {
                        Image(systemName: "building.2.crop.circle.fill")
                            .foregroundColor(.teal)
                        Text("RE Scout Pro")
                            .font(.headline)
                            .fontWeight(.black)
                        
                        if subscriptionManager.isProUser {
                            Text("PRO")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(.black)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.teal)
                                .clipShape(Capsule())
                        }
                    }
                }

                ToolbarItem(placement: .principal) {
                    Picker("Mode", selection: $viewModel.displayMode) {
                        ForEach(AppDisplayMode.allCases) { mode in
                            Label(mode.rawValue, systemImage: mode.icon).tag(mode)
                        }
                    }
                    .pickerStyle(.segmented)
                    .frame(maxWidth: 220)
                }

                ToolbarItem(placement: .topBarTrailing) {
                    HStack(spacing: 8) {
                        if !subscriptionManager.isProUser {
                            Button {
                                viewModel.isPaywallPresented = true
                            } label: {
                                HStack(spacing: 3) {
                                    Image(systemName: "crown.fill")
                                        .foregroundColor(.yellow)
                                    Text("Pro")
                                        .foregroundColor(.white)
                                }
                                .font(.system(size: 11, weight: .bold))
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.teal.opacity(0.2))
                                .clipShape(Capsule())
                                .overlay(Capsule().stroke(Color.teal.opacity(0.4), lineWidth: 1))
                            }
                        }

                        Button {
                            if !subscriptionManager.isProUser {
                                viewModel.isPaywallPresented = true
                            } else {
                                viewModel.isScannerPresented = true
                            }
                        } label: {
                            Image(systemName: "camera.viewfinder")
                                .font(.subheadline)
                                .foregroundColor(.teal)
                        }
                    }
                }
                #else
                ToolbarItem(placement: .navigation) {
                    HStack(spacing: 6) {
                        Image(systemName: "building.2.crop.circle.fill")
                            .foregroundColor(.teal)
                        Text("RE Scout Pro")
                            .font(.headline)
                            .fontWeight(.black)
                    }
                }

                ToolbarItem(placement: .automatic) {
                    Picker("Mode", selection: $viewModel.displayMode) {
                        ForEach(AppDisplayMode.allCases) { mode in
                            Label(mode.rawValue, systemImage: mode.icon).tag(mode)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                #endif
            }
            .sheet(isPresented: $viewModel.isScannerPresented) {
                VisionFlyerScannerView { scoutedProp in
                    viewModel.addScoutedProperty(scoutedProp)
                }
            }
            .sheet(isPresented: $viewModel.isPaywallPresented) {
                PaywallView()
            }
            .sheet(isPresented: $showFiltersSheet) {
                filtersSheetView
            }
        }
    }

    // MARK: - Subviews

    private var mapHUDView: some View {
        ZStack(alignment: .bottom) {
            ScoutMapView(viewModel: viewModel)
                .ignoresSafeArea(edges: .bottom)

            VStack(spacing: 8) {
                quickFilterBar
                if let selected = viewModel.selectedProperty {
                    PropertyCardView(property: selected, onRemove: {
                        viewModel.removeCustomProperty(id: selected.id)
                        viewModel.selectedProperty = nil
                    })
                    .padding(.horizontal)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .padding(.bottom, 10)
        }
    }

    private var scatterMatrixView: some View {
        VStack(spacing: 0) {
            quickFilterBar
                .padding(.vertical, 8)
                .background(Color.scoutSecondaryBackground)

            YieldScatterChartView(
                properties: viewModel.filteredProperties,
                selectedProperty: $viewModel.selectedProperty
            )
            .padding()

            if let selected = viewModel.selectedProperty {
                ScrollView {
                    PropertyCardView(property: selected, onRemove: {
                        viewModel.removeCustomProperty(id: selected.id)
                        viewModel.selectedProperty = nil
                    })
                    .padding(.horizontal)
                }
                .frame(maxHeight: 280)
            }
        }
        .background(Color.scoutBackground)
    }

    private var listDossierView: some View {
        VStack(spacing: 0) {
            quickFilterBar
                .padding(.vertical, 8)
                .background(Color.scoutSecondaryBackground)

            if !subscriptionManager.isProUser {
                HStack(spacing: 12) {
                    Image(systemName: "sparkles")
                        .foregroundColor(.teal)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Free Deal Pipeline: 5 of \(viewModel.filteredProperties.count) Unlocked")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        Text("Upgrade to Pro for the full 25+ nationwide pipeline & PDF exports")
                            .font(.system(size: 10))
                            .foregroundColor(.gray)
                    }
                    Spacer()
                    Button("Unlock All") {
                        viewModel.isPaywallPresented = true
                    }
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.black)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(Color.teal)
                    .clipShape(Capsule())
                }
                .padding(10)
                .background(Color(white: 0.1))
                .cornerRadius(14)
                .padding(.horizontal)
                .padding(.top, 8)
            }

            ScrollView {
                LazyVStack(spacing: 14) {
                    ForEach(Array(viewModel.filteredProperties.enumerated()), id: \.element.id) { index, property in
                        let isLocked = viewModel.isPropertyLocked(property)
                        
                        if isLocked {
                            Button {
                                viewModel.isPaywallPresented = true
                            } label: {
                                HStack(spacing: 14) {
                                    ZStack {
                                        RoundedRectangle(cornerRadius: 12)
                                            .fill(Color(white: 0.15))
                                            .frame(width: 50, height: 50)
                                        Image(systemName: "lock.fill")
                                            .foregroundColor(.yellow)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 3) {
                                        HStack {
                                            Text(property.address)
                                                .font(.subheadline)
                                                .fontWeight(.bold)
                                                .foregroundColor(.white)
                                            Spacer()
                                            Text("PRO DEAL")
                                                .font(.system(size: 9, weight: .bold))
                                                .foregroundColor(.black)
                                                .padding(.horizontal, 6)
                                                .padding(.vertical, 2)
                                                .background(Color.yellow)
                                                .clipShape(Capsule())
                                        }
                                        Text("\(property.city), \(property.state) • \(property.type.replacingOccurrences(of: "_", with: " ").capitalized)")
                                            .font(.caption2)
                                            .foregroundColor(.gray)
                                        Text("Tap to unlock full valuation & underwriting memo")
                                            .font(.system(size: 10))
                                            .foregroundColor(.teal)
                                    }
                                }
                                .padding(12)
                                .background(Color(white: 0.08))
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                                )
                            }
                        } else {
                            PropertyCardView(property: property, onRemove: {
                                viewModel.removeCustomProperty(id: property.id)
                            })
                        }
                    }
                }
                .padding()
            }
        }
        .background(Color.scoutBackground)
    }

    private var terminalScoutView: some View {
        ScoutTerminalView(viewModel: viewModel)
    }

    private var quickFilterBar: some View {
        HStack(spacing: 8) {
            // Region Selector
            Menu {
                Picker("Region", selection: $viewModel.selectedRegion) {
                    ForEach(RegionFilter.allCases) { region in
                        Text(region.rawValue).tag(region)
                    }
                }
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: "map")
                    Text(viewModel.selectedRegion.rawValue)
                        .lineLimit(1)
                }
                .font(.caption2)
                .fontWeight(.semibold)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(Color.scoutTertiaryBackground)
                .foregroundColor(.primary)
                .cornerRadius(8)
            }

            // Sort Menu
            Menu {
                Picker("Sort", selection: $viewModel.sortBy) {
                    ForEach(SortField.allCases) { sort in
                        Text(sort.rawValue).tag(sort)
                    }
                }
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: "arrow.up.arrow.down")
                    Text(viewModel.sortBy.rawValue)
                        .lineLimit(1)
                }
                .font(.caption2)
                .fontWeight(.semibold)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(Color.scoutTertiaryBackground)
                .foregroundColor(.primary)
                .cornerRadius(8)
            }

            Spacer()

            // Filters Sheet Button
            Button {
                showFiltersSheet = true
            } label: {
                HStack(spacing: 4) {
                    Image(systemName: "line.3.horizontal.decrease.circle")
                    Text("Filters")
                }
                .font(.caption2)
                .fontWeight(.bold)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(viewModel.minValueScore > 0 || viewModel.showResidential ? Color.teal : Color.scoutTertiaryBackground)
                .foregroundColor(viewModel.minValueScore > 0 || viewModel.showResidential ? .black : .primary)
                .cornerRadius(8)
            }
        }
        .padding(.horizontal)
    }

    private var filtersSheetView: some View {
        NavigationStack {
            Form {
                Section("Filter by Value Score") {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text("Minimum Value Score")
                            Spacer()
                            Text("\(Int(viewModel.minValueScore))")
                                .fontWeight(.bold)
                                .foregroundColor(.teal)
                        }
                        Slider(value: $viewModel.minValueScore, in: 0...100, step: 5)
                            .tint(.teal)
                    }
                }

                Section("Property Classification") {
                    Toggle("Include Residential (SFR/Duplex)", isOn: $viewModel.showResidential)
                        .tint(.teal)
                }

                Section("Membership") {
                    HStack {
                        Image(systemName: "crown.fill")
                            .foregroundColor(.yellow)
                        Text(subscriptionManager.isProUser ? "RE Scout Pro Active" : "Free Plan (5 Deals)")
                        Spacer()
                        if !subscriptionManager.isProUser {
                            Button("Upgrade") {
                                showFiltersSheet = false
                                viewModel.isPaywallPresented = true
                            }
                            .font(.caption)
                            .fontWeight(.bold)
                            .foregroundColor(.teal)
                        }
                    }
                    
                    Button("Restore Purchases") {
                        Task {
                            await subscriptionManager.restorePurchases()
                        }
                    }
                }

                Section("About & Legal") {
                    Link("Privacy Policy", destination: URL(string: "https://github.com/alexmohit825/RE-Scout/blob/main/PRIVACY_POLICY.md")!)
                    Link("Terms of Use (EULA)", destination: URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!)
                    HStack {
                        Text("Copyright")
                        Spacer()
                        Text("2026 A. Alex Mohit")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Filters & Settings")
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        showFiltersSheet = false
                    }
                }
            }
        }
    }
}
