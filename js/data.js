// Base de wheys do Compara Whey.
// Valores de referência coletados em lojas e bancos nutricionais públicos (out/2026).
// Variam por sabor, lote e versão do rótulo: confira sempre a embalagem.
//
// Campos:
//   porcao, proteina      -> gramas por porção, como no rótulo
//   leucina               -> mg por porção (null = não informada)
//   leucinaFonte          -> "rotulo" | "estimada" (~10,5% da proteína) | null
//   embalagem             -> gramas no pote/refil do preço de referência
//   oferta                -> preço de referência { valor, loja, url, data }
//                            url: link direto do produto. Para usar link de afiliado,
//                            preencha "afiliado" com o seu link; ele passa a valer no lugar de url.
//   historico             -> [{ data: "AAAA-MM-DD", valor }] — acrescente um ponto a cada coleta.
window.WHEYS = [
  {
    id: "integralmedica-100-pure",
    marca: "Integralmédica", nome: "Whey 100% Pure", tipo: "Concentrado",
    porcao: 30, proteina: 21, leucina: 2030, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: 118.70, loja: "Central Suplementos", data: "2026-10-14",
      url: "https://www.centralsuplemento.com.br/suplementos/whey-protein/whey-100-pure-integral-medica-900g", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 118.70 }]
  },
  {
    id: "max-100-whey",
    marca: "Max Titanium", nome: "100% Whey", tipo: "Concentrado",
    porcao: 30, proteina: 21, leucina: 2119, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: 139.00, loja: "Hiper Pump", data: "2026-10-14",
      url: "https://www.hiperpumpsuplementos.com.br/100-whey-900g-max-titanium", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 139.00 }]
  },
  {
    id: "growth-concentrado",
    marca: "Growth Supplements", nome: "Whey Protein Concentrado 80%", tipo: "Concentrado",
    porcao: 30, proteina: 23, leucina: 2500, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: 199.90, loja: "Droga Raia", data: "2026-10-14",
      url: "https://www.drogaraia.com.br/whey-protein-growth-100-concentrado-chocolate-900g-1495321.html", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 199.90 }]
  },
  {
    id: "growth-isolado",
    marca: "Growth Supplements", nome: "Whey Protein Isolado 90%", tipo: "Isolado",
    porcao: 30, proteina: 26, leucina: 3200, leucinaFonte: "rotulo",
    embalagem: 1000,
    oferta: { valor: null, loja: "Captain Supplements", data: null,
      url: "https://www.captainsupplements.com.br/iso-protein-90-proteina-isolada-1000g-growth-supplements", afiliado: "" },
    historico: []
  },
  {
    id: "on-gold-standard",
    marca: "Optimum Nutrition", nome: "100% Whey Gold Standard", tipo: "Blend",
    porcao: 30.4, proteina: 24, leucina: 2520, leucinaFonte: "estimada",
    embalagem: 907,
    oferta: { valor: 314.45, loja: "Amazon", data: "2026-10-14",
      url: "https://www.amazon.com.br/Gold-Standard-100-Whey-Chocolate/dp/B002DYIZH6", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 314.45 }]
  },
  {
    id: "essential-hi-whey",
    marca: "Essential Nutrition", nome: "H.I. Whey", tipo: "Hidrolisado",
    porcao: 25, proteina: 22, leucina: 2310, leucinaFonte: "estimada",
    embalagem: 375,
    oferta: { valor: 282.15, loja: "Amazon", data: "2026-10-14",
      url: "https://www.amazon.com.br/H-I-Whey-Protein-Essential-375G/dp/B07KX4PZ8G", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 282.15 }]
  },
  {
    id: "black-skull-whey-zero",
    marca: "Black Skull", nome: "Whey Zero", tipo: "Isolado",
    porcao: 23, proteina: 20, leucina: 2100, leucinaFonte: "estimada",
    embalagem: 907,
    oferta: { valor: 169.90, loja: "Loja do Suplemento", data: "2026-10-14",
      url: "https://m.lojadosuplemento.com.br/whey-zero-black-skull-5407-p6165504", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 169.90 }]
  },
  {
    id: "probiotica-pure-whey",
    marca: "Probiótica", nome: "100% Pure Whey", tipo: "Concentrado",
    porcao: 33, proteina: 23, leucina: 2415, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: 164.26, loja: "Nature Center", data: "2026-10-14",
      url: "https://www.naturecenter.com.br/p/100-pure-whey-900g-probiotica", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 164.26 }]
  },
  {
    id: "dux-concentrado",
    marca: "Dux Nutrition", nome: "Whey Protein Concentrado", tipo: "Concentrado",
    porcao: 30, proteina: 20, leucina: 2500, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: 192.68, loja: "Amazon", data: "2026-10-14",
      url: "https://www.amazon.com.br/Whey-Protein-Concentrado-Cookies-900g/dp/B07NGL3FDY", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 192.68 }]
  },
  {
    id: "max-top-whey-3w",
    marca: "Max Titanium", nome: "Top Whey 3W Mais Performance", tipo: "Blend",
    // 31 g: valor do fabricante; confere com 163 kcal (31x4 + 4,5x4 + 2,2x9 ≈ 162)
    porcao: 40, proteina: 31, leucina: 3255, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: 265.34, loja: "Max Titanium (oficial)", data: "2026-10-14",
      url: "https://www.maxtitanium.com.br/top-whey-3w-mais-performance-900g/p", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 265.34 }]
  },
  {
    id: "atlhetica-best-whey",
    marca: "Atlhetica Nutrition", nome: "Best Whey", tipo: "Blend",
    porcao: 35, proteina: 25, leucina: 2508, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: 231.80, loja: "Matéria Prima", data: "2026-10-14",
      url: "https://www.materiaprimasuplementos.com.br/13109-best-whey-atlhetica-p5710", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 231.80 }]
  },
  {
    id: "vitafor-isofort",
    marca: "Vitafor", nome: "Isofort", tipo: "Isolado",
    porcao: 30, proteina: 27, leucina: 2835, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: 249.99, loja: "GSN Suplementos", data: "2026-10-14",
      url: "https://www.gsnsuplementos.com.br/produto/isofort-900g-vitafor/", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 249.99 }]
  },
  {
    id: "darkness-dark-whey",
    marca: "Darkness", nome: "Dark Whey 100%", tipo: "Concentrado",
    porcao: 40, proteina: 30, leucina: 3072, leucinaFonte: "rotulo",
    embalagem: 2300,
    oferta: { valor: 379.90, loja: "Matéria Prima", data: "2026-10-14",
      url: "https://www.materiaprimasuplementos.com.br/13601-dark-whey-100-23kg-integralmedica-darkness-p6283", afiliado: "" },
    historico: [{ data: "2026-10-14", valor: 379.90 }]
  },
  {
    id: "adaptogen-tasty-iso",
    marca: "Adaptogen", nome: "Tasty Iso Whey", tipo: "Isolado",
    porcao: 31, proteina: 25, leucina: 2600, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "new-millen-iso",
    marca: "New Millen", nome: "ISO Whey", tipo: "Isolado",
    porcao: 30, proteina: 25, leucina: 2599, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "under-labz-crush",
    marca: "Under Labz", nome: "100% Whey Crush", tipo: "Concentrado",
    porcao: 30, proteina: 19, leucina: 1995, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: 169.90, loja: "Amazon", data: "2026-10-07",
      url: "https://www.amazon.com.br/whey-protein-under-labz/s?k=whey+protein+under+labz", afiliado: "" },
    historico: [{ data: "2026-10-07", valor: 169.90 }]
  },
  {
    id: "under-labz-iso-hydro",
    marca: "Under Labz", nome: "Iso Hydro Whey Crush", tipo: "Isolado",
    porcao: 32, proteina: 25, leucina: 2625, leucinaFonte: "estimada",
    embalagem: 907,
    oferta: { valor: 369.90, loja: "Amazon", data: "2026-10-07",
      url: "https://www.amazon.com.br/whey-protein-isolado-under-labz/s?k=whey+protein+isolado+under+labz", afiliado: "" },
    historico: [{ data: "2026-10-07", valor: 369.90 }]
  },
  {
    id: "integralmedica-nutri-whey",
    marca: "Integralmédica", nome: "Nutri Whey Protein", tipo: "Blend",
    porcao: 120, proteina: 30, leucina: null, leucinaFonte: null,
    embalagem: 907,
    oferta: { valor: null, loja: "Centauro", data: null,
      url: "https://www.centauro.com.br/nutri-whey-protein-907g-m0vz7y-mktp.html", afiliado: "" },
    historico: []
  },

  // ===== Outras linhas das mesmas marcas (adicionadas em out/2026) =====
  {
    id: "growth-3w",
    marca: "Growth Supplements", nome: "3W Whey Protein", tipo: "Blend",
    porcao: 30, proteina: 24, leucina: 2520, leucinaFonte: "estimada",
    embalagem: 1000,
    oferta: { valor: 236.90, loja: "Growth (oficial)", data: "2026-10-19",
      url: "https://www.gsuplementos.com.br/3-whey-protein-1kg-growth-supplements-p985944", afiliado: "" },
    historico: [{ data: "2026-10-19", valor: 236.90, loja: "Growth (oficial)" }]
  },
  {
    id: "growth-hidrolisado",
    marca: "Growth Supplements", nome: "Whey Protein Hidrolisado", tipo: "Hidrolisado",
    porcao: 30, proteina: 27, leucina: 2730, leucinaFonte: "rotulo",
    embalagem: 1000,
    oferta: { valor: 449.90, loja: "Growth (oficial)", data: "2026-10-19",
      url: "https://www.gsuplementos.com.br/whey-protein-hidrolisado-1kg-sabor-natural-growth-supplements-p985872", afiliado: "" },
    historico: [{ data: "2026-10-19", valor: 449.90, loja: "Growth (oficial)" }]
  },
  {
    id: "growth-zero-lactose",
    marca: "Growth Supplements", nome: "Whey Protein Zero Lactose", tipo: "Concentrado",
    porcao: 30, proteina: 23, leucina: 2415, leucinaFonte: "estimada",
    embalagem: 1000,
    oferta: { valor: 259.90, loja: "Growth (oficial)", data: "2026-10-19",
      url: "https://www.gsuplementos.com.br/whey-protein-zero-lactose", afiliado: "" },
    historico: [{ data: "2026-10-19", valor: 259.90, loja: "Growth (oficial)" }]
  },
  {
    id: "growth-medium",
    marca: "Growth Supplements", nome: "Medium Whey", tipo: "Concentrado",
    porcao: 30, proteina: 17, leucina: 1785, leucinaFonte: "estimada",
    embalagem: 1000,
    oferta: { valor: 99.90, loja: "Growth (oficial)", data: "2026-10-19",
      url: "https://www.gsuplementos.com.br/medium-whey-protein-1kg-growth-supplements-p986001", afiliado: "" },
    historico: [{ data: "2026-10-19", valor: 99.90, loja: "Growth (oficial)" }]
  },
  {
    id: "integralmedica-iso-triple-zero",
    marca: "Integralmédica", nome: "Whey Isolado Iso Triple Zero", tipo: "Isolado",
    porcao: 30, proteina: 26, leucina: 2730, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null,
      url: "https://www.integralmedica.com.br/whey-protein-isolado-900g/p", afiliado: "" },
    historico: []
  },
  {
    id: "max-iso-whey",
    marca: "Max Titanium", nome: "Iso Whey", tipo: "Isolado",
    porcao: 30, proteina: 26, leucina: 2730, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "black-skull-whey-hd",
    marca: "Black Skull", nome: "Whey 100% HD", tipo: "Blend",
    porcao: 30, proteina: 21, leucina: 2210, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "dux-isolado",
    marca: "Dux Nutrition", nome: "Whey Protein Isolado", tipo: "Isolado",
    porcao: 28, proteina: 24, leucina: 2520, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null,
      url: "https://www.duxhumanhealth.com/wheyproteinisolado-pote900g/p", afiliado: "" },
    historico: []
  },
  {
    id: "dux-hidrolisado",
    marca: "Dux Nutrition", nome: "Whey Protein Hydro", tipo: "Hidrolisado",
    porcao: 30, proteina: 25, leucina: 2625, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null,
      url: "https://www.duxhumanhealth.com/wheyproteinhydro-pote900g/p", afiliado: "" },
    historico: []
  },
  {
    id: "probiotica-3w",
    marca: "Probiótica", nome: "3 Whey Protein", tipo: "Blend",
    porcao: 33, proteina: 23, leucina: 2415, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "probiotica-iso-pro",
    marca: "Probiótica", nome: "Iso Pro Whey", tipo: "Isolado",
    porcao: 30, proteina: 26, leucina: 2730, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null,
      url: "https://www.probiotica.com.br/iso-pro-whey-pote-900g-63/p", afiliado: "" },
    historico: []
  },
  {
    id: "atlhetica-best-whey-iso",
    marca: "Atlhetica Nutrition", nome: "Best Whey Iso", tipo: "Isolado",
    porcao: 24, proteina: 20, leucina: 2130, leucinaFonte: "rotulo",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "vitafor-whey-fort-3w",
    marca: "Vitafor", nome: "Whey Fort 3W", tipo: "Blend",
    porcao: 31, proteina: 24, leucina: 2520, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "new-millen-whey-100",
    marca: "New Millen", nome: "Whey 100%", tipo: "Concentrado",
    porcao: 30, proteina: 21, leucina: 2205, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "adaptogen-tasty-whey-3w",
    marca: "Adaptogen", nome: "Tasty Whey 3W", tipo: "Blend",
    porcao: 34, proteina: 24, leucina: 2520, leucinaFonte: "estimada",
    embalagem: 900,
    oferta: { valor: null, loja: null, data: null, url: "", afiliado: "" },
    historico: []
  },
  {
    id: "essential-cacao-whey",
    marca: "Essential Nutrition", nome: "Cacao Whey", tipo: "Isolado",
    porcao: 28, proteina: 22, leucina: 2310, leucinaFonte: "estimada",
    embalagem: 420,
    oferta: { valor: null, loja: null, data: null,
      url: "https://www.essentialnutrition.com.br/cacao-whey-protein-chocolate", afiliado: "" },
    historico: []
  }
];
