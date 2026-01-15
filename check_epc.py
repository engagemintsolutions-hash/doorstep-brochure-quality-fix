import sqlite3

conn = sqlite3.connect('data/epc/epc.db')
cursor = conn.cursor()

# Check GU6 7HH
cursor.execute("SELECT COUNT(*) FROM epc_certificates WHERE UPPER(REPLACE(postcode, ' ', '')) = 'GU67HH'")
count = cursor.fetchone()[0]
print(f"GU6 7HH count: {count}")

# Check any GU6 properties
cursor.execute("SELECT postcode, address, property_type, current_energy_rating FROM epc_certificates WHERE UPPER(REPLACE(postcode, ' ', '')) LIKE 'GU6%' LIMIT 10")
results = cursor.fetchall()
print(f"\nSample GU6 properties ({len(results)} found):")
for r in results:
    print(f"  {r[0]} - {r[1]}")

# Check what the EPC service is using
cursor.execute("SELECT COUNT(*) FROM epc_certificates WHERE postcode LIKE 'GU6 7%'")
print(f"\nUsing LIKE 'GU6 7%': {cursor.fetchone()[0]}")

cursor.execute("SELECT COUNT(*) FROM epc_certificates WHERE postcode = 'GU6 7HH'")
print(f"Using = 'GU6 7HH': {cursor.fetchone()[0]}")

conn.close()
