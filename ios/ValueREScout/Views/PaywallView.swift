//
//  PaywallView.swift
//  RE Scout Pro
//
//  Created by A. Alex Mohit.
//  Copyright © 2026 A. Alex Mohit. All rights reserved.
//

import SwiftUI
import StoreKit

public struct PaywallView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared
    @State private var selectedProduct: Product?
    @State private var isPurchasing = false
    @State private var showingAlert = false
    @State private var alertMessage = ""
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header Illustration & Title
                    VStack(spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [Color.teal.opacity(0.8), Color.indigo],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 80, height: 80)
                            
                            Image(systemName: "building.2.crop.circle.fill")
                                .font(.system(size: 40))
                                .foregroundColor(.teal)
                        }
                        .padding(.top, 16)
                        
                        Text("Unlock RE Scout Pro")
                            .font(.system(size: 26, weight: .black))
                            .foregroundColor(.white)
                        
                        Text("Instant access to the complete nationwide distressed deal pipeline, automated underwriting, and investor PDF dossiers.")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 24)
                    }
                    
                    // Feature List
                    VStack(alignment: .leading, spacing: 14) {
                        REProFeatureRow(icon: "chart.line.uptrend.xyaxis", title: "Full 25+ Nationwide Deal Pipeline", subtitle: "Access all high-cap-rate commercial & multifamily opportunities")
                        REProFeatureRow(icon: "doc.text.fill", title: "Investment Dossier PDF Export", subtitle: "Generate bank-ready underwriting reports & cash-on-cash metrics")
                        REProFeatureRow(icon: "camera.viewfinder", title: "Vision AI Flyer Scanner", subtitle: "Scan physical brochures/flyers to auto-extract and evaluate deals")
                        REProFeatureRow(icon: "sparkles", title: "On-Device Value Scoring", subtitle: "Automated renovation estimates & discount-to-market calculations")
                    }
                    .padding(20)
                    .background(Color(white: 0.1))
                    .cornerRadius(24)
                    .padding(.horizontal, 20)
                    
                    // Product Selection
                    VStack(spacing: 12) {
                        if subscriptionManager.products.isEmpty {
                            // Fallback Visual Products when StoreKit is loading or in development
                            REProductCardView(
                                title: "Annual Membership",
                                subtitle: "3-Day Free Trial, then $19.99/year",
                                badge: "BEST VALUE - SAVE 44%",
                                isSelected: selectedProduct == nil,
                                priceString: "$19.99/yr"
                            ) {
                                // Default selection
                            }
                            
                            REProductCardView(
                                title: "Monthly Subscription",
                                subtitle: "Full deal pipeline, cancel anytime",
                                badge: nil,
                                isSelected: false,
                                priceString: "$2.99/mo"
                            ) {
                                // Select
                            }
                        } else {
                            ForEach(subscriptionManager.products, id: \.id) { product in
                                let isSelected = (selectedProduct?.id == product.id) || (selectedProduct == nil && product.id.contains("yearly"))
                                let badgeText = product.id.contains("yearly") ? "SAVE 44%" : nil
                                
                                REProductCardView(
                                    title: product.displayName,
                                    subtitle: product.description,
                                    badge: badgeText,
                                    isSelected: isSelected,
                                    priceString: product.displayPrice
                                ) {
                                    selectedProduct = product
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    
                    // Main CTA Button
                    Button {
                        Task {
                            await triggerPurchase()
                        }
                    } label: {
                        HStack {
                            if isPurchasing {
                                ProgressView()
                                    .tint(.black)
                                    .padding(.trailing, 6)
                            }
                            Text(isPurchasing ? "Processing..." : "Start Free Trial & Unlock Deals")
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundColor(.black)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            LinearGradient(
                                colors: [Color.teal, Color.cyan],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .cornerRadius(20)
                        .shadow(color: Color.teal.opacity(0.4), radius: 10, y: 4)
                    }
                    .disabled(isPurchasing)
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                    
                    // Restore & Legal Links
                    VStack(spacing: 8) {
                        Button {
                            Task {
                                await subscriptionManager.restorePurchases()
                                if subscriptionManager.isProUser {
                                    alertMessage = "Your RE Scout Pro subscription has been restored successfully!"
                                    showingAlert = true
                                } else {
                                    alertMessage = "No active subscriptions were found for this Apple ID."
                                    showingAlert = true
                                }
                            }
                        } label: {
                            Text("Restore Purchases")
                                .font(.footnote)
                                .fontWeight(.semibold)
                                .foregroundColor(.gray)
                        }
                        
                        HStack(spacing: 14) {
                            Link("Privacy Policy", destination: URL(string: "https://github.com/alexmohit825/RE-Scout/blob/main/PRIVACY_POLICY.md")!)
                            Text("•").foregroundColor(.gray.opacity(0.5))
                            Link("Terms of Use (EULA)", destination: URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!)
                        }
                        .font(.caption2)
                        .foregroundColor(.gray.opacity(0.7))
                        
                        Text("Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period. Manage subscriptions in your Apple ID Settings.")
                            .font(.system(size: 9))
                            .foregroundColor(.gray.opacity(0.5))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 24)
                            .padding(.top, 4)
                    }
                    .padding(.bottom, 24)
                }
            }
            .background(Color(white: 0.05).ignoresSafeArea())
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.gray.opacity(0.6))
                    }
                }
            }
            .alert("Subscription", isPresented: $showingAlert) {
                Button("OK", role: .cancel) {
                    if subscriptionManager.isProUser {
                        dismiss()
                    }
                }
            } message: {
                Text(alertMessage)
            }
        }
    }
    
    private func triggerPurchase() async {
        isPurchasing = true
        
        let targetProduct: Product?
        if let sel = selectedProduct {
            targetProduct = sel
        } else {
            targetProduct = subscriptionManager.products.first { $0.id.contains("yearly") } ?? subscriptionManager.products.first
        }
        
        guard let product = targetProduct else {
            isPurchasing = false
            alertMessage = "In-App Purchases are currently initializing. Please try again in a moment."
            showingAlert = true
            return
        }
        
        do {
            let success = try await subscriptionManager.purchase(product)
            isPurchasing = false
            if success {
                alertMessage = "Welcome to RE Scout Pro!"
                showingAlert = true
            }
        } catch {
            isPurchasing = false
            alertMessage = "Purchase failed: \(error.localizedDescription)"
            showingAlert = true
        }
    }
}

struct REProFeatureRow: View {
    let icon: String
    let title: String
    let subtitle: String
    
    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                Circle()
                    .fill(Color.teal.opacity(0.2))
                    .frame(width: 36, height: 36)
                Image(systemName: icon)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.teal)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                Text(subtitle)
                    .font(.caption2)
                    .foregroundColor(.gray)
            }
            Spacer()
        }
    }
}

struct REProductCardView: View {
    let title: String
    let subtitle: String
    let badge: String?
    let isSelected: Bool
    let priceString: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Text(title)
                            .font(.subheadline)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        if let badge = badge {
                            Text(badge)
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(.black)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.teal)
                                .clipShape(Capsule())
                        }
                    }
                    
                    Text(subtitle)
                        .font(.caption2)
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                Text(priceString)
                    .font(.system(size: 15, weight: .bold, design: .rounded))
                    .foregroundColor(isSelected ? .teal : .white)
                
                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isSelected ? .teal : .gray.opacity(0.4))
                    .font(.system(size: 20))
                    .padding(.leading, 6)
            }
            .padding(16)
            .background(Color(white: isSelected ? 0.14 : 0.09))
            .cornerRadius(20)
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(isSelected ? Color.teal : Color.gray.opacity(0.2), lineWidth: isSelected ? 2 : 1)
            )
        }
    }
}
