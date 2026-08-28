// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ValueREScout",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "ValueREScout",
            targets: ["ValueREScout"]
        ),
    ],
    targets: [
        .target(
            name: "ValueREScout",
            path: "ValueREScout"
        ),
    ]
)
