import Database from "tauri-plugin-sql-api";

import { useState } from "react";

export const DbTests = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const doTests = async () => {
    const logs: Array<string> = [];

    const log = (msg: string) => {
      console.log(msg);

      logs.push(msg);

      setLogs([...logs]);
    };

    log("loading db");

    const t0 = performance.now();
    const db = await Database.load("sqlite:test.db");
    const t1 = performance.now();

    log(`db loaded in ${t1 - t0}ms`);

    log("creating table");

    const t2 = performance.now();
    await db.execute(
      "CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT, content BLOB)"
    );
    const t3 = performance.now();

    log(`table created in ${t3 - t2}ms`);

    log("inserting data");

    const t4 = performance.now();
    await db.execute("INSERT INTO test (name, content) VALUES (?, ?)", [
      "test",
      "test",
    ]);
    const t5 = performance.now();

    log(`data inserted in ${t5 - t4}ms`);

    log("trying to insert a big uint8array");

    log("creating big data");

    const uint8array = new Uint8Array(1000000).fill(1);
    console.log("Created big data");

    const t6 = performance.now();
    await db.execute("INSERT INTO test (name, content) VALUES (?, ?)", [
      "big",
      uint8array,
    ]);
    const t7 = performance.now();

    log(`big data inserted in ${t7 - t6}ms`);
  };

  return (
    <div className="db-tests">
      <button onClick={() => doTests()}>Db Tests</button>

      <pre>{logs.join("\n")}</pre>
    </div>
  );
};
