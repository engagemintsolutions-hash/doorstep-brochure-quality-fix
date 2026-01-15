"""
Pydantic schemas for export endpoints (PDF, portal, social, email).
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class ImageInput(BaseModel):
    """Image input for export."""
    url: str = Field(..., description="Path to image file or base64 data")
    caption: Optional[str] = Field(None, description="Image caption")
    is_hero: bool = Field(False, description="Whether this is the hero/cover image")


class RoomCaption(BaseModel):
    """Caption for a specific room."""
    room: str = Field(..., description="Room name (e.g., 'Living Room', 'Kitchen')")
    caption: str = Field(..., description="Room description caption")


class ListingDataExport(BaseModel):
    """
    Complete listing data for export.
    This represents the final, selected variant ready for publishing.
    """
    address: str = Field(..., description="Full property address")
    price: Optional[str] = Field(None, description="Price string (e.g., '£495,000')")
    headline: str = Field(..., description="Main listing headline")
    main_description: str = Field(..., description="Full property description text")
    key_features: List[str] = Field(..., description="List of key features (bullets)")
    room_captions: List[RoomCaption] = Field(
        default_factory=list,
        description="Optional room-by-room captions"
    )
    epc_rating: Optional[str] = Field(None, description="EPC rating (A-G)")
    property_type: Optional[str] = Field(None, description="Property type")
    bedrooms: Optional[int] = Field(None, description="Number of bedrooms")
    bathrooms: Optional[int] = Field(None, description="Number of bathrooms")


class BrandingOptions(BaseModel):
    """Agency branding configuration for exports."""
    agency_name: str = Field("Your Agency", description="Agency name")
    phone: str = Field("+44 0000 000000", description="Contact phone number")
    email: str = Field("info@example.com", description="Contact email")
    primary_color: str = Field("#0A5FFF", description="Brand primary color (hex)")
    secondary_color: str = Field("#0B1B2B", description="Brand secondary color (hex)")
    logo_path: Optional[str] = Field(None, description="Path to agency logo image")


class PDFOptions(BaseModel):
    """PDF-specific export options."""
    template: str = Field("simple", description="PDF template: simple | classic | premium")
    enable_qr: bool = Field(False, description="Include QR code linking to property")
    qr_target_url: Optional[str] = Field(None, description="URL for QR code")


class PDFExportRequest(BaseModel):
    """Request for PDF brochure export."""
    listing_data: ListingDataExport
    images: List[ImageInput] = Field(default_factory=list, description="Property images")
    branding: BrandingOptions = Field(default_factory=BrandingOptions)
    options: PDFOptions = Field(default_factory=PDFOptions)


class ExportResponse(BaseModel):
    """Response for export endpoints (PDF or ZIP)."""
    export_id: str = Field(..., description="Unique export identifier")
    download_url: str = Field(..., description="URL to download the export")
    size_bytes: int = Field(..., description="File size in bytes")
    size_mb: float = Field(..., description="File size in megabytes")
    size_warning_exceeded: bool = Field(
        ...,
        description="True if file exceeds configured size cap"
    )
    meta: Dict[str, Any] = Field(..., description="Additional metadata about the export")


class PackExportRequest(BaseModel):
    """Request for marketing pack export (PDF + portal + social + email)."""
    listing_data: ListingDataExport
    images: List[ImageInput] = Field(default_factory=list)
    branding: BrandingOptions = Field(default_factory=BrandingOptions)
    options: PDFOptions = Field(default_factory=PDFOptions)


class PackExportResponse(BaseModel):
    """Response for marketing pack export."""
    export_id: str = Field(..., description="Unique export identifier")
    download_url: str = Field(..., description="URL to download the ZIP pack")
    size_bytes: int = Field(..., description="Total ZIP size in bytes")
    size_mb: float = Field(..., description="Total ZIP size in megabytes")
    contents: Dict[str, str] = Field(
        ...,
        description="Filenames of contents in the ZIP"
    )
