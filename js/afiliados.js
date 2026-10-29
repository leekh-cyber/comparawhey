// Links de afiliado do Compara Whey (comissão para o site, sem custo extra para quem compra).
// Mercado Livre: produtos da página https://www.mercadolivre.com.br/social/ferreiradasilvaalex61
//          (8 primeiros) + 22 gerados no Gerador de links em 21/10/2026 (preço da busca do ML no dia).
// Shopee: links gerados no painel de afiliados (Oferta de produto) em 20/10/2026. O preço é o que o
//          painel mostra no anúncio, que é o da variação mais barata: aparece como "a partir de"
//          e não entra no cálculo do menor preço.
//
// Cada loja: { loja, link (link de afiliado), url (página do produto), embalagem (g), historico }
// O link fica fixo aqui; a rotina diária só atualiza o preço (precos.json, campo "lojas").
// historico: preços vistos na própria loja; o primeiro ponto veio do monitor_ml.py (15/10/2026).
window.AFILIADOS = {
  "new-millen-iso": [{
    loja: "Mercado Livre", link: "https://meli.la/29KpC3D", embalagem: 900,
    url: "https://www.mercadolivre.com.br/iso-whey-isolado-900g-new-millen-sabor-baunilha/p/MLB19797243",
    historico: [{ data: "2026-10-15", valor: 149.00 }, { data: "2026-10-20", valor: 149.00 }]
  }],
  "vitafor-isofort": [{
    loja: "Mercado Livre", link: "https://meli.la/2K79Nih", embalagem: 900,
    url: "https://www.mercadolivre.com.br/whey-protein-isolado-isofort-chocolate-pote-900g-vitafor/p/MLB18625908",
    historico: [{ data: "2026-10-15", valor: 338.00 }, { data: "2026-10-20", valor: 309.00 }]
  }],
  "atlhetica-best-whey": [{
    loja: "Mercado Livre", link: "https://meli.la/2M6ARqX", embalagem: 900,
    url: "https://www.mercadolivre.com.br/atlhetica-nutrition-best-whey-en-pote-sabor-original-900g/p/MLB15054380",
    historico: [{ data: "2026-10-15", valor: 206.10 }, { data: "2026-10-20", valor: 206.67 }]
  }],
  "dux-concentrado": [{
    loja: "Mercado Livre", link: "https://meli.la/1Ma2m27", embalagem: 900,
    url: "https://www.mercadolivre.com.br/dux-human-health-whey-protein-concentrado-suplemento-900g-sabor-chocolate/p/MLB23853955",
    historico: [{ data: "2026-10-15", valor: 249.68 }, { data: "2026-10-20", valor: 222.00 }]
  }],
  "probiotica-pure-whey": [{
    loja: "Mercado Livre", link: "https://meli.la/2V33cj4", embalagem: 900,
    url: "https://www.mercadolivre.com.br/suplemento-em-po-probiotica-100-pure-whey-sabor-chocolate-pote-de-900g/p/MLB6254051",
    historico: [{ data: "2026-10-15", valor: 179.90 }, { data: "2026-10-20", valor: 174.00 }]
  }],
  "on-gold-standard": [{
    loja: "Mercado Livre", link: "https://meli.la/2LgfqVi", embalagem: 907,
    url: "https://www.mercadolivre.com.br/suplemento-em-po-optimum-nutrition-proteina-gold-standard-100-whey-sabor-double-rich-chocolate-em-pote-de-907g/p/MLB6088697",
    historico: [{ data: "2026-10-15", valor: 319.00 }, { data: "2026-10-20", valor: 287.00 }]
  }],
  "growth-concentrado": [{
    loja: "Mercado Livre", link: "https://meli.la/2RrbH5R", embalagem: 1000,
    url: "https://www.mercadolivre.com.br/whey-concentrado-80-whey-protein-1kg-growth-supplements-sabor-chocolate/p/MLB19049038",
    historico: [{ data: "2026-10-15", valor: 249.90 }, { data: "2026-10-20", valor: 189.90 }]
  }],
  "max-100-whey": [{
    loja: "Mercado Livre", link: "https://meli.la/2ZvML4G", embalagem: 900,
    url: "https://www.mercadolivre.com.br/100-whey-protein-concentrado-900g-max-titanium-sabor-chocolate/p/MLB18418075",
    historico: [{ data: "2026-10-15", valor: 174.00 }, { data: "2026-10-20", valor: 174.00 }]
  }]
};

// Mercado Livre, gerados em 21/10/2026: { id: [link meli.la, url do produto, embalagem em g, preço do dia] }
(function () {
  var ML = {
    "integralmedica-100-pure": ["https://meli.la/1q4Wa22", "https://www.mercadolivre.com.br/proteina-integralmedica-whey-100-pure-em-po-sabor-chocolate-x-900g/p/MLB18218400", 900, 155.01],
    "growth-isolado": ["https://meli.la/2ey799P", "https://www.mercadolivre.com.br/whey-protein-isolado-1kg-growth-supplements-chocolate/p/MLB26879184", 1000, 449.90],
    "growth-zero-lactose": ["https://meli.la/2kbVhEh", "https://www.mercadolivre.com.br/whey-protein-concentrado-zero-lactose-1kg-growth-supplements-morango/p/MLB74916619", 1000, 261.64],
    "growth-medium": ["https://meli.la/2JT9ptj", "https://www.mercadolivre.com.br/whey-protein-medium-1kg-growth-supplementos-chocolate/p/MLB23982703", 1000, 159.90],
    "integralmedica-iso-triple-zero": ["https://meli.la/2GJAurW", "https://www.mercadolivre.com.br/integralmedica-iso-triple-zero-whey-protein-isolado-sabor-baunilha-suplemento-alimentar-proteico-pote-900g/p/MLB13088510", 900, 311.28],
    "max-top-whey-3w": ["https://meli.la/1CUDqZp", "https://www.mercadolivre.com.br/top-whey-3w-mais-performance-900g-max-titanium-chocolate/up/MLBU3559164075", 900, 257.00],
    "max-iso-whey": ["https://meli.la/1AJEphq", "https://www.mercadolivre.com.br/whey-protein-900g-iso-whey-max-titanium-baunilha-proteina-isolada/p/MLB20609445", 900, 299.00],
    "black-skull-whey-hd": ["https://meli.la/1v6kQ6d", "https://www.mercadolivre.com.br/proteina-black-skull-whey-100-hd-em-po-sabor-cookies-and-cream-x-900g/p/MLB18995414", 900, 110.31],
    "dux-isolado": ["https://meli.la/1JW6Q2t", "https://www.mercadolivre.com.br/proteina-dux-nutrition-whey-protein-isolado-em-po-sabor-baunilha-x-900g/p/MLB18512109", 900, 309.70],
    "dux-hidrolisado": ["https://meli.la/1NqPmwq", "https://www.mercadolivre.com.br/whey-protein-hydro-900g-dux-nutrition-sabor-baunilha/p/MLB79445822", 900, 342.92],
    "probiotica-3w": ["https://meli.la/14iJdme", "https://www.mercadolivre.com.br/whey-3w-concentrada-isolada-hidrolisada-900g-probiotica-sabor-chocolate/p/MLB58829714", 900, 199.89],
    "probiotica-iso-pro": ["https://meli.la/1CzfCoB", "https://www.mercadolivre.com.br/whey-isolado-probiotica-iso-pro-whey-900g-sabor-baunilha-whey-protein/p/MLB30948212", 900, 261.00],
    "atlhetica-best-whey-iso": ["https://meli.la/1NzEruM", "https://www.mercadolivre.com.br/best-whey-iso-atlhetica-nutrition-900g-brigadeiro/up/MLBU4174644416", 900, 342.90],
    "vitafor-whey-fort-3w": ["https://meli.la/2wqXkQy", "https://www.mercadolivre.com.br/suplemento-alimentar-whey-fort-3w-sabor-frutas-vermelhas-900g-vitafor/p/MLB19772622", 900, 219.90],
    "new-millen-whey-100": ["https://meli.la/1ivo6uB", "https://www.mercadolivre.com.br/whey-protein-100-900g-concentrado-new-millen-sabor-doce-de-leite/p/MLB37037483", 900, 189.90],
    "adaptogen-tasty-whey-3w": ["https://meli.la/2Lc2HFj", "https://www.mercadolivre.com.br/whey-protein-adaptogen-science-tasty-gourmet-3w-em-po-sem-sabor-x-900g/p/MLB61630221", 900, 215.17],
    "adaptogen-tasty-iso": ["https://meli.la/2T8sPDa", "https://www.mercadolivre.com.br/tasty-iso-proteina-isolada-hidrolisada-adaptogen-900g-whey-sabor-doce-de-leite/p/MLB51911002", 900, 348.00],
    "essential-cacao-whey": ["https://meli.la/1BosyK2", "https://www.mercadolivre.com.br/cacao-whey-protein-isolado-e-hidrolisado-420g-essential-nutrition/p/MLB29712868", 420, 247.90],
    "essential-hi-whey": ["https://meli.la/2LFRYFb", "https://www.mercadolivre.com.br/hi-whey-375g-essential-nutrition-sabor-sem-sabor/p/MLB19548978", 375, 280.50],
    "integralmedica-nutri-whey": ["https://meli.la/1hhUZzc", "https://www.mercadolivre.com.br/nutri-whey-protein-baunilha-refil-900g-integral-medica/p/MLB18537209", 900, 153.90],
    "under-labz-crush": ["https://meli.la/1f3c573", "https://www.mercadolivre.com.br/proteina-under-labz-whey-concentrado-crush-em-po-sabor-cookies-bear-x-900g/p/MLB58803320", 900, 135.00],
    "under-labz-iso-hydro": ["https://meli.la/2Gvn2uL", "https://www.mercadolivre.com.br/iso-hydro-whey-crush-907g-milk-cream-under-labz-sabor-creme-de-leite/p/MLB38432507", 907, 264.99]
  };
  Object.keys(ML).forEach(function (id) {
    var m = ML[id];
    (window.AFILIADOS[id] = window.AFILIADOS[id] || []).push({ loja: "Mercado Livre", link: m[0], url: m[1], embalagem: m[2],
      historico: [{ data: "2026-10-21", valor: m[3] }] });
  });
})();

// Shopee: { id: [link, embalagem do anúncio em g, preço "a partir de" visto no painel em 20/10/2026] }
(function () {
  var SHOPEE = {
    "vitafor-isofort": ["https://s.shopee.com.br/4VdjDnOUgt", 900, 319.99],
    "vitafor-whey-fort-3w": ["https://s.shopee.com.br/gR0f6ubEb", 900, 224.99],
    "growth-isolado": ["https://s.shopee.com.br/3B8LdP5xLk", 1000, 420.94],
    "growth-zero-lactose": ["https://s.shopee.com.br/LoAGCPKrE", 1000, 159.90],
    "growth-medium": ["https://s.shopee.com.br/3g4cEKLRdj", 1000, 142.00],
    "max-100-whey": ["https://s.shopee.com.br/1qcy2ywon6", 900, 196.90],
    "max-top-whey-3w": ["https://s.shopee.com.br/4VdjDsdrnB", 900, 269.99],
    "max-iso-whey": ["https://s.shopee.com.br/9pfFZjE1Mi", 900, 359.26],
    "on-gold-standard": ["https://s.shopee.com.br/30ovR9eVVw", 907, 319.90],
    "probiotica-pure-whey": ["https://s.shopee.com.br/7AeUOqSAU7", 900, 158.33],
    "probiotica-3w": ["https://s.shopee.com.br/1qcy34lfCG", 900, 259.89],
    "probiotica-iso-pro": ["https://s.shopee.com.br/1gJXqjvuDi", 900, 328.99],
    "dux-concentrado": ["https://s.shopee.com.br/50Zzot0LIM", 900, 229.89],
    "dux-isolado": ["https://s.shopee.com.br/30ovRETcW5", 900, 386.99],
    "dux-hidrolisado": ["https://s.shopee.com.br/3qO2QkDeWT", 900, 499.00],
    "atlhetica-best-whey": ["https://s.shopee.com.br/AKbWAjIpP8", 900, 235.90],
    "atlhetica-best-whey-iso": ["https://s.shopee.com.br/6L5NPNgr6f", 900, 419.33],
    "new-millen-whey-100": ["https://s.shopee.com.br/3g4cEVd8Zc", 900, 169.90],
    "integralmedica-100-pure": ["https://s.shopee.com.br/3B8Ldbiy3o", 900, 189.99],
    "integralmedica-iso-triple-zero": ["https://s.shopee.com.br/1qcy3Ba6b9", 900, 389.99],
    "black-skull-whey-hd": ["https://s.shopee.com.br/4VdjE541XD", 900, 139.00],
    "essential-hi-whey": ["https://s.shopee.com.br/80DbOYTUP0", 375, 297.99],
    "essential-cacao-whey": ["https://s.shopee.com.br/6VOnbnv3rD", 420, 297.00],
    "adaptogen-tasty-iso": ["https://s.shopee.com.br/7fakzzXjwP", 912, 417.90],
    "adaptogen-tasty-whey-3w": ["https://s.shopee.com.br/20wOFaX7Es", 900, 230.99],
    "under-labz-crush": ["https://s.shopee.com.br/5VWGQ3niIt", 900, 143.99],
    "under-labz-iso-hydro": ["https://s.shopee.com.br/50Zzp92occ", 907, 259.99]
  };
  Object.keys(SHOPEE).forEach(function (id) {
    (window.AFILIADOS[id] = window.AFILIADOS[id] || []).push({ loja: "Shopee", link: SHOPEE[id][0], embalagem: SHOPEE[id][1], aPartir: true,
      historico: [{ data: "2026-10-20", valor: SHOPEE[id][2] }] });
  });
})();
