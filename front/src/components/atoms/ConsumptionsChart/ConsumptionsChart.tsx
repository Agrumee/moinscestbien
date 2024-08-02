import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./ConsumptionsChart.scss";

const COLORS = ['#F9BC60', '#004643', '#E16162', '#DD614A', '#3a86ff', '#73a580', '#f28482'];

interface ConsumptionsChartProps {
  className?: string;
  data: Array<{ date: string; product: string; quantity: number }>;
  period: 'daily' | 'weekly' | 'monthly';
}

const groupDataByPeriod = (data: Array<{ date: string; product: string; quantity: number }>, period: 'daily' | 'weekly' | 'monthly') => {
  const groupedData: { [key: string]: { [key: string]: number } } = {};

  data.forEach(({ date, product, quantity }) => {
    const dateObj = new Date(date);
    let key: string;

    switch (period) {
      case 'daily':
        key = new Date(date).toLocaleDateString('fr-FR').slice(0, 5); // Format DD/MM
        break;
      case 'weekly':
        const startOfWeek = new Date(dateObj.setDate(dateObj.getDate() - dateObj.getDay()));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        key = `${startOfWeek.toLocaleDateString('fr-FR')} au ${endOfWeek.toLocaleDateString('fr-FR')}`;
        break;
      case 'monthly':
        key = `${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`; // Format MM/YYYY
        break;
      default:
        key = date;
    }

    if (!groupedData[key]) {
      groupedData[key] = {};
    }

    if (!groupedData[key][product]) {
      groupedData[key][product] = 0;
    }

    groupedData[key][product] += quantity;
  });

  return Object.entries(groupedData).map(([key, values]) => ({
    name: key,
    ...values
  }));
};

const formatDate = (date: string, period: 'daily' | 'weekly' | 'monthly') => {
  const [month, year] = date.split('/').map(Number);
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  if (period === 'monthly') {
    return `${months[month - 1]} ${year}`;
  }

  return date;
};

const getColor = (index: number) => COLORS[index % COLORS.length];

export default function ConsumptionsChart({ className, data, period }: ConsumptionsChartProps) {
  const transformedData = groupDataByPeriod(data, period);

  const products = Array.from(new Set(transformedData.flatMap(d => Object.keys(d).filter(k => k !== 'name'))));

  return (
    <div className={`a-consumptions-chart ${className}`}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={transformedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="name" tickFormatter={(value) => formatDate(value, period)} />
          <YAxis />
          <Tooltip />
          <Legend />
          {products.map((product, index) => (
            <Bar key={product} dataKey={product} fill={getColor(index)} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
