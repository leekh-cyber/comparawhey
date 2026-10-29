// Tabela nutricional e informações de dieta por whey (por porção do rótulo).
// Pesquisa feita em out/2026 em sites oficiais das marcas e lojas que reproduzem o rótulo.
// Os valores variam por sabor e lote: são valores típicos de um sabor de referência.
//
//   kcal, carb, acucar, gord (g), sodio (mg)  -> null = não encontrado em fonte confiável
//   lactose: "contem" (declarado no rótulo) | "baixa" (isolado/hidrolisado, sem declaração oficial de zero)
//            | "zero" (o fabricante declara zero lactose)
//   semGluten: true (rótulo diz "não contém glúten") | false (contém) | "parcial" (só alguns sabores) | null
//   adocante: texto | "sem adoçante" | null (não confirmado)
//   fonte: página usada como referência principal
window.NUTRI = {
  "integralmedica-100-pure": {
    kcal: 122, carb: 5.1, acucar: 3.8, gord: 1.9, sodio: 65,
    lactose: "contem", semGluten: true, adocante: "sucralose",
    sabores: ["Baunilha", "Chocolate", "Cookies", "Morango", "Coco"],
    fonte: "https://www.integralmedica.com.br/whey-protein-concentrado-900g/p"
  },
  "max-100-whey": {
    kcal: 120, carb: 4.7, acucar: 1.0, gord: 2.3, sodio: 75,
    lactose: "contem", semGluten: "parcial", adocante: "sucralose",
    sabores: ["Chocolate", "Baunilha", "Morango", "Cookies and Cream"],
    notaGluten: "O sabor Cookies and Cream contém glúten.",
    fonte: "https://www.tabelatacoonline.com.br/tabela-nutricional/marcas/max-titanium-100-whey-pote-900g-sabor-chocolate"
  },
  "growth-concentrado": {
    kcal: 122, carb: 4.0, acucar: null, gord: 2.0, sodio: 53,
    lactose: "contem", semGluten: null, adocante: "sucralose",
    sabores: ["Chocolate", "Baunilha", "Morango", "Doce de leite", "Sorvete de creme", "Natural"],
    fonte: "https://www.dicasdetreino.com.br/whey-protein-concentrado-growth-supplements/"
  },
  "growth-isolado": {
    kcal: 112, carb: null, acucar: null, gord: null, sodio: null,
    lactose: "contem", semGluten: null, adocante: null,
    sabores: ["Chocolate", "Morango", "Natural"],
    fonte: "https://www.captainsupplements.com.br/iso-protein-90-proteina-isolada-1000g-growth-supplements"
  },
  "on-gold-standard": {
    kcal: 116, carb: 1.6, acucar: 1.0, gord: 1.4, sodio: 48,
    lactose: "contem", semGluten: null, adocante: "sucralose e acessulfame-K",
    sabores: ["Double Rich Chocolate", "Baunilha", "Morango", "Cookies"],
    notaFonte: "Valores do rótulo europeu; o rótulo brasileiro pode variar.",
    fonte: "https://www.optimumnutrition.com/products/gold-standard-100-whey-protein-powder-eu"
  },
  "essential-hi-whey": {
    kcal: 90, carb: 0, acucar: 0, gord: 0, sodio: 85,
    lactose: "baixa", semGluten: true, adocante: "sem adoçante",
    sabores: ["Sem sabor"],
    fonte: "https://www.essentialnutrition.com.br/h-i-whey-375g-whey-protein-hidrolisado-e-isolado"
  },
  "black-skull-whey-zero": {
    kcal: 86, carb: 1.5, acucar: 0, gord: 0, sodio: 55,
    lactose: "baixa", semGluten: null, adocante: "sucralose",
    sabores: ["Baunilha", "Chocolate", "Cookies and Cream", "Morango"],
    fonte: "https://www.lojadosuplemento.com.br/whey-zero-black-skull-5407-p6165504"
  },
  "probiotica-pure-whey": {
    kcal: 130, carb: 4.1, acucar: 1.8, gord: 2.4, sodio: 107,
    lactose: "contem", semGluten: null, adocante: null,
    sabores: ["Baunilha", "Chocolate", "Morango", "Cookies & Cream"],
    fonte: "https://www.materiaprimasuplementos.com.br/13837-100-pure-whey-900g-probiotica-p6789"
  },
  "dux-concentrado": {
    kcal: 122, carb: 5.5, acucar: 5.3, gord: 2.2, sodio: null,
    lactose: "contem", semGluten: null, adocante: "sucralose e acessulfame-K",
    sabores: ["Chocolate", "Baunilha", "Morango", "Cookies", "Doce de leite", "Cappuccino", "Chocolate branco"],
    fonte: "https://www.duxhumanhealth.com/wheyproteinconcentrado-pote900g/p"
  },
  "max-top-whey-3w": {
    kcal: 163, carb: 4.5, acucar: null, gord: 2.2, sodio: 70,
    lactose: "contem", semGluten: null, adocante: null,
    sabores: ["Chocolate", "Morango", "Baunilha", "Vitamina de frutas", "Fresh lemon"],
    fonte: "https://www.otimanutri.com.br/top-whey-3w-mais-performance-900g-chocolate-max-titanium-2913"
  },
  "atlhetica-best-whey": {
    kcal: 134, carb: 5.0, acucar: null, gord: 1.6, sodio: 78,
    lactose: "contem", semGluten: null, adocante: "sucralose, acessulfame-K e estévia",
    sabores: ["Original", "Brigadeiro", "Doce de leite", "Original com café", "Achocolatado"],
    fonte: "https://www.otimanutri.com.br/best-whey-900g-original-atlhetica-nutrition-9775"
  },
  "vitafor-isofort": {
    kcal: 112, carb: 1.0, acucar: null, gord: 0, sodio: 42,
    lactose: "baixa", semGluten: null, adocante: "sem adoçante",
    notaAdocante: "Valores da versão Neutra. Os sabores usam estévia e taumatina.",
    sabores: ["Neutro", "Baunilha", "Chocolate", "Frutas vermelhas"],
    fonte: "https://www.nutrii.com.br/isofort-neutro-900g"
  },
  "darkness-dark-whey": {
    kcal: 160, carb: 4.2, acucar: 2.5, gord: 2.6, sodio: 82,
    lactose: "contem", semGluten: true, adocante: "sucralose",
    sabores: ["Chocolate", "Morango", "Baunilha", "Chocolate maltado"],
    fonte: "https://www.otimanutri.com.br/dark-whey-darkness-900g-morango-integralmedica-31180"
  },
  "adaptogen-tasty-iso": {
    kcal: 124, carb: 2.0, acucar: 0, gord: 1.8, sodio: 45,
    lactose: "zero", semGluten: true, adocante: "sucralose e acessulfame-K",
    sabores: ["Original", "Chocolate trufado"],
    fonte: "https://adaptogen.com.br/tasty-iso-912g-chocolate-trufado/"
  },
  "new-millen-iso": {
    kcal: 108, carb: 2.0, acucar: null, gord: 0, sodio: 54,
    lactose: "baixa", semGluten: true, adocante: "sucralose",
    sabores: ["Chocolate", "Baunilha"],
    fonte: "https://www.otimanutri.com.br/iso-whey-900g-chocolate-new-millen-4785"
  },
  "under-labz-crush": {
    kcal: 121, carb: 8.2, acucar: 6.8, gord: 1.4, sodio: 71,
    lactose: "contem", semGluten: true, adocante: "sucralose",
    sabores: ["Milk Cream", "Chocobear", "Cocobear", "Strawbear"],
    fonte: "https://underlabz.com.br/products/100-whey-crush-concentrada-900g"
  },
  "under-labz-iso-hydro": {
    kcal: 123, carb: 2.7, acucar: null, gord: 1.4, sodio: 60,
    lactose: "baixa", semGluten: true, adocante: "sucralose",
    sabores: ["Milk Cream", "Dulce de Leche", "Chocobear", "Strawbear"],
    fonte: "https://www.suplementosblumenau.com.br/produto/iso-hydro-whey-crush-907g/2467858"
  },
  "integralmedica-nutri-whey": {
    kcal: 461, carb: 80, acucar: null, gord: 2.3, sodio: null,
    lactose: "contem", semGluten: null, adocante: "sucralose",
    notaGluten: "Algumas versões da fórmula contêm proteína de trigo (glúten).",
    sabores: ["Baunilha", "Chocolate", "Morango", "Cookies & Cream"],
    fonte: "https://www.otimanutri.com.br/nutri-whey-protein-907g-chocolate-integralmedica-1749"
  },
  "growth-3w": {
    kcal: 118, carb: 2.5, acucar: 1.1, gord: 1.3, sodio: 46,
    lactose: "contem", semGluten: null, adocante: "sucralose e acessulfame-K",
    sabores: ["Chocolate", "Morango", "Baunilha"],
    fonte: "https://www.gsuplementos.com.br/3-whey-protein-1kg-growth-supplements-p985944"
  },
  "growth-hidrolisado": {
    kcal: 115, carb: 0.6, acucar: 0.5, gord: 0.5, sodio: 68,
    lactose: "contem", semGluten: true, adocante: "sem adoçante",
    sabores: ["Natural"],
    fonte: "https://www.gsuplementos.com.br/whey-protein-hidrolisado-1kg-sabor-natural-growth-supplements-p985872"
  },
  "growth-zero-lactose": {
    kcal: 120, carb: 2.3, acucar: 1.7, gord: 2.1, sodio: 43,
    lactose: "zero", semGluten: true, adocante: "sem adoçante",
    notaAdocante: "Valores da versão Natural. Os sabores levam adoçante.",
    sabores: ["Natural", "Baunilha", "Chocolate", "Leite em pó", "Morango"],
    fonte: "https://www.gsuplementos.com.br/whey-protein-zero-lactose"
  },
  "growth-medium": {
    kcal: 121, carb: 8.7, acucar: 7.9, gord: 2.0, sodio: 76,
    lactose: "contem", semGluten: true, adocante: "sem adoçante",
    notaAdocante: "Valores da versão Natural. O sabor Chocolate leva adoçante.",
    sabores: ["Natural", "Chocolate"],
    fonte: "https://www.gsuplementos.com.br/medium-whey-protein-1kg-growth-supplements-p986001"
  },
  "integralmedica-iso-triple-zero": {
    kcal: 111, carb: 1.7, acucar: 0, gord: 0, sodio: 66,
    lactose: "contem", semGluten: true, adocante: "sucralose",
    sabores: ["Chocolate", "Baunilha", "Morango", "Neutro", "Coco"],
    fonte: "https://www.integralmedica.com.br/whey-protein-isolado-900g/p"
  },
  "max-iso-whey": {
    kcal: 112, carb: 2.0, acucar: null, gord: 0, sodio: 46,
    lactose: "baixa", semGluten: null, adocante: null,
    sabores: ["Baunilha", "Chocolate"],
    fonte: "https://www.otimanutri.com.br/iso-whey-900g-baunilha-max-titanium-2942"
  },
  "black-skull-whey-hd": {
    kcal: 125, carb: 5.9, acucar: null, gord: 1.9, sodio: 89,
    lactose: "contem", semGluten: true, adocante: null,
    sabores: ["Chocolate", "Baunilha", "Morango", "Cookies and Cream"],
    fonte: "https://www.otimanutri.com.br/whey-100-hd-900g-chocolate-black-skull-14914"
  },
  "dux-isolado": {
    kcal: 105, carb: 0.8, acucar: null, gord: 0.6, sodio: 118,
    lactose: "contem", semGluten: false, adocante: null,
    notaGluten: "Segundo o site da Dux, o produto contém glúten.",
    sabores: ["Baunilha", "Chocolate", "Morango", "Coco", "Cappuccino", "Doce de leite", "Chocolate branco", "Neutro"],
    fonte: "https://www.duxhumanhealth.com/wheyproteinisolado-pote900g/p"
  },
  "dux-hidrolisado": {
    kcal: 112, carb: 1.6, acucar: 0.5, gord: 0.6, sodio: 97,
    lactose: "contem", semGluten: false, adocante: null,
    notaGluten: "Segundo o site da Dux, o produto contém glúten.",
    sabores: ["Baunilha", "Chocolate"],
    fonte: "https://www.duxhumanhealth.com/wheyproteinhydro-pote900g/p"
  },
  "probiotica-3w": {
    kcal: 127, carb: 3.8, acucar: null, gord: 2.1, sodio: 110,
    lactose: "contem", semGluten: true, adocante: null,
    sabores: ["Chocolate", "Morango", "Baunilha"],
    fonte: "https://www.otimanutri.com.br/3-whey-protein-nova-formula-900g-chocolate-probiotica-5752"
  },
  "probiotica-iso-pro": {
    kcal: 105, carb: 1.3, acucar: 0.2, gord: 0, sodio: 146,
    lactose: "baixa", semGluten: null, adocante: null,
    sabores: ["Chocolate", "Baunilha", "Sem sabor"],
    fonte: "https://www.otimanutri.com.br/iso-pro-whey-900g-chocolate-probiotica-5893"
  },
  "atlhetica-best-whey-iso": {
    kcal: 87, carb: 1.7, acucar: null, gord: null, sodio: null,
    lactose: "baixa", semGluten: null, adocante: "sucralose e acessulfame-K",
    sabores: ["Baunilha", "Brigadeiro", "Doce de leite", "Morango", "Maracujá", "Napolitano"],
    fonte: "https://www.otimanutri.com.br/best-whey-iso-900g-baunilha-atlhetica-nutrition-9007"
  },
  "vitafor-whey-fort-3w": {
    kcal: 121, carb: 2.5, acucar: null, gord: 1.7, sodio: 51,
    lactose: "contem", semGluten: true, adocante: "sucralose e acessulfame-K",
    sabores: ["Chocolate", "Baunilha", "Neutro", "Banana", "Paçoca", "Cookies & Cream", "Mocaccino"],
    fonte: "https://www.otimanutri.com.br/whey-fort-3w-900g-chocolate-vitafor-20971"
  },
  "new-millen-whey-100": {
    kcal: 122, carb: 6.0, acucar: 6.0, gord: 1.5, sodio: 134,
    lactose: "contem", semGluten: true, adocante: "sucralose",
    sabores: ["Doce de leite", "Milho verde", "Creme de coco", "Maracujá", "Açaí com banana"],
    notaFonte: "Os sabores Baunilha, Morango e Chocolate têm outra porção (40 g com 24 g de proteína).",
    fonte: "https://www.otimanutri.com.br/whey-100-900g-refil-doce-de-leite-new-millen-32804"
  },
  "adaptogen-tasty-whey-3w": {
    kcal: 138, carb: 5.0, acucar: null, gord: 2.5, sodio: 70,
    lactose: "contem", semGluten: true, adocante: "sucralose e acessulfame-K",
    sabores: ["Original", "Dulce de leche", "Rich chocolate", "Cookies & Cream", "Churros", "Beijinho"],
    fonte: "https://www.otimanutri.com.br/tasty-whey-3w-900g-original-adaptogen-32606"
  },
  "essential-cacao-whey": {
    kcal: 104, carb: 1.9, acucar: 0.3, gord: 0.9, sodio: 89,
    lactose: "baixa", semGluten: true, adocante: "estévia e taumatina",
    sabores: ["Cacau"],
    fonte: "https://www.essentialnutrition.com.br/cacao-whey-protein-chocolate"
  }
};
