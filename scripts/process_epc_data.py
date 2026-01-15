"""
EPC Data Processor - Fast extraction and SQLite database builder
Processes 6GB ZIP file containing all UK domestic EPC certificates
"""
import os
import sqlite3
import zipfile
import csv
import time

def create_database(db_path):
    """Create SQLite database with optimized schema"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS epc_certificates (
            lmk_key TEXT PRIMARY KEY,
            address TEXT,
            postcode TEXT,
            current_energy_rating TEXT,
            potential_energy_rating TEXT,
            property_type TEXT,
            built_form TEXT,
            inspection_date TEXT,
            lodgement_date TEXT,
            tenure TEXT,
            transaction_type TEXT,
            total_floor_area REAL,
            number_habitable_rooms INTEGER,
            current_energy_efficiency INTEGER,
            potential_energy_efficiency INTEGER
        )
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_postcode ON epc_certificates(postcode)")
    conn.commit()
    print("[OK] Database created")
    return conn

def process_csv_batch(csv_path, conn, batch_size=50000):
    """Process CSV file in large batches"""
    cursor = conn.cursor()
    batch = []
    total = 0

    print(f"Processing: {os.path.basename(csv_path)}")

    with open(csv_path, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)

        for row in reader:
            try:
                data = (
                    row.get('LMK_KEY', ''),
                    row.get('ADDRESS', ''),
                    row.get('POSTCODE', '').replace(' ', '').upper(),
                    row.get('CURRENT_ENERGY_RATING', ''),
                    row.get('POTENTIAL_ENERGY_RATING', ''),
                    row.get('PROPERTY_TYPE', ''),
                    row.get('BUILT_FORM', ''),
                    row.get('INSPECTION_DATE', ''),
                    row.get('LODGEMENT_DATE', ''),
                    row.get('TENURE', ''),
                    row.get('TRANSACTION_TYPE', ''),
                    float(row.get('TOTAL_FLOOR_AREA', 0) or 0),
                    int(row.get('NUMBER_HABITABLE_ROOMS', 0) or 0),
                    int(row.get('CURRENT_ENERGY_EFFICIENCY', 0) or 0),
                    int(row.get('POTENTIAL_ENERGY_EFFICIENCY', 0) or 0)
                )
                batch.append(data)

                if len(batch) >= batch_size:
                    cursor.executemany("""
                        INSERT OR REPLACE INTO epc_certificates VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                    """, batch)
                    conn.commit()
                    total += len(batch)
                    print(f"  {total:,} records...")
                    batch = []

            except Exception as e:
                continue

        if batch:
            cursor.executemany("""
                INSERT OR REPLACE INTO epc_certificates VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, batch)
            conn.commit()
            total += len(batch)

    print(f"  [OK] {total:,} total")
    return total

def main():
    zip_path = r"C:\Users\billm\Downloads\all-domestic-certificates.zip"
    extract_dir = r"C:\Users\billm\Desktop\Listing agent\property-listing-generator\data\epc\temp"
    db_path = r"C:\Users\billm\Desktop\Listing agent\property-listing-generator\data\epc\epc.db"

    print("\n" + "="*60)
    print("EPC DATABASE BUILDER")
    print("="*60 + "\n")

    os.makedirs(extract_dir, exist_ok=True)
    conn = create_database(db_path)

    print("\nExtracting and processing ZIP file...")
    print("(Processing first 3 CSV files as test)\n")

    start = time.time()
    grand_total = 0

    with zipfile.ZipFile(zip_path, 'r') as zf:
        csv_files = [f for f in zf.namelist() if f.endswith('.csv')][:3]  # First 3 files
        print(f"Found {len(csv_files)} CSV files to process\n")

        for idx, csv_file in enumerate(csv_files, 1):
            print(f"[{idx}/{len(csv_files)}] {csv_file}")
            zf.extract(csv_file, extract_dir)
            csv_path = os.path.join(extract_dir, csv_file)

            total = process_csv_batch(csv_path, conn)
            grand_total += total

            os.remove(csv_path)

    elapsed = time.time() - start

    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM epc_certificates")
    db_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT postcode) FROM epc_certificates")
    unique_postcodes = cursor.fetchone()[0]

    print("\n" + "="*60)
    print("COMPLETE!")
    print("="*60)
    print(f"Records in database: {db_count:,}")
    print(f"Unique postcodes: {unique_postcodes:,}")
    print(f"Processing time: {elapsed:.1f}s")
    print(f"Database: {db_path}")
    print(f"Size: {os.path.getsize(db_path)/(1024*1024):.1f} MB")

    conn.close()

if __name__ == "__main__":
    main()
