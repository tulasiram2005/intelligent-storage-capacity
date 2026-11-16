import csv, sqlite3, tempfile, unittest
from pathlib import Path
from collector import SCHEMA, collect, export
class CollectorTests(unittest.TestCase):
    def test_real_measurement_and_elapsed_days(self):
        with tempfile.TemporaryDirectory() as tmp, sqlite3.connect(':memory:') as c:
            c.execute(SCHEMA)
            for t in (1000,1060,1120):
                row=collect(c,tmp,'Test',t)
                self.assertGreater(row[3],0)
                self.assertLessEqual(row[2],row[3])
            path=Path(tmp)/'out.csv'
            self.assertEqual(export(c,path),3)
            with path.open() as stream:
                rows=list(csv.DictReader(stream))
            self.assertAlmostEqual(float(rows[2]['day']),120/86400,places=7)
if __name__=='__main__':unittest.main()
