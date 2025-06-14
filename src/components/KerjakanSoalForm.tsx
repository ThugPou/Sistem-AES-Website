// component/KerjakanSoalForm.tsx
import React, { useEffect, useRef, useState } from "react";

interface Soal {
  id: number;
  question: string;
}

interface KerjakanSoalFormProps {
  listSoal: Soal[];
  onSelesai: () => void;
  durasi: number; // dalam menit
}

const KerjakanSoalForm: React.FC<KerjakanSoalFormProps> = ({
  listSoal,
  onSelesai,
  durasi,
}) => {
  const [jawabanMap, setJawabanMap] = useState<{ [id: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(durasi * 60);
  const timerRef = useRef<number | null>(null);
  const hasSubmittedRef = useRef(false); // mencegah submit ganda
  const jawabanRef = useRef<{ [id: number]: string }>({}); // untuk auto-submit

  const handleChange = (soalId: number, value: string) => {
    setJawabanMap((prev) => {
      const updated = { ...prev, [soalId]: value };
      jawabanRef.current = updated; // update juga ref
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting || hasSubmittedRef.current) return;

    setIsSubmitting(true);
    hasSubmittedRef.current = true;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const promises = listSoal.map((soal) => {
        const jawaban = jawabanRef.current[soal.id]?.trim() || "";
        return fetch("http://localhost:8000/jawaban-siswa/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            soal_id: soal.id,
            jawaban: jawaban,
          }),
        }).then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Gagal submit soal ${soal.id}: ${errorText}`);
          }
        });
      });

      await Promise.all(promises);

      alert("Jawaban berhasil disubmit!");
      onSelesai();
    } catch (error) {
      console.error("Gagal submit:", error);
      alert(`Terjadi error saat submit: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync state ke ref setiap kali jawabanMap berubah (backup untuk auto-submit)
  useEffect(() => {
    jawabanRef.current = jawabanMap;
  }, [jawabanMap]);

  // Timer countdown
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!hasSubmittedRef.current) {
            alert("Waktu pengerjaan habis! Jawaban akan disubmit otomatis.");
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="text-black">
      <div className="mb-4 text-right text-red-600 font-semibold text-lg">
        Sisa Waktu: {formatTime(timeLeft)}
      </div>
      <h2 className="text-xl font-semibold mb-4">Kerjakan Soal</h2>
      {listSoal.map((soal) => (
        <div key={soal.id} className="mb-4">
          <p className="font-medium">{soal.question}</p>
          <textarea
            value={jawabanMap[soal.id] || ""}
            onChange={(e) => handleChange(soal.id, e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isSubmitting || timeLeft <= 0}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || timeLeft <= 0}
        className={`bg-green-500 text-white px-4 py-2 rounded mt-4 ${
          isSubmitting || timeLeft <= 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isSubmitting ? "Menyimpan..." : "Submit Jawaban"}
      </button>
    </div>
  );
};

export default KerjakanSoalForm;
