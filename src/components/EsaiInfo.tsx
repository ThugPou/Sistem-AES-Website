// components/EsaiInfo.tsx
interface Esai {
  id: number;
  title: string;
  description: string;
  durasi_menit: number;
  start_time: string | null;
  end_time: string | null;
}

const EsaiInfo = ({ esai }: { esai: Esai }) => {
  return (
    <div className="bg-white shadow p-4 rounded-md text-black">
      <h1 className="text-2xl font-bold mb-2">{esai.title}</h1>
      <p className="text-gray-700 mb-2">{esai.description}</p>

      <p className="text-sm">
        <strong>Durasi pengerjaan:</strong> {esai.durasi_menit} menit
      </p>

      <p className="text-sm">
        <strong>Waktu aktif:</strong>{' '}
        {esai.start_time ? new Date(esai.start_time).toLocaleString('id-ID') : 'Belum ditentukan'}{' '}
        s/d{' '}
        {esai.end_time ? new Date(esai.end_time).toLocaleString('id-ID') : 'Belum ditentukan'}
      </p>
    </div>
  );
};

export default EsaiInfo;