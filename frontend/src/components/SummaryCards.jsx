function SummaryCards({ servers }) {
  const totalServers = servers.length;

  const onlineServers = servers.filter(
    (server) => server.status === "online"
  ).length;

  const warningServers = servers.filter(
    (server) => server.status === "warning"
  ).length;

  const offlineServers = servers.filter(
    (server) => server.status === "offline"
  ).length;

  const cards = [
    {
      label: "Total Servers",
      value: totalServers,
    },
    {
      label: "Online",
      value: onlineServers,
    },
    {
      label: "Warnings",
      value: warningServers,
    },
    {
      label: "Offline",
      value: offlineServers,
    },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article className="summary-card" key={card.label}>
          <p>{card.label}</p>
          <h2>{card.value}</h2>
        </article>
      ))}
    </section>
  );
}

export default SummaryCards;
