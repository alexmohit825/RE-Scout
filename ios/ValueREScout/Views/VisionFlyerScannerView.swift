import SwiftUI
import VisionKit
import AVFoundation

#if os(iOS)
@MainActor
public struct VisionFlyerScannerView: View {
    @Environment(\.dismiss) private var dismiss
    @Bindable var viewModel: ScoutViewModel
    
    @State private var isFlashlightOn: Bool = false
    @State private var scannedTextSnippet: String = ""
    @State private var scannerError: String? = nil

    public init(viewModel: ScoutViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationStack {
            ZStack(alignment: .bottom) {
                if DataScannerViewController.isSupported && DataScannerViewController.isAvailable {
                    DataScannerRepresentable(
                        isFlashlightOn: isFlashlightOn,
                        onTextRecognized: { text in
                            handleRecognizedText(text)
                        },
                        onError: { error in
                            self.scannerError = error.localizedDescription
                        }
                    )
                    .ignoresSafeArea()

                    // Viewfinder reticle overlay
                    VStack {
                        Spacer()
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(
                                LinearGradient(
                                    colors: [.teal, .cyan, .green],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                ),
                                lineWidth: 2.5
                            )
                            .frame(maxWidth: .infinity)
                            .frame(height: 220)
                            .padding(.horizontal, 28)
                            .overlay(
                                VStack {
                                    HStack {
                                        Image(systemName: "sparkles")
                                            .foregroundColor(.teal)
                                        Text("Position flyer, sign, or listing within frame")
                                            .font(.caption2)
                                            .fontWeight(.bold)
                                            .foregroundColor(.white)
                                    }
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 5)
                                    .background(Color.black.opacity(0.65))
                                    .cornerRadius(8)
                                    .padding(.top, 12)
                                    
                                    Spacer()
                                }
                            )
                        Spacer()
                    }
                } else {
                    // Fallback for Simulator or unsupported hardware
                    VStack(spacing: 16) {
                        Image(systemName: "camera.viewfinder")
                            .font(.system(size: 60))
                            .foregroundColor(.secondary)
                        Text("Live OCR Scanner Unsupported")
                            .font(.headline)
                        Text("VisionKit camera scanning requires physical iOS hardware with Neural Engine support. You can type or paste property text directly into the AI Terminal.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color.scoutGroupedBackground)
                }

                // Bottom Captured Text HUD
                if !scannedTextSnippet.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text("Text Captured")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            Spacer()
                            Button("Clear") {
                                scannedTextSnippet = ""
                            }
                            .font(.caption2)
                            .foregroundColor(.white.opacity(0.8))
                        }

                        Text(scannedTextSnippet)
                            .font(.system(size: 11, weight: .medium, design: .monospaced))
                            .foregroundColor(.white)
                            .lineLimit(3)

                        Button {
                            viewModel.scoutInputText = scannedTextSnippet
                            dismiss()
                            Task {
                                await viewModel.scoutWithAppleIntelligence()
                            }
                        } label: {
                            HStack {
                                Image(systemName: "sparkles")
                                Text("Underwrite with Apple Intelligence")
                                    .fontWeight(.bold)
                            }
                            .font(.caption)
                            .foregroundColor(.black)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(Color.teal)
                            .cornerRadius(10)
                        }
                    }
                    .padding(14)
                    .background(.ultraThinMaterial)
                    .background(Color.black.opacity(0.75))
                    .cornerRadius(16)
                    .padding(16)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .navigationTitle("Scout Scanner")
            .scoutInlineNavigationBar()
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Done") {
                        dismiss()
                    }
                    .font(.subheadline)
                    .foregroundColor(.white)
                }

                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        isFlashlightOn.toggle()
                    } label: {
                        Image(systemName: isFlashlightOn ? "flashlight.on.fill" : "flashlight.off.fill")
                            .foregroundColor(isFlashlightOn ? .yellow : .white)
                    }
                }
            }
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarBackground(Color.black.opacity(0.8), for: .navigationBar)
        }
    }

    private func handleRecognizedText(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard trimmed.count > 10 else { return }

        ScoutHaptic.triggerMedium()
        withAnimation(.spring()) {
            if scannedTextSnippet.isEmpty {
                scannedTextSnippet = trimmed
            } else if !scannedTextSnippet.contains(trimmed) {
                scannedTextSnippet += "\n" + trimmed
            }
        }
    }
}

// MARK: - DataScannerViewController Representable
private struct DataScannerRepresentable: UIViewControllerRepresentable {
    var isFlashlightOn: Bool
    var onTextRecognized: (String) -> Void
    var onError: (Error) -> Void

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let scanner = DataScannerViewController(
            recognizedDataTypes: [.text()],
            qualityLevel: .balanced,
            recognizesMultipleItems: true,
            isHighFrameRateTrackingEnabled: true,
            isHighlightingEnabled: true
        )
        scanner.delegate = context.coordinator
        return scanner
    }

    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {
        if uiViewController.isScanning == false {
            try? uiViewController.startScanning()
        }
        
        // Flashlight toggle
        if let device = AVCaptureDevice.default(for: .video), device.hasTorch {
            try? device.lockForConfiguration()
            device.torchMode = isFlashlightOn ? .on : .off
            device.unlockForConfiguration()
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(onTextRecognized: onTextRecognized, onError: onError)
    }

    class Coordinator: NSObject, DataScannerViewControllerDelegate {
        var onTextRecognized: (String) -> Void
        var onError: (Error) -> Void
        private var recognizedHistory = Set<String>()

        init(onTextRecognized: @escaping (String) -> Void, onError: @escaping (Error) -> Void) {
            self.onTextRecognized = onTextRecognized
            self.onError = onError
        }

        func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem], allItems: [RecognizedItem]) {
            for item in addedItems {
                if case .text(let text) = item {
                    if !recognizedHistory.contains(text.transcript) {
                        recognizedHistory.insert(text.transcript)
                        onTextRecognized(text.transcript)
                    }
                }
            }
        }

        func dataScanner(_ dataScanner: DataScannerViewController, becameUnavailableWithError error: DataScannerViewController.ScanningUnavailable) {
            onError(error)
        }
    }
}
#else
@MainActor
public struct VisionFlyerScannerView: View {
    @Bindable var viewModel: ScoutViewModel
    public init(viewModel: ScoutViewModel) { self.viewModel = viewModel }
    public var body: some View {
        Text("Vision Scanner only available on iOS.")
    }
}
#endif
