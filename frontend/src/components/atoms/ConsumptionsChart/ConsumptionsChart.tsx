import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./ConsumptionsChart.scss";
import { Consumption } from "../../../types/consumption.model";
import { Frequency } from "../../../types/tracked-product.model";


interface ConsumptionsChartProps {
  consumptions: Consumption[];
  frequency: Frequency;
  className: string;
}


// Infobulle
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{ background: "white", padding: "10px", border: "1px solid #ddd" }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{payload[0].payload.name}</p>
        {payload.map((entry: any, index: number) => {

          let symbol = entry.name.trim().split('(')?.[1].split(')')?.[0];
          return (
            <div key={`item-${index}`} style={{ marginTop: 5 }}>
              <span style={{ color: entry.color }}>
                {entry.name.trim().split('(')[0]}: {entry.value + ' ' + symbol}
              </span>
            </div>
          )
        })}
      </div>
    );
  }

  return null;
};

// Composant principal du graphique
const ConsumptionsChart = ({
  consumptions,
  frequency,
  className,
}: ConsumptionsChartProps) => {

  // Formater une date en fonction de la fréquence (quotidienne, hebdomadaire, mensuelle)
  const formatDate = (date: Date, frequency: Frequency): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
    };

    if (frequency === "monthly") options.month = "long";

    return date.toLocaleDateString("fr-FR", options);
  };

  const formatXAxisLabels = (date: Date, frequency: Frequency): string => {
    let label = "";

    switch (frequency) {
      case "daily":
        // Formater la date pour un affichage quotidien, ex : "24/11"
        label = formatDate(date, frequency);
        break;

      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // Construire le label au format : "24/11-30/11"
        label = `${formatDate(weekStart, "daily")}-${formatDate(weekEnd, "daily")}`;
        break;

      case "monthly":
        // Formater le mois en texte, ex : "Novembre"
        label = date.toLocaleDateString("fr-FR", { month: "long" });
        break;

      default:
        label = "";
        break;
    }

    return label;
  };



  const groupConsumptions = (consumptions: Consumption[], frequency: Frequency) => {
    // Recharts prend en paramètre un indexed type. L'index correspond à l'axe des abscisses
    const grouped: { [key: string]: { name: string;[key: string]: number | string } } = {};

    consumptions.forEach((consumption) => {
      const date = new Date(consumption.date);
      let label = formatXAxisLabels(date, frequency);

      // On crée un groupe de data lorsque la période n'a pas encore été créée.
      if (!grouped[label]) grouped[label] = { name: label };

      // Identifier chaque produit avec son label et son unité, ex : "Shopping (€)"
      const productKey = `${consumption.tracked_product.product.label} (${consumption.tracked_product.unit.code})`;

      // Initialiser la valeur à 0 si ce produit n'est pas encore dans la période
      if (!grouped[label][productKey]) grouped[label][productKey] = 0;

      // Ajouter la quantité à la clé correspondante
      grouped[label][productKey] = (grouped[label][productKey] as number) + consumption.quantity;
    });

    // Retourner les valeurs sous forme de tableau
    return Object.values(grouped);
  };

  // Regrouper les consommations par période pour les données du graphique
  const groupedData = groupConsumptions(consumptions, frequency);

  // Extraire les clés des produits pour créer des lignes distinctes
  const trackedProductKey =
    `${consumptions[0].tracked_product?.product.label} (${consumptions[0].tracked_product?.unit.code})`;

  // Si aucune donnée n'est disponible, afficher un message
  if (!groupedData.length) {
    return <p>Aucune consommation disponible pour la fréquence sélectionnée.</p>;
  }

  // Rendu du graphique
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={groupedData} dataKey={'label'}>
          {/* Axe des X : périodes */}
          <XAxis dataKey="name" />
          {/* Axe des Y : quantités */}
          <YAxis />
          {/* Tooltip personnalisé */}
          <Tooltip content={<CustomTooltip />} />
          {/* Légende pour identifier les lignes */}
          <Legend />
          {/* Créer une ligne pour chaque produit suivi */}

          <Line
            key={trackedProductKey}
            type="monotone" // Ligne lisse
            dataKey={trackedProductKey} // Clé correspondant à ce produit
            name={trackedProductKey} // Nom affiché dans la légende et le Tooltip
            stroke={'#f9bc60'} // Couleur de la ligne
            strokeWidth={2} // Épaisseur de la ligne
            dot={{ r: 4 }} // Taille des points sur la ligne
            activeDot={{ r: 6 }} // Taille des points survolés
          />


        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionsChart;
