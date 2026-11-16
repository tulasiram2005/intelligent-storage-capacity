import tempfile, unittest
from pathlib import Path
from scanner import scan
class ScannerTests(unittest.TestCase):
    def test_duplicates_and_symlinks(self):
        with tempfile.TemporaryDirectory() as folder:
            p=Path(folder)
            (p/'one.txt').write_text('same content')
            (p/'two.txt').write_text('same content')
            (p/'other.txt').write_text('diff content')
            (p/'link.txt').symlink_to(p/'one.txt')
            result=scan(p)
            self.assertEqual(len(result['files']),3)
            self.assertEqual(sum(bool(f.get('duplicate')) for f in result['files']),1)
            self.assertEqual(result['scopeBytes'],36)
    def test_missing_folder(self):
        with self.assertRaises(ValueError): scan('/nonexistent-strata-test-directory')
if __name__=='__main__': unittest.main()
