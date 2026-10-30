// Qualidade e transparência por whey. Pesquisa feita em 16/out/2026.
// Regras: só fatos com fonte; nada de "aprovado/reprovado"; sempre registrar a contestação do fabricante.
//
//   senacon:   "produto" (este produto foi citado) | "marca" (outros produtos da marca foram citados) | null
//   anvisa:    texto sobre suspensões encontradas (null = nenhuma encontrada até a data da pesquisa)
//   certificacao: { nome, nota, fonte } | null
//   ingredientes: "ok" (lista verificada, sem aminoácidos livres adicionados)
//                 | "alerta" (fórmula com proteínas de menor valor ou outro ponto de atenção) | null (não verificada)
window.QUALIDADE_DATA = "2026-10-16";

window.QUALIDADE_FONTES = {
  senacon: [
    { titulo: "Lista da Senacon (Sincofarma SP, 09/12/2024)", url: "https://sincofarmasp.com.br/2024/12/09/veja-lista-de-marcas-de-whey-protein-adulterado-com-venda-suspensa/" },
    { titulo: "Agência Brasil, 06/12/2024", url: "https://agenciabrasil.ebc.com.br/saude/noticia/2024-12/partir-de-hoje-sites-nao-podem-vender-48-marcas-de-whey-protein" },
    { titulo: "O Povo, 04/06/2025 (contestação e status)", url: "https://www.opovo.com.br/noticias/saude/2025/06/04/whey-protein-relembre-marcas-reprovadas-na-ultima-analise-do-suplemento.html" }
  ],
  anvisa: [
    { titulo: "Exemplo de suspensão oficial de whey em 2025 (outra marca): RE nº 2.311/2025", url: "https://diariodocomercio.com.br/legislacao/apos-analise-funed-anvisa-suspende-lotes-whey-protein-canela-em-po/" }
  ]
};

window.QUALIDADE = {
  "integralmedica-100-pure": {
    senacon: "produto",
    senaconNota: "O Whey 100% Pure está na lista de produtos que a Senacon mandou suspender em sites em dez/2024, com base em análises da Abenutri feitas com amostras de 2022 (suspeita de \"amino spiking\"). A fabricante (Grupo BRG) contesta os laudos na Justiça e diz que os resultados foram divulgados de forma errada. Não encontramos decisão final.",
    ingredientes: "ok", ingredientesNota: "Concentrado de proteína do soro do leite, aromatizantes, goma xantana e sucralose."
  },
  "max-100-whey": {
    senacon: "marca", senaconNota: "Outros produtos da Max Titanium (Whey Blend e Whey Pro) foram citados na lista da Senacon de dez/2024. O 100% Whey não aparece. A fabricante (Grupo Supley) contesta a lista na Justiça.",
    ingredientes: "ok", ingredientesNota: "Proteína do soro do leite, aromatizantes, corantes e sucralose (lista do sabor morango)."
  },
  "growth-concentrado": {
    ingredientes: "ok", ingredientesNota: "Proteína do soro do leite concentrada, cacau, maltodextrina, aromatizante, lecitina e sucralose (sabor chocolate)."
  },
  "growth-isolado": {
    ingredientes: "ok", ingredientesNota: "Proteína do soro do leite isolada e lecitina (versão Natural, sem aromas e sem adoçantes)."
  },
  "on-gold-standard": {
    certificacao: {
      nome: "Informed Choice",
      nota: "Programa independente que testa cada lote contra substâncias proibidas no esporte. A certificação encontrada é da versão vendida nos EUA; confira se o lote do seu pote aparece na base da Informed Choice.",
      fonte: "https://choice.wetestyoutrust.com/"
    },
    ingredientes: "ok", ingredientesNota: "Blend de isolado, concentrado e hidrolisado de soro do leite, lecitina, aromas, goma xantana, sucralose e acessulfame-K (rótulo europeu)."
  },
  "essential-hi-whey": {
    senacon: "marca", senaconNota: "Outros produtos da Essential Nutrition (Immuno Whey, Immuno Gold Whey e Cacao Whey) foram citados na lista da Senacon de dez/2024. O H.I. Whey não aparece.",
    ingredientes: "ok", ingredientesNota: "Proteínas hidrolisada e isolada do soro do leite e antiumectante. Sem aromas e sem adoçantes."
  },
  "black-skull-whey-zero": {
    ingredientes: "ok", ingredientesNota: "Proteína isolada do soro do leite, vitaminas do complexo B, gomas, emulsificante e sucralose."
  },
  "probiotica-pure-whey": {
    ingredientes: "ok", ingredientesNota: "Proteína concentrada do soro do leite, cacau, sal, aromatizante, lecitina de soja, espessantes e sucralose."
  },
  "dux-concentrado": {
    ingredientes: "ok", ingredientesNota: "Proteína concentrada do soro do leite, aromatizantes, sucralose e acessulfame-K."
  },
  "max-top-whey-3w": {
    senacon: "marca", senaconNota: "Outros produtos da Max Titanium (Whey Blend e Whey Pro) foram citados na lista da Senacon de dez/2024. O Top Whey 3W não aparece. A fabricante contesta a lista na Justiça.",
    ingredientes: "ok", ingredientesNota: "Proteínas do soro concentrada, isolada e hidrolisada, mix de vitaminas e minerais, aromatizantes e sucralose."
  },
  "atlhetica-best-whey": {
    senacon: "produto",
    senaconNota: "O Best Whey aparece na lista de produtos que a Senacon mandou suspender em sites em dez/2024 (grafado \"Athletica Nutrition – Best Whey\"), com base em análises da Abenutri feitas com amostras de 2022. Entidades do setor contestam a validade dos laudos. Não encontramos decisão final.",
    ingredientes: "ok", ingredientesNota: "Blend de proteínas do soro concentrada, isolada e hidrolisada, goma xantana, aromatizantes, sucralose, acessulfame-K e estévia."
  },
  "vitafor-isofort": {
    ingredientes: "ok", ingredientesNota: "Proteína isolada do soro do leite (versão Neutra, sem aromas e sem adoçantes)."
  },
  "darkness-dark-whey": {
    senacon: "marca", senaconNota: "A Integralmédica, dona da marca Darkness, teve outros produtos citados na lista da Senacon de dez/2024. O Dark Whey não aparece. A fabricante contesta os laudos na Justiça.",
    ingredientes: "ok", ingredientesNota: "Proteína de soro do leite concentrada, cacau ou aromatizante e sucralose."
  },
  "adaptogen-tasty-iso": {
    ingredientes: "ok", ingredientesNota: "Proteínas isolada e hidrolisada do soro do leite, aromas, goma xantana, cloreto de potássio, sucralose e acessulfame-K."
  },
  "new-millen-iso": {
    ingredientes: "ok", ingredientesNota: "Proteína isolada do soro do leite, aroma ou cacau, goma xantana e sucralose."
  },
  "under-labz-crush": {
    senacon: "marca", senaconNota: "Outro produto da Under Labz (Isohydro++ Flexx Whey) foi citado na lista da Senacon de dez/2024. O 100% Whey Crush não aparece.",
    ingredientes: "ok", ingredientesNota: "Proteína de soro do leite concentrada, coenzima Q10, óxido de zinco, goma xantana, aromatizante e sucralose."
  },
  "under-labz-iso-hydro": {
    senacon: "marca", senaconNota: "Outro produto da Under Labz (Isohydro++ Flexx Whey) foi citado na lista da Senacon de dez/2024. O Iso Hydro Whey Crush é outra linha e não aparece.",
    ingredientes: "ok", ingredientesNota: "Proteínas isolada e hidrolisada do soro do leite, coenzima Q10, zinco, vitaminas do complexo B e sucralose."
  },
  "integralmedica-nutri-whey": {
    senacon: "marca", senaconNota: "Outros produtos da Integralmédica foram citados na lista da Senacon de dez/2024. O Nutri Whey não aparece.",
    ingredientes: "alerta",
    ingredientesNota: "A fórmula mistura whey com colágeno hidrolisado e albumina, além de maltodextrina e frutose. O colágeno conta como proteína no rótulo, mas tem pouca leucina e baixo valor para ganho muscular."
  },
  "growth-3w": {
    ingredientes: "ok", ingredientesNota: "Proteínas do soro do leite concentrada, isolada e hidrolisada, cacau, maltodextrina, lecitina, aromatizante, sucralose e acessulfame-K (sabor chocolate)."
  },
  "growth-hidrolisado": {
    ingredientes: "ok", ingredientesNota: "Proteína do soro do leite hidrolisada e lecitina. Sem aromas e sem adoçantes."
  },
  "growth-zero-lactose": {
    ingredientes: "ok", ingredientesNota: "Proteína do soro do leite concentrada e lecitina (versão Natural)."
  },
  "growth-medium": {
    ingredientes: "ok", ingredientesNota: "Proteína do soro do leite concentrada e lecitina (versão Natural). Tem menos proteína por porção que as outras linhas da Growth."
  },
  "integralmedica-iso-triple-zero": {
    senacon: "produto",
    senaconNota: "O Iso Triple Zero está na lista de produtos que a Senacon mandou suspender em sites em dez/2024, com base em análises da Abenutri feitas com amostras de 2022. A fabricante (Grupo BRG) contesta os laudos na Justiça. Não encontramos decisão final.",
    ingredientes: "ok", ingredientesNota: "Proteína isolada do soro do leite, aromatizante, sucralose e goma xantana."
  },
  "max-iso-whey": {
    senacon: "marca", senaconNota: "Outros produtos da Max Titanium (Whey Blend e Whey Pro) foram citados na lista da Senacon de dez/2024. O Iso Whey não aparece. A fabricante contesta a lista na Justiça.",
    ingredientes: "ok", ingredientesNota: "Proteína isolada do soro do leite, mix de vitaminas e minerais e aromatizante."
  },
  "black-skull-whey-hd": {
    ingredientes: null
  },
  "dux-isolado": {
    ingredientes: null
  },
  "dux-hidrolisado": {
    ingredientes: null
  },
  "probiotica-3w": {
    ingredientes: null
  },
  "probiotica-iso-pro": {
    ingredientes: "ok", ingredientesNota: "Proteína isolada do soro do leite por microfiltração, com vitaminas e minerais."
  },
  "atlhetica-best-whey-iso": {
    senacon: "marca", senaconNota: "Outro produto da Atlhetica (Best Whey, a versão tradicional) foi citado na lista da Senacon de dez/2024. O Best Whey Iso não aparece. Entidades do setor contestam a validade dos laudos.",
    ingredientes: "ok", ingredientesNota: "Proteínas isolada e hidrolisada do soro do leite, goma xantana, sucralose e acessulfame-K."
  },
  "vitafor-whey-fort-3w": {
    ingredientes: "ok", ingredientesNota: "Proteínas do soro do leite concentrada, isolada e hidrolisada, goma xantana, aromas, sucralose e acessulfame-K."
  },
  "new-millen-whey-100": {
    ingredientes: "ok", ingredientesNota: "Proteína concentrada do soro do leite, goma xantana, sucralose e dióxido de silício."
  },
  "adaptogen-tasty-whey-3w": {
    ingredientes: "ok", ingredientesNota: "Proteínas do soro do leite concentrada, isolada e hidrolisada, aromas, sucralose e acessulfame-K."
  },
  "essential-cacao-whey": {
    senacon: "produto",
    senaconNota: "O Cacao Whey está na lista de produtos que a Senacon mandou suspender em sites em dez/2024, com base em análises da Abenutri feitas com amostras de 2022. Entidades do setor contestam a validade dos laudos. Não encontramos decisão final.",
    ingredientes: "alerta",
    ingredientesNota: "Proteínas isolada e hidrolisada do soro do leite, cacau e colágeno hidrolisado (Peptan), com estévia e taumatina. O colágeno conta como proteína no rótulo, mas tem pouca leucina."
  }
};
