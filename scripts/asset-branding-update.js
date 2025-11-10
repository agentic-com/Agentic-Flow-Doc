#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";

/**
 * Asset and branding update script for Agentic WorkFlow documentation
 * Updates asset references and ensures consistent branding throughout the documentation
 */

/**
 * Check if the favicon needs to be updated to match the logo
 */
async function updateFavicon() {
  try {
    // Check if favicon exists
    const faviconExists = await fs
      .access("public/favicon.svg")
      .then(() => true)
      .catch(() => false);

    if (faviconExists) {
      console.log("✅ Favicon exists at public/favicon.svg");
    } else {
      console.log("⚠️  Favicon not found at public/favicon.svg");
    }

    // Check Astro config favicon reference
    const configContent = await fs.readFile("astro.config.mjs", "utf-8");
    if (configContent.includes('favicon: "./src/assets/logo.png"')) {
      console.log("✅ Astro config references correct favicon path");
    } else {
      console.log("⚠️  Astro config favicon reference may need updating");
    }

    return true;
  } catch (error) {
    console.error("❌ Error checking favicon:", error.message);
    return false;
  }
}

/**
 * Verify logo assets are properly configured
 */
async function verifyLogoAssets() {
  const logoFiles = [
    "src/assets/logo.png",
    "src/assets/logo.png",
    "src/assets/logo.png",
  ];

  const results = [];

  for (const logoFile of logoFiles) {
    try {
      await fs.access(logoFile);
      console.log(`✅ Logo asset exists: ${logoFile}`);
      results.push({ file: logoFile, exists: true });
    } catch (error) {
      console.log(`⚠️  Logo asset missing: ${logoFile}`);
      results.push({ file: logoFile, exists: false });
    }
  }

  return results;
}

/**
 * Update hero image reference if needed
 */
async function updateHeroImage() {
  try {
    const indexContent = await fs.readFile(
      "src/content/docs/index.mdx",
      "utf-8"
    );

    // Check if houston.webp exists
    const houstonExists = await fs
      .access("src/assets/houston.webp")
      .then(() => true)
      .catch(() => false);

    if (houstonExists) {
      console.log("✅ Hero image (houston.webp) exists");

      // Check if it's properly referenced
      if (indexContent.includes("file: ../../assets/houston.webp")) {
        console.log("✅ Hero image properly referenced in index.mdx");
      } else {
        console.log("⚠️  Hero image reference may need updating in index.mdx");
      }
    } else {
      console.log("⚠️  Hero image (houston.webp) not found");

      // Suggest using a logo as hero image instead
      const updatedContent = indexContent.replace(
        /file: \.\.\/\.\.\/assets\/houston\.webp/,
        "file: ../../assets/logo.png"
      );

      if (updatedContent !== indexContent) {
        await fs.writeFile(
          "src/content/docs/index.mdx",
          updatedContent,
          "utf-8"
        );
        console.log("✅ Updated hero image to use logo.png");
        return { updated: true, change: "hero-image-to-logo" };
      }
    }

    return { updated: false };
  } catch (error) {
    console.error("❌ Error updating hero image:", error.message);
    return { updated: false, error: error.message };
  }
}

/**
 * Check for any remaining n8n branding in asset references
 */
async function checkAssetBrandingConsistency() {
  const issues = [];

  try {
    // Check astro.config.mjs for branding consistency
    const configContent = await fs.readFile("astro.config.mjs", "utf-8");

    // Verify title is correct
    if (configContent.includes('title: "Agentic WorkFlow"')) {
      console.log('✅ Site title is correctly set to "Agentic WorkFlow"');
    } else {
      issues.push("Site title may need updating in astro.config.mjs");
    }

    // Verify description is browser extension focused
    if (
      configContent.includes(
        "framework for building AI-powered workflows that runs inside your Browser"
      )
    ) {
      console.log("✅ Site description is browser extension focused");
    } else {
      issues.push(
        "Site description should emphasize browser extension capabilities"
      );
    }

    // Check social links for any n8n references
    if (
      configContent.includes("n8n") ||
      configContent.includes("github.com/n8n-io")
    ) {
      issues.push("Social links may contain old n8n references");
    } else {
      console.log("✅ No n8n references found in social links");
    }
  } catch (error) {
    issues.push(`Error checking astro.config.mjs: ${error.message}`);
  }

  return issues;
}

/**
 * Update social links to be appropriate for Agentic WorkFlow
 */
async function updateSocialLinks() {
  try {
    const configContent = await fs.readFile("astro.config.mjs", "utf-8");

    // Replace generic social links with more appropriate ones for the project
    let updatedContent = configContent;

    // Update GitHub link to be more generic or remove if not applicable
    updatedContent = updatedContent.replace(
      /href: "https:\/\/github\.com\/withastro"/,
      'href: "https://github.com/agentic-workflow-studio"'
    );

    // Update Discord link to be more appropriate
    updatedContent = updatedContent.replace(
      /href: "https:\/\/astro\.build\/chat"/,
      'href: "https://discord.gg/agentic-workflow-studio"'
    );

    // Update Mastodon link
    updatedContent = updatedContent.replace(
      /href: "https:\/\/m\.webtoo\.ls\/@astro"/,
      'href: "https://mastodon.social/@agentic-workflow-studio"'
    );

    if (updatedContent !== configContent) {
      await fs.writeFile("astro.config.mjs", updatedContent, "utf-8");
      console.log("✅ Updated social links for Agentic WorkFlow");
      return { updated: true };
    } else {
      console.log("⏭️  Social links already appropriate");
      return { updated: false };
    }
  } catch (error) {
    console.error("❌ Error updating social links:", error.message);
    return { updated: false, error: error.message };
  }
}

/**
 * Generate a comprehensive branding report
 */
async function generateBrandingReport() {
  const report = {
    timestamp: new Date().toISOString(),
    favicon: await updateFavicon(),
    logoAssets: await verifyLogoAssets(),
    heroImage: await updateHeroImage(),
    brandingIssues: await checkAssetBrandingConsistency(),
    socialLinks: await updateSocialLinks(),
  };

  // Save report
  const reportFileName = `scripts/reports/branding-update-report-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  await fs.writeFile(reportFileName, JSON.stringify(report, null, 2));
  console.log(`\n📝 Branding report saved to: ${reportFileName}`);

  return report;
}

/**
 * Main execution function
 */
async function main() {
  console.log("🎨 Starting asset and branding update...\n");

  const report = await generateBrandingReport();

  // Summary
  console.log("\n📊 Branding Update Summary:");
  console.log(
    `   Favicon status: ${report.favicon ? "OK" : "Needs attention"}`
  );
  console.log(
    `   Logo assets: ${report.logoAssets.filter((a) => a.exists).length}/${report.logoAssets.length} found`
  );
  console.log(
    `   Hero image: ${report.heroImage.updated ? "Updated" : "No changes needed"}`
  );
  console.log(`   Branding issues: ${report.brandingIssues.length} found`);
  console.log(
    `   Social links: ${report.socialLinks.updated ? "Updated" : "No changes needed"}`
  );

  if (report.brandingIssues.length > 0) {
    console.log("\n⚠️  Branding issues found:");
    report.brandingIssues.forEach((issue) => {
      console.log(`   - ${issue}`);
    });
  }

  console.log("\n✅ Asset and branding update completed!");
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  updateFavicon,
  verifyLogoAssets,
  updateHeroImage,
  checkAssetBrandingConsistency,
};
