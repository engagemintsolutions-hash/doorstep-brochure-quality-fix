"""
PDF generator for property listing brochures.
Handles layout, branding, image optimization, and QR codes.
"""
import os
import io
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
from PIL import Image
import qrcode

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage,
    PageBreak, Table, TableStyle, KeepTogether
)
from reportlab.pdfgen import canvas

from backend.schemas_export import ListingDataExport, BrandingOptions, PDFOptions, ImageInput

logger = logging.getLogger(__name__)


class PDFGenerator:
    """
    Generates branded PDF brochures for property listings.
    
    Features:
    - Branded header/footer with agency details
    - Hero image cover page
    - Auto-layout for multiple images
    - Image compression to meet size targets
    - Optional QR code
    - EPC rating and compliance footer
    """
    
    def __init__(
        self,
        max_size_mb: float = 10.0,
        template: str = "simple"
    ):
        """
        Initialize PDF generator.
        
        Args:
            max_size_mb: Target maximum PDF size in MB
            template: Template style (simple, classic, premium)
        """
        self.max_size_mb = max_size_mb
        self.template = template
        self.page_width, self.page_height = A4
        
    def generate_pdf(
        self,
        listing_data: ListingDataExport,
        images: List[ImageInput],
        branding: BrandingOptions,
        options: PDFOptions,
        output_path: str
    ) -> Dict[str, Any]:
        """
        Generate a PDF brochure.
        
        Args:
            listing_data: Complete listing information
            images: List of property images
            branding: Agency branding configuration
            options: PDF generation options
            output_path: Path where PDF will be saved
            
        Returns:
            Dictionary with metadata about the generated PDF
        """
        logger.info(f"Generating PDF for {listing_data.address}")
        
        # Create document
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=20*mm,
            leftMargin=20*mm,
            topMargin=25*mm,
            bottomMargin=25*mm,
        )
        
        # Build content
        story = []
        styles = self._create_styles(branding)
        
        # Cover page
        story.extend(self._create_cover_page(listing_data, images, branding, styles))
        story.append(PageBreak())
        
        # Main content
        story.extend(self._create_main_content(listing_data, styles))
        
        # Features section
        story.extend(self._create_features_section(listing_data, styles))
        
        # Room captions (if provided)
        if listing_data.room_captions:
            story.extend(self._create_room_captions(listing_data, styles))
        
        # Image gallery
        if len(images) > 1:
            story.append(PageBreak())
            story.extend(self._create_image_gallery(images[1:], styles))
        
        # QR code (if enabled)
        if options.enable_qr and options.qr_target_url:
            story.extend(self._create_qr_section(options.qr_target_url, styles))
        
        # Build PDF with header/footer
        doc.build(
            story,
            onFirstPage=lambda c, d: self._add_header_footer(c, d, branding, listing_data, True),
            onLaterPages=lambda c, d: self._add_header_footer(c, d, branding, listing_data, False)
        )
        
        # Check file size
        file_size = os.path.getsize(output_path)
        size_mb = file_size / (1024 * 1024)
        size_warning = size_mb > self.max_size_mb
        
        metadata = {
            "template": self.template,
            "images_included": len(images),
            "qr_enabled": options.enable_qr,
            "pages": self._estimate_pages(listing_data, images),
            "size_bytes": file_size,
            "size_mb": round(size_mb, 2),
            "size_warning_exceeded": size_warning
        }
        
        logger.info(f"PDF generated: {size_mb:.2f} MB, {metadata['pages']} pages")
        
        return metadata
    
    def _create_styles(self, branding: BrandingOptions) -> Dict[str, ParagraphStyle]:
        """Create custom paragraph styles with branding colors."""
        styles = getSampleStyleSheet()
        
        # Parse brand colors
        try:
            primary = colors.HexColor(branding.primary_color)
        except:
            primary = colors.HexColor("#0A5FFF")
        
        # Custom styles
        custom_styles = {
            "Title": ParagraphStyle(
                "CustomTitle",
                parent=styles["Heading1"],
                fontSize=24,
                textColor=primary,
                spaceAfter=12,
                alignment=TA_CENTER,
                fontName="Helvetica-Bold"
            ),
            "Headline": ParagraphStyle(
                "CustomHeadline",
                parent=styles["Heading2"],
                fontSize=18,
                textColor=primary,
                spaceAfter=10,
                fontName="Helvetica-Bold"
            ),
            "Subheading": ParagraphStyle(
                "CustomSubheading",
                parent=styles["Heading3"],
                fontSize=14,
                textColor=primary,
                spaceAfter=8,
                fontName="Helvetica-Bold"
            ),
            "Body": ParagraphStyle(
                "CustomBody",
                parent=styles["BodyText"],
                fontSize=11,
                alignment=TA_JUSTIFY,
                spaceAfter=10,
                leading=16
            ),
            "Feature": ParagraphStyle(
                "CustomFeature",
                parent=styles["BodyText"],
                fontSize=10,
                leftIndent=20,
                bulletIndent=10,
                spaceAfter=4
            ),
            "Caption": ParagraphStyle(
                "CustomCaption",
                parent=styles["BodyText"],
                fontSize=9,
                textColor=colors.grey,
                alignment=TA_CENTER,
                spaceAfter=6
            ),
            "Footer": ParagraphStyle(
                "CustomFooter",
                parent=styles["BodyText"],
                fontSize=8,
                textColor=colors.grey,
                alignment=TA_CENTER
            )
        }
        
        return custom_styles
    
    def _create_cover_page(
        self,
        listing_data: ListingDataExport,
        images: List[ImageInput],
        branding: BrandingOptions,
        styles: Dict[str, ParagraphStyle]
    ) -> List:
        """Create cover page with hero image and headline."""
        story = []
        
        # Spacer for top margin
        story.append(Spacer(1, 20*mm))
        
        # Address/Title
        address_title = Paragraph(listing_data.address, styles["Title"])
        story.append(address_title)
        story.append(Spacer(1, 5*mm))
        
        # Price (if provided)
        if listing_data.price:
            price_para = Paragraph(
                f"<b>{listing_data.price}</b>",
                ParagraphStyle(
                    "PriceStyle",
                    parent=styles["Headline"],
                    fontSize=20,
                    alignment=TA_CENTER
                )
            )
            story.append(price_para)
            story.append(Spacer(1, 10*mm))
        
        # Hero image
        hero_image = next((img for img in images if img.is_hero), images[0] if images else None)
        if hero_image:
            img_element = self._process_image(hero_image.url, max_width=160*mm, max_height=120*mm)
            if img_element:
                story.append(img_element)
                if hero_image.caption:
                    caption = Paragraph(hero_image.caption, styles["Caption"])
                    story.append(caption)
        
        story.append(Spacer(1, 10*mm))
        
        # Headline
        headline = Paragraph(listing_data.headline, styles["Headline"])
        story.append(headline)
        
        return story
    
    def _create_main_content(
        self,
        listing_data: ListingDataExport,
        styles: Dict[str, ParagraphStyle]
    ) -> List:
        """Create main description section."""
        story = []
        
        story.append(Spacer(1, 5*mm))
        
        # Section title
        title = Paragraph("Property Description", styles["Subheading"])
        story.append(title)
        
        # Main description
        description = Paragraph(listing_data.main_description, styles["Body"])
        story.append(description)
        
        story.append(Spacer(1, 5*mm))
        
        return story
    
    def _create_features_section(
        self,
        listing_data: ListingDataExport,
        styles: Dict[str, ParagraphStyle]
    ) -> List:
        """Create key features section with bullets."""
        story = []
        
        if not listing_data.key_features:
            return story
        
        # Section title
        title = Paragraph("Key Features", styles["Subheading"])
        story.append(title)
        
        # Features as bullet list
        for feature in listing_data.key_features:
            bullet = Paragraph(f"• {feature}", styles["Feature"])
            story.append(bullet)
        
        story.append(Spacer(1, 5*mm))
        
        return story
    
    def _create_room_captions(
        self,
        listing_data: ListingDataExport,
        styles: Dict[str, ParagraphStyle]
    ) -> List:
        """Create room-by-room captions section."""
        story = []
        
        story.append(PageBreak())
        
        # Section title
        title = Paragraph("Room Details", styles["Subheading"])
        story.append(title)
        story.append(Spacer(1, 3*mm))
        
        # Each room
        for room_caption in listing_data.room_captions:
            room_title = Paragraph(f"<b>{room_caption.room}</b>", styles["Body"])
            story.append(room_title)
            
            caption = Paragraph(room_caption.caption, styles["Body"])
            story.append(caption)
            story.append(Spacer(1, 3*mm))
        
        return story
    
    def _create_image_gallery(
        self,
        images: List[ImageInput],
        styles: Dict[str, ParagraphStyle]
    ) -> List:
        """Create image gallery with 2 images per row."""
        story = []
        
        # Section title
        title = Paragraph("Property Gallery", styles["Subheading"])
        story.append(title)
        story.append(Spacer(1, 5*mm))
        
        # Layout images in pairs
        for i in range(0, len(images), 2):
            row_images = images[i:i+2]
            
            table_data = []
            img_row = []
            caption_row = []
            
            for img_input in row_images:
                img = self._process_image(img_input.url, max_width=75*mm, max_height=60*mm)
                if img:
                    img_row.append(img)
                    caption_text = img_input.caption or ""
                    caption_row.append(Paragraph(caption_text, styles["Caption"]))
            
            if img_row:
                table_data.append(img_row)
                table_data.append(caption_row)
                
                table = Table(table_data, colWidths=[80*mm] * len(img_row))
                table.setStyle(TableStyle([
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ]))
                story.append(table)
                story.append(Spacer(1, 5*mm))
        
        return story
    
    def _create_qr_section(self, url: str, styles: Dict[str, ParagraphStyle]) -> List:
        """Create QR code section."""
        story = []
        
        story.append(Spacer(1, 10*mm))
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, box_size=10, border=2)
        qr.add_data(url)
        qr.make(fit=True)
        
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to bytes
        qr_bytes = io.BytesIO()
        qr_img.save(qr_bytes, format="PNG")
        qr_bytes.seek(0)
        
        # Add to PDF
        qr_element = RLImage(qr_bytes, width=40*mm, height=40*mm)
        
        # Center QR code
        qr_table = Table([[qr_element]], colWidths=[170*mm])
        qr_table.setStyle(TableStyle([("ALIGN", (0, 0), (-1, -1), "CENTER")]))
        story.append(qr_table)
        
        # Caption
        qr_caption = Paragraph(f"Scan to view online: {url}", styles["Caption"])
        story.append(qr_caption)
        
        return story
    
    def _process_image(
        self,
        image_path: str,
        max_width: float,
        max_height: float
    ) -> Optional[RLImage]:
        """
        Load and optimize image for PDF inclusion.
        
        Args:
            image_path: Path to image file
            max_width: Maximum width in points
            max_height: Maximum height in points
            
        Returns:
            RLImage object or None if image cannot be loaded
        """
        try:
            if not os.path.exists(image_path):
                logger.warning(f"Image not found: {image_path}")
                return None
            
            # Open image
            img = Image.open(image_path)
            
            # Convert RGBA to RGB if necessary
            if img.mode == "RGBA":
                img = img.convert("RGB")
            
            # Calculate scaling
            width_ratio = max_width / img.width
            height_ratio = max_height / img.height
            scale = min(width_ratio, height_ratio, 1.0)  # Don't upscale
            
            new_width = int(img.width * scale)
            new_height = int(img.height * scale)
            
            # Resize if needed
            if scale < 1.0:
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Save to bytes (optimize for size)
            img_bytes = io.BytesIO()
            img.save(img_bytes, format="JPEG", quality=85, optimize=True)
            img_bytes.seek(0)
            
            # Create ReportLab image
            rl_img = RLImage(img_bytes, width=new_width, height=new_height)
            
            return rl_img
            
        except Exception as e:
            logger.error(f"Failed to process image {image_path}: {e}")
            return None
    
    def _add_header_footer(
        self,
        canvas: canvas.Canvas,
        doc: SimpleDocTemplate,
        branding: BrandingOptions,
        listing_data: ListingDataExport,
        is_first_page: bool
    ):
        """Add branded header and footer to page."""
        canvas.saveState()
        
        # Parse brand color
        try:
            primary = colors.HexColor(branding.primary_color)
        except:
            primary = colors.HexColor("#0A5FFF")
        
        # Header (skip on first page)
        if not is_first_page:
            canvas.setStrokeColor(primary)
            canvas.setLineWidth(1)
            canvas.line(30*mm, self.page_height - 15*mm, self.page_width - 30*mm, self.page_height - 15*mm)
            
            canvas.setFont("Helvetica", 9)
            canvas.setFillColor(primary)
            canvas.drawString(30*mm, self.page_height - 12*mm, branding.agency_name)
        
        # Footer
        canvas.setStrokeColor(primary)
        canvas.setLineWidth(1)
        canvas.line(30*mm, 15*mm, self.page_width - 30*mm, 15*mm)
        
        # Contact details
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.grey)
        
        footer_text = f"{branding.agency_name} | {branding.phone} | {branding.email}"
        canvas.drawCentredString(self.page_width / 2, 12*mm, footer_text)
        
        # EPC warning if missing
        if not listing_data.epc_rating:
            canvas.setFillColor(colors.red)
            canvas.drawCentredString(
                self.page_width / 2,
                9*mm,
                "⚠ EPC rating to be confirmed"
            )
        else:
            canvas.setFillColor(colors.grey)
            canvas.drawCentredString(
                self.page_width / 2,
                9*mm,
                f"EPC Rating: {listing_data.epc_rating}"
            )
        
        # Page number
        canvas.setFillColor(colors.grey)
        page_num = canvas.getPageNumber()
        canvas.drawRightString(self.page_width - 30*mm, 12*mm, f"Page {page_num}")
        
        canvas.restoreState()
    
    def _estimate_pages(self, listing_data: ListingDataExport, images: List[ImageInput]) -> int:
        """Estimate number of pages in the PDF."""
        pages = 1  # Cover
        pages += 1  # Main content + features
        
        if listing_data.room_captions:
            pages += 1
        
        if len(images) > 1:
            pages += 1  # Gallery
        
        return pages
