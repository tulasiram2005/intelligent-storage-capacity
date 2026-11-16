"""Collect actual volume usage into a local SQLite database and export telemetry CSV."""
import argparse, csv, shutil, sqlite3, time
from pathlib import Path

SCHEMA = 'CREATE TABLE IF NOT EXISTS readings (server TEXT, timestamp REAL, used_gb REAL, capacity_gb REAL, PRIMARY KEY(server,timestamp))'

def collect(connection, path, server, timestamp=None):
    disk = shutil.disk_usage(Path(path).resolve())
    timestamp = time.time() if timestamp is None else timestamp
    row=(server,timestamp,disk.used/1e9,disk.total/1e9)
    connection.execute('INSERT INTO readings VALUES (?,?,?,?)',row)
    connection.commit()
    return row

def export(connection, output):
    rows=connection.execute('SELECT server,timestamp,used_gb,capacity_gb FROM readings ORDER BY server,timestamp').fetchall()
    origins={}
    with open(output,'w',newline='') as f:
        writer=csv.writer(f);writer.writerow(['server','day','used_gb','capacity_gb'])
        for server,timestamp,used,capacity in rows:
            origins.setdefault(server,timestamp)
            writer.writerow([server,round((timestamp-origins[server])/86400,8),round(used,8),round(capacity,8)])
    return len(rows)

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--path',default='.')
    p.add_argument('--server',default='Local-Mac')
    p.add_argument('--database',default='storage-history.sqlite3')
    p.add_argument('--interval',type=float,default=60)
    p.add_argument('--once',action='store_true')
    p.add_argument('--export',metavar='CSV_PATH')
    a=p.parse_args()
    if any(c in a.server for c in ',\r\n') or len(a.server)>64: p.error('Use a server name up to 64 characters without commas or newlines.')
    if a.interval<1:p.error('Interval must be at least 1 second.')
    with sqlite3.connect(a.database) as connection:
        connection.execute(SCHEMA)
        if a.export:
            print(f'Exported {export(connection,a.export)} measured observations to {a.export}');return
        print('Collecting real volume readings. Press Ctrl+C to stop. No file contents are read.')
        try:
            while True:
                row=collect(connection,a.path,a.server)
                print(f'{time.strftime("%H:%M:%S")} | {row[0]} | {row[2]:.3f} / {row[3]:.3f} GB',flush=True)
                if a.once:break
                time.sleep(a.interval)
        except KeyboardInterrupt:
            print('\nStopped. Export with: python3 collector.py --export telemetry.csv')
if __name__=='__main__':main()
