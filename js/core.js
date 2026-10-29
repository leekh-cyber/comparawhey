// Cálculos e utilidades compartilhados pelas páginas do Compara Whey.
(function () {
  "use strict";

  var LEUCINA_META = 2000;
  var CLASSES = { "muito-bom": "Muito bom", "bom": "Bom", "regular": "Regular", "ruim": "Ruim" };

  // Pesos da nota geral. Sem preço não há nota; sem leucina, o peso dela é redistribuído.
  var PESOS = { pureza: 0.4, leucina: 0.25, custo: 0.35 };

  function concentracao(proteina, porcao) {
    if (!porcao || porcao <= 0 || proteina < 0) return null;
    return Math.round((proteina / porcao) * 100) / 100;
  }

  function classificar(c) {
    if (c === null) return null;
    if (c > 0.75) return "muito-bom";
    if (c >= 0.70) return "bom";
    if (c >= 0.60) return "regular";
    return "ruim";
  }

  function escala(v, min, max) {
    var t = (v - min) / (max - min);
    return Math.round(Math.max(0, Math.min(1, t)) * 100) / 10; // 0 a 10, 1 casa
  }

  /* ===== Lojas de cada whey =====
     Até 4 lojas: primeiro as de afiliado (afiliados.js: Mercado Livre, Shopee), depois as outras
     pelo menor preço. Preços vêm de precos.json (campo "lojas", rotina diária) e, para lojas
     sem esse campo, do histórico geral agrupado por loja. */
  var MAX_LOJAS = 4;
  var LOJA_RECENTE_DIAS = 7; // preço mais velho que isso não vira o preço de referência

  function ordenarHist(h) {
    return h.slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; });
  }

  function juntarHist(destino, pontos) {
    (pontos || []).forEach(function (p) {
      if (!p || !p.data || !p.valor) return;
      var igual = destino.filter(function (q) { return q.data === p.data; })[0];
      if (igual) igual.valor = p.valor; else destino.push({ data: p.data, valor: p.valor });
    });
  }

  function montarLojas(w) {
    var mapa = {}, ordem = [];
    function pegar(nome) {
      if (!mapa[nome]) {
        mapa[nome] = { loja: nome, valor: null, data: null, url: "", link: "", afiliado: false, embalagem: w.embalagem, historico: [] };
        ordem.push(nome);
      }
      return mapa[nome];
    }
    // histórico geral: cada ponto com loja vira um ponto da série daquela loja
    (w.historico || []).forEach(function (p) { if (p.loja) juntarHist(pegar(p.loja).historico, [p]); });
    // lojas da rotina diária
    (w.lojas || []).forEach(function (l) {
      if (!l || !l.loja) return;
      var o = pegar(l.loja);
      if (l.url) o.url = l.url;
      if (l.embalagem) o.embalagem = l.embalagem;
      juntarHist(o.historico, l.historico);
      if (l.valor && l.data) juntarHist(o.historico, [{ data: l.data, valor: l.valor }]);
    });
    // oferta atual
    if (w.oferta && w.oferta.loja && w.oferta.valor) {
      var of = pegar(w.oferta.loja);
      if (w.oferta.url) of.url = w.oferta.url;
      if (w.oferta.afiliado) of.link = w.oferta.afiliado;
      if (w.oferta.data) juntarHist(of.historico, [{ data: w.oferta.data, valor: w.oferta.valor }]);
    }
    // links de afiliado (fixos, nunca sobrescritos pela rotina)
    ((window.AFILIADOS || {})[w.id] || []).forEach(function (a) {
      var o = pegar(a.loja);
      o.afiliado = true;
      o.link = a.link;
      if (a.aPartir) o.aPartir = true; // preço "a partir de" (pode ser de outra variação)
      if (a.url && !o.url) o.url = a.url;
      if (a.embalagem) o.embalagem = a.embalagem;
      juntarHist(o.historico, a.historico);
    });

    var lista = ordem.map(function (n) {
      var o = mapa[n];
      o.historico = ordenarHist(o.historico);
      var ult = o.historico[o.historico.length - 1];
      if (ult) { o.valor = ult.valor; o.data = ult.data; }
      o.link = o.link || o.url;
      return o;
    }).filter(function (o) { return o.link; }); // sem link não dá para comprar: fica fora da lista e do gráfico

    var afil = lista.filter(function (o) { return o.afiliado; });
    var outras = lista.filter(function (o) { return !o.afiliado; }).sort(function (a, b) {
      if (!a.valor || !b.valor) return a.valor ? -1 : b.valor ? 1 : 0;
      return a.valor - b.valor;
    });
    return afil.concat(outras).slice(0, MAX_LOJAS);
  }

  function mesmoTamanho(a, b) { return Math.abs(a - b) <= 10; }

  // A loja mais barata no mesmo tamanho de pote, com preço recente, vira o preço de referência
  function ofertaDasLojas(w, lojas) {
    var hoje = hojeIso();
    var validas = lojas.filter(function (l) {
      return l.valor && l.data && !l.aPartir && mesmoTamanho(l.embalagem, w.embalagem) && diasEntre(l.data, hoje) <= LOJA_RECENTE_DIAS;
    });
    if (!validas.length) return w.oferta;
    var melhor = validas.reduce(function (a, b) {
      if (b.valor < a.valor) return b;
      if (b.valor === a.valor && b.afiliado && !a.afiliado) return b; // empate: link de afiliado
      return a;
    });
    var atual = w.oferta || {};
    var atualRecente = atual.valor && atual.data && diasEntre(atual.data, hoje) <= LOJA_RECENTE_DIAS;
    if (atualRecente && atual.valor < melhor.valor) return atual;
    if (atualRecente && atual.valor === melhor.valor && atual.loja === melhor.loja && !melhor.afiliado) return atual;
    return { valor: melhor.valor, loja: melhor.loja, data: melhor.data, url: melhor.url || melhor.link,
      afiliado: melhor.afiliado ? melhor.link : (atual.loja === melhor.loja ? atual.afiliado || "" : "") };
  }

  function enriquecer(w) {
    var lojas = montarLojas(w);
    w = Object.assign({}, w, { oferta: ofertaDasLojas(w, lojas) });
    var conc = concentracao(w.proteina, w.porcao);
    var preco = w.oferta && w.oferta.valor;
    var porcoes = w.embalagem / w.porcao;
    var protPote = w.embalagem * (w.proteina / w.porcao);
    var custoDose = preco ? preco / porcoes : null;
    var custo100 = preco ? (preco / protPote) * 100 : null;
    var precoKg = preco ? (preco / w.embalagem) * 1000 : null;

    var notas = {
      pureza: escala(conc, 0.5, 0.9),
      leucina: w.leucina === null ? null : escala(w.leucina, 1500, 3000),
      custo: custo100 === null ? null : escala(-custo100, -60, -15)
    };
    var soma = 0, pesos = 0;
    Object.keys(PESOS).forEach(function (k) {
      if (notas[k] !== null) { soma += notas[k] * PESOS[k]; pesos += PESOS[k]; }
    });
    notas.geral = notas.custo === null ? null : Math.round((soma / pesos) * 10) / 10;

    var link = w.oferta ? (w.oferta.afiliado || w.oferta.url || "") : "";

    return Object.assign({}, w, {
      nutri: (window.NUTRI || {})[w.id] || {},
      qual: (window.QUALIDADE || {})[w.id] || {},
      precoInfo: infoPreco(w),
      conc: conc,
      classe: classificar(conc),
      porcoes: porcoes,
      custoDose: custoDose,
      custo100: custo100,
      precoKg: precoKg,
      preco: preco || null,
      notas: notas,
      link: link,
      lojas: lojas,
      leucinaOk: w.leucina !== null && w.leucina > LEUCINA_META
    });
  }

  /* Histórico de preço: variação desde a coleta anterior, menor preço em 30 dias e idade do preço */
  var DIA = 86400000;
  function hojeIso() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function diasEntre(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / DIA); }

  function infoPreco(w) {
    var h = (w.historico || []).slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; });
    var info = { variacao: null, menor30: false, dias: null };
    if (w.oferta && w.oferta.data) info.dias = Math.max(0, diasEntre(w.oferta.data, hojeIso()));
    if (h.length >= 2) {
      var pAnt = h[h.length - 2], pAtual = h[h.length - 1];
      var ant = pAnt.valor, atual = pAtual.valor;
      // Só compara pontos da mesma loja: troca de loja não é "preço subiu/caiu"
      if (ant && pAnt.loja && pAnt.loja === pAtual.loja) info.variacao = (atual - ant) / ant;
      var ultimo = h[h.length - 1].data;
      var janela = h.filter(function (p) { return diasEntre(p.data, ultimo) <= 30; });
      var valores = janela.map(function (p) { return p.valor; });
      var min = Math.min.apply(null, valores), max = Math.max.apply(null, valores);
      // Só vale com pelo menos 3 coletas na janela e quando o preço variou
      info.menor30 = janela.length >= 3 && atual <= min && max > min;
    }
    return info;
  }

  function fmt(n, casas) {
    return n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  }
  function fmtG(n) { return (Number.isInteger(n) ? fmt(n, 0) : fmt(n, 1)) + " g"; }
  function fmtR(n) { return "R$ " + fmt(n, 2); }
  function fmtData(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }
  function fmtPeso(g) { return g >= 1000 ? fmt(g / 1000, g % 1000 ? 1 : 0) + " kg" : fmt(g, 0) + " g"; }

  function semAcento(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  function selo(classe) {
    return el("span", "selo selo--" + classe, CLASSES[classe]);
  }

  function leucinaNode(w) {
    var wrap = el("span", "leu");
    if (w.leucina === null) {
      wrap.appendChild(el("span", "leu__valor leu__valor--nd", "Não informada"));
      return wrap;
    }
    wrap.appendChild(el("span", "leu__valor" + (w.leucinaOk ? " leu__valor--ok" : " leu__valor--baixo"),
      fmt(w.leucina, 0) + " mg"));
    if (w.leucinaFonte === "estimada") {
      var t = el("span", "leu__tag", "estimada");
      t.title = "Não encontramos no rótulo. Estimativa: cerca de 10,5% da proteína.";
      wrap.appendChild(t);
    }
    return wrap;
  }

  function medidor(c) {
    var pct = Math.max(0, Math.min(1, (c - 0.4) / 0.6)) * 100;
    var m = el("span", "medidor");
    m.setAttribute("aria-hidden", "true");
    var f = el("span", "medidor__fill medidor__fill--" + classificar(c));
    f.style.width = pct + "%";
    m.appendChild(f);
    return m;
  }

  function nota(n, grande) {
    if (n === null) return el("span", "nota nota--nd", "Sem nota");
    var s = el("span", "nota" + (grande ? " nota--grande" : ""));
    s.appendChild(el("span", "nota__n", fmt(n, 1)));
    s.appendChild(el("span", "nota__de", "/10"));
    return s;
  }

  // Foto do produto (imagens das lojas, em /img/produtos/<id>.webp). Sem foto: ilustração com as iniciais da marca.
  var FOTOS = ["integralmedica-100-pure", "max-100-whey", "growth-concentrado", "on-gold-standard",
    "essential-hi-whey", "black-skull-whey-zero", "probiotica-pure-whey", "dux-concentrado", "max-top-whey-3w",
    "atlhetica-best-whey", "vitafor-isofort", "darkness-dark-whey", "adaptogen-tasty-iso", "new-millen-iso",
    "under-labz-crush", "under-labz-iso-hydro", "integralmedica-nutri-whey", "growth-isolado",
    "growth-3w", "growth-hidrolisado", "growth-zero-lactose", "growth-medium", "integralmedica-iso-triple-zero",
    "max-iso-whey", "black-skull-whey-hd", "dux-isolado", "dux-hidrolisado", "probiotica-3w", "probiotica-iso-pro",
    "atlhetica-best-whey-iso", "vitafor-whey-fort-3w", "new-millen-whey-100", "adaptogen-tasty-whey-3w", "essential-cacao-whey"];
  var CORES_TIPO = { "Isolado": "#0B8BD6", "Hidrolisado": "#6B4FD8", "Concentrado": "#0B2540", "Blend": "#E8590C" };
  function pote(w) {
    var cor = CORES_TIPO[w.tipo] || "#0B2540";
    var iniciais = w.marca.split(/\s+/).filter(function (p) { return p.length > 2; })
      .slice(0, 2).map(function (p) { return p[0]; }).join("").toUpperCase() || w.marca.slice(0, 2).toUpperCase();
    var wrap = el("div", "pote");
    wrap.setAttribute("aria-hidden", "true");
    var svg =
      '<svg viewBox="0 0 80 96" width="80" height="96">' +
      '<rect x="14" y="4" width="52" height="14" rx="4" fill="' + cor + '" opacity=".85"/>' +
      '<path d="M10 22h60l-3 66a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6z" fill="' + cor + '"/>' +
      '<rect x="16" y="40" width="48" height="30" rx="3" fill="#fff"/>' +
      '<text x="40" y="61" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="15" fill="' + cor + '">' + iniciais + '</text>' +
      '</svg>';
    if (FOTOS.indexOf(w.id) >= 0) {
      var img = new Image();
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 160; img.height = 160;
      img.src = "/img/produtos/" + w.id + ".webp";
      img.onerror = function () { wrap.classList.remove("pote--foto"); wrap.innerHTML = svg; };
      wrap.classList.add("pote--foto");
      wrap.appendChild(img);
    } else {
      wrap.innerHTML = svg;
    }
    return wrap;
  }

  // Miniatura para lista e seletor (só quando há foto)
  function miniatura(w, classe) {
    if (FOTOS.indexOf(w.id) < 0) return null;
    var img = new Image();
    img.className = classe;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 48; img.height = 48;
    img.src = "/img/produtos/" + w.id + ".webp";
    img.onerror = function () { img.remove(); };
    return img;
  }

  // Selo de preço (prioridade: menor em 30 dias, caiu, subiu). Variações abaixo de 3% são ignoradas.
  function seloPreco(w) {
    var p = w.precoInfo;
    if (!w.preco || !p) return null;
    if (p.menor30) return el("span", "preco-selo preco-selo--menor", "Menor preço em 30 dias");
    if (p.variacao !== null && Math.abs(p.variacao) >= 0.03) {
      var pct = fmt(Math.abs(p.variacao) * 100, 0) + "%";
      return p.variacao < 0
        ? el("span", "preco-selo preco-selo--caiu", "↓ Caiu " + pct)
        : el("span", "preco-selo preco-selo--subiu", "↑ Subiu " + pct);
    }
    return null;
  }

  // "30 porções (900 g)"
  function textoPorcoes(w) {
    return fmt(Math.floor(w.porcoes), 0) + " porções (" + fmtPeso(w.embalagem) + ")";
  }

  // "no Mercado Livre", "na Droga Raia"
  function naLoja(nome) { return (/^Mercado Livre/.test(nome) ? "no " : "na ") + nome; }

  // "30 porções (900 g) na Loja, atualizado ontem" (sem vírgula sobrando quando falta a data)
  function textoOferta(w) {
    var t = textoPorcoes(w) + " " + naLoja(w.oferta.loja);
    var at = textoAtualizado(w);
    return at ? t + ", " + at : t;
  }

  function textoAtualizado(w) {
    var d = w.precoInfo && w.precoInfo.dias;
    if (d === null || d === undefined) return "";
    if (d === 0) return "preço de hoje";
    if (d === 1) return "atualizado ontem";
    return "atualizado há " + d + " dias";
  }

  // Selos de qualidade: só aparecem quando há fato com fonte (detalhes na página de comparação)
  function chipsQualidade(w) {
    var q = w.qual || {};
    var box = el("span", "qual");
    if (q.certificacao) box.appendChild(el("span", "qual__chip qual__chip--ok", "✓ " + q.certificacao.nome + " (EUA)"));
    if (q.senacon === "produto") {
      var s = el("span", "qual__chip qual__chip--atencao", "⚠ Citado em lista da Senacon (2024)");
      s.title = "Contestado pelo fabricante. Veja os detalhes na página de comparação.";
      box.appendChild(s);
    }
    if (q.ingredientes === "alerta") box.appendChild(el("span", "qual__chip qual__chip--atencao", "⚠ Contém colágeno"));
    return box.children.length ? box : null;
  }

  // Selos de dieta a partir da tabela nutricional
  function chipsDieta(w) {
    var n = w.nutri || {};
    var box = el("span", "dieta");
    if (n.lactose === "zero") box.appendChild(el("span", "dieta__chip dieta__chip--ok", "Zero lactose"));
    else if (n.lactose === "baixa") box.appendChild(el("span", "dieta__chip", "Baixa lactose"));
    if (n.semGluten === true) box.appendChild(el("span", "dieta__chip", "Sem glúten"));
    if (n.adocante === "sem adoçante") box.appendChild(el("span", "dieta__chip", "Sem adoçante"));
    return box.children.length ? box : null;
  }

  function botaoLoja(w, texto) {
    if (!w.link) {
      return el("span", "loja loja--sem", "Link em breve");
    }
    var a = el("a", "loja", texto || (w.oferta.loja ? "Ver na " + w.oferta.loja : "Ver na loja"));
    a.href = w.link;
    a.target = "_blank";
    a.rel = "sponsored nofollow noopener";
    return a;
  }

  // Cores fixas para as lojas de afiliado; as outras lojas usam a paleta na ordem em que aparecem.
  // Todas com contraste de pelo menos 3:1 sobre branco (linhas do gráfico).
  var CORES_FIXAS = { "Mercado Livre": "#A87700", "Shopee": "#D73211" };
  var CORES_OUTRAS = ["#0B8BD6", "#6B4FD8", "#11864A", "#0B2540"];
  function coresLojas(lojas) {
    var livres = CORES_OUTRAS.slice(), mapa = {};
    lojas.forEach(function (l) { if (CORES_FIXAS[l.loja]) mapa[l.loja] = CORES_FIXAS[l.loja]; });
    lojas.forEach(function (l) { if (!mapa[l.loja]) mapa[l.loja] = livres.shift() || "#5B6B7B"; });
    return mapa;
  }

  // Lista "Onde comprar": até 4 lojas, cada uma com preço e botão
  function listaLojas(w) {
    var box = el("div", "lojas");
    var lojas = (w.lojas || []).filter(function (l) { return l.link; });
    if (!lojas.length) {
      box.appendChild(el("span", "loja loja--sem", "Link em breve"));
      return box;
    }
    var cores = coresLojas(w.lojas);
    var ul = el("ul", "lojas__lista");
    var temAfiliado = false;
    lojas.forEach(function (l) {
      var li = el("li", "lojas__item" + (w.oferta && l.loja === w.oferta.loja ? " lojas__item--melhor" : ""));
      var nome = el("span", "lojas__nome");
      var ponto = el("span", "lojas__cor");
      ponto.style.background = cores[l.loja];
      nome.appendChild(ponto);
      nome.appendChild(document.createTextNode(l.loja));
      if (!mesmoTamanho(l.embalagem, w.embalagem)) nome.appendChild(el("span", "lojas__tam", "(" + fmtPeso(l.embalagem) + ")"));
      li.appendChild(nome);
      var preco = el("span", "lojas__preco");
      if (l.valor) {
        if (l.aPartir) preco.appendChild(el("span", "lojas__data", "a partir de"));
        preco.appendChild(el("span", "lojas__valor", fmtR(l.valor)));
        var dias = l.data ? Math.max(0, diasEntre(l.data, hojeIso())) : null;
        if (dias !== null) preco.appendChild(el("span", "lojas__data", dias === 0 ? "hoje" : dias === 1 ? "ontem" : "há " + dias + " dias"));
      } else {
        preco.appendChild(el("span", "lojas__data", "ver preço"));
      }
      li.appendChild(preco);
      var a = el("a", "lojas__ir", "Ver");
      a.href = l.link;
      a.target = "_blank";
      a.rel = "sponsored nofollow noopener";
      a.setAttribute("aria-label", "Ver " + w.nome + " " + naLoja(l.loja));
      li.appendChild(a);
      ul.appendChild(li);
      if (l.afiliado) temAfiliado = true;
    });
    box.appendChild(ul);
    if (temAfiliado) box.appendChild(el("p", "lojas__aviso", "Alguns links são de afiliado: o Compara Whey pode ganhar uma comissão, sem custo extra para você."));
    return box;
  }

  window.CW = {
    LEUCINA_META: LEUCINA_META,
    CLASSES: CLASSES,
    PESOS: PESOS,
    concentracao: concentracao,
    classificar: classificar,
    dados: (window.WHEYS || []).map(enriquecer),
    fmt: fmt, fmtG: fmtG, fmtR: fmtR, fmtData: fmtData, fmtPeso: fmtPeso,
    semAcento: semAcento,
    el: el, selo: selo, leucinaNode: leucinaNode, medidor: medidor, nota: nota, botaoLoja: botaoLoja, listaLojas: listaLojas, coresLojas: coresLojas, pote: pote, miniatura: miniatura, naLoja: naLoja,
    seloPreco: seloPreco, textoAtualizado: textoAtualizado, textoPorcoes: textoPorcoes, textoOferta: textoOferta, chipsDieta: chipsDieta, chipsQualidade: chipsQualidade
  };

  // Preços atualizados diariamente por uma rotina na nuvem no repositório do GitHub.
  // Se o GitHub não responder, o site usa os preços embutidos em data.js.
  var PRECOS_URL = "https://raw.githubusercontent.com/leekh-cyber/compara-whey-dados/main/precos.json";

  function aplicarPrecos(json) {
    var mapa = (json && json.wheys) || {};
    (window.WHEYS || []).forEach(function (w) {
      var p = mapa[w.id];
      if (!p) return;
      if (p.oferta) w.oferta = p.oferta;
      if (Array.isArray(p.historico)) w.historico = p.historico;
      if (Array.isArray(p.lojas)) w.lojas = p.lojas;
    });
    window.CW.dados = window.WHEYS.map(enriquecer);
    window.CW.precosAtualizados = json.atualizado || null;
  }

  function comLimite(promessa, ms) {
    return Promise.race([promessa, new Promise(function (_, rejeitar) {
      setTimeout(function () { rejeitar(new Error("tempo")); }, ms);
    })]);
  }

  /* ===== Avaliações (Supabase) =====
     A chave publishable é pública por natureza; a segurança vem das regras (RLS) da tabela:
     visitantes só leem avaliações visíveis e enviam novas. */
  var SB_URL = "https://pnhspufnboxubpbwabrg.supabase.co/rest/v1";
  var SB_KEY = "sb_publishable_lo9MH28JiQJW22qhLLNJIw_S_R8goJl";
  var SB_HEADERS = { apikey: SB_KEY, Authorization: "Bearer " + SB_KEY };

  function sb(caminho, opcoes) {
    opcoes = opcoes || {};
    opcoes.headers = Object.assign({}, SB_HEADERS, opcoes.headers || {});
    return fetch(SB_URL + caminho, opcoes).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error(t || ("HTTP " + r.status)); });
      return r.status === 204 || r.status === 201 ? null : r.json();
    });
  }

  var resumo = {};
  function carregarResumo() {
    return sb("/avaliacoes_resumo?select=whey_id,media,total").then(function (linhas) {
      resumo = {};
      (linhas || []).forEach(function (l) { resumo[l.whey_id] = { media: Number(l.media), total: l.total }; });
      return resumo;
    });
  }

  // Tags opcionais das avaliações. Se a coluna "tags" ainda não existir no banco, o site segue sem elas.
  var TAGS = {
    "dissolve-bem": "Dissolve bem", "sabor-bom": "Sabor bom", "custo-beneficio": "Bom custo-benefício",
    "nao-estufa": "Não estufa", "embalagem-boa": "Embalagem boa", "compraria-de-novo": "Compraria de novo"
  };
  var tagsAtivas = true;

  function listarAval(id, comTags) {
    var campos = "id,estrelas,nome,comentario,criado_em" + (comTags ? ",tags" : "");
    return sb("/avaliacoes?select=" + campos + "&whey_id=eq." + encodeURIComponent(id) + "&order=criado_em.desc&limit=30");
  }
  function postAval(dados) {
    return sb("/avaliacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(dados)
    });
  }

  var avaliacoes = {
    TAGS: TAGS,
    tagsAtivas: function () { return tagsAtivas; },
    resumoDe: function (id) { return resumo[id] || null; },
    recarregarResumo: carregarResumo,
    listar: function (id) {
      if (!tagsAtivas) return listarAval(id, false);
      return listarAval(id, true).catch(function (e) {
        if (String(e.message).indexOf("tags") === -1) throw e;
        tagsAtivas = false;
        return listarAval(id, false);
      });
    },
    enviar: function (dados) {
      if (!tagsAtivas || !dados.tags || !dados.tags.length) {
        var semTags = Object.assign({}, dados);
        delete semTags.tags;
        return postAval(semTags);
      }
      return postAval(dados).catch(function (e) {
        if (String(e.message).indexOf("tags") === -1) throw e;
        tagsAtivas = false;
        var semTags = Object.assign({}, dados);
        delete semTags.tags;
        return postAval(semTags);
      });
    }
  };

  // Estrelas para exibir (somente leitura)
  function estrelas(media, total, compacto) {
    var wrap = el("span", "estrelas" + (compacto ? " estrelas--compacto" : ""));
    if (!total) {
      wrap.appendChild(el("span", "estrelas__vazio", "Sem avaliações"));
      return wrap;
    }
    var barra = el("span", "estrelas__barra");
    barra.setAttribute("role", "img");
    barra.setAttribute("aria-label", fmt(media, 1) + " de 5 estrelas");
    var cheio = el("span", "estrelas__cheio", "★★★★★");
    cheio.style.width = (media / 5) * 100 + "%";
    barra.appendChild(el("span", "estrelas__fundo", "★★★★★"));
    barra.appendChild(cheio);
    wrap.appendChild(barra);
    wrap.appendChild(el("span", "estrelas__num", fmt(media, 1)));
    wrap.appendChild(el("span", "estrelas__total", "(" + total + ")"));
    return wrap;
  }

  window.CW.avaliacoes = avaliacoes;
  window.CW.estrelas = estrelas;

  var precos = comLimite(
    fetch(PRECOS_URL, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }), 4000
  ).then(aplicarPrecos).catch(function () { /* mantém os preços embutidos */ });

  var notasVisitantes = comLimite(carregarResumo(), 3000).catch(function () { /* site funciona sem avaliações */ });

  window.CW.pronto = Promise.all([precos, notasVisitantes]);
})();
