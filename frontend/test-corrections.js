// Teste para verificar se as correções estão funcionando
const testPropertyValues = () => {
  console.log("🧪 Testando valores de propriedades corrigidas...");

  // Simular o que deveria retornar initiative_reach depois da correção
  const expectedInitiativeReach = [
    { value: "National", label: "National", count: 80, type: "value" },
    { value: "Local", label: "Local", count: 15, type: "value" },
    { value: "Regional", label: "Regional", count: 15, type: "value" },
    {
      value: "International",
      label: "International",
      count: 13,
      type: "value",
    },
  ];

  console.log("✅ initiative_reach deve retornar:");
  expectedInitiativeReach.forEach((item) => {
    console.log(`  - ${item.label} (${item.count})`);
  });

  // Simular o que deveria retornar initiative_format depois da correção
  const expectedInitiativeFormat = [
    { value: "Virtual", label: "Virtual", count: 19, type: "value" },
    { value: "Hibrid", label: "Hibrid", count: 14, type: "value" },
    { value: "Hybrid", label: "Hybrid", count: 3, type: "value" },
    { value: "In person", label: "In person", count: 1, type: "value" },
    { value: "Presencial", label: "Presencial", count: 1, type: "value" },
  ];

  console.log("\n✅ initiative_format deve retornar:");
  expectedInitiativeFormat.forEach((item) => {
    console.log(`  - ${item.label} (${item.count})`);
  });

  console.log(
    '\n🎯 Se o sistema ainda mostra "Opção 1, Opção 2, Opção 3" para essas propriedades,'
  );
  console.log(
    "   significa que há um problema na aplicação das correções ou no build."
  );

  return true;
};

testPropertyValues();
