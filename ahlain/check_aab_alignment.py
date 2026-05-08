#!/usr/bin/env python3
import zipfile
import sys
import os

aab_path = "/Users/mac/Downloads/ahlain/android/app/build/outputs/bundle/release/app-release.aab"
page_size = 16384  # 16 KB

if not os.path.exists(aab_path):
    print(f"❌ Error: .aab file not found at {aab_path}")
    sys.exit(1)

print("Checking 16 KB alignment for native libraries in AAB\n")
print("=" * 80)

total_so_files = 0
aligned = 0
not_aligned = 0
issues = []

try:
    with zipfile.ZipFile(aab_path, 'r') as aab:
        so_files = [info for info in aab.infolist() if info.filename.endswith('.so')]
        
        if not so_files:
            print("ℹ️  No .so files found in the AAB file")
            sys.exit(0)
        
        total_so_files = len(so_files)
        
        for info in so_files:
            # The offset calculation for zip files
            # Local file header is typically 30 bytes + filename length + extra field length
            local_header_size = 30
            filename_length = len(info.filename.encode('utf-8'))
            extra_length = len(info.extra)
            
            # Actual data offset
            offset = info.header_offset + local_header_size + filename_length + extra_length
            remainder = offset % page_size
            is_aligned = remainder == 0
            
            if is_aligned:
                aligned += 1
                status = "✓ ALIGNED"
            else:
                not_aligned += 1
                status = f"✗ NOT ALIGNED"
                issues.append(f"{info.filename} (offset: {offset}, remainder: {remainder})")
            
            print(f"{status:30} {info.filename:60} offset: {offset}")

except Exception as e:
    print(f"❌ Error reading AAB file: {e}")
    sys.exit(1)

print("\n" + "=" * 80)
print(f"Total .so files: {total_so_files}")
print(f"Aligned to 16 KB: {aligned}")
print(f"NOT aligned: {not_aligned}")

if not_aligned > 0:
    print("\n⚠️  WARNING: AAB has alignment issues for 16 KB page size!")
    print("\nMisaligned files:")
    for issue in issues:
        print(f"  - {issue}")
    print("\nNote: Android 15+ requires 16 KB page alignment for native libraries.")
    print("Consider using the bundleConfig in build.gradle to enforce alignment.")
    sys.exit(1)
else:
    print("\n✅ SUCCESS: All native libraries are properly aligned for 16 KB page size!")
    print("The AAB is compatible with Android 15+ devices with 16 KB page size support.")
    sys.exit(0)
