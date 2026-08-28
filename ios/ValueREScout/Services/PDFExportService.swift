import SwiftUI
import PDFKit

/// Service for rendering SwiftUI views directly into vector PDF documents.
@MainActor
public final class PDFExportService {
    public static let shared = PDFExportService()

    private init() {}

    /// Renders a 1-page institutional underwriting tear sheet to a temporary PDF file.
    public func exportUnderwritingPDF(
        property: Property,
        loanModel: (loanAmount: Double, annualDebtService: Double, dscr: Double, cashOnCash: Double, debtYield: Double),
        parcelData: OpenParcelRegistryService.ParcelRecord? = nil
    ) -> URL? {
        let pdfView = PropertyDossierPDFView(
            property: property,
            loanModel: loanModel,
            parcelData: parcelData
        )

        let renderer = ImageRenderer(content: pdfView)
        renderer.proposedSize = ProposedViewSize(width: 595, height: 842)

        let tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("REScout_\(property.id)_TearSheet.pdf")

        renderer.render { size, context in
            var box = CGRect(x: 0, y: 0, width: size.width, height: size.height)
            guard let pdfContext = CGContext(tempURL as CFURL, mediaBox: &box, nil) else {
                return
            }

            pdfContext.beginPDFPage(nil)
            context(pdfContext)
            pdfContext.endPDFPage()
            pdfContext.closePDF()
        }

        return FileManager.default.fileExists(atPath: tempURL.path) ? tempURL : nil
    }
}
