import SwiftUI

public struct ContentView: View {
    @State private var viewModel = ScoutViewModel()
    @State private var isMapSheetPresented: Bool = true

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
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    HStack(spacing: 6) {
                        Image(systemName: "building.2.crop.circle.fill")
                            .foregroundColor(.teal)
                        Text("RE Scout")
                            .font(.headline)
                            .fontWeight(.black)
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
                    Button {
                        viewModel.isScannerPresented = true
                    } label: {
                        Image(systemName: "camera.viewfinder")
                            .font(.subheadline)
                            .foregroundColor(.teal)
                    }
                }
            }
            .sheet(isPresented: $viewModel.isScannerPresented) {
                VisionFlyerScannerView(viewModel: viewModel)
            }
        }
    }

    // MARK: - 1. Spatial Map HUD Mode (Apple Maps Style Sheet Detents)
    private var mapHUDView: some View {
        ZStack {
            ScoutMapView(viewModel: viewModel)
                .ignoresSafeArea(edges: .bottom)
        }
        .sheet(isPresented: $isMapSheetPresented) {
            NavigationStack {
                ScrollView {
                    VStack(spacing: 14) {
                        // Region Pill Selector
                        regionBar

                        // Search Bar
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.secondary)
                            TextField("Search address, city, state...", text: $viewModel.searchQuery)
                                .font(.subheadline)
                        }
                        .padding(10)
                        .background(Color(uiColor: .secondarySystemBackground))
                        .cornerRadius(10)

                        // Selected Property Quick Preview (if any)
                        if let selected = viewModel.selectedProperty {
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Label("Selected Property", systemImage: "scope")
                                        .font(.caption)
                                        .fontWeight(.bold)
                                        .foregroundColor(.teal)
                                    Spacer()
                                    Button("Clear") {
                                        viewModel.selectedProperty = nil
                                    }
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                                }

                                PropertyCardView(
                                    property: selected,
                                    onRemove: viewModel.customProperties.contains(where: { $0.id == selected.id }) ? {
                                        viewModel.removeProperty(id: selected.id)
                                    } : nil
                                )
                            }
                        }

                        // Filtered Properties Header & List
                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Text("Scouted Dossiers (\(viewModel.filteredProperties.count))")
                                    .font(.headline)
                                    .fontWeight(.bold)
                                Spacer()
                                Picker("Sort", selection: $viewModel.sortBy) {
                                    ForEach(SortField.allCases) { opt in
                                        Text(opt.rawValue).tag(opt)
                                    }
                                }
                                .pickerStyle(.menu)
                                .font(.caption)
                            }

                            ForEach(viewModel.filteredProperties) { prop in
                                if prop.id != viewModel.selectedProperty?.id {
                                    PropertyCardView(
                                        property: prop,
                                        onRemove: viewModel.customProperties.contains(where: { $0.id == prop.id }) ? {
                                            viewModel.removeProperty(id: prop.id)
                                        } : nil
                                    )
                                }
                            }
                        }
                    }
                    .padding(16)
                }
                .navigationTitle("Field Scout Dossier")
                .navigationBarTitleDisplayMode(.inline)
            }
            .presentationDetents([.fraction(0.15), .medium, .large])
            .presentationDragIndicator(.visible)
            .presentationBackgroundInteraction(.enabled)
            .interactiveDismissDisabled(true)
        }
    }

    // MARK: - 2. Yield Scatter Matrix Mode
    private var scatterMatrixView: some View {
        ScrollView {
            VStack(spacing: 16) {
                regionBar

                YieldScatterChartView(
                    properties: viewModel.filteredProperties,
                    regionLabel: viewModel.selectedRegion.label
                )

                ValidationGuideView()

                // Properties in Region
                VStack(alignment: .leading, spacing: 10) {
                    Text("Assets in Yield Cluster (\(viewModel.filteredProperties.count))")
                        .font(.headline)
                        .fontWeight(.bold)

                    ForEach(viewModel.filteredProperties) { prop in
                        PropertyCardView(
                            property: prop,
                            onRemove: viewModel.customProperties.contains(where: { $0.id == prop.id }) ? {
                                viewModel.removeProperty(id: prop.id)
                            } : nil
                        )
                    }
                }
            }
            .padding(16)
        }
        .background(Color(uiColor: .systemGroupedBackground))
    }

    // MARK: - 3. AI Terminal & NLP Ingestion Mode
    private var terminalScoutView: some View {
        ScrollView {
            VStack(spacing: 16) {
                ScoutTerminalView(viewModel: viewModel)

                ValidationGuideView()

                if let last = viewModel.lastScoutedProperty {
                    VStack(alignment: .leading, spacing: 8) {
                        Label("Latest AI Ingestion", systemImage: "sparkles")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.teal)

                        PropertyCardView(
                            property: last,
                            onRemove: { viewModel.removeProperty(id: last.id) }
                        )
                    }
                }
            }
            .padding(16)
        }
        .background(Color(uiColor: .systemGroupedBackground))
    }

    // MARK: - 4. Full List Dossier Mode
    private var listDossierView: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Header Search & Filters
                VStack(spacing: 10) {
                    regionBar

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

                // Property List
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("All Scouted Properties (\(viewModel.filteredProperties.count))")
                            .font(.headline)
                            .fontWeight(.bold)
                        Spacer()
                    }

                    if viewModel.filteredProperties.isEmpty {
                        VStack(spacing: 8) {
                            Text("No properties match active filters.")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(40)
                        .background(Color(uiColor: .secondarySystemBackground))
                        .cornerRadius(12)
                    } else {
                        ForEach(viewModel.filteredProperties) { prop in
                            PropertyCardView(
                                property: prop,
                                onRemove: viewModel.customProperties.contains(where: { $0.id == prop.id }) ? {
                                    viewModel.removeProperty(id: prop.id)
                                } : nil
                            )
                        }
                    }
                }
            }
            .padding(16)
        }
        .background(Color(uiColor: .systemGroupedBackground))
    }

    // MARK: - Shared Region Bar
    private var regionBar: some View {
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
}
