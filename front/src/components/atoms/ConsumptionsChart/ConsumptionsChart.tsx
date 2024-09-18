import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./ConsumptionsChart.scss";

const COLORS = [
  "#F9BC60",
  "#004643",
  "#E16162",
  "#DD614A",
  "#3a86ff",
  "#73a580",
  "#f28482",
];

interface ConsumptionsChartProps {
  className?: string;
  data: Array<{ date: string; product: string; quantity: number }>;
  period: "daily" | "weekly" | "monthly";
}

const groupDataByPeriod = (
  data: Array<{ date: string; product: string; quantity: number }>,
  period: "daily" | "weekly" | "monthly"
) => {
  const groupedData: { [key: string]: { [key: string]: number } } = {};

  data.forEach(({ date, product, quantity }) => {
    const dateObj = new Date(date);
    let key: string;

    switch (period) {
      case "daily":
        key = new Date(date).toLocaleDateString("fr-FR").slice(0, 5);
        break;
      case "weekly":
        const startOfWeek = new Date(
          dateObj.setDate(dateObj.getDate() - dateObj.getDay())
        );
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        key = `${startOfWeek
          .toLocaleDateString("fr-FR")
          .slice(0, 5)}-${endOfWeek.toLocaleDateString("fr-FR").slice(0, 5)}`;
        break;
      case "monthly":
        key = `${dateObj.getMonth() + 1}`; // Utilisation uniquement du mois
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
    ...values,
  }));
};

const formatDate = (date: string, period: "daily" | "weekly" | "monthly") => {
  const [month, year] = date.split("/").map(Number);
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  if (period === "monthly") {
    return months[month - 1]; // Pas d'année dans le format mensuel
  }

  // Pour daily et weekly
  return date;
};

const getColor = (index: number) => COLORS[index % COLORS.length];

export default function ConsumptionsChart({
  className,
  data,
  period,
}: ConsumptionsChartProps) {
  const transformedData = groupDataByPeriod(data, period);

  const products = Array.from(
    new Set(
      transformedData.flatMap((d) => Object.keys(d).filter((k) => k !== "name"))
    )
  );

  return (
    <div className={`a-consumptions-chart ${className}`}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={transformedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="name"
            stroke="white"
            tickFormatter={(value) => formatDate(value, period)}
          />
          <YAxis stroke="white" />
          <Tooltip />
          {products.length > 1 && (
            <>
              <Legend />
              {products.map((product, index) => (
                <Bar key={product} dataKey={product} fill={getColor(index)} />
              ))}
            </>
          )}
          {products.length === 1 && (
            <Bar dataKey={products[0]} fill={getColor(0)} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
