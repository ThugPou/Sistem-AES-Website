//HasilPengerjaan.tsx
import React from "react";

interface SoalJawaban {
  id: number;
  question: string;
  jawaban_siswa: string;
  label: number; 
}

interface HasilPengerjaanProps {
  data: SoalJawaban[];
}

const HasilPengerjaan: React.FC<HasilPengerjaanProps> = ({ data }) => {
  const totalSkor = data.reduce((acc, curr) => acc + curr.label, 0);
  const totalSoal = data.length;
  const persentase = Math.round((totalSkor / totalSoal) * 100);

  return (
    <div className="text-black mt-6">
      <h2 className="text-xl font-semibold mb-4">Hasil Pengerjaan</h2>
      {data.map((item, index) => (
        <div key={item.id} className="mb-4 border p-4 rounded shadow">
          <p className="font-medium">{index + 1}. {item.question}</p>
          <p className="mt-2"><span className="font-semibold">Jawaban Anda:</span> {item.jawaban_siswa}</p>
          <p className="mt-1">
            <span className="font-semibold">Skor:</span>{" "}
            {item.label}/1
          </p>
        </div>
      ))}
      <div className="mt-6 p-4 bg-green-100 border rounded shadow text-center">
        <h3 className="text-lg font-bold">Skor Akhir: {totalSkor}/{totalSoal} ({persentase}%)</h3>
      </div>
    </div>
  );
};

export default HasilPengerjaan;