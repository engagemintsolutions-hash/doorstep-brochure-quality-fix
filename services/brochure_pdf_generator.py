"""
Brochure PDF generator for interactive brochure editor.
Handles dynamic layouts (hero, split, grid, magazine, gallery, showcase).
"""
import os
import io
import logging
from typing import List, Dict, Any
from PIL import Image

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage,
    PageBreak, Table, TableStyle, KeepTogether, Frame, PageTemplate
)
from reportlab.pdfgen import canvas as pdf_canvas

logger = logging.getLogger(__name__)


class BrochurePDFGenerator:
    """
    Generates PDF brochures from interactive brochure editor data.

    Supports dynamic layouts:
    - hero: Large feature photo(s) with dramatic presentation
    - split: Side-by-side photo layout
    - grid: Even grid arrangement
    - magazine: Mixed sizes for visual interest
    - gallery: Multiple photos in flowing arrangement
    - showcase: Full-page photo spreads
    - contact: Agent contact page
    """

    def __init__(self, max_size_mb: float = 20.0):
        """
        Initialize brochure PDF generator.

        Args:
            max_size_mb: Target maximum PDF size in MB
        """
        self.max_size_mb = max_size_mb
        self.page_width, self.page_height = landscape(A4)

    def generate_brochure_pdf(
        self,
        property_data: Dict[str, Any],
        agent_data: Dict[str, Any],
        pages: List[Dict[str, Any]],
        layout_style: str,
        output_path: str,
        brand_colors: Dict[str, str] = None
    ) -> Dict[str, Any]:
        """
        Generate a complete brochure PDF.

        Args:
            property_data: Property information (address, price, etc.)
            agent_data: Agent information (name, phone, email)
            pages: List of page objects with photos, layout, content
            layout_style: Overall brochure style (standard/blended)
            output_path: Path where PDF will be saved

        Returns:
            Dictionary with metadata about the generated PDF
        """
        logger.info(f"Generating brochure PDF for {property_data.get('address', 'property')}")
        logger.info(f"Layout style: {layout_style}, Pages: {len(pages)}")

        # Store brand colors for use in styles and footer
        self.brand_colors = brand_colors or {
            "primary": "#002855",    # Default to Savills navy
            "secondary": "#C5A572"   # Default to Savills gold
        }

        # Create document in LANDSCAPE orientation
        doc = SimpleDocTemplate(
            output_path,
            pagesize=landscape(A4),
            rightMargin=15*mm,
            leftMargin=15*mm,
            topMargin=15*mm,
            bottomMargin=20*mm,
        )

        # Build content
        story = []
        styles = self._create_styles()

        # Cover page with property details
        story.extend(self._create_cover_page(property_data, agent_data, styles))
        story.append(PageBreak())

        # Process each page based on layout
        for idx, page in enumerate(pages):
            logger.info(f"Processing page {idx + 1}: {page.get('title')} with {len(page.get('photos', []))} photos")

            # Page title
            title = Paragraph(page.get("title", ""), styles["PageTitle"])
            story.append(title)
            story.append(Spacer(1, 5*mm))

            # Content blocks (if any)
            for content_block in page.get("content", []):
                if content_block.get("type") == "text":
                    text_para = Paragraph(content_block.get("text", ""), styles["Body"])
                    story.append(text_para)
                    story.append(Spacer(1, 3*mm))
                elif content_block.get("type") == "feature":
                    feature_para = Paragraph(f"• {content_block.get('text', '')}", styles["Feature"])
                    story.append(feature_para)

            if page.get("content"):
                story.append(Spacer(1, 5*mm))

            # Photos based on layout
            photos = page.get("photos", [])
            layout = page.get("layout", "standard")

            if photos:
                story.extend(self._create_photo_layout(photos, layout, styles))

            # Page break (except for last page)
            if idx < len(pages) - 1:
                story.append(PageBreak())

        # Agent contact page
        story.append(PageBreak())
        story.extend(self._create_contact_page(agent_data, styles))

        # Build PDF
        doc.build(
            story,
            onFirstPage=lambda c, d: self._add_footer(c, d, property_data, agent_data),
            onLaterPages=lambda c, d: self._add_footer(c, d, property_data, agent_data)
        )

        # Check file size
        file_size = os.path.getsize(output_path)
        size_mb = file_size / (1024 * 1024)

        metadata = {
            "pages": len(pages),
            "total_photos": sum(len(p.get("photos", [])) for p in pages),
            "layout_style": layout_style,
            "size_bytes": file_size,
            "size_mb": round(size_mb, 2),
        }

        logger.info(f"PDF generated: {size_mb:.2f} MB, {len(pages)} pages")

        return metadata

    def _create_styles(self) -> Dict[str, ParagraphStyle]:
        """Create custom paragraph styles using agency brand colors."""
        styles = getSampleStyleSheet()

        # Use agency primary color for titles/headings
        primary_color = colors.HexColor(self.brand_colors.get("primary", "#002855"))

        custom_styles = {
            "CoverTitle": ParagraphStyle(
                "CoverTitle",
                parent=styles["Heading1"],
                fontSize=28,
                textColor=primary_color,
                spaceAfter=12,
                alignment=TA_CENTER,
                fontName="Helvetica-Bold"
            ),
            "CoverSubtitle": ParagraphStyle(
                "CoverSubtitle",
                parent=styles["Heading2"],
                fontSize=20,
                textColor=colors.HexColor("#0B1B2B"),
                spaceAfter=8,
                alignment=TA_CENTER,
                fontName="Helvetica-Bold"
            ),
            "PageTitle": ParagraphStyle(
                "PageTitle",
                parent=styles["Heading2"],
                fontSize=18,
                textColor=primary_color,
                spaceAfter=10,
                fontName="Helvetica-Bold"
            ),
            "Body": ParagraphStyle(
                "Body",
                parent=styles["BodyText"],
                fontSize=11,
                alignment=TA_LEFT,
                spaceAfter=8,
                leading=16
            ),
            "Feature": ParagraphStyle(
                "Feature",
                parent=styles["BodyText"],
                fontSize=10,
                leftIndent=10,
                spaceAfter=4
            ),
            "Caption": ParagraphStyle(
                "Caption",
                parent=styles["BodyText"],
                fontSize=9,
                textColor=colors.grey,
                alignment=TA_CENTER,
                spaceAfter=6
            ),
            "Footer": ParagraphStyle(
                "Footer",
                parent=styles["BodyText"],
                fontSize=8,
                textColor=colors.grey,
                alignment=TA_CENTER
            ),
            "ContactTitle": ParagraphStyle(
                "ContactTitle",
                parent=styles["Heading2"],
                fontSize=22,
                textColor=primary_color,
                spaceAfter=12,
                alignment=TA_CENTER,
                fontName="Helvetica-Bold"
            ),
            "ContactInfo": ParagraphStyle(
                "ContactInfo",
                parent=styles["BodyText"],
                fontSize=14,
                spaceAfter=8,
                alignment=TA_CENTER
            )
        }

        return custom_styles

    def _create_cover_page(
        self,
        property_data: Dict[str, Any],
        agent_data: Dict[str, Any],
        styles: Dict[str, ParagraphStyle]
    ) -> List:
        """Create cover page with property details."""
        story = []

        # Spacer for top margin
        story.append(Spacer(1, 30*mm))

        # Address/Title
        address = property_data.get("address", "Property Brochure")
        address_para = Paragraph(address, styles["CoverTitle"])
        story.append(address_para)
        story.append(Spacer(1, 8*mm))

        # Price (if provided)
        price = property_data.get("askingPrice", "")
        if price:
            price_para = Paragraph(f"£{price:,}" if isinstance(price, (int, float)) else str(price), styles["CoverSubtitle"])
            story.append(price_para)
            story.append(Spacer(1, 5*mm))

        # Property details
        details = []
        if property_data.get("bedrooms"):
            details.append(f"{property_data['bedrooms']} Bedrooms")
        if property_data.get("bathrooms"):
            details.append(f"{property_data['bathrooms']} Bathrooms")
        if property_data.get("propertyType"):
            details.append(property_data["propertyType"])

        if details:
            details_text = " • ".join(details)
            details_para = Paragraph(details_text, styles["Body"])
            story.append(details_para)
            story.append(Spacer(1, 10*mm))

        # Agent info on cover
        agent_name = agent_data.get("name", "")
        if agent_name:
            agent_para = Paragraph(f"Presented by {agent_name}", styles["Body"])
            story.append(agent_para)

        return story

    def _create_photo_layout(
        self,
        photos: List[Dict[str, Any]],
        layout: str,
        styles: Dict[str, ParagraphStyle]
    ) -> List:
        """
        Create photo layout based on template style.

        Args:
            photos: List of photo dicts with 'path' and optional 'name'
            layout: Layout style (hero, split, grid, magazine, gallery, showcase)
            styles: Paragraph styles

        Returns:
            List of ReportLab flowables
        """
        story = []

        num_photos = len(photos)
        logger.info(f"Creating {layout} layout with {num_photos} photos")

        if layout == "hero":
            # Large feature photo(s) - 1 per page
            for photo in photos[:2]:  # Max 2 hero images
                img = self._process_image(photo["path"], max_width=170*mm, max_height=180*mm)
                if img:
                    story.append(img)
                    story.append(Spacer(1, 3*mm))

        elif layout == "split":
            # Side-by-side - 2 photos per row
            for i in range(0, num_photos, 2):
                row_photos = photos[i:i+2]
                img_row = []

                for photo in row_photos:
                    img = self._process_image(photo["path"], max_width=85*mm, max_height=100*mm)
                    if img:
                        img_row.append(img)

                if img_row:
                    table = Table([img_row], colWidths=[90*mm] * len(img_row))
                    table.setStyle(TableStyle([
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 5*mm))

        elif layout == "grid":
            # Even grid - 2x2 or 3x3
            cols = 2 if num_photos <= 4 else 3
            col_width = 85*mm if cols == 2 else 55*mm
            max_height = 90*mm if cols == 2 else 60*mm

            for i in range(0, num_photos, cols):
                row_photos = photos[i:i+cols]
                img_row = []

                for photo in row_photos:
                    img = self._process_image(photo["path"], max_width=col_width, max_height=max_height)
                    if img:
                        img_row.append(img)

                if img_row:
                    table = Table([img_row], colWidths=[col_width] * len(img_row))
                    table.setStyle(TableStyle([
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 4*mm))

        elif layout == "magazine":
            # Mixed sizes - first photo large, rest smaller
            if num_photos > 0:
                # First photo large
                img = self._process_image(photos[0]["path"], max_width=170*mm, max_height=120*mm)
                if img:
                    story.append(img)
                    story.append(Spacer(1, 5*mm))

                # Remaining photos in pairs
                for i in range(1, num_photos, 2):
                    row_photos = photos[i:i+2]
                    img_row = []

                    for photo in row_photos:
                        img = self._process_image(photo["path"], max_width=85*mm, max_height=70*mm)
                        if img:
                            img_row.append(img)

                    if img_row:
                        table = Table([img_row], colWidths=[90*mm] * len(img_row))
                        table.setStyle(TableStyle([
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                        ]))
                        story.append(table)
                        story.append(Spacer(1, 4*mm))

        elif layout == "gallery":
            # Flowing arrangement - 3 photos per row
            for i in range(0, num_photos, 3):
                row_photos = photos[i:i+3]
                img_row = []

                for photo in row_photos:
                    img = self._process_image(photo["path"], max_width=55*mm, max_height=60*mm)
                    if img:
                        img_row.append(img)

                if img_row:
                    table = Table([img_row], colWidths=[60*mm] * len(img_row))
                    table.setStyle(TableStyle([
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 4*mm))

        elif layout == "showcase":
            # Full-page photos - 1 per page with page break
            for idx, photo in enumerate(photos):
                img = self._process_image(photo["path"], max_width=180*mm, max_height=220*mm)
                if img:
                    story.append(img)
                    if idx < len(photos) - 1:
                        story.append(PageBreak())

        else:
            # Standard/fallback - 2 per row
            for i in range(0, num_photos, 2):
                row_photos = photos[i:i+2]
                img_row = []

                for photo in row_photos:
                    img = self._process_image(photo["path"], max_width=85*mm, max_height=100*mm)
                    if img:
                        img_row.append(img)

                if img_row:
                    table = Table([img_row], colWidths=[90*mm] * len(img_row))
                    table.setStyle(TableStyle([
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 5*mm))

        return story

    def _create_contact_page(
        self,
        agent_data: Dict[str, Any],
        styles: Dict[str, ParagraphStyle]
    ) -> List:
        """Create agent contact page with logo, agent photo, and floorplan."""
        story = []

        # Logo at top (if provided)
        logo_url = agent_data.get("logoUrl", "")
        if logo_url:
            # Logo is a URL path, need to convert to filesystem path
            # Try multiple possible locations for the logo file
            import os
            possible_paths = []

            if logo_url.startswith("/static/"):
                # Try static directory first (preferred), then frontend fallback
                relative_path = logo_url.replace("/static/", "")
                possible_paths = [
                    os.path.join("static", relative_path),
                    os.path.join("frontend", relative_path)
                ]
            else:
                possible_paths = [logo_url]

            # Try each path until one works
            for logo_path in possible_paths:
                if os.path.exists(logo_path):
                    try:
                        logo_img = self._process_image(logo_path, 60*mm, 20*mm)
                        if logo_img:
                            story.append(logo_img)
                            story.append(Spacer(1, 10*mm))
                            break  # Successfully loaded, stop trying other paths
                    except Exception as e:
                        logger.warning(f"Could not load logo from {logo_path}: {e}")
                        continue  # Try next path

        story.append(Spacer(1, 20*mm))

        # Title
        title = Paragraph("Contact Us", styles["ContactTitle"])
        story.append(title)
        story.append(Spacer(1, 10*mm))

        # Agent photo (if provided and includePhoto is True)
        agent_photo_path = agent_data.get("photoPath", "")
        include_photo = agent_data.get("includePhoto", False)
        if include_photo and agent_photo_path:
            try:
                agent_img = self._process_image(agent_photo_path, 40*mm, 50*mm)
                if agent_img:
                    story.append(agent_img)
                    story.append(Spacer(1, 5*mm))
            except Exception as e:
                print(f"Warning: Could not load agent photo: {e}")

        # Agent name
        agent_name = agent_data.get("name", "")
        if agent_name:
            name_para = Paragraph(f"<b>{agent_name}</b>", styles["ContactInfo"])
            story.append(name_para)
            story.append(Spacer(1, 5*mm))

        # Phone
        phone = agent_data.get("phone", "")
        if phone:
            phone_para = Paragraph(f"Phone: {phone}", styles["ContactInfo"])
            story.append(phone_para)

        # Email
        email = agent_data.get("email", "")
        if email:
            email_para = Paragraph(f"Email: {email}", styles["ContactInfo"])
            story.append(email_para)

        # Floorplan (if provided)
        floorplan_path = agent_data.get("floorplanPath", "")
        if floorplan_path:
            story.append(Spacer(1, 15*mm))

            # Floorplan heading
            floorplan_heading = Paragraph("<b>Property Layout</b>", styles["ContactTitle"])
            story.append(floorplan_heading)
            story.append(Spacer(1, 5*mm))

            try:
                # Full page width for floorplan
                floorplan_img = self._process_image(floorplan_path, 180*mm, 200*mm)
                if floorplan_img:
                    story.append(floorplan_img)
            except Exception as e:
                print(f"Warning: Could not load floorplan: {e}")

        return story

    def _process_image(
        self,
        image_path: str,
        max_width: float,
        max_height: float
    ) -> RLImage:
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

    def _add_footer(
        self,
        canvas: pdf_canvas.Canvas,
        doc: SimpleDocTemplate,
        property_data: Dict[str, Any],
        agent_data: Dict[str, Any]
    ):
        """Add footer with contact info to page."""
        canvas.saveState()

        # Footer line - use agency primary color
        footer_color = colors.HexColor(self.brand_colors.get("primary", "#002855"))
        canvas.setStrokeColor(footer_color)
        canvas.setLineWidth(1)
        canvas.line(30*mm, 15*mm, self.page_width - 30*mm, 15*mm)

        # Contact details
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.grey)

        agent_name = agent_data.get("name", "")
        phone = agent_data.get("phone", "")
        email = agent_data.get("email", "")

        footer_text = " | ".join(filter(None, [agent_name, phone, email]))
        canvas.drawCentredString(self.page_width / 2, 12*mm, footer_text)

        # Page number
        page_num = canvas.getPageNumber()
        canvas.drawRightString(self.page_width - 30*mm, 12*mm, f"Page {page_num}")

        canvas.restoreState()
