"""
Export service for generating portal payloads, social captions, email blurbs, and marketing packs.
"""
import os
import json
import logging
import zipfile
from datetime import datetime, timedelta
from typing import Dict, Any, List
from pathlib import Path

from backend.schemas_export import (
    ListingDataExport,
    BrandingOptions,
    PDFOptions,
    ImageInput
)
from services.pdf_generator import PDFGenerator

logger = logging.getLogger(__name__)


class ExportService:
    """
    Service for exporting property listings in various formats.
    
    Handles:
    - Portal payloads (Rightmove, Zoopla, etc.)
    - Social media captions (short & ultra-short)
    - Email blurbs (subject + body + CTA)
    - Marketing pack ZIP bundles
    """
    
    def __init__(
        self,
        export_dir: str = "./exports_tmp",
        pdf_max_size_mb: float = 10.0,
        portal_format: str = "rightmove",
        social_hashtags: str = "#NewListing #Property #ForSale",
        retention_hours: int = 24
    ):
        """
        Initialize export service.
        
        Args:
            export_dir: Directory for temporary export files
            pdf_max_size_mb: Maximum PDF size in MB
            portal_format: Portal format (rightmove, zoopla, etc.)
            social_hashtags: Default hashtags for social posts
            retention_hours: Hours to retain exports before cleanup
        """
        self.export_dir = Path(export_dir)
        self.export_dir.mkdir(parents=True, exist_ok=True)
        
        self.pdf_generator = PDFGenerator(max_size_mb=pdf_max_size_mb)
        self.portal_format = portal_format
        self.social_hashtags = social_hashtags
        self.retention_hours = retention_hours
        
        logger.info(f"Export service initialized: {self.export_dir}")
    
    def generate_pdf(
        self,
        listing_data: ListingDataExport,
        images: List[ImageInput],
        branding: BrandingOptions,
        options: PDFOptions
    ) -> Dict[str, Any]:
        """
        Generate a PDF brochure.
        
        Args:
            listing_data: Complete listing data
            images: Property images
            branding: Agency branding
            options: PDF options
            
        Returns:
            Dictionary with export_id, file path, size, and metadata
        """
        # Generate export ID
        export_id = self._generate_export_id("pdf")
        
        # Output path
        output_path = self.export_dir / f"{export_id}.pdf"
        
        # Generate PDF
        metadata = self.pdf_generator.generate_pdf(
            listing_data=listing_data,
            images=images,
            branding=branding,
            options=options,
            output_path=str(output_path)
        )
        
        return {
            "export_id": export_id,
            "file_path": str(output_path),
            "size_bytes": metadata["size_bytes"],
            "size_mb": metadata["size_mb"],
            "size_warning_exceeded": metadata["size_warning_exceeded"],
            "meta": metadata
        }
    
    def generate_portal_payload(
        self,
        listing_data: ListingDataExport
    ) -> Dict[str, Any]:
        """
        Generate portal-ready payload (Rightmove, Zoopla, etc.).
        
        Args:
            listing_data: Complete listing data
            
        Returns:
            Dictionary with structured portal data
        """
        # Extract portal summary (40-80 words from main description)
        words = listing_data.main_description.split()
        portal_summary = " ".join(words[:60])  # Approx 60 words
        if len(words) > 60:
            portal_summary += "..."
        
        # Build payload based on format
        if self.portal_format == "rightmove":
            payload = {
                "headline": listing_data.headline,
                "summary": portal_summary,
                "full_description": listing_data.main_description,
                "key_features": listing_data.key_features,
                "property_type": listing_data.property_type or "house",
                "bedrooms": listing_data.bedrooms or 0,
                "bathrooms": listing_data.bathrooms or 0,
                "address": listing_data.address,
                "price": listing_data.price,
                "epc_rating": listing_data.epc_rating,
                "compliance_note": "All information believed to be correct but not guaranteed. "
                                  "EPC rating to be confirmed." if not listing_data.epc_rating else ""
            }
        else:
            # Generic format
            payload = {
                "headline": listing_data.headline,
                "summary": portal_summary,
                "description": listing_data.main_description,
                "features": listing_data.key_features,
                "address": listing_data.address,
                "price": listing_data.price,
                "epc": listing_data.epc_rating
            }
        
        return payload
    
    def generate_social_captions(
        self,
        listing_data: ListingDataExport
    ) -> Dict[str, str]:
        """
        Generate social media captions (ultra-short and standard).
        
        Args:
            listing_data: Complete listing data
            
        Returns:
            Dictionary with ultra_short and standard captions
        """
        # Extract first sentence of headline or description
        first_sentence = listing_data.headline.split(".")[0]
        
        # Ultra-short (20-30 words) - just the hook
        ultra_short = f"{first_sentence}. {listing_data.address}. {listing_data.price or 'POA'}."
        
        # Standard (1-2 sentences)
        description_start = listing_data.main_description.split(".")[:2]
        description_snippet = ". ".join(description_start) + "."
        
        standard = f"{listing_data.headline}\n\n{description_snippet}\n\n"
        standard += f"📍 {listing_data.address}\n"
        if listing_data.price:
            standard += f"💰 {listing_data.price}\n"
        if listing_data.bedrooms:
            standard += f"🛏️ {listing_data.bedrooms} bed | "
        if listing_data.bathrooms:
            standard += f"🛁 {listing_data.bathrooms} bath\n"
        standard += f"\n{self.social_hashtags}"
        
        return {
            "ultra_short": ultra_short,
            "standard": standard.strip()
        }
    
    def generate_email_blurb(
        self,
        listing_data: ListingDataExport
    ) -> Dict[str, str]:
        """
        Generate email marketing blurb (subject + body + CTA).
        
        Args:
            listing_data: Complete listing data
            
        Returns:
            Dictionary with subject, body, and cta
        """
        # Subject line
        subject = f"New Listing: {listing_data.address}"
        if listing_data.bedrooms:
            subject = f"New {listing_data.bedrooms}-Bed Property: {listing_data.address}"
        
        # Body (80-120 words)
        words = listing_data.main_description.split()
        body = " ".join(words[:100])  # Approx 100 words
        if len(words) > 100:
            body += "..."
        
        # Add key details
        body += "\n\n"
        if listing_data.price:
            body += f"Price: {listing_data.price}\n"
        if listing_data.bedrooms and listing_data.bathrooms:
            body += f"Bedrooms: {listing_data.bedrooms} | Bathrooms: {listing_data.bathrooms}\n"
        if listing_data.epc_rating:
            body += f"EPC Rating: {listing_data.epc_rating}\n"
        
        # CTA
        cta = "Contact us today to arrange a viewing or request more information."
        
        return {
            "subject": subject,
            "body": body.strip(),
            "cta": cta
        }
    
    def generate_marketing_pack(
        self,
        listing_data: ListingDataExport,
        images: List[ImageInput],
        branding: BrandingOptions,
        options: PDFOptions
    ) -> Dict[str, Any]:
        """
        Generate a complete marketing pack ZIP with all export formats.
        
        Args:
            listing_data: Complete listing data
            images: Property images
            branding: Agency branding
            options: PDF options
            
        Returns:
            Dictionary with export_id, file path, size, and contents manifest
        """
        # Generate export ID
        export_id = self._generate_export_id("pack")
        
        # Create temporary directory for pack contents
        pack_dir = self.export_dir / export_id
        pack_dir.mkdir(parents=True, exist_ok=True)
        
        contents = {}
        
        # 1. Generate PDF brochure
        logger.info("Generating PDF for marketing pack")
        pdf_filename = "listing_brochure.pdf"
        pdf_path = pack_dir / pdf_filename
        
        self.pdf_generator.generate_pdf(
            listing_data=listing_data,
            images=images,
            branding=branding,
            options=options,
            output_path=str(pdf_path)
        )
        contents["pdf"] = pdf_filename
        
        # 2. Generate portal payload (JSON)
        logger.info("Generating portal payload")
        portal_payload = self.generate_portal_payload(listing_data)
        
        portal_json_filename = "portal_payload.json"
        portal_json_path = pack_dir / portal_json_filename
        with open(portal_json_path, "w") as f:
            json.dump(portal_payload, f, indent=2)
        contents["portal_json"] = portal_json_filename
        
        # 3. Generate portal payload (TXT - human-readable)
        portal_txt_filename = "portal_summary.txt"
        portal_txt_path = pack_dir / portal_txt_filename
        with open(portal_txt_path, "w") as f:
            f.write(f"HEADLINE:\n{portal_payload['headline']}\n\n")
            f.write(f"SUMMARY:\n{portal_payload.get('summary', '')}\n\n")
            f.write(f"FULL DESCRIPTION:\n{portal_payload.get('full_description', portal_payload.get('description', ''))}\n\n")
            f.write(f"KEY FEATURES:\n")
            for feature in portal_payload.get('key_features', portal_payload.get('features', [])):
                f.write(f"• {feature}\n")
        contents["portal_txt"] = portal_txt_filename
        
        # 4. Generate social captions
        logger.info("Generating social captions")
        social_captions = self.generate_social_captions(listing_data)
        
        social_filename = "social_captions.txt"
        social_path = pack_dir / social_filename
        with open(social_path, "w") as f:
            f.write("ULTRA-SHORT POST (20-30 words):\n")
            f.write("=" * 50 + "\n")
            f.write(social_captions["ultra_short"] + "\n\n")
            f.write("STANDARD POST:\n")
            f.write("=" * 50 + "\n")
            f.write(social_captions["standard"] + "\n")
        contents["social_txt"] = social_filename
        
        # 5. Generate email blurb
        logger.info("Generating email blurb")
        email_blurb = self.generate_email_blurb(listing_data)
        
        email_filename = "email_blurb.txt"
        email_path = pack_dir / email_filename
        with open(email_path, "w") as f:
            f.write(f"SUBJECT: {email_blurb['subject']}\n\n")
            f.write("BODY:\n")
            f.write("=" * 50 + "\n")
            f.write(email_blurb["body"] + "\n\n")
            f.write("CALL TO ACTION:\n")
            f.write("=" * 50 + "\n")
            f.write(email_blurb["cta"] + "\n")
        contents["email_txt"] = email_filename
        
        # 6. Create README
        logger.info("Creating README")
        readme_filename = "README.txt"
        readme_path = pack_dir / readme_filename
        with open(readme_path, "w") as f:
            f.write("PROPERTY LISTING MARKETING PACK\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"Property: {listing_data.address}\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("CONTENTS:\n")
            f.write("-" * 60 + "\n")
            f.write(f"• {pdf_filename} - Branded PDF brochure\n")
            f.write(f"• {portal_json_filename} - Portal upload payload (JSON)\n")
            f.write(f"• {portal_txt_filename} - Portal summary (human-readable)\n")
            f.write(f"• {social_filename} - Social media captions\n")
            f.write(f"• {email_filename} - Email marketing blurb\n\n")
            f.write("USAGE:\n")
            f.write("-" * 60 + "\n")
            f.write("1. Use the PDF for client presentations and printouts\n")
            f.write("2. Upload portal_payload.json to your property portal\n")
            f.write("3. Copy social captions for Instagram, Facebook, LinkedIn\n")
            f.write("4. Use email blurb for your email marketing campaigns\n\n")
            f.write(f"Generated by {branding.agency_name}\n")
        contents["readme"] = readme_filename
        
        # 7. Create ZIP file
        logger.info("Creating ZIP bundle")
        zip_filename = f"{export_id}.zip"
        zip_path = self.export_dir / zip_filename
        
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file_path in pack_dir.iterdir():
                if file_path.is_file():
                    zipf.write(file_path, file_path.name)
        
        # Get ZIP size
        zip_size = os.path.getsize(zip_path)
        
        # Cleanup temporary directory
        import shutil
        shutil.rmtree(pack_dir)
        
        return {
            "export_id": export_id,
            "file_path": str(zip_path),
            "size_bytes": zip_size,
            "size_mb": round(zip_size / (1024 * 1024), 2),
            "contents": contents
        }
    
    def get_export(self, export_id: str) -> Dict[str, Any]:
        """
        Retrieve an existing export by ID.
        
        Args:
            export_id: Export identifier
            
        Returns:
            Dictionary with file_path and metadata
            
        Raises:
            FileNotFoundError: If export doesn't exist
        """
        # Check for PDF
        pdf_path = self.export_dir / f"{export_id}.pdf"
        if pdf_path.exists():
            size = os.path.getsize(pdf_path)
            return {
                "export_id": export_id,
                "file_path": str(pdf_path),
                "file_type": "pdf",
                "size_bytes": size,
                "size_mb": round(size / (1024 * 1024), 2)
            }
        
        # Check for ZIP
        zip_path = self.export_dir / f"{export_id}.zip"
        if zip_path.exists():
            size = os.path.getsize(zip_path)
            return {
                "export_id": export_id,
                "file_path": str(zip_path),
                "file_type": "zip",
                "size_bytes": size,
                "size_mb": round(size / (1024 * 1024), 2)
            }
        
        raise FileNotFoundError(f"Export not found: {export_id}")
    
    def cleanup_old_exports(self):
        """Remove exports older than retention period."""
        cutoff = datetime.now() - timedelta(hours=self.retention_hours)
        
        removed_count = 0
        for file_path in self.export_dir.iterdir():
            if file_path.is_file():
                # Check file modification time
                mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
                if mtime < cutoff:
                    file_path.unlink()
                    removed_count += 1
                    logger.info(f"Removed old export: {file_path.name}")
        
        if removed_count > 0:
            logger.info(f"Cleanup complete: {removed_count} old exports removed")
    
    def _generate_export_id(self, export_type: str) -> str:
        """
        Generate a unique export ID.
        
        Args:
            export_type: Type of export (pdf, pack)
            
        Returns:
            Unique export identifier
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"{export_type}_{timestamp}"
