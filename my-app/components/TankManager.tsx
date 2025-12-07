"use client";

import { useEffect, useState } from "react";
import TankDetails from "../components/TankDetails";

type Tank = {
  id: string;
  name: string;
  level: number;
  capacity: number;
};

export default function TankManager() {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadTanks() {
    const res = await fetch("/api/tanks");
    setTanks(await res.json());
  }

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/tanks");
      setTanks(await res.json());
    })();
  }, []);

  // 追加フォームへ切り替え
  const handleAdd = () => {
    setSelectedTank({ id: "", name: "", level: 0, capacity: 0 });
    setIsNew(true);
  };

  // 行クリック → 編集表示
  const handleRowClick = async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/tanks/${id}`);
    setSelectedTank(await res.json());
    setIsNew(false);
    setLoading(false);
  };

  // 保存（追加・更新共通）
  const handleSave = async () => {
    if (!selectedTank) return;

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? `/api/tanks` : `/api/tanks/${selectedTank.id}`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedTank),
    });

    await loadTanks();       // ← 最新一覧を再読み込み
    setSelectedTank(null);   // ← フォームクリア
    setIsNew(false);
  };

  const handleDelete = async () => {
    if (!selectedTank) return;
    if (!confirm("本当に削除しますか？")) return;

    await fetch(`/api/tanks/${selectedTank.id}`, { method: "DELETE" });
    await loadTanks();
    setSelectedTank(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "90vh", gap: "12px" }}>

      {/* 上：テーブル */}
      <div style={{ flex: 4, overflowY: "auto", border: "1px solid #ccc", padding: "8px" }}>
        <h2>タンク一覧</h2>
        <button onClick={handleAdd} style={{ marginBottom: "8px" }}>
          ➕ タンク追加
        </button>

        <table width="100%" border={1} cellPadding={6} style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#e8e8e8" }}>
              <th>ID</th>
              <th>タンク名</th>
              <th>水位</th>
            </tr>
          </thead>
          <tbody>
            {tanks.map((tank) => (
              <tr
                key={tank.id}
                onClick={() => handleRowClick(tank.id)}
                style={{ cursor: "pointer", background: selectedTank?.id === tank.id ? "#dff0ff" : undefined }}
              >
                <td>{tank.id}</td>
                <td>{tank.name}</td>
                <td>{tank.level} / {tank.capacity} L</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 下：詳細 or フォーム */}
      <div style={{ flex: 6, overflowY: "auto", border: "1px solid #ccc", padding: "12px" }}>
        {!selectedTank ? (
          <p>タンクを選択するか［タンク追加］を押してください。</p>
        ) : (
          <div>
            <h2>{isNew ? "タンク追加" : "タンク詳細"}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "300px" }}>
              <label>ID<input disabled={!isNew} value={selectedTank.id} onChange={(e) => setSelectedTank({ ...selectedTank, id: e.target.value })} /></label>
              <label>名前<input value={selectedTank.name} onChange={(e) => setSelectedTank({ ...selectedTank, name: e.target.value })} /></label>
              <label>水量<input type="number" value={selectedTank.level} onChange={(e) => setSelectedTank({ ...selectedTank, level: Number(e.target.value) })} /></label>
              <label>容量<input type="number" value={selectedTank.capacity} onChange={(e) => setSelectedTank({ ...selectedTank, capacity: Number(e.target.value) })} /></label>
            </div>

            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button onClick={handleSave}>💾 保存</button>
              {!isNew && <button onClick={handleDelete} style={{ color: "red" }}>🗑 削除</button>}
            </div>

            {!isNew && <TankDetails name={selectedTank.name} level={selectedTank.level} capacity={selectedTank.capacity} />}
          </div>
        )}

        {loading && <p>読み込み中...</p>}
      </div>
    </div>
  );
}
