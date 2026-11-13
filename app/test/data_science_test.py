"""Execute the lesson's actual SQL against its downloadable data (stdlib only)."""
import json
import sqlite3
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

class DataScienceExamples(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = sqlite3.connect(':memory:')
        cls.db.executescript((ROOT / 'app/assets/data/data-science-lab.sql').read_text())
        cls.lessons = json.loads(subprocess.check_output([
            'node', '--input-type=module', '-e',
            "import {loadApp} from './app/test/load.mjs'; const C=loadApp().CONTENT; "
            "console.log(JSON.stringify(['DS1','DS2'].map(id=>C.competency(id).lesson)));"
        ], cwd=ROOT))

    def test_worked_query_excludes_both_adjacent_months(self):
        sql = self.lessons[0]['demonstrate']['full'].split(';')[0]
        self.assertEqual(self.db.execute(sql).fetchall(), [('Stationery',75), ('Home',30)])

    def test_guided_query_preserves_customers_with_same_name(self):
        sql = self.lessons[0]['guided']['model']['query']
        self.assertEqual(self.db.execute(sql).fetchall(), [(1,'Sam Lee',50), (2,'Sam Lee',40)])

    def test_cleaned_statistics_preserve_missing_and_equal_amounts(self):
        import statistics
        rows = self.db.execute('SELECT DISTINCT order_id, amount FROM observations').fetchall()
        self.assertEqual(len(rows), 5)
        known = [amount for _,amount in rows if amount is not None]
        self.assertEqual((len(known), sum(known), statistics.mean(known), statistics.median(known)),(4,100,25,20))
        self.assertIn('Mean $25; median $20', self.lessons[1]['demonstrate']['full'])
        guided = [r[0] for r in self.db.execute('SELECT amount FROM guided_observations WHERE amount IS NOT NULL')]
        self.assertEqual((sum(guided), statistics.mean(guided), statistics.median(guided)),(90,30,18))
        self.assertIn('mean $30, median $18', self.lessons[1]['guided']['model']['cleaning'])

if __name__ == '__main__':
    unittest.main()
