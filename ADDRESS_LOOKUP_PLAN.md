# Address Lookup Implementation Plan

## Current Issues
1. ✅ Postcode autocomplete shows just postcodes (M1 4AB, M1 4AH) - WORKING
2. ❌ Need FULL ADDRESS lookup (e.g., "123 High Street, M1 4AB")
3. ❌ "Waverly" and other mock data showing in forms (from localStorage)
4. ❌ Mock house name dropdown still visible
5. ❌ Mock EPC rating and guide price pre-filled

## Solution Required

### IMMEDIATE FIX (Manual):
1. **Clear browser localStorage**:
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Refresh page

2. **Disable form auto-restore temporarily**:
   - Edit `frontend/form_auto_save.js`
   - Comment out the restore function

### FULL ADDRESS LOOKUP IMPLEMENTATION:

#### Option 1: Ideal Postcodes (RECOMMENDED)
- **Cost**: £20/month for 1000 lookups
- **Features**: Full UK address database, PAF licensed
- **API**: https://ideal-postcodes.co.uk/

**Steps**:
1. Sign up: https://ideal-postcodes.co.uk/accounts
2. Get API key
3. Add to `.env`: `IDEAL_POSTCODES_API_KEY=your_key_here`
4. Backend changes needed (see below)
5. Frontend changes needed (see below)

#### Option 2: Getaddress.io
- **Cost**: £25/month for 1000 lookups
- **API**: https://getaddress.io/

#### Option 3: Loqate
- **Cost**: Enterprise pricing
- **API**: https://www.loqate.com/

## Implementation Steps (Ideal Postcodes)

### Backend Changes

1. **Install httpx** (already installed ✅)

2. **Create providers/address_lookup_client.py**:
```python
import httpx
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

class AddressLookupClient:
    """Client for Ideal Postcodes API"""

    BASE_URL = "https://api.ideal-postcodes.co.uk/v1"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=10)

    async def lookup_addresses(self, postcode: str) -> List[Dict]:
        """
        Get all addresses for a postcode
        Returns:
            List of addresses with full details
        """
        url = f"{self.BASE_URL}/postcodes/{postcode.replace(' ', '')}"
        params = {"api_key": self.api_key}

        try:
            response = await self.client.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                return data.get("result", [])
            return []
        except Exception as e:
            logger.error(f"Address lookup failed: {e}")
            return []
```

3. **Update backend/config.py**:
```python
class Settings(BaseSettings):
    ...
    ideal_postcodes_api_key: str = ""
```

4. **Update backend/main.py** - Add new endpoint:
```python
@app.post("/address/lookup")
async def lookup_addresses(request: PostcodeRequest):
    """Get all addresses for a postcode"""
    addresses = await address_lookup_client.lookup_addresses(request.postcode)

    return {
        "addresses": [
            {
                "line_1": addr.get("line_1", ""),
                "line_2": addr.get("line_2", ""),
                "line_3": addr.get("line_3", ""),
                "postcode": addr.get("postcode", ""),
                "post_town": addr.get("post_town", ""),
                "county": addr.get("county", ""),
                "formatted": f"{addr.get('line_1', '')}, {addr.get('post_town', '')}, {addr.get('postcode', '')}"
            }
            for addr in addresses
        ]
    }
```

### Frontend Changes

1. **Update frontend/postcode_autofill.js**:

```javascript
// Fetch ADDRESS suggestions (not just postcodes)
async function fetchAddressSuggestions(postcode) {
    const response = await fetch('/address/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode })
    });
    const result = await response.json();
    return result.addresses || [];
}

// Show addresses in dropdown
function showAddressDropdown(input, addresses) {
    // ... create dropdown ...

    addresses.forEach((address, index) => {
        const option = document.createElement('div');
        option.innerHTML = `
            <div style="font-weight: 600;">${address.line_1}</div>
            <div style="font-size: 0.875rem; color: #666;">
                ${address.post_town}, ${address.postcode}
            </div>
        `;
        option.addEventListener('click', () => {
            selectAddress(address);
        });
        dropdown.appendChild(option);
    });
}

// When address selected, autofill form
function selectAddress(address) {
    // Fill in form fields
    document.getElementById('address').value = address.line_1;
    document.getElementById('postcode').value = address.postcode;

    // Fetch enrichment data
    fetchEnrichmentData(address.postcode);
}
```

## Workflow After Implementation

1. User types "GU6 7" → Shows postcodes dropdown
2. User selects "GU6 7HH" → Shows ADDRESSES dropdown:
   - "1 The Street, Bramley, GU6 7HH"
   - "2 The Street, Bramley, GU6 7HH"
   - "Waverly House, The Street, Bramley, GU6 7HH"
   - etc.
3. User selects address → Form autofills with:
   - Address: "Waverly House"
   - Postcode: "GU6 7HH"
   - Enrichment data loads automatically

## Files to Create/Modify

### Create:
- `providers/address_lookup_client.py` (new)
- `ADDRESS_LOOKUP_PLAN.md` (this file)

### Modify:
- `backend/config.py` - Add API key setting
- `backend/main.py` - Add address lookup endpoint + initialize client
- `backend/schemas.py` - Add address schemas
- `frontend/postcode_autofill.js` - Update to use address API
- `.env` - Add `IDEAL_POSTCODES_API_KEY=your_key`

## Cost Analysis

For 100 properties/month:
- Ideal Postcodes: £20/month (1000 lookups included) ✅
- Average: 2 lookups per property = 200 lookups/month
- Cost per property: £0.02

## Next Steps

1. **You**: Sign up for Ideal Postcodes and get API key
2. **Me**: Implement the full address lookup system
3. **Test**: Verify full address dropdown works
4. **Clean**: Remove all mock data and localStorage issues

