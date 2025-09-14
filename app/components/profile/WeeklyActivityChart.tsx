import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function WeeklyActivityChart({
  data,
  small = false,
}: {
  data: { week: string; count: number }[];
  small?: boolean;
}) {
  return (
    <div
      className={`mx-auto bg-transparent rounded-xl p-4 shadow-md border border-bolt-elements-borderColor mb-6 ${small ? 'w-full max-w-xs md:max-w-sm' : 'w-full max-w-2xl'}`}
    >
      <h2 className="text-lg font-bold text-bolt-elements-textPrimary mb-2 text-center">Weekly Activity</h2>
      <Line
        data={{
          labels: data.map((d) => d.week),
          datasets: [
            {
              label: 'Challenges Solved',
              data: data.map((d) => d.count),
              borderColor: '#60a5fa',
              backgroundColor: 'rgba(96,165,250,0.2)',
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: '#2563eb',
              pointBorderColor: '#fff',
              pointHoverRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            tooltip: {
              backgroundColor: '#1e293b',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#60a5fa',
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(96,165,250,0.1)',
              },
              ticks: {
                color: '#94a3b8',
                font: { weight: 'bold', size: small ? 10 : 12 },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(96,165,250,0.1)',
              },
              ticks: {
                color: '#94a3b8',
                font: { weight: 'bold', size: small ? 10 : 12 },
              },
            },
          },
        }}
      />
    </div>
  );
}
