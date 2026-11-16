"""Read-only storage inventory. Python 3.10+, no dependencies."""
import argparse, hashlib, json, os, shutil, time
from pathlib import Path

def scan(root):
    root = Path(root).resolve()
    if not root.is_dir():
        raise ValueError('Choose an existing directory')
    files, errors = [], 0
    for base, dirs, names in os.walk(root, followlinks=False):
        dirs[:] = [d for d in dirs if not Path(base, d).is_symlink() and d not in {'.git', 'node_modules', '.venv'}]
        for name in names:
            p = Path(base, name)
            try:
                if p.is_symlink() or not p.is_file(): continue
                s = p.stat()
                files.append({'name': str(p.relative_to(root)), 'size': s.st_size, 'ageDays': round(max(0, (time.time()-s.st_mtime)/86400)), 'category': category(p.suffix)})
            except OSError: errors += 1
    by_size = {}
    for f in files:
        if f['size']: by_size.setdefault(f['size'], []).append(f)
    group = 0
    for candidates in by_size.values():
        if len(candidates) < 2: continue
        hashes = {}
        for f in candidates:
            try:
                h = hashlib.sha256()
                with open(root / f['name'], 'rb') as stream:
                    for chunk in iter(lambda: stream.read(1024*1024), b''): h.update(chunk)
                hashes.setdefault(h.hexdigest(), []).append(f)
            except OSError: errors += 1
        for same in hashes.values():
            if len(same) > 1:
                group += 1
                for i, f in enumerate(same):
                    f['duplicateGroup'] = group
                    f['duplicate'] = i > 0
    disk = shutil.disk_usage(root)
    return {'source':'Folder scan', 'scannedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()), 'capacity':disk.total, 'used':disk.used, 'scopeBytes':sum(f['size'] for f in files), 'errors':errors, 'files':files}

def category(ext):
    ext = ext.lower()
    if ext in {'.mp4','.mov','.mkv','.mp3','.wav'}: return 'Media'
    if ext in {'.png','.jpg','.jpeg','.webp','.gif','.svg'}: return 'Images'
    if ext in {'.zip','.tar','.gz','.7z'}: return 'Archives'
    if ext in {'.pdf','.docx','.txt','.pptx','.xlsx','.md'}: return 'Documents'
    return 'Other'

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('folder')
    parser.add_argument('-o','--output', default='inventory.json')
    args = parser.parse_args()
    result = scan(args.folder)
    Path(args.output).write_text(json.dumps(result, indent=2))
    print(f"Scanned {len(result['files'])} files; {result['errors']} unreadable entries. Saved {args.output}")
