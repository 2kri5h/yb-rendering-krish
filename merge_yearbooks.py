#!/usr/bin/env python3
"""
Yearbook PDF Merger Script
=========================
Merges:
1. Personalised_pages_rendered_pdf (Cover, Censor Certificate, Profile page, posts)
2. Common pages (commented out collage & snapshots)
3. Personalized snapshot PDFs (if any available)

Page Order:
- Pages 1-3 of Personalized PDF (Intro, Cover, Censor Cert)
- Common Pages (26 pages)
- Middle Pages of Personalized PDF (Profile, Posts) [up to page index N-5]
- Personalized Snapshot PDF (if any)
- Page index N-4 of Personalized PDF (64 Convocation / LAST-5.png)
- End Pages of Personalized PDF (LAST-2.jpg, LAST-1.png, LAST.png) [page indices N-3 to N-1]
"""

import os
import csv
import sys
import io
import argparse

# Try loading pypdf from custom /tmp/temp_packages path or standard path
try:
    import pypdf
    from pypdf import PdfReader, PdfWriter
except ImportError:
    sys.path.insert(0, '/tmp/temp_packages')
    try:
        import pypdf
        from pypdf import PdfReader, PdfWriter
    except ImportError:
        print("\033[91mError: pypdf library is not installed.\033[0m")
        print("Please run: pip install pypdf")
        print("Or if you are on a system with permission restrictions: python3 -m pip install --target /tmp/temp_packages pypdf")
        sys.exit(1)

# Console Coloring
class Logger:
    CYAN = '\033[96m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    END = '\033[0m'

    @staticmethod
    def info(msg):
        print(f"{Logger.BLUE}[INFO]{Logger.END} {msg}")

    @staticmethod
    def success(msg):
        print(f"{Logger.GREEN}[SUCCESS]{Logger.END} {Logger.BOLD}{msg}{Logger.END}")

    @staticmethod
    def warn(msg):
        print(f"{Logger.YELLOW}[WARNING]{Logger.END} {msg}")

    @staticmethod
    def error(msg):
        print(f"{Logger.RED}[ERROR]{Logger.END} {Logger.BOLD}{msg}{Logger.END}")

    @staticmethod
    def title(msg):
        print(f"\n{Logger.CYAN}{Logger.BOLD}{'=' * 60}\n{msg}\n{'=' * 60}{Logger.END}")


# Google Drive Download Helper
def download_gdrive_folder(folder_id, dest_dir, service_account_path):
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaIoBaseDownload
    except ImportError:
        Logger.error("Google Client libraries not available. Please install google-api-python-client google-auth-httplib2 google-auth-oauthlib")
        return False

    if not os.path.exists(service_account_path):
        Logger.error(f"Service account JSON not found at: {service_account_path}")
        return False

    Logger.info(f"Connecting to Google Drive using credentials: {os.path.basename(service_account_path)}")
    SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
    creds = service_account.Credentials.from_service_account_file(service_account_path, scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)

    os.makedirs(dest_dir, exist_ok=True)
    query = f"'{folder_id}' in parents and mimeType = 'application/pdf' and trashed = false"
    Logger.info(f"Listing PDF files in GDrive folder: {folder_id}")

    try:
        results = service.files().list(q=query, fields="files(id, name)").execute()
        files = results.get('files', [])
        if not files:
            Logger.warn("No PDF files found in specified Google Drive folder.")
            return True

        Logger.info(f"Found {len(files)} PDFs. Starting download...")
        for idx, file_info in enumerate(files):
            file_id = file_info['id']
            file_name = file_info['name']
            dest_path = os.path.join(dest_dir, file_name)

            if os.path.exists(dest_path):
                Logger.info(f"[{idx+1}/{len(files)}] Skipping already downloaded: {file_name}")
                continue

            Logger.info(f"[{idx+1}/{len(files)}] Downloading: {file_name}...")
            request = service.files().get_media(fileId=file_id)
            fh = io.FileIO(dest_path, 'wb')
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
        Logger.success("Google Drive folder download completed.")
        return True
    except Exception as e:
        Logger.error(f"GDrive download error: {e}")
        return False


# Google Drive Single File Download Helper (on-demand)
def download_file_from_gdrive(folder_id, file_name_prefix, dest_dir, service_account_path):
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaIoBaseDownload
    except ImportError:
        return None

    if not os.path.exists(service_account_path):
        return None

    os.makedirs(dest_dir, exist_ok=True)
    # Strip extension for query
    query_prefix = file_name_prefix.replace(".pdf", "").replace(".PDF", "").strip()
    safe_prefix = query_prefix.replace("'", "\\'")
    
    try:
        SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
        creds = service_account.Credentials.from_service_account_file(service_account_path, scopes=SCOPES)
        service = build('drive', 'v3', credentials=creds)

        query = f"'{folder_id}' in parents and mimeType = 'application/pdf' and name contains '{safe_prefix}' and trashed = false"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        files = results.get('files', [])

        if not files:
            # Fallback: check all files in folder if contains query did not match
            query_all = f"'{folder_id}' in parents and mimeType = 'application/pdf' and trashed = false"
            results = service.files().list(q=query_all, fields="files(id, name)").execute()
            files_all = results.get('files', [])
            
            prefix_lower = query_prefix.lower()
            for file_info in files_all:
                name_lower = file_info['name'].lower().replace(".pdf", "").strip()
                if name_lower.startswith(prefix_lower) or prefix_lower in name_lower:
                    files = [file_info]
                    break

        if files:
            file_id = files[0]['id']
            file_name = files[0]['name']
            dest_path = os.path.join(dest_dir, file_name)
            
            # Skip downloading if already exists locally
            if os.path.exists(dest_path):
                return dest_path
                
            Logger.info(f"Downloading from Google Drive: '{file_name}'...")
            request = service.files().get_media(fileId=file_id)
            fh = io.FileIO(dest_path, 'wb')
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
            Logger.success(f"Successfully downloaded '{file_name}' from Google Drive.")
            return dest_path
    except Exception as e:
        Logger.warn(f"Google Drive search/download failed for prefix '{file_name_prefix}': {e}")
    return None


# Fuzzy header matching helper
def find_column(headers: list, keywords: list) -> str:
    for header in headers:
        normalized = header.lower().strip().replace('_', ' ').replace('-', ' ')
        for kw in keywords:
            if kw in normalized:
                return header
    return None


def add_scaled_page(writer, page):
    # Standard A4 size in PostScript points: 595.28 x 841.89
    target_w = 595.28
    target_h = 841.89
    try:
        w = float(page.mediabox.width)
        h = float(page.mediabox.height)
        if abs(w - target_w) < 1.0 and abs(h - target_h) < 1.0:
            page.mediabox.lower_left = (0, 0)
            page.mediabox.upper_right = (target_w, target_h)
            if '/CropBox' in page:
                page.cropbox.lower_left = (0, 0)
                page.cropbox.upper_right = (target_w, target_h)
        else:
            page.scale_to(width=target_w, height=target_h)
            page.mediabox.lower_left = (0, 0)
            page.mediabox.upper_right = (target_w, target_h)
            if '/CropBox' in page:
                page.cropbox.lower_left = (0, 0)
                page.cropbox.upper_right = (target_w, target_h)
    except Exception as e:
        Logger.warn(f"Failed to scale page: {e}. Adding original page size.")
    writer.add_page(page)


def merge_single_profile(pdf_path, common_pdf_path, snapshot_path, output_path):
    writer = PdfWriter()
    
    # 1. Load personalized PDF
    try:
        pers_reader = PdfReader(pdf_path)
    except Exception as e:
        Logger.error(f"Failed to read personalized PDF {pdf_path}: {e}")
        return False
        
    N = len(pers_reader.pages)
    if N < 5:
        Logger.warn(f"PDF {os.path.basename(pdf_path)} has only {N} pages. Appending all pages sequentially.")
        for page in pers_reader.pages:
            add_scaled_page(writer, page)
        if os.path.exists(common_pdf_path):
            try:
                common_reader = PdfReader(common_pdf_path)
                for page in common_reader.pages:
                    add_scaled_page(writer, page)
            except Exception as e:
                Logger.error(f"Error loading common PDF: {e}")
        if snapshot_path and os.path.exists(snapshot_path):
            try:
                snap_reader = PdfReader(snapshot_path)
                for page in snap_reader.pages:
                    add_scaled_page(writer, page)
            except Exception as e:
                Logger.error(f"Error loading snapshot PDF: {e}")
        with open(output_path, "wb") as f_out:
            writer.write(f_out)
        return True

    # High fidelity splits
    # Part 1: Front cover/Intro/Censor (first 3 pages, indices 0, 1, 2)
    for i in range(3):
        add_scaled_page(writer, pers_reader.pages[i])
        
    # Part 2: Common Pages
    if os.path.exists(common_pdf_path):
        try:
            common_reader = PdfReader(common_pdf_path)
            for page in common_reader.pages:
                add_scaled_page(writer, page)
        except Exception as e:
            Logger.error(f"Error loading common PDF {common_pdf_path}: {e}")
            return False
    else:
        Logger.error(f"Common PDF not found at {common_pdf_path}")
        return False
        
    # Part 3: Middle pages (Profile page to index N-5 inclusive, i.e. excluding LAST-5.png)
    for i in range(3, N - 4):
        add_scaled_page(writer, pers_reader.pages[i])
        
    # Part 4: Snapshot PDF
    if snapshot_path and os.path.exists(snapshot_path):
        try:
            snap_reader = PdfReader(snapshot_path)
            for page in snap_reader.pages:
                add_scaled_page(writer, page)
        except Exception as e:
            Logger.error(f"Error reading snapshot PDF {snapshot_path}: {e}")
            return False
            
    # Part 4.5: 64 Convocation / LAST-5.png (index N-4)
    add_scaled_page(writer, pers_reader.pages[N - 4])

    # Part 5: End back pages (indices N-3 to N-1, which are LAST-2.jpg, LAST-1.png, LAST.png)
    for i in range(N - 3, N):
        add_scaled_page(writer, pers_reader.pages[i])
        
    # Write final PDF
    try:
        with open(output_path, "wb") as f_out:
            writer.write(f_out)
        return True
    except Exception as e:
        Logger.error(f"Error saving merged PDF to {output_path}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Merge personalized profiles with common pages and snapshots.")
    parser.add_argument("--csv", default="merge_list.csv", help="Path to input CSV file mapping profile IDs and PDFs")
    parser.add_argument("--personalized-dir", default="Personalised_pages_rendered_pdf", help="Dir containing student personalized PDFs")
    parser.add_argument("--common-pdf", default="commented_pages_preview.pdf", help="Path to common pages PDF")
    parser.add_argument("--snapshots-dir", default="pers_snapshots_id", help="Dir containing student snapshot PDFs")
    parser.add_argument("--output-dir", default="final_merged_yearbooks", help="Dir to save output merged PDFs")
    
    # GDrive Sync Arguments
    parser.add_argument("--sync-gdrive", action="store_true", help="Sync folders from Google Drive before merging")
    parser.add_argument("--gdrive-pers-id", default="1AUZRUdlq-IsC9soL9KxL9E88SBkXKbba", help="Google Drive Folder ID for personalized profile PDFs")
    parser.add_argument("--gdrive-snap-id", default="1Ma599G8jg-bnQXrIoslqQXz3wnrs7JmQ", help="Google Drive Folder ID for snapshot PDFs")
    parser.add_argument("--service-account", default="YB-pdf-backend-main/physicalYbImage/service_account/yb-pdf-rendering-229aa55bb9b3.json", help="Path to service account credentials JSON")

    args = parser.parse_args()

    Logger.title("Yearbook PDF Merging Pipeline Initializing")

    # Optional: Sync folders from Google Drive
    if args.sync_gdrive:
        Logger.info("Sync GDrive flag detected.")
        if args.gdrive_pers_id:
            Logger.info("Downloading personalized PDFs from Google Drive...")
            download_gdrive_folder(args.gdrive_pers_id, args.personalized_dir, args.service_account)
        else:
            Logger.warn("GDrive Personalized Folder ID (--gdrive-pers-id) not provided. Skipping.")
            
        if args.gdrive_snap_id:
            Logger.info("Downloading snapshot PDFs from Google Drive...")
            download_gdrive_folder(args.gdrive_snap_id, args.snapshots_dir, args.service_account)
        else:
            Logger.warn("GDrive Snapshot Folder ID (--gdrive-snap-id) not provided. Skipping.")

    # Check input files and directories
    if not os.path.exists(args.csv):
        Logger.error(f"CSV file not found: {args.csv}")
        Logger.info("Please place or generate the CSV file, or specify its path with --csv.")
        sys.exit(1)

    if not os.path.exists(args.common_pdf):
        Logger.error(f"Common pages PDF not found: {args.common_pdf}")
        Logger.info("Ensure you have generated the common pages PDF first (e.g. commented_pages_preview.pdf).")
        sys.exit(1)

    os.makedirs(args.personalized_dir, exist_ok=True)
    os.makedirs(args.snapshots_dir, exist_ok=True)
    os.makedirs(args.output_dir, exist_ok=True)

    # Read CSV
    Logger.info(f"Reading CSV mapping from: {args.csv}")
    rows = []
    with open(args.csv, mode='r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        try:
            headers = next(reader)
        except StopIteration:
            Logger.error("CSV file is empty.")
            sys.exit(1)
            
        # Map columns using fuzzy matching
        col_pers_file = find_column(headers, ["name of file from folder", "personalized file", "file name", "pdf file", "name", "student name"])
        col_profile_id = find_column(headers, ["profile id", "id", "profile_id"])
        col_snap_flag = find_column(headers, ["personalised snapshots there", "snapshots there", "snapshot there", "snapshot flag", "personalised snapshots", "snapshots"])
        col_snap_file = find_column(headers, ["if yes then name", "snapshot file name", "snapshot filename", "snap file"])

        # Display resolved columns
        Logger.info("Resolved columns from CSV:")
        Logger.info(f"  - Personalized PDF filename column: '{col_pers_file}'")
        Logger.info(f"  - Profile ID column: '{col_profile_id}'")
        Logger.info(f"  - Snapshot flag column: '{col_snap_flag}'")
        Logger.info(f"  - Snapshot filename column: '{col_snap_file}'")

        # Validation
        if not col_pers_file:
            Logger.warn("Could not identify personalized file column. Defaulting to first column.")
            col_pers_file = headers[0]
        if not col_profile_id:
            Logger.warn("Could not identify profile ID column. Defaulting to second column.")
            col_profile_id = headers[1] if len(headers) > 1 else headers[0]

        # Read row data
        dict_reader = csv.DictReader(f, fieldnames=headers)
        for row in dict_reader:
            rows.append(row)

    total_profiles = len(rows)
    Logger.info(f"Loaded {total_profiles} profiles from CSV.")

    success_count = 0
    fail_count = 0
    warnings_count = 0

    # Process merges
    for idx, row in enumerate(rows):
        profile_id = row.get(col_profile_id, "").strip()
        pers_filename = row.get(col_pers_file, "").strip()
        
        # Determine snapshot inclusion
        snap_flag = row.get(col_snap_flag, "").strip().lower() if col_snap_flag else "no"
        include_snap = snap_flag in ["yes", "y", "true", "1"]
        
        snap_filename = row.get(col_snap_file, "").strip() if col_snap_file else ""

        Logger.info(f"[{idx+1}/{total_profiles}] Processing Profile: ID={profile_id} File={pers_filename}")

        if not pers_filename:
            Logger.error("Empty personalized filename! Skipping.")
            fail_count += 1
            continue

        # Look for personalized PDF
        pers_pdf_path = os.path.join(args.personalized_dir, pers_filename)
        
        # Check Google Drive first if configured
        if args.gdrive_pers_id and os.path.exists(args.service_account):
            gdrive_path = download_file_from_gdrive(
                args.gdrive_pers_id,
                pers_filename,
                args.personalized_dir,
                args.service_account
            )
            if gdrive_path and os.path.exists(gdrive_path):
                pers_pdf_path = gdrive_path
                pers_filename = os.path.basename(pers_pdf_path)

        # Fallback/verification locally if not downloaded or GDrive check failed
        if not os.path.exists(pers_pdf_path):
            # Try appending .pdf extension if missing
            if not pers_pdf_path.endswith(".pdf"):
                pers_pdf_path_with_pdf = pers_pdf_path + ".pdf"
            else:
                pers_pdf_path_with_pdf = pers_pdf_path
                
            if os.path.exists(pers_pdf_path_with_pdf):
                pers_pdf_path = pers_pdf_path_with_pdf
                pers_filename = os.path.basename(pers_pdf_path)
            else:
                # Try finding a file in the directory that starts with the given name prefix
                prefix = pers_filename.lower().replace(".pdf", "").strip()
                matched_file = None
                try:
                    for f in os.listdir(args.personalized_dir):
                        if f.lower().startswith(prefix) and f.lower().endswith(".pdf"):
                            matched_file = f
                            break
                except Exception as e:
                    pass
                
                if matched_file:
                    pers_filename = matched_file
                    pers_pdf_path = os.path.join(args.personalized_dir, pers_filename)
                    Logger.info(f"Fuzzy matched '{prefix}' to file: '{pers_filename}'")
                else:
                    Logger.error(f"Personalized PDF file not found: {pers_pdf_path}. Skipping.")
                    fail_count += 1
                    continue

        # Look for Snapshot PDF if requested
        snapshot_path = None
        if include_snap:
            snap_lookup = snap_filename if snap_filename else f"{profile_id}.pdf"
            
            # Check Google Drive first if configured
            if args.gdrive_snap_id and os.path.exists(args.service_account):
                gdrive_path = download_file_from_gdrive(
                    args.gdrive_snap_id,
                    snap_lookup,
                    args.snapshots_dir,
                    args.service_account
                )
                if gdrive_path and os.path.exists(gdrive_path):
                    snapshot_path = gdrive_path

            # Fallback to local search if GDrive check failed
            if not snapshot_path or not os.path.exists(snapshot_path):
                if snap_filename:
                    snapshot_path = os.path.join(args.snapshots_dir, snap_filename)
                    if not os.path.exists(snapshot_path) and not snapshot_path.endswith(".pdf"):
                        snapshot_path += ".pdf"
                else:
                    # Fallback to {profile_id}.pdf
                    snapshot_path = os.path.join(args.snapshots_dir, f"{profile_id}.pdf")

            if not snapshot_path or not os.path.exists(snapshot_path):
                Logger.warn(f"Snapshot PDF requested but not found at: {snapshot_path}. Proceeding without snapshot.")
                warnings_count += 1
                snapshot_path = None

        # Build output path
        output_filename = pers_filename
        output_pdf_path = os.path.join(args.output_dir, output_filename)

        # Execute merge
        success = merge_single_profile(
            pers_pdf_path,
            args.common_pdf,
            snapshot_path,
            output_pdf_path
        )

        if success:
            Logger.success(f"Successfully merged: {output_filename}")
            success_count += 1
        else:
            Logger.error(f"Failed merging: {pers_filename}")
            fail_count += 1

    # Print Summary Report
    Logger.title("Execution Summary Report")
    print(f"Total Profiles Evaluated: {total_profiles}")
    print(f"Successfully Merged:      \033[92m{success_count}\033[0m")
    print(f"Warnings / Missing Snaps: \033[93m{warnings_count}\033[0m")
    print(f"Failed / Skipped:         \033[91m{fail_count}\033[0m")
    print(f"Merged output saved in:   \033[96m{args.output_dir}/\033[0m\n")


if __name__ == "__main__":
    main()
