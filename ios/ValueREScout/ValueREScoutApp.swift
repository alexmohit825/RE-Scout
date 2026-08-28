import SwiftUI
import AppIntents

@main
struct ValueREScoutApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// MARK: - Apple Intelligence App Intent for Siri & Shortcuts
@available(iOS 16.0, macOS 13.0, watchOS 9.0, tvOS 16.0, *)
public struct UnderwritePropertyIntent: AppIntent {
    public static var title: LocalizedStringResource = "Underwrite Property with Apple Intelligence"
    public static var description = IntentDescription("Underwrites a commercial real estate property using on-device Apple Intelligence.")

    @Parameter(title: "Property Listing or Address")
    public var inputQuery: String

    public init() {}

    public init(inputQuery: String) {
        self.inputQuery = inputQuery
    }

    public func perform() async throws -> some IntentResult & ProvidesDialog {
        let property = try await AppleIntelligenceScoutService.shared.scoutProperty(input: inputQuery)
        let dialog = "Underwritten \(property.address) in \(property.city), \(property.state). Estimated Cap Rate is \(String(format: "%.1f%%", property.metrics.capRate)) with a Value Score of \(property.valueScore)/100."
        return .result(dialog: IntentDialog(stringLiteral: dialog))
    }
}
