import SwiftUI

public struct ScoutTerminalView: View {
    @Bindable var viewModel: ScoutViewModel

    private let sampleQueries = [
        "3110 Judson St, Gig Harbor, WA",
        "12-unit apartment in Chicago IL, $1.85M with 8.2% cap rate",
        "Warehouse distribution facility in Phoenix AZ, $2.45M 16,500 SF"
    ]

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Title Header with Apple Intelligence Sparkle
            HStack {
                Image(systemName: "apple.intelligence")
                    .font(.title2)
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.teal, .cyan, .blue, .purple],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )

                VStack(alignment: .leading, spacing: 1) {
                    Text("Apple Intelligence Opportunity Scout")
                        .font(.headline)
                        .fontWeight(.bold)
                    Text("On-Device NLP & LLM Underwriting • Zero External API Keys")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }

                Spacer()

                HStack(spacing: 4) {
                    Circle()
                        .fill(Color.green)
                        .frame(width: 6, height: 6)
                    Text("On-Device")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal, 6)
                .padding(.vertical, 3)
                .background(Color.green.opacity(0.1))
                .cornerRadius(6)
            }

            // Live Camera OCR Scanner Action Bar
            HStack {
                Button {
                    viewModel.isScannerPresented = true
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "camera.viewfinder")
                            .font(.system(size: 13, weight: .bold))
                        Text("Live OCR Flyer Scanner")
                            .font(.system(size: 11, weight: .bold))
                    }
                    .foregroundColor(.teal)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.teal.opacity(0.12))
                    .cornerRadius(8)
                }

                Spacer()

                if !viewModel.scoutInputText.isEmpty {
                    Button("Clear") {
                        viewModel.scoutInputText = ""
                    }
                    .font(.caption2)
                    .foregroundColor(.secondary)
                }
            }

            // Input Text Area
            VStack(alignment: .trailing, spacing: 8) {
                TextEditor(text: $viewModel.scoutInputText)
                    .frame(height: 70)
                    .padding(8)
                    .background(Color(uiColor: .secondarySystemBackground))
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.teal.opacity(0.3), lineWidth: 1)
                    )

                HStack {
                    if viewModel.isScouting {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .teal))
                            .scaleEffect(0.8)
                        Text("Apple Intelligence Underwriting...")
                            .font(.caption2)
                            .foregroundColor(.teal)
                    }

                    Spacer()

                    Button {
                        Task {
                            await viewModel.scoutWithAppleIntelligence()
                        }
                    } label: {
                        HStack(spacing: 6) {
                            Image(systemName: "sparkles")
                            Text("Scout & Underwrite")
                                .fontWeight(.semibold)
                        }
                        .font(.caption)
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(
                            LinearGradient(
                                colors: [Color(red: 0.05, green: 0.45, blue: 0.4), Color(red: 0.02, green: 0.3, blue: 0.35)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(8)
                    }
                    .disabled(viewModel.isScouting || viewModel.scoutInputText.trimmingCharacters(in: .whitespaces).isEmpty)
                    .opacity(viewModel.scoutInputText.trimmingCharacters(in: .whitespaces).isEmpty ? 0.6 : 1.0)
                }
            }

            // Quick Prompt Chips
            VStack(alignment: .leading, spacing: 4) {
                Text("Try sample listings:")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(.secondary)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(sampleQueries, id: \.self) { sample in
                            Button {
                                viewModel.scoutInputText = sample
                            } label: {
                                Text(sample)
                                    .font(.system(size: 10))
                                    .foregroundColor(.primary)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(Color(uiColor: .tertiarySystemBackground))
                                    .cornerRadius(6)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 6)
                                            .stroke(Color.gray.opacity(0.2), lineWidth: 0.5)
                                    )
                            }
                        }
                    }
                }
            }

            // Error display if any
            if let err = viewModel.scoutError {
                HStack {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.orange)
                    Text(err)
                        .font(.caption2)
                        .foregroundColor(.orange)
                }
                .padding(8)
                .background(Color.orange.opacity(0.1))
                .cornerRadius(6)
            }
        }
        .sheet(isPresented: $viewModel.isScannerPresented) {
            VisionFlyerScannerView(viewModel: viewModel)
        }
        .padding(16)
        .background(Color(uiColor: .systemBackground))
        .cornerRadius(14)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.teal.opacity(0.2), lineWidth: 1)
        )
    }
}
