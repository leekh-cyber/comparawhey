window.CW.pronto.then(function () {
  "use strict";

  var CW = window.CW;
  var el = CW.el, fmt = CW.fmt, fmtG = CW.fmtG, fmtR = CW.fmtR;
  var dados = CW.dados;
  /* "Comparar +" abre a página VS com este whey de um lado e o outro lado vazio para escolher */
  function botaoComparar(w) {
    var a = el("a", "cmp-btn", "Comparar");
    a.href = "/comparar.html?w=" + w.id;
    a.setAttribute("aria-label", "Comparar " + w.marca + " " + w.nome + " com outro whey");
    a.appendChild(el("span", "cmp-btn__mais", "+"));
    return a;
  }

  // Estrelas dos visitantes, com link para ler e escrever avaliações na página do whey
  function linkAvaliacoes(w) {
    var r = CW.avaliacoes.resumoDe(w.id);
    var a = el("a", "aval-link");
    a.href = "/comparar.html?w=" + w.id + "#avaliacoes";
    a.appendChild(CW.estrelas(r ? r.media : 0, r ? r.total : 0, true));
    if (!r) a.appendChild(el("span", "aval-link__cta", "Avaliar"));
    return a;
  }

  /* Rankings */
  var RANKINGS = {
    proteina: {
      filtro: function () { return true; },
      ordem: function (a, b) { return b.conc - a.conc || (b.leucina || 0) - (a.leucina || 0); },
      destaque: function (w) { return { valor: fmt(w.conc, 2), rotulo: "proteína ÷ porção" }; }
    },
    custo: {
      filtro: function (w) { return w.custo100 !== null && w.conc >= 0.7; },
      ordem: function (a, b) { return a.custo100 - b.custo100; },
      destaque: function (w) { return { valor: fmtR(w.custo100), rotulo: "por 100 g de proteína" }; }
    },
    leucina: {
      // Só valores informados no rótulo: estimativa não disputa o ranking
      filtro: function (w) { return w.leucina !== null && w.leucinaFonte === "rotulo"; },
      ordem: function (a, b) { return b.leucina - a.leucina; },
      destaque: function (w) { return { valor: fmt(w.leucina, 0), rotulo: "mg de leucina" }; }
    },
    nota: {
      filtro: function (w) { return w.notas.geral !== null; },
      ordem: function (a, b) { return b.notas.geral - a.notas.geral; },
      destaque: function (w) { return { valor: fmt(w.notas.geral, 1), rotulo: "nota de 0 a 10" }; }
    }
  };

  var NOTAS_RANKING = {
    proteina: "Ordenados pela concentração. Em caso de empate, vence quem tem mais leucina.",
    custo: "Quanto você paga por 100 g de proteína pura. Só entram wheys classificados como Bom ou Muito bom.",
    leucina: "Mais leucina por porção, só com valores informados no rótulo. Acima de 2.000 mg é o recomendado para hipertrofia.",
    nota: "Combina pureza, leucina e custo-benefício. Veja a conta em Como avaliamos."
  };

  function renderTop(chave) {
    var ol = document.getElementById("top5");
    var r = RANKINGS[chave];
    ol.textContent = "";
    document.getElementById("top-nota").textContent = NOTAS_RANKING[chave];

    dados.filter(r.filtro).sort(r.ordem).slice(0, 5).forEach(function (w, i) {
      var li = el("li", "card");

      var topo = el("div", "card__topo");
      topo.appendChild(el("span", "card__pos", (i + 1) + "º"));
      topo.appendChild(CW.selo(w.classe));
      li.appendChild(topo);

      li.appendChild(CW.pote(w));

      li.appendChild(el("span", "card__marca", w.marca));
      var a = el("a", "card__nome", w.nome);
      a.href = "/comparar.html?w=" + w.id;
      li.appendChild(a);
      li.appendChild(linkAvaliacoes(w));
      var etiquetas = el("div", "card__etiquetas");
      etiquetas.appendChild(el("span", "card__tipo", w.tipo));
      var dieta = CW.chipsDieta(w);
      if (dieta) etiquetas.appendChild(dieta);
      li.appendChild(etiquetas);
      var qualC = CW.chipsQualidade(w);
      if (qualC) li.appendChild(qualC);

      var d = r.destaque(w);
      var met = el("div", "card__metrica");
      met.appendChild(el("span", "card__valor", d.valor));
      met.appendChild(el("span", "card__rotulo", d.rotulo));
      li.appendChild(met);

      var dl = el("dl", "card__dados");
      function dado(rot, node) {
        var div = el("div");
        div.appendChild(el("dt", null, rot));
        var dd = el("dd");
        dd.appendChild(typeof node === "string" ? document.createTextNode(node) : node);
        div.appendChild(dd);
        dl.appendChild(div);
      }
      dado("Proteína", fmtG(w.proteina) + " em " + fmtG(w.porcao));
      dado("Leucina", CW.leucinaNode(w));
      dado("Custo/100 g prot.", w.custo100 ? fmtR(w.custo100) : "—");
      if (w.nutri.kcal !== undefined && w.nutri.kcal !== null) {
        dado("Calorias/porção", fmt(w.nutri.kcal, 0) + " kcal");
      }
      li.appendChild(dl);

      var preco = el("div", "card__preco");
      if (w.preco) {
        var sp = CW.seloPreco(w);
        if (sp) preco.appendChild(sp);
        preco.appendChild(el("span", "card__preco-valor", fmtR(w.preco)));
        preco.appendChild(el("span", "card__preco-sub", CW.textoPorcoes(w) + " " + CW.naLoja(w.oferta.loja)));
        preco.appendChild(el("span", "card__preco-sub card__preco-data", CW.textoAtualizado(w)));
      } else {
        preco.appendChild(el("span", "card__preco-sub", "Sem preço verificado"));
      }
      li.appendChild(preco);

      var acoes = el("div", "card__acoes");
      acoes.appendChild(CW.botaoLoja(w, "Ver na loja"));
      acoes.appendChild(botaoComparar(w));
      li.appendChild(acoes);

      ol.appendChild(li);
    });
  }

  function ligarAbas() {
    var abas = document.querySelectorAll("[data-ranking]");
    abas.forEach(function (aba) {
      aba.addEventListener("click", function () {
        abas.forEach(function (a) { a.setAttribute("aria-selected", a === aba ? "true" : "false"); });
        renderTop(aba.getAttribute("data-ranking"));
      });
    });
    // Links do menu que abrem um ranking específico
    document.querySelectorAll("[data-ir-ranking]").forEach(function (link) {
      link.addEventListener("click", function () {
        var aba = document.querySelector('[data-ranking="' + link.getAttribute("data-ir-ranking") + '"]');
        if (aba) aba.click();
      });
    });
  }

  /* Lista completa */
  var estado = { busca: "", classe: "todas", tipo: "todos", leucina: false, lactose: false, gluten: false, carb: false, ordem: "nota" };

  // No celular a lista mostra 10 wheys por vez (botão "Mostrar mais"); no computador, todos
  var CELULAR = window.matchMedia("(max-width: 680px)");
  var PASSO = 10;
  estado.mostrar = PASSO;
  // Avisa quando a tela cruza o limite celular/computador (o evento "change" do matchMedia
  // nem sempre dispara ao redimensionar; o resize cobre esse caso)
  function aoMudarTela(fn) {
    var antes = CELULAR.matches;
    function checar() { if (CELULAR.matches !== antes) { antes = CELULAR.matches; fn(); } }
    CELULAR.addEventListener("change", checar);
    window.addEventListener("resize", checar);
  }

  function ordenar(lista) {
    var c = lista.slice();
    var o = estado.ordem;
    c.sort(function (a, b) {
      if (o === "conc") return b.conc - a.conc || (b.leucina || 0) - (a.leucina || 0);
      if (o === "leucina") {
        // valor do rótulo vem antes da estimativa, como no ranking dos 5 melhores
        var ra = a.leucinaFonte === "rotulo" ? 1 : 0, rb = b.leucinaFonte === "rotulo" ? 1 : 0;
        return rb - ra || (b.leucina || 0) - (a.leucina || 0);
      }
      if (o === "custo") {
        if (a.custo100 === null) return 1;
        if (b.custo100 === null) return -1;
        return a.custo100 - b.custo100;
      }
      if (o === "kcal" || o === "carb") {
        var va = a.nutri[o], vb = b.nutri[o];
        var na = va === null || va === undefined, nb = vb === null || vb === undefined;
        if (na || nb) return na === nb ? 0 : (na ? 1 : -1);
        return va - vb;
      }
      if (o === "nome") return (a.marca + a.nome).localeCompare(b.marca + b.nome, "pt-BR");
      if (a.notas.geral === null) return b.notas.geral === null ? b.conc - a.conc : 1;
      if (b.notas.geral === null) return -1;
      return b.notas.geral - a.notas.geral;
    });
    return c;
  }

  function celPreco(w) {
    var td = el("td", "c-preco");
    td.setAttribute("data-label", "Preço");
    if (!w.preco) {
      td.appendChild(el("span", "c-preco__nd", "Sem preço verificado"));
      return td;
    }
    var sp = CW.seloPreco(w);
    if (sp) td.appendChild(sp);
    td.appendChild(el("span", "c-preco__valor", fmtR(w.preco)));
    td.appendChild(el("span", "c-preco__sub", CW.textoOferta(w)));
    td.appendChild(el("span", "c-preco__sub", fmtR(w.precoKg) + " por kg"));
    td.appendChild(el("span", "c-preco__sub", fmtR(w.custo100) + " por 100 g de proteína"));
    td.appendChild(el("span", "c-preco__sub", fmtR(w.custoDose) + " por porção"));
    return td;
  }

  // manter = true só quando o próprio botão "Mostrar mais" pede; qualquer filtro volta para os 10 primeiros
  function renderLista(manter) {
    if (manter !== true) estado.mostrar = PASSO;
    var tbody = document.getElementById("lista-corpo");
    var vazio = document.getElementById("lista-vazia");
    var contagem = document.getElementById("lista-contagem");

    var termo = CW.semAcento(estado.busca.trim());
    var filtrados = dados.filter(function (w) {
      var alvo = CW.semAcento(w.marca + " " + w.nome + " " + w.tipo);
      var passaBusca = !termo || termo.split(/\s+/).every(function (p) { return alvo.indexOf(p) !== -1; });
      var passaClasse = estado.classe === "todas" || w.classe === estado.classe;
      var passaTipo = estado.tipo === "todos" || w.tipo === estado.tipo;
      var passaLeu = !estado.leucina || w.leucinaOk;
      var passaLac = !estado.lactose || w.nutri.lactose === "zero" || w.nutri.lactose === "baixa";
      var passaGlu = !estado.gluten || w.nutri.semGluten === true;
      var passaCarb = !estado.carb || (w.nutri.carb !== null && w.nutri.carb !== undefined && w.nutri.carb <= 3);
      return passaBusca && passaClasse && passaTipo && passaLeu && passaLac && passaGlu && passaCarb;
    });

    var lista = ordenar(filtrados);
    var limite = CELULAR.matches ? estado.mostrar : lista.length;
    tbody.textContent = "";

    lista.slice(0, limite).forEach(function (w) {
      var tr = el("tr");

      var tdNome = el("td", "c-nome");
      var mini = CW.miniatura(w, "c-nome__foto");
      if (mini) tdNome.appendChild(mini);
      tdNome.appendChild(el("span", "c-nome__marca", w.marca));
      var a = el("a", "c-nome__prod", w.nome);
      a.href = "/comparar.html?w=" + w.id;
      tdNome.appendChild(a);
      tdNome.appendChild(linkAvaliacoes(w));
      var etq = el("div", "c-nome__etq");
      etq.appendChild(el("span", "c-nome__tipo", w.tipo));
      var dieta = CW.chipsDieta(w);
      if (dieta) etq.appendChild(dieta);
      tdNome.appendChild(etq);
      var qualL = CW.chipsQualidade(w);
      if (qualL) tdNome.appendChild(qualL);
      tr.appendChild(tdNome);

      var tdC = el("td", "c-conc");
      tdC.setAttribute("data-label", "Proteína ÷ porção");
      var cw = el("div", "c-conc__wrap");
      cw.appendChild(el("span", "c-conc__num", fmt(w.conc, 2)));
      cw.appendChild(CW.selo(w.classe));
      tdC.appendChild(cw);
      tdC.appendChild(CW.medidor(w.conc));
      tdC.appendChild(el("span", "c-conc__sub", fmtG(w.proteina) + " em " + fmtG(w.porcao)));
      tr.appendChild(tdC);

      var tdL = el("td", "c-leu");
      tdL.setAttribute("data-label", "Leucina");
      tdL.appendChild(CW.leucinaNode(w));
      tr.appendChild(tdL);

      tr.appendChild(celPreco(w));

      var tdN = el("td", "c-nota");
      tdN.setAttribute("data-label", "Nota");
      tdN.appendChild(CW.nota(w.notas.geral));
      tr.appendChild(tdN);

      var tdA = el("td", "c-acoes");
      tdA.appendChild(CW.botaoLoja(w, "Ver na loja"));
      tdA.appendChild(botaoComparar(w));
      tr.appendChild(tdA);

      tbody.appendChild(tr);
    });

    vazio.hidden = lista.length !== 0;
    tbody.closest(".tabela-wrap").hidden = lista.length === 0;
    contagem.textContent = lista.length === 1 ? "1 whey encontrado" : lista.length + " wheys encontrados";

    var mais = document.getElementById("lista-mais");
    var faltam = lista.length - limite;
    mais.hidden = faltam <= 0;
    if (faltam > 0) {
      contagem.textContent = "Mostrando " + limite + " de " + lista.length + " wheys";
      mais.textContent = "Mostrar mais " + Math.min(PASSO, faltam) + " (faltam " + faltam + ")";
    }
  }

  function ligarMostrarMais() {
    var mais = document.getElementById("lista-mais");
    mais.addEventListener("click", function () {
      var antes = document.querySelectorAll("#lista-corpo tr").length;
      estado.mostrar += PASSO;
      renderLista(true);
      // leva o foco para o primeiro whey novo (quem usa leitor de tela não se perde)
      var novo = document.querySelectorAll("#lista-corpo tr")[antes];
      var link = novo && novo.querySelector(".c-nome__prod");
      if (link) link.focus({ preventScroll: true });
    });
    aoMudarTela(function () { renderLista(true); });
  }

  // No celular a calculadora sai do topo e vai para depois do ranking, para o ranking aparecer antes
  function posicionarCalculadora() {
    var calc = document.getElementById("calcular");
    var movel = document.getElementById("calc-movel");
    var hero = document.querySelector(".hero");
    function aplicar() {
      if (CELULAR.matches) {
        if (calc.parentNode !== movel) movel.appendChild(calc);
        movel.hidden = false;
      } else {
        if (calc.parentNode !== hero) hero.appendChild(calc);
        movel.hidden = true;
      }
    }
    aplicar();
    aoMudarTela(aplicar);
  }

  function ligarFiltros() {
    var busca = document.getElementById("busca");
    var ordem = document.getElementById("ordem");
    var tipo = document.getElementById("tipo");
    var leu = document.getElementById("so-leucina");
    var chips = document.querySelectorAll("[data-classe]");

    // Tipos vêm dos dados, para a lista crescer sozinha
    var tipos = dados.map(function (w) { return w.tipo; })
      .filter(function (t, i, arr) { return arr.indexOf(t) === i; }).sort();
    tipos.forEach(function (t) {
      var o = el("option", null, t);
      o.value = t;
      tipo.appendChild(o);
    });

    busca.addEventListener("input", function () { estado.busca = busca.value; renderLista(); });
    ordem.addEventListener("change", function () { estado.ordem = ordem.value; renderLista(); });
    tipo.addEventListener("change", function () { estado.tipo = tipo.value; renderLista(); });
    leu.addEventListener("change", function () { estado.leucina = leu.checked; renderLista(); });
    [["so-lactose", "lactose"], ["so-gluten", "gluten"], ["so-carb", "carb"]].forEach(function (p) {
      var cx = document.getElementById(p[0]);
      cx.addEventListener("change", function () { estado[p[1]] = cx.checked; renderLista(); });
    });
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        estado.classe = chip.getAttribute("data-classe");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        renderLista();
      });
    });

    document.getElementById("ir-calc").addEventListener("click", function () {
      var nome = document.getElementById("calc-nome");
      if (busca.value.trim()) nome.value = busca.value.trim();
      document.getElementById("calcular").scrollIntoView({ behavior: "smooth" });
      document.getElementById("calc-porcao").focus({ preventScroll: true });
    });
  }

  /* Calculadora para qualquer whey */
  function ligarCalculadora() {
    var form = document.getElementById("calc");
    var porcao = document.getElementById("calc-porcao");
    var prot = document.getElementById("calc-proteina");
    var leu = document.getElementById("calc-leucina");
    var saida = document.getElementById("calc-resultado");

    // Aceita o formato brasileiro: "2.600" = dois mil e seiscentos, "30,5" = trinta e meio
    function num(input) {
      var s = String(input.value).trim().replace(/\s/g, "");
      if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "");
      s = s.replace(",", ".");
      var v = parseFloat(s);
      return isNaN(v) ? null : v;
    }

    function atualizar() {
      var p = num(porcao), pr = num(prot), l = num(leu);
      saida.textContent = "";

      if (p === null || pr === null) {
        saida.appendChild(el("p", "calc__dica",
          "Preencha a porção e a proteína, como aparecem na tabela nutricional do pote."));
        return;
      }
      if (p <= 0 || pr <= 0 || (l !== null && l < 0)) {
        saida.appendChild(el("p", "calc__erro", "Use apenas números maiores que zero, como no rótulo."));
        return;
      }
      if (pr > p) {
        saida.appendChild(el("p", "calc__erro",
          "A proteína não pode ser maior que a porção. Confira os valores do rótulo."));
        return;
      }

      var c = CW.concentracao(pr, p);
      var linha = el("div", "calc__linha");
      linha.appendChild(el("span", "calc__conc", fmt(c, 2)));
      linha.appendChild(CW.selo(CW.classificar(c)));
      saida.appendChild(linha);
      saida.appendChild(CW.medidor(c));
      saida.appendChild(el("p", "calc__expl", fmt(Math.round(c * 100), 0) + "% da porção é proteína."));

      if (l !== null) {
        var ok = l > CW.LEUCINA_META;
        saida.appendChild(el("p", ok ? "calc__leu calc__leu--ok" : "calc__leu calc__leu--baixo",
          ok
            ? fmt(l, 0) + " mg de leucina: acima de 2.000 mg, adequado para hipertrofia."
            : fmt(l, 0) + " mg de leucina: abaixo de 2.000 mg por porção."));
      }
    }

    form.addEventListener("input", atualizar);
    form.addEventListener("submit", function (e) { e.preventDefault(); atualizar(); });
    atualizar();
  }

  // Busca do cabeçalho: filtra a lista e leva até ela. Também aceita ?q= vindo de outras páginas.
  function ligarBuscaTopo() {
    var form = document.getElementById("busca-topo");
    var campo = document.getElementById("busca-topo-campo");
    var busca = document.getElementById("busca");
    function aplicar(texto, rolar) {
      busca.value = texto;
      estado.busca = texto;
      renderLista();
      if (rolar) document.getElementById("lista").scrollIntoView({ behavior: "smooth" });
    }
    campo.addEventListener("input", function () { aplicar(campo.value, false); });
    form.addEventListener("submit", function (e) { e.preventDefault(); aplicar(campo.value, true); });
    var q = new URLSearchParams(location.search).get("q");
    if (q) { campo.value = q; aplicar(q, true); }
  }

  document.getElementById("total-wheys").textContent = dados.length;
  posicionarCalculadora();
  ligarAbas();
  renderTop("proteina");
  ligarFiltros();
  ligarMostrarMais();
  renderLista();
  ligarCalculadora();
  ligarBuscaTopo();
});
