import SwiftUI
import MapKit

@MainActor
public struct ScoutMapView: View {
    @Bindable var viewModel: ScoutViewModel
    
    @State private var cameraPosition: MapCameraPosition = .automatic
    @State private var selectedPropertyId: String? = nil

    public init(viewModel: ScoutViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        ZStack(alignment: .topTrailing) {
            Map(position: $cameraPosition, selection: $selectedPropertyId) {
                ForEach(viewModel.filteredProperties) { property in
                    if let coord = property.coordinate {
                        Annotation(property.address, coordinate: coord, anchor: .bottom) {
                            ScoutMapPin(
                                property: property,
                                isSelected: viewModel.selectedProperty?.id == property.id
                            )
                            .onTapGesture {
                                withAnimation(.spring(response: 0.35, dampingFraction: 0.75)) {
                                    viewModel.selectedProperty = property
                                    selectedPropertyId = property.id
                                    cameraPosition = .region(
                                        MKCoordinateRegion(
                                            center: coord,
                                            span: MKCoordinateSpan(latitudeDelta: 0.08, longitudeDelta: 0.08)
                                        )
                                    )
                                }
                            }
                        }
                        .tag(property.id)
                    }
                }
                
                UserAnnotation()
            }
            .mapStyle(.standard(elevation: .realistic, pointsOfInterest: .excludingAll))
            .mapControls {
                MapCompass()
                MapScaleView()
                MapPitchToggle()
            }
            .onChange(of: viewModel.selectedRegion) { _, newRegion in
                withAnimation(.easeInOut(duration: 0.8)) {
                    cameraPosition = .region(regionFor(newRegion))
                }
            }
            .onChange(of: viewModel.selectedProperty) { _, newProp in
                if let prop = newProp, let coord = prop.coordinate {
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                        selectedPropertyId = prop.id
                        cameraPosition = .region(
                            MKCoordinateRegion(
                                center: coord,
                                span: MKCoordinateSpan(latitudeDelta: 0.06, longitudeDelta: 0.06)
                            )
                        )
                    }
                }
            }
            .onAppear {
                cameraPosition = .region(regionFor(viewModel.selectedRegion))
            }

            // Quick Map Action Bar
            VStack(spacing: 8) {
                Button {
                    withAnimation(.spring()) {
                        cameraPosition = .region(regionFor(viewModel.selectedRegion))
                    }
                } label: {
                    Image(systemName: "arrow.counterclockwise")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.primary)
                        .frame(width: 36, height: 36)
                        .background(.ultraThinMaterial)
                        .clipShape(Circle())
                        .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                }

                if let sel = viewModel.selectedProperty, let coord = sel.coordinate {
                    Button {
                        withAnimation(.spring()) {
                            cameraPosition = .region(
                                MKCoordinateRegion(
                                    center: coord,
                                    span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
                                )
                            )
                        }
                    } label: {
                        Image(systemName: "scope")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.teal)
                            .frame(width: 36, height: 36)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                            .shadow(color: .black.opacity(0.15), radius: 4, x: 0, y: 2)
                    }
                }
            }
            .padding(.top, 16)
            .padding(.trailing, 16)
        }
    }

    private func regionFor(_ region: RegionId) -> MKCoordinateRegion {
        switch region {
        case .pnw:
            return MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: 47.1, longitude: -122.4),
                span: MKCoordinateSpan(latitudeDelta: 2.5, longitudeDelta: 2.5)
            )
        case .southwest:
            return MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: 33.5, longitude: -112.1),
                span: MKCoordinateSpan(latitudeDelta: 3.0, longitudeDelta: 3.0)
            )
        case .midwest:
            return MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: 41.9, longitude: -87.7),
                span: MKCoordinateSpan(latitudeDelta: 2.5, longitudeDelta: 2.5)
            )
        case .southeast:
            return MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: 33.7, longitude: -84.4),
                span: MKCoordinateSpan(latitudeDelta: 3.5, longitudeDelta: 3.5)
            )
        case .northeast:
            return MKCoordinateRegion(
                center: CLLocationCoordinate2D(latitude: 40.7, longitude: -74.0),
                span: MKCoordinateSpan(latitudeDelta: 2.5, longitudeDelta: 2.5)
            )
        }
    }
}

// MARK: - Custom Map Pin Annotation
public struct ScoutMapPin: View {
    public let property: Property
    public let isSelected: Bool

    public var body: some View {
        VStack(spacing: 2) {
            ZStack {
                Circle()
                    .fill(pinColor(property.valueScore))
                    .frame(width: isSelected ? 42 : 34, height: isSelected ? 42 : 34)
                    .shadow(color: pinColor(property.valueScore).opacity(0.4), radius: isSelected ? 8 : 4, x: 0, y: 2)
                    .overlay(
                        Circle()
                            .stroke(Color.white, lineWidth: isSelected ? 2.5 : 1.5)
                    )

                VStack(spacing: -1) {
                    Text("\(property.valueScore)")
                        .font(.system(size: isSelected ? 14 : 11, weight: .black, design: .rounded))
                        .foregroundColor(.white)
                    Text("VAL")
                        .font(.system(size: isSelected ? 7 : 5, weight: .bold))
                        .foregroundColor(.white.opacity(0.9))
                }
            }
            .scaleEffect(isSelected ? 1.15 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isSelected)

            // Price / Address Tag
            HStack(spacing: 3) {
                Text(formatShortPrice(property.price))
                    .font(.system(size: 9, weight: .bold))
                Text("• \(String(format: "%.1f%%", property.metrics.capRate))")
                    .font(.system(size: 8, weight: .semibold))
                    .foregroundColor(.teal)
            }
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(.ultraThinMaterial)
            .cornerRadius(6)
            .shadow(color: .black.opacity(0.12), radius: 2, x: 0, y: 1)
        }
    }

    private func pinColor(_ score: Int) -> Color {
        if score >= 70 { return Color(red: 0.08, green: 0.65, blue: 0.40) }
        if score >= 50 { return Color.orange }
        return Color.red.opacity(0.85)
    }

    private func formatShortPrice(_ val: Double) -> String {
        if val >= 1_000_000 {
            return String(format: "$%.1fM", val / 1_000_000)
        }
        return String(format: "$%.0fk", val / 1_000)
    }
}
