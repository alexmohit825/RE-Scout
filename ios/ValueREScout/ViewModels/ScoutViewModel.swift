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
    public var selectedRegion: RegionFilter = .all
    public var minValueScore: Double = 0.0
    public var showResidential: Bool = false
    public var searchQuery: String = ""
    public var sortBy: SortField = .valueScore
    public var displayMode: AppDisplayMode = .map
    public var selectedProperty: Property?
    public var isScannerPresented: Bool = false
    public var isPaywallPresented: Bool = false
    
    // Scout State
    public var scoutInputText: String = ""
    public var isScouting: Bool = false
    public var scoutError: String?
    public var lastScoutedProperty: Property?
    
    public let freeDealLimit: Int = 5
    
    @ObservationIgnored
    private let scoutService = AppleIntelligenceScoutService.shared

    public init() {
        loadCustomProperties()
    }

    public var filteredProperties: [Property] {
        let combined = customProperties + properties
        return combined.filter { property in
            // 1. Minimum Value Score Filter
            guard Double(property.valueScore) >= minValueScore else {
                return false
            }

            // 2. Region Filter
            if selectedRegion != .all {
                let regionMatch = property.region.rawValue == selectedRegion.rawValue
                guard regionMatch else { return false }
            }

            // 3. Residential Filter
            let isRes = ["single_family", "duplex_triplex", "townhome"].contains(property.type)
            if isRes && !showResidential {
                return false
            }

            // 4. Search Query
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

    public func isPropertyLocked(_ property: Property) -> Bool {
        if SubscriptionManager.shared.isProUser {
            return false
        }
        let list = filteredProperties
        if let index = list.firstIndex(where: { $0.id == property.id }) {
            return index >= freeDealLimit
        }
        return false
    }

    public func scoutWithAppleIntelligence() async {
        if !SubscriptionManager.shared.isProUser && properties.count >= freeDealLimit {
            isPaywallPresented = true
            return
        }

        let input = scoutInputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !input.isEmpty else { return }

        isScouting = true
        scoutError = nil

        do {
            let property = try await scoutService.scoutProperty(input: input)
            self.lastScoutedProperty = property
            self.customProperties.insert(property, at: 0)
            self.selectedProperty = property
            self.scoutInputText = ""
            saveCustomProperties()
            self.isScouting = false
        } catch {
            self.scoutError = error.localizedDescription
            self.isScouting = false
        }
    }

    public func addScoutedProperty(_ property: Property) {
        customProperties.insert(property, at: 0)
        selectedProperty = property
        saveCustomProperties()
    }

    public func removeCustomProperty(id: String) {
        customProperties.removeAll { $0.id == id }
        saveCustomProperties()
    }

    private func saveCustomProperties() {
        if let encoded = try? JSONEncoder().encode(customProperties) {
            UserDefaults.standard.set(encoded, forKey: "scout_custom_properties_v2")
        }
    }

    private func loadCustomProperties() {
        if let data = UserDefaults.standard.data(forKey: "scout_custom_properties_v2"),
           let decoded = try? JSONDecoder().decode([Property].self, from: data) {
            self.customProperties = decoded
        }
    }
}
