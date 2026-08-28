import Foundation
import SwiftUI
import Observation
import MapKit

public enum SortField: String, CaseIterable, Identifiable, Sendable {
    case valueScore = "Best Value Score"
    case capRate = "Highest Cap Rate"
    case pricePerUnit = "Lowest $/Unit"
    case price = "Lowest Price"
    case occupancy = "Highest Occupancy"

    public var id: String { rawValue }
}

public enum AppDisplayMode: String, CaseIterable, Identifiable, Sendable {
    case map = "Map HUD"
    case scatter = "Yield Matrix"
    case terminal = "AI Terminal"
    case list = "List Dossier"

    public var id: String { rawValue }
    public var icon: String {
        switch self {
        case .map: return "map.fill"
        case .scatter: return "chart.dots.scatter"
        case .terminal: return "sparkles"
        case .list: return "list.bullet.rectangle.portrait.fill"
        }
    }
}

@Observable
@MainActor
public final class ScoutViewModel {
    public var properties: [Property] = PropertyData.initialProperties
    public var customProperties: [Property] = []
    public var selectedRegion: RegionId = .pnw
    public var showResidential: Bool = false
    public var searchQuery: String = ""
    public var sortBy: SortField = .valueScore
    public var displayMode: AppDisplayMode = .map
    public var selectedProperty: Property?
    public var isScannerPresented: Bool = false
    
    // Apple Intelligence Scout State
    public var scoutInputText: String = ""
    public var isScouting: Bool = false
    public var scoutError: String?
    public var lastScoutedProperty: Property?
    
    @ObservationIgnored
    private let scoutService = AppleIntelligenceScoutService.shared

    public init() {
        loadCustomProperties()
    }

    public var filteredProperties: [Property] {
        let combined = customProperties + properties
        return combined.filter { property in
            // Region filter
            let regionMatch = property.region == selectedRegion || selectedRegion.states.contains(property.state.uppercased())
            guard regionMatch else { return false }

            // Residential filter
            let isRes = ["single_family", "duplex_triplex", "townhome"].contains(property.type)
            if isRes && !showResidential {
                return false
            }

            // Search query
            if !searchQuery.trimmingCharacters(in: .whitespaces).isEmpty {
                let q = searchQuery.lowercased()
                let addrMatch = property.address.lowercased().contains(q)
                let cityMatch = property.city.lowercased().contains(q)
                let stateMatch = property.state.lowercased().contains(q)
                if !addrMatch && !cityMatch && !stateMatch {
                    return false
                }
            }

            return true
        }
        .sorted { a, b in
            switch sortBy {
            case .valueScore:
                return a.valueScore > b.valueScore
            case .capRate:
                return a.metrics.capRate > b.metrics.capRate
            case .pricePerUnit:
                let aUnit = a.metrics.pricePerUnit > 0 ? a.metrics.pricePerUnit : Double.greatestFiniteMagnitude
                let bUnit = b.metrics.pricePerUnit > 0 ? b.metrics.pricePerUnit : Double.greatestFiniteMagnitude
                return aUnit < bUnit
            case .price:
                return a.price < b.price
            case .occupancy:
                return a.metrics.occupancyRate > b.metrics.occupancyRate
            }
        }
    }

    public func scoutWithAppleIntelligence() async {
        let input = scoutInputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !input.isEmpty else { return }

        isScouting = true
        scoutError = nil

        do {
            let property = try await scoutService.scoutProperty(input: input)
            self.lastScoutedProperty = property
            self.addProperty(property)
            self.selectedProperty = property
            self.scoutInputText = ""
        } catch {
            self.scoutError = error.localizedDescription
        }

        isScouting = false
    }

    public func addProperty(_ property: Property) {
        customProperties.insert(property, at: 0)
        selectedRegion = property.region
        selectedProperty = property
        saveCustomProperties()
    }

    public func removeProperty(id: String) {
        customProperties.removeAll { $0.id == id }
        if selectedProperty?.id == id {
            selectedProperty = nil
        }
        saveCustomProperties()
    }

    private func saveCustomProperties() {
        if let encoded = try? JSONEncoder().encode(customProperties) {
            UserDefaults.standard.set(encoded, forKey: "custom_scouted_properties")
        }
    }

    private func loadCustomProperties() {
        if let data = UserDefaults.standard.data(forKey: "custom_scouted_properties"),
           let decoded = try? JSONDecoder().decode([Property].self, from: data) {
            self.customProperties = decoded
        }
    }
}
