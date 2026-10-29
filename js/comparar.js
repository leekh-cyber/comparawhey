window.CW.pronto.then(function () {
  "use strict";

  var CW = window.CW;
  var el = CW.el, fmt = CW.fmt, fmtG = CW.fmtG, fmtR = CW.fmtR;
  var dados = CW.dados;

  function porId(id) { return dados.find(function (d) { return d.id === id; }) || null; }

  // Dois lados: /comparar.html?w=idA,idB (qualquer um pode estar vazio)
  var lados = (new URLSearchParams(location.search).get("w") || "").split(",").map(porId);
  lados = [lados[0] || null, lados[1] || null];
  if (lados[0] && lados[1] && lados[0].id === lados[1].id) lados[1] = null;

  var ladoEscolhendo = 0;

  function salvarUrl() {
    var ids = lados.map(function (w) { return w ? w.id : ""; });
    var q = ids[0] || ids[1] ? "?w=" + ids.join(",").replace(/,$/, "") : "";
    history.replaceState(null, "", location.pathname + q);
  }

  /* ===== Cartões dos dois lados ===== */
  function cartaoLado(i) {
    var w = lados[i];
    if (!w) {
      var vazio = el("button", "vs__lado vs__lado--vazio");
      vazio.type = "button";
      vazio.appendChild(el("span", "vs__mais", "+"));
      vazio.appendChild(el("span", "vs__vazio-txt", "Adicionar whey para comparar"));
      vazio.addEventListener("click", function () { abrirSeletor(i); });
      return vazio;
    }
    var c = el("article", "vs__lado");
    var topo = el("div", "vs__topo");
    topo.appendChild(CW.selo(w.classe));
    topo.appendChild(CW.nota(w.notas.geral, true));
    c.appendChild(topo);
    c.appendChild(CW.pote(w));
    c.appendChild(el("span", "card__marca", w.marca));
    c.appendChild(el("h2", "vs__nome", w.nome));
    var r = CW.avaliacoes.resumoDe(w.id);
    var aval = el("a", "aval-link");
    aval.href = "#avaliacoes";
    aval.appendChild(CW.estrelas(r ? r.media : 0, r ? r.total : 0, true));
    c.appendChild(aval);
    var etq = el("div", "card__etiquetas");
    etq.appendChild(el("span", "card__tipo", w.tipo));
    var dieta = CW.chipsDieta(w);
    if (dieta) etq.appendChild(dieta);
    c.appendChild(etq);
    var qualC = CW.chipsQualidade(w);
    if (qualC) c.appendChild(qualC);
    var preco = el("div", "card__preco");
    if (w.preco) {
      var sp = CW.seloPreco(w);
      if (sp) preco.appendChild(sp);
      preco.appendChild(el("span", "card__preco-valor", fmtR(w.preco)));
      preco.appendChild(el("span", "card__preco-sub", CW.textoOferta(w)));
    } else {
      preco.appendChild(el("span", "card__preco-sub", "Sem preço verificado"));
    }
    c.appendChild(preco);
    var acoes = el("div", "vs__acoes");
    acoes.appendChild(el("h3", "lojas__titulo", "Onde comprar"));
    acoes.appendChild(CW.listaLojas(w));
    var linha = el("div", "vs__links");
    var trocar = el("button", "link-btn", "Trocar");
    trocar.type = "button";
    trocar.addEventListener("click", function () { abrirSeletor(i); });
    var remover = el("button", "link-btn", "Remover");
    remover.type = "button";
    remover.addEventListener("click", function () { lados[i] = null; salvarUrl(); render(); });
    linha.appendChild(trocar);
    linha.appendChild(remover);
    acoes.appendChild(linha);
    c.appendChild(acoes);
    return c;
  }

  /* ===== "Por que X é melhor?" ===== */
  var CRITERIOS = [
    { chave: "conc", melhor: "max", texto: "Maior concentração de proteína",
      val: function (w) { return w.conc; }, fmt: function (v) { return fmt(v, 2); } },
    { chave: "proteina", melhor: "max", texto: "Mais proteína por porção",
      val: function (w) { return w.proteina; }, fmt: function (v) { return fmtG(v); } },
    { chave: "leucina", melhor: "max", texto: "Mais leucina por porção", soRotulo: true,
      val: function (w) { return w.leucina; }, fmt: function (v) { return fmt(v, 0) + " mg"; },
      fmtW: function (w) { return fmt(w.leucina, 0) + " mg" + (w.leucinaFonte === "estimada" ? " (estimada)" : ""); } },
    { chave: "custo100", melhor: "min", texto: "Proteína mais barata",
      val: function (w) { return w.custo100; }, fmt: function (v) { return fmtR(v) + " por 100 g"; } },
    { chave: "custoDose", melhor: "min", texto: "Porção mais barata",
      val: function (w) { return w.custoDose; }, fmt: function (v) { return fmtR(v); } },
    { chave: "precoKg", melhor: "min", texto: "Preço por kg menor",
      val: function (w) { return w.precoKg; }, fmt: function (v) { return fmtR(v) + "/kg"; } },
    { chave: "porcoes", melhor: "max", texto: "Mais porções por embalagem",
      val: function (w) { return Math.floor(w.porcoes); }, fmt: function (v) { return fmt(v, 0) + " porções"; } },
    { chave: "carb", melhor: "min", texto: "Menos carboidratos por porção",
      val: function (w) { return w.nutri.carb === undefined ? null : w.nutri.carb; }, fmt: function (v) { return fmtG(v); } },
    { chave: "nota", melhor: "max", texto: "Nota geral maior",
      val: function (w) { return w.notas.geral; }, fmt: function (v) { return fmt(v, 1); } }
  ];

  // Leucina estimada não decide vencedor: só compara quando os dois valores são do rótulo
  function leucinaIncerta(c, a, b) {
    return c.soRotulo && (a.leucinaFonte !== "rotulo" || b.leucinaFonte !== "rotulo");
  }

  function vence(c, a, b) {
    if (leucinaIncerta(c, a, b)) return null;
    var va = c.val(a), vb = c.val(b);
    if (va === null || vb === null || va === undefined || vb === undefined || va === vb) return null;
    if (c.melhor === "max") return va > vb ? 0 : 1;
    return va < vb ? 0 : 1;
  }

  function renderPorque(a, b) {
    var box = document.getElementById("porque");
    box.textContent = "";
    [a, b].forEach(function (w, i) {
      var outro = i === 0 ? b : a;
      var col = el("div", "porque__col porque__col--" + (i === 0 ? "a" : "b"));
      col.appendChild(el("h3", null, "Por que " + w.nome + " é melhor?"));
      var ul = el("ul");
      CRITERIOS.forEach(function (c) {
        if (vence(c, a, b) !== i) return;
        var li = el("li");
        li.appendChild(el("span", "porque__ok", "✓"));
        var t = el("span");
        t.appendChild(el("strong", null, c.texto));
        var fw = c.fmtW || function (x) { return c.fmt(c.val(x)); };
        t.appendChild(document.createTextNode(" " + fw(w) + " contra " + fw(outro)));
        li.appendChild(t);
        ul.appendChild(li);
      });
      if (!ul.children.length) {
        ul.appendChild(el("li", "porque__nada", "Não ganha em nenhum critério desta comparação."));
      }
      col.appendChild(ul);
      box.appendChild(col);
    });
  }

  /* ===== Barras critério a critério (A cresce para a esquerda, B para a direita) ===== */
  var BARRAS = [
    { rotulo: "Nota geral", melhor: "max", val: function (w) { return w.notas.geral; }, max: function () { return 10; },
      fmt: function (v) { return fmt(v, 1); } },
    { rotulo: "Proteína ÷ porção", melhor: "max", val: function (w) { return w.conc; }, max: function () { return 1; },
      fmt: function (v) { return fmt(v, 2); } },
    { rotulo: "Proteína por porção", melhor: "max", val: function (w) { return w.proteina; },
      fmt: function (v) { return fmtG(v); } },
    { rotulo: "Leucina por porção", melhor: "max", soRotulo: true, nota: "\"est.\" = estimada; sem vencedor quando um dos valores é estimado", val: function (w) { return w.leucina; },
      fmt: function (v) { return fmt(v, 0) + " mg"; },
      fmtW: function (w) { return fmt(w.leucina, 0) + " mg" + (w.leucinaFonte === "estimada" ? " (est.)" : ""); } },
    { rotulo: "Calorias por porção", melhor: "min", nota: "menos é melhor para dieta de corte", val: function (w) { return w.nutri.kcal === undefined ? null : w.nutri.kcal; },
      fmt: function (v) { return fmt(v, 0) + " kcal"; } },
    { rotulo: "Carboidratos por porção", melhor: "min", nota: "menos é melhor para dieta de corte", val: function (w) { return w.nutri.carb === undefined ? null : w.nutri.carb; },
      fmt: function (v) { return fmtG(v); } },
    { rotulo: "Porções por embalagem", melhor: "max", nota: "quantas porções do rótulo cabem no pote", val: function (w) { return Math.floor(w.porcoes); },
      fmt: function (v) { return fmt(v, 0) + " porções"; } },
    { rotulo: "Preço por kg do produto", melhor: "min", nota: "menor é melhor, compara potes de tamanhos diferentes", val: function (w) { return w.precoKg; },
      fmt: function (v) { return fmtR(v); } },
    { rotulo: "Custo por 100 g de proteína", melhor: "min", nota: "menor é melhor", val: function (w) { return w.custo100; },
      fmt: function (v) { return fmtR(v); } },
    { rotulo: "Custo por porção", melhor: "min", nota: "menor é melhor", val: function (w) { return w.custoDose; },
      fmt: function (v) { return fmtR(v); } }
  ];

  function renderBarras(a, b) {
    var box = document.getElementById("barras");
    box.textContent = "";

    var leg = el("div", "barras__legenda");
    [a, b].forEach(function (w, i) {
      var s = el("span", "barras__leg barras__leg--" + (i === 0 ? "a" : "b"));
      s.appendChild(el("i"));
      s.appendChild(document.createTextNode(w.marca + " " + w.nome));
      leg.appendChild(s);
    });
    box.appendChild(leg);

    BARRAS.forEach(function (m) {
      var va = m.val(a), vb = m.val(b);
      var temA = va !== null && va !== undefined, temB = vb !== null && vb !== undefined;
      var max = m.max ? m.max() : Math.max(temA ? va : 0, temB ? vb : 0) * 1.1 || 1;
      var ganhador = null;
      if (temA && temB && va !== vb && !leucinaIncerta(m, a, b)) ganhador = m.melhor === "max" ? (va > vb ? 0 : 1) : (va < vb ? 0 : 1);

      var linha = el("div", "barra");
      var cab = el("div", "barra__rot");
      cab.appendChild(el("span", null, m.rotulo));
      if (m.nota) cab.appendChild(el("small", null, m.nota));
      linha.appendChild(cab);

      var trilho = el("div", "barra__trilho");
      [[va, temA, "a", a], [vb, temB, "b", b]].forEach(function (p, i) {
        var lado = el("div", "barra__lado barra__lado--" + p[2] + (ganhador === i ? " barra__lado--ganha" : ""));
        var valor = el("span", "barra__valor", p[1] ? (m.fmtW ? m.fmtW(p[3]) : m.fmt(p[0])) : "sem dado");
        if (ganhador === i) valor.appendChild(el("span", "vence", "Melhor"));
        var fundo = el("span", "barra__fundo");
        var fill = el("span", "barra__fill");
        fill.style.width = p[1] ? Math.max(2, Math.min(100, (p[0] / max) * 100)) + "%" : "0";
        fundo.appendChild(fill);
        if (i === 0) { lado.appendChild(valor); lado.appendChild(fundo); }
        else { lado.appendChild(fundo); lado.appendChild(valor); }
        trilho.appendChild(lado);
      });
      linha.appendChild(trilho);
      box.appendChild(linha);
    });
  }

  /* ===== Tabela de detalhes + histórico ===== */
  var SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs) {
    var e = document.createElementNS(SVGNS, tag);
    Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  // Uma linha por loja (as mesmas lojas de "Onde comprar"), cada uma com sua cor e legenda
  function grafico(w) {
    var cores = CW.coresLojas(w.lojas || []);
    var series = (w.lojas || []).filter(function (l) { return l.historico && l.historico.length; })
      .map(function (l) { return { loja: l.loja, cor: cores[l.loja], tam: l.embalagem, pontos: l.historico, aPartir: !!l.aPartir }; });
    if (!series.length && w.historico && w.historico.length) {
      // sem lojas identificadas: uma série só, com o histórico geral
      series = [{ loja: (w.oferta && w.oferta.loja) || "Preço", cor: "#0B8BD6", tam: w.embalagem,
        pontos: w.historico.slice().sort(function (p, q) { return p.data < q.data ? -1 : 1; }) }];
    }
    var box = el("figure", "hist");
    if (!series.length) {
      box.appendChild(el("figcaption", "nd", "Ainda sem preço registrado."));
      return box;
    }
    var todos = [];
    series.forEach(function (s) { s.pontos.forEach(function (p) { todos.push({ s: s, data: p.data, valor: p.valor }); }); });
    var W = 240, H = 120, padX = 12, padTop = 12, padBot = 22;
    var valores = todos.map(function (p) { return p.valor; });
    var min = Math.min.apply(null, valores), max = Math.max.apply(null, valores);
    if (min === max) { min = min * 0.9; max = max * 1.1; }
    var datas = todos.map(function (p) { return p.data; }).sort();
    var d0 = datas[0], d1 = datas[datas.length - 1];
    var t0 = Date.parse(d0), t1 = Date.parse(d1);
    var umaData = t1 === t0; // todos os pontos no mesmo dia: evita divisão por zero
    function x(p) { return umaData ? W / 2 : padX + ((Date.parse(p.data) - t0) / (t1 - t0)) * (W - padX * 2); }
    function y(p) { return padTop + (1 - (p.valor - min) / (max - min)) * (H - padTop - padBot); }

    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, role: "img",
      "aria-label": "Histórico de preço de " + w.nome + " em " + series.length + (series.length > 1 ? " lojas" : " loja") });
    svg.appendChild(svgEl("line", { x1: 0, x2: W, y1: H - padBot, y2: H - padBot, class: "hist__base" }));
    series.forEach(function (s) {
      if (s.pontos.length > 1) {
        var d = s.pontos.map(function (p, i) { return (i ? "L" : "M") + x(p).toFixed(1) + " " + y(p).toFixed(1); }).join(" ");
        svg.appendChild(svgEl("path", { d: d, class: "hist__linha", style: "stroke:" + s.cor }));
      }
    });
    series.forEach(function (s) {
      s.pontos.forEach(function (p) {
        var c = svgEl("circle", { cx: x(p), cy: y(p), r: 3.6, class: "hist__ponto", style: "fill:" + s.cor });
        var t = svgEl("title", {});
        t.textContent = s.loja + ", " + CW.fmtData(p.data) + ": " + fmtR(p.valor);
        c.appendChild(t);
        svg.appendChild(c);
      });
    });
    var ini = svgEl("text", { x: umaData ? W / 2 : padX, y: H - 6, class: "hist__eixo", "text-anchor": umaData ? "middle" : "start" });
    ini.textContent = CW.fmtData(d0);
    svg.appendChild(ini);
    if (!umaData) {
      var fim = svgEl("text", { x: W - padX, y: H - 6, class: "hist__eixo", "text-anchor": "end" });
      fim.textContent = CW.fmtData(d1);
      svg.appendChild(fim);
    }
    box.appendChild(svg);

    var dica = el("div", "hist__dica");
    dica.hidden = true;
    box.appendChild(dica);
    svg.addEventListener("mousemove", function (ev) {
      var r = svg.getBoundingClientRect();
      var mx = ((ev.clientX - r.left) / r.width) * W, my = ((ev.clientY - r.top) / r.height) * H;
      var p = todos.reduce(function (a, b) {
        var da = Math.pow(x(a) - mx, 2) + Math.pow(y(a) - my, 2), db = Math.pow(x(b) - mx, 2) + Math.pow(y(b) - my, 2);
        return db < da ? b : a;
      });
      dica.textContent = p.s.loja + ", " + CW.fmtData(p.data) + ": " + fmtR(p.valor);
      dica.style.left = (x(p) / W) * 100 + "%";
      dica.hidden = false;
    });
    svg.addEventListener("mouseleave", function () { dica.hidden = true; });

    var leg = el("ul", "hist__legenda");
    series.forEach(function (s) {
      var li = el("li");
      var tr = el("span", "hist__traco");
      tr.style.background = s.cor;
      li.appendChild(tr);
      li.appendChild(document.createTextNode(s.loja + (mesmoTam(s.tam, w.embalagem) ? "" : " (" + CW.fmtPeso(s.tam) + ")") + (s.aPartir ? " (a partir de)" : "")));
      leg.appendChild(li);
    });
    box.appendChild(leg);

    var menor = todos.filter(function (p) { return mesmoTam(p.s.tam, w.embalagem) && !p.s.aPartir; })
      .reduce(function (a, b) { return !a || b.valor < a.valor ? b : a; }, null);
    box.appendChild(el("figcaption", "sub",
      umaData && todos.length <= series.length
        ? "Histórico começa em " + CW.fmtData(d0) + "."
        : menor ? "Menor preço: " + fmtR(menor.valor) + " " + CW.naLoja(menor.s.loja) + " em " + CW.fmtData(menor.data) : ""));
    return box;
  }

  function mesmoTam(a, b) { return Math.abs(a - b) <= 10; }

  var DETALHES = [
    ["Tipo", function (w) { return w.tipo; }],
    ["Porção", function (w) { return fmtG(w.porcao); }],
    ["Proteína por porção", function (w) { return fmtG(w.proteina); }],
    ["Leucina", function (w) { return CW.leucinaNode(w); }],
    ["Calorias por porção", function (w) { return nutriTxt(w.nutri.kcal, " kcal", 0); }],
    ["Carboidratos por porção", function (w) { return nutriTxt(w.nutri.carb, " g", 1); }],
    ["Açúcares por porção", function (w) { return nutriTxt(w.nutri.acucar, " g", 1); }],
    ["Gorduras por porção", function (w) { return nutriTxt(w.nutri.gord, " g", 1); }],
    ["Sódio por porção", function (w) { return nutriTxt(w.nutri.sodio, " mg", 0); }],
    ["Lactose", function (w) {
      return { contem: "Contém lactose", baixa: "Baixa (isolado/hidrolisado)", zero: "Zero lactose (declarado pela marca)" }[w.nutri.lactose] || "Não informado";
    }],
    ["Glúten", function (w) {
      var g = w.nutri.semGluten;
      var t = g === true ? "Não contém" : g === false ? "Contém" : g === "parcial" ? "Depende do sabor" : "Não informado";
      return w.nutri.notaGluten ? t + ". " + w.nutri.notaGluten : t;
    }],
    ["Adoçante", function (w) {
      var t = w.nutri.adocante || "Não confirmado";
      return w.nutri.notaAdocante ? t + ". " + w.nutri.notaAdocante : t;
    }],
    ["Sabores", function (w) { return (w.nutri.sabores || []).join(", ") || "Não informado"; }],
    ["Fonte da tabela", function (w) {
      if (!w.nutri.fonte) return "—";
      var a = el("a", null, new URL(w.nutri.fonte).hostname.replace(/^www\./, ""));
      a.href = w.nutri.fonte; a.target = "_blank"; a.rel = "noopener nofollow";
      var d = el("div");
      d.appendChild(a);
      if (w.nutri.notaFonte) d.appendChild(el("span", "sub", w.nutri.notaFonte));
      return d;
    }],
    ["Tamanho do pote", function (w) { return CW.fmtPeso(w.embalagem); }],
    ["Preço por kg", function (w) { return w.precoKg ? fmtR(w.precoKg) : "—"; }],
    ["Porções por embalagem", function (w) { return fmt(Math.floor(w.porcoes), 0) + " porções de " + fmtG(w.porcao); }],
    ["Preço de referência", function (w) {
      if (!w.preco) return "Sem preço verificado";
      var d = el("div");
      d.appendChild(el("span", "num forte", fmtR(w.preco)));
      d.appendChild(el("span", "sub", CW.naLoja(w.oferta.loja) + " em " + CW.fmtData(w.oferta.data)));
      return d;
    }],
    ["Histórico de preço", grafico]
  ];

  /* Qualidade e transparência: fatos com fonte, sem "aprovado/reprovado" */
  function linkFonte(f) {
    var a = el("a", null, f.titulo);
    a.href = f.url; a.target = "_blank"; a.rel = "noopener nofollow";
    return a;
  }
  function blocoTexto(titulo, texto, classe, fontes) {
    var d = el("div", "qual-cel" + (classe ? " qual-cel--" + classe : ""));
    d.appendChild(el("strong", null, titulo));
    if (texto) d.appendChild(el("span", "sub", texto));
    if (fontes && fontes.length) {
      var f = el("span", "qual-fontes");
      f.appendChild(document.createTextNode("Fontes: "));
      fontes.forEach(function (x, i) { if (i) f.appendChild(document.createTextNode("; ")); f.appendChild(linkFonte(x)); });
      d.appendChild(f);
    }
    return d;
  }
  var FQ = window.QUALIDADE_FONTES || {};
  var QUALIDADE_LINHAS = [
    ["Lista da Senacon (dez/2024)", function (w) {
      var q = w.qual;
      if (q.senacon === "produto") return blocoTexto("Este produto foi citado", q.senaconNota, "atencao", FQ.senacon);
      if (q.senacon === "marca") return blocoTexto("Este produto não foi citado", q.senaconNota, "neutro", FQ.senacon);
      return blocoTexto("Não citado", "Nem o produto nem a marca aparecem na lista.", "ok", FQ.senacon);
    }],
    ["Suspensões da ANVISA", function (w) {
      return w.qual.anvisa
        ? blocoTexto("Suspensão encontrada", w.qual.anvisa, "atencao", FQ.anvisa)
        : blocoTexto("Nenhuma encontrada", "Pesquisa em notícias e resoluções até " + CW.fmtData(window.QUALIDADE_DATA) + ".", "ok");
    }],
    ["Certificação independente", function (w) {
      var c = w.qual.certificacao;
      return c
        ? blocoTexto(c.nome, c.nota, "ok", [{ titulo: c.nome, url: c.fonte }])
        : blocoTexto("Nenhuma encontrada", "Sem certificação de terceiros (Informed Choice, Informed Sport, NSF) localizada.", "neutro");
    }],
    ["Ingredientes", function (w) {
      var q = w.qual;
      if (q.ingredientes === "alerta") return blocoTexto("Ponto de atenção", q.ingredientesNota, "atencao");
      if (q.ingredientes === "ok") return blocoTexto("Sem aminoácidos livres adicionados", q.ingredientesNota, "ok");
      return blocoTexto("Lista não verificada", "Não encontramos a lista completa de ingredientes em fonte confiável.", "neutro");
    }]
  ];

  function renderQualidade(a, b) {
    var t = document.getElementById("qualidade");
    if (!t) return;
    t.textContent = "";
    var thead = el("thead");
    var tr = el("tr");
    var canto = el("th", "cmp-tabela__canto");
    canto.appendChild(el("span", "sr", "Critério"));
    tr.appendChild(canto);
    [a, b].forEach(function (w, i) {
      var th = el("th", "cmp-col cmp-col--" + (i === 0 ? "a" : "b"), w.nome);
      th.scope = "col";
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    t.appendChild(thead);
    var tbody = el("tbody");
    QUALIDADE_LINHAS.forEach(function (d) {
      var linha = el("tr");
      var th = el("th", "cmp-rot", d[0]);
      th.scope = "row";
      linha.appendChild(th);
      [a, b].forEach(function (w) {
        var td = el("td");
        td.appendChild(d[1](w));
        linha.appendChild(td);
      });
      tbody.appendChild(linha);
    });
    t.appendChild(tbody);
  }

  function nutriTxt(v, unidade, casas) {
    return v === null || v === undefined ? "Não encontrado" : fmt(v, casas) + unidade;
  }

  function renderDetalhes(a, b) {
    var t = document.getElementById("detalhes");
    t.textContent = "";
    var thead = el("thead");
    var tr = el("tr");
    var canto = el("th", "cmp-tabela__canto");
    canto.appendChild(el("span", "sr", "Critério"));
    tr.appendChild(canto);
    [a, b].forEach(function (w, i) {
      var th = el("th", "cmp-col cmp-col--" + (i === 0 ? "a" : "b"), w.nome);
      th.scope = "col";
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    t.appendChild(thead);
    var tbody = el("tbody");
    DETALHES.forEach(function (d) {
      var linha = el("tr");
      var th = el("th", "cmp-rot", d[0]);
      th.scope = "row";
      linha.appendChild(th);
      [a, b].forEach(function (w) {
        var td = el("td");
        var v = d[1](w);
        td.appendChild(typeof v === "string" ? document.createTextNode(v) : v);
        linha.appendChild(td);
      });
      tbody.appendChild(linha);
    });
    t.appendChild(tbody);
  }

  /* ===== Janela de escolha ===== */
  var dialogo = document.getElementById("seletor");
  var buscaSel = document.getElementById("seletor-busca");

  function abrirSeletor(i) {
    ladoEscolhendo = i;
    buscaSel.value = "";
    renderSeletor();
    if (dialogo.showModal) dialogo.showModal(); else dialogo.setAttribute("open", "");
    buscaSel.focus();
  }
  function fecharSeletor() { if (dialogo.close) dialogo.close(); else dialogo.removeAttribute("open"); }

  function renderSeletor() {
    var ul = document.getElementById("seletor-lista");
    ul.textContent = "";
    var outro = lados[ladoEscolhendo === 0 ? 1 : 0];
    var termo = CW.semAcento(buscaSel.value.trim());
    var lista = dados.filter(function (w) {
      if (outro && w.id === outro.id) return false;
      var alvo = CW.semAcento(w.marca + " " + w.nome + " " + w.tipo);
      return !termo || termo.split(/\s+/).every(function (p) { return alvo.indexOf(p) !== -1; });
    }).sort(function (a, b) { return (a.marca + a.nome).localeCompare(b.marca + b.nome, "pt-BR"); });

    if (!lista.length) {
      ul.appendChild(el("li", "seletor__vazio", "Nenhum whey encontrado com esse nome."));
      return;
    }
    lista.forEach(function (w) {
      var li = el("li");
      var b = el("button", "seletor__item");
      b.type = "button";
      b.appendChild(CW.miniatura(w, "seletor__foto") || el("span", "seletor__foto"));
      var info = el("span", "seletor__info");
      info.appendChild(el("span", "card__marca", w.marca));
      info.appendChild(el("strong", null, w.nome));
      b.appendChild(info);
      var met = el("span", "seletor__met");
      met.appendChild(el("span", "seletor__conc", fmt(w.conc, 2)));
      met.appendChild(CW.selo(w.classe));
      b.appendChild(met);
      b.appendChild(el("span", "seletor__preco", w.preco ? fmtR(w.preco) : "—"));
      b.addEventListener("click", function () {
        lados[ladoEscolhendo] = w;
        salvarUrl();
        fecharSeletor();
        render();
      });
      li.appendChild(b);
      ul.appendChild(li);
    });
  }

  buscaSel.addEventListener("input", renderSeletor);
  document.getElementById("seletor-fechar").addEventListener("click", fecharSeletor);
  dialogo.addEventListener("click", function (e) { if (e.target === dialogo) fecharSeletor(); });

  /* ===== Avaliações dos visitantes ===== */
  var PALAVROES = ["porra", "caralho", "merda", "puta", "fdp", "viado", "buceta", "arrombado", "otario", "vagabundo", "desgracado"];
  function temPalavrao(texto) {
    var t = " " + CW.semAcento(texto).replace(/[^a-z0-9]+/g, " ") + " ";
    return PALAVROES.some(function (p) { return t.indexOf(" " + p + " ") !== -1; });
  }
  function jaAvaliou(id) { try { return localStorage.getItem("cw-avaliou-" + id) === "1"; } catch (e) { return false; } }
  function marcarAvaliou(id) { try { localStorage.setItem("cw-avaliou-" + id, "1"); } catch (e) { /* sem armazenamento */ } }

  function dataCurta(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  function formulario(w, aoEnviar) {
    var f = el("form", "aval-form");
    f.noValidate = true;
    f.appendChild(el("h4", null, "Avaliar este whey"));

    var fs = el("fieldset", "aval-nota");
    fs.appendChild(el("legend", null, "Sua nota"));
    var labels = [];
    var nota = 0;
    function pintar(n) { labels.forEach(function (l, i) { l.classList.toggle("on", i < n); }); }
    for (var i = 1; i <= 5; i++) {
      (function (v) {
        var lab = el("label", "aval-nota__estrela");
        var inp = el("input");
        inp.type = "radio"; inp.name = "estrelas-" + w.id; inp.value = String(v);
        inp.className = "sr";
        inp.addEventListener("change", function () { nota = v; pintar(v); });
        lab.appendChild(inp);
        lab.appendChild(el("span", null, "★"));
        lab.appendChild(el("span", "sr", v + (v === 1 ? " estrela" : " estrelas")));
        lab.addEventListener("mouseenter", function () { pintar(v); });
        lab.addEventListener("mouseleave", function () { pintar(nota); });
        labels.push(lab);
        fs.appendChild(lab);
      })(i);
    }
    f.appendChild(fs);

    var lNome = el("label", "aval-campo");
    lNome.appendChild(el("span", null, "Seu nome"));
    var nome = el("input");
    nome.type = "text"; nome.maxLength = 40; nome.autocomplete = "given-name";
    lNome.appendChild(nome);
    f.appendChild(lNome);

    // Tags rápidas (opcional)
    var escolhidas = [];
    var tagsBox = el("fieldset", "aval-tags");
    tagsBox.appendChild(el("legend", null, "Destaques (opcional)"));
    Object.keys(CW.avaliacoes.TAGS).forEach(function (k) {
      var b = el("button", "aval-tag", CW.avaliacoes.TAGS[k]);
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        var i = escolhidas.indexOf(k);
        if (i === -1) escolhidas.push(k); else escolhidas.splice(i, 1);
        b.setAttribute("aria-pressed", i === -1 ? "true" : "false");
      });
      tagsBox.appendChild(b);
    });
    f.appendChild(tagsBox);

    var lCom = el("label", "aval-campo");
    lCom.appendChild(el("span", null, "Comentário (opcional)"));
    var com = el("textarea");
    com.maxLength = 600; com.rows = 3;
    com.placeholder = "Sabor, dissolução, se faria a compra de novo…";
    lCom.appendChild(com);
    f.appendChild(lCom);

    // Campo invisível para pegar robôs de spam
    var hp = el("input", "aval-hp");
    hp.type = "text"; hp.tabIndex = -1; hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    f.appendChild(hp);

    f.appendChild(el("p", "aval-aviso", "Seu nome e seu comentário ficam visíveis para todos os visitantes."));

    var btn = el("button", "botao", "Enviar avaliação");
    btn.type = "submit";
    f.appendChild(btn);
    var msg = el("p", "aval-msg");
    msg.setAttribute("aria-live", "polite");
    f.appendChild(msg);

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.className = "aval-msg aval-msg--erro";
      if (hp.value) return;
      if (!nota) { msg.textContent = "Escolha de 1 a 5 estrelas."; return; }
      var n = nome.value.trim(), c = com.value.trim();
      if (n.length < 2) { msg.textContent = "Escreva seu nome (pelo menos 2 letras)."; nome.focus(); return; }
      if (temPalavrao(n + " " + c)) { msg.textContent = "Revise o texto: ele tem palavras que não publicamos."; return; }
      btn.disabled = true;
      btn.textContent = "Enviando…";
      CW.avaliacoes.enviar({ whey_id: w.id, estrelas: nota, nome: n, comentario: c || null, tags: escolhidas.slice() })
        .then(function () {
          marcarAvaliou(w.id);
          aoEnviar();
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = "Enviar avaliação";
          msg.textContent = "Não foi possível enviar agora. Tente de novo em instantes.";
        });
    });
    return f;
  }

  function colunaAvaliacoes(w, lado) {
    var col = el("div", "aval-col aval-col--" + lado);
    var cab = el("div", "aval-col__cab");
    cab.appendChild(el("h3", null, w.nome));
    var r = CW.avaliacoes.resumoDe(w.id);
    cab.appendChild(CW.estrelas(r ? r.media : 0, r ? r.total : 0));
    col.appendChild(cab);

    if (jaAvaliou(w.id)) {
      col.appendChild(el("p", "aval-obrigado", "Obrigado! Você já avaliou este whey neste aparelho."));
    } else {
      col.appendChild(formulario(w, function () {
        CW.avaliacoes.recarregarResumo().catch(function () {}).then(render);
      }));
    }

    var lista = el("ul", "aval-lista");
    lista.appendChild(el("li", "aval-carregando", "Carregando avaliações…"));
    col.appendChild(lista);
    CW.avaliacoes.listar(w.id).then(function (itens) {
      lista.textContent = "";
      if (!itens || !itens.length) {
        lista.appendChild(el("li", "aval-vazio", "Ninguém avaliou ainda. Seja o primeiro."));
        return;
      }
      // Resumo dos destaques mais citados
      var contagem = {};
      itens.forEach(function (it) { (it.tags || []).forEach(function (t) { contagem[t] = (contagem[t] || 0) + 1; }); });
      var top = Object.keys(contagem).filter(function (t) { return CW.avaliacoes.TAGS[t]; })
        .sort(function (a, b) { return contagem[b] - contagem[a]; }).slice(0, 4);
      if (top.length) {
        var resumoTags = el("li", "aval-resumo-tags");
        resumoTags.appendChild(el("span", "aval-resumo-tags__rot", "Mais citados:"));
        top.forEach(function (t) {
          resumoTags.appendChild(el("span", "aval-tag aval-tag--fixa", CW.avaliacoes.TAGS[t] + " (" + contagem[t] + ")"));
        });
        lista.appendChild(resumoTags);
      }
      itens.forEach(function (it) {
        var li = el("li", "aval-item");
        var topo = el("div", "aval-item__topo");
        topo.appendChild(CW.estrelas(it.estrelas, 1, true));
        topo.appendChild(el("strong", null, it.nome));
        topo.appendChild(el("span", "aval-item__data", dataCurta(it.criado_em)));
        li.appendChild(topo);
        if (it.comentario) li.appendChild(el("p", null, it.comentario));
        var tg = (it.tags || []).filter(function (t) { return CW.avaliacoes.TAGS[t]; });
        if (tg.length) {
          var tbox = el("div", "aval-item__tags");
          tg.forEach(function (t) { tbox.appendChild(el("span", "aval-tag aval-tag--fixa", CW.avaliacoes.TAGS[t])); });
          li.appendChild(tbox);
        }
        lista.appendChild(li);
      });
    }).catch(function () {
      lista.textContent = "";
      lista.appendChild(el("li", "aval-vazio", "Não foi possível carregar as avaliações agora."));
    });
    return col;
  }

  function renderAvaliacoes() {
    var sec = document.getElementById("avaliacoes");
    var grade = document.getElementById("aval-grade");
    grade.textContent = "";
    var ativos = [[lados[0], "a"], [lados[1], "b"]].filter(function (p) { return p[0]; });
    sec.hidden = ativos.length === 0;
    grade.classList.toggle("aval-grade--uma", ativos.length === 1);
    ativos.forEach(function (p) { grade.appendChild(colunaAvaliacoes(p[0], p[1])); });
  }

  /* ===== Render geral ===== */
  function render() {
    var vs = document.getElementById("vs");
    vs.textContent = "";
    vs.appendChild(cartaoLado(0));
    vs.appendChild(el("div", "vs__x", "VS"));
    vs.appendChild(cartaoLado(1));

    var a = lados[0], b = lados[1];
    var titulo = document.getElementById("vs-titulo");
    var sub = document.getElementById("vs-sub");
    var resultado = document.getElementById("vs-resultado");
    if (a && b) {
      titulo.textContent = a.nome + " x " + b.nome;
      sub.textContent = "Veja onde cada um ganha. Copie o endereço desta página para compartilhar a comparação.";
      resultado.hidden = false;
      renderPorque(a, b);
      renderBarras(a, b);
      renderDetalhes(a, b);
      renderQualidade(a, b);
      document.title = a.nome + " x " + b.nome + " | Compara Whey";
    } else {
      titulo.textContent = "Comparar wheys";
      sub.textContent = (a || b)
        ? "Agora escolha o segundo whey no espaço vazio."
        : "Escolha dois wheys para ver qual é melhor em cada critério.";
      resultado.hidden = true;
      document.title = "Comparar wheys | Compara Whey";
    }
    renderAvaliacoes();
  }

  var ancora = location.hash;
  salvarUrl();
  render();
  if (ancora === "#avaliacoes") {
    history.replaceState(null, "", location.pathname + location.search + ancora);
    setTimeout(function () { document.getElementById("avaliacoes").scrollIntoView({ behavior: "smooth" }); }, 500);
  }
});
