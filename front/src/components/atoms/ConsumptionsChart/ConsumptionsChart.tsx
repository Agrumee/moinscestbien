import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./ConsumptionsChart.scss";

// Génération de données aléatoires
const generateRandomData = () => {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];
  return months.map(month => ({
    name: month,
    viande: Math.floor(Math.random() * 21),
    café: Math.floor(Math.random() * 21),
    cigarettes: Math.floor(Math.random() * 21),
  }));
};

const data = generateRandomData();

interface ConsumptionsChartProps {
  className?: string;
}

export default function ConsumptionsChart({ className }: ConsumptionsChartProps) {
  return (
    <div className={`a-consumptions-chart ${className}`}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="viande" fill="#F9BC60" />
          <Bar dataKey="café" fill="#004643" />
          <Bar dataKey="cigarettes" fill="#E16162" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
