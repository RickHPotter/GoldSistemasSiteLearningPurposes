function carregarPadroesRelatorio(idmenu) {


    // Faturamento
        if (Number(idmenu) == 4) {
            buscarDadoUnico("select to_char(trunc(sysdate,'MM'), 'dd/mm/yyyy') RETORNO from dual", "dtIniFat", "value");
            dataAtualFormatada('dtFimFat', 'value');
            document.getElementById("codfilialFat").value = getCookie('ccwCodFilial');
            document.getElementById("btnAttFat").removeAttribute("disabled");
        }
    // Pedidos
        if (Number(idmenu) == 5) {
            buscarDadoUnico("select to_char(trunc(sysdate,'MM'), 'dd/mm/yyyy') RETORNO from dual", "dtIniPed", "value");
            dataAtualFormatada('dtFimPed', 'value');
            document.getElementById("codfilialPed").value = getCookie('ccwCodFilial');
            document.getElementById("btnAttPed").removeAttribute("disabled");
        }
    // Financeiro
        if (Number(idmenu) == 6) {
            buscarDadoUnico("select to_char(trunc(sysdate,'MM'), 'dd/mm/yyyy') RETORNO from dual", "dtIniFin", "value");
            dataAtualFormatada('dtFimFin', 'value');
            document.getElementById("codfilialFin").value = getCookie('ccwCodFilial');
            document.getElementById("btnAttFin").removeAttribute("disabled");
        }
    // Estoque
        if (Number(idmenu) == 7) {
            document.getElementById("codfilialEst").value = getCookie('ccwCodFilial');
            document.getElementById("btnAttEst").removeAttribute("disabled");
        }
    // Fiscal
        if (Number(idmenu) == 8) {
            buscarDadoUnico("select to_char(trunc(sysdate,'MM'), 'dd/mm/yyyy') RETORNO from dual", "dtIniFis", "value");
            dataAtualFormatada('dtFimFis', 'value');
            document.getElementById("codfilialFis").value = getCookie('ccwCodFilial');
            document.getElementById("btnAttFis").removeAttribute("disabled");
        }
    // Produto
        if (Number(idmenu) == 9) {
            document.getElementById("codfilialProd").value = getCookie('ccwCodFilial');
            document.getElementById("btnAttProd").removeAttribute("disabled");
        }
    //Relação de Pedidos
        if (Number(idmenu) == 10) {
            //dataAtualFormatada('dtIniRelPed', 'value');
            buscarDadoUnico("select to_char(trunc(sysdate,'MM'), 'dd/mm/yyyy') RETORNO from dual", "dtIniRelPed", "value");
            dataAtualFormatada('dtFimRelPed', 'value');
            document.getElementById("codfilialRelPed").value = getCookie('ccwCodFilial');
            document.getElementById("btnAttRelPed").removeAttribute("disabled");
        }
}

function buscarProdutos() {
    var consultaProd = document.getElementById("consultaProd").value;
    if (consultaProd.length = 0) {
        return;
    }
    document.getElementById("resultConsultaProd").innerHTML = "...";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("resultConsultaProd").innerHTML = "Carregando...";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                var consultaProd = "";
                for(var i = 0; i < obj.items.length; i++) {
                    consultaProd += '<h4> ';
                    consultaProd += '<button class="btn green" data-dismiss="modal" aria-hidden="true" type="button" onClick="setCodBarra('+obj.items[i].CODBARRA+')"><i class="fa fa-check"></i></button> ';
                    consultaProd += obj.items[i].CODPROD+' - '+obj.items[i].DESCRICAO+' - '+obj.items[i].EMBALAGEM+' - '+obj.items[i].UNIDADE;
                    consultaProd += '</h4>';
                } 
            }
            document.getElementById("resultConsultaProd").innerHTML = consultaProd;
        }
    };
    var sql = "select x.codprod, x.descricao, x.embalagem, x.unidade, x.codbarra, rownum from (select p.codprod, p.descricao, p.embalagem, p.unidade, p.codbarra from msproduto p where p.dtexclusao is null and (to_char(p.codprod) like upper('%25"+consultaProd+"%25') or upper(p.descricao) like upper('%25"+consultaProd+"%25')) ) x where rownum <= 20 order by x.descricao;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function setCodBarra(codbarra) {
    document.getElementById("codbarraProd").value = codbarra;
    atualizar('produto');
}

function atualizar(modulo, objeto, pagina, chave) {
    // URL Encode: + = %2B " = %22

    objeto = typeof objeto !== 'undefined' ? objeto : 'all';
    pagina = typeof pagina !== 'undefined' ? pagina : 0;
    chave = typeof chave !== 'undefined' ? chave : '0';
    checkCookie();
    filiais();
    filiaisRestritas();

    if (modulo == 'faturamento') {

        setCookie("ccwCodFilial", document.getElementById("codfilialFat").value, 30);
        document.getElementById("codfilialFat").value = getCookie('ccwCodFilial');

        var codfilial = document.getElementById("codfilialFat").value;
        var dtIni = document.getElementById("dtIniFat").value;
        var dtFim = document.getElementById("dtFimFat").value;
        var codvendedor = document.getElementById("codvendedorFat").value;
        var meta = parseFloat(document.getElementById("metaFat").value);

        var segundos = document.getElementById("segundosFat").value;
        if (segundos.length == 0 || segundos == 0) {
            segundos = 0;
        }

        if (meta.length == 0 || meta == 0) {
            meta = 0;
        }
        if (codvendedor.length == 0 || codvendedor == '0') {
            codvendedor = '0';
        }
        
        var relFat_WherePadrao = " and n.codcli not in (select nvl(codcli,0) from msfilial)";
            relFat_WherePadrao += " and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+")";
            relFat_WherePadrao += " and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+")";
            relFat_WherePadrao += " and n.dtsaida >= to_date('"+dtIni+"', 'dd/mm/yyyy') and n.dtsaida <= to_date('"+dtFim+"', 'dd/mm/yyyy')";
            relFat_WherePadrao += " and decode('"+codvendedor+"','0','0',n.codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+")";
            relFat_WherePadrao += " and (";
            relFat_WherePadrao += "  ((select count(*) from msfunc where matricula="+getCookie('ccwMatricula')+" and cargo in ('SPV','VD','VE','RCA'))=0)";
            relFat_WherePadrao += "  or ((select count(*) from msfunc where matricula="+getCookie('ccwMatricula')+" and cargo in ('SPV','VD','VE','RCA'))>0";
            relFat_WherePadrao += "  and "+getCookie('ccwMatricula')+" in (n.codsupervisor,n.codvendedor))";
            relFat_WherePadrao += ")";

        // and n.codvendedor = decode("+codvendedor+",'0',n.codvendedor,"+codvendedor+")
        // and n.codvendedor in (decode("+vetorTexto(codvendedor, '0')+",'0',n.codvendedor))
        // and n.codvendedor in (decode("+vetorTexto(codvendedor, '0')+",'0',n.codvendedor,"+vetorTexto(codvendedor, '0')+"))
        // and n.codvendedor in (decode('"+codvendedor+"','0',n.codvendedor,"+vetorTexto(codvendedor, '0')+"))
        // and decode('"+codvendedor+"','0',n.codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+")
        // and decode('"+codvendedor+"','0','0',n.codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+")


        // QUADROS
            // Linha 1
                //Qt. Clientes Cadastrados
                quadro("select count(codcli) valor from mscliente where dtexclusao is null and tipo = 'C' and decode('"+codvendedor+"','0','0',codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+")", "qd1Fat", "Qt. Clientes Cadastrados", "users", "purple-sharp", " ", " ");
                // Qt. Clientes Positivados
                quadro("select count(distinct n.codcli) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+"", "qd2Fat", "Qt. Clientes Positivados", "users", "yellow-lemon", " ", " ");
                // % Positivação
                quadro("select round(nvl((ttP.ttP/nvl(ttC.ttC,1))*100,0),2) VALOR from (select count(distinct n.codcli) ttP from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+") ttP, (select count(c.codcli) ttC from mscliente c where c.tipo='C' and c.dtexclusao is null) ttC", "qd3Fat", "% Positiva&ccedil;&atilde;o", "users", "green-jungle", " ", "%");
                // % Mix Produtos
                quadro("select round(nvl((ttMix.ttMix/nvl(ttProd.ttProd,1))*100,0),2) VALOR from (select count(distinct(m.codprod)) ttMix from msmov m, msnf n where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+") ttMix,(select count(p.codprod) ttProd from msproduto p where p.dtexclusao is null) ttProd", "qd4Fat", "% Mix Produtos", "cubes", "purple", " ", "%");
            // Linha 2
                // Pedidos em Aberto
                quadro("select formatar_valor(round(nvl(sum(m.vlprod),0),2)) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and posicao not in ('F','C')"+relFat_WherePadrao+"", "qd5Fat", "Pedidos em Aberto", "dollar", "red-haze", "R$ ", " ");
                // Valor Faturado
                quadro("select formatar_valor(round(nvl(sum(m.vlprod),0),2)) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+"", "qd6Fat", "Valor Faturado", "dollar", "green", "R$ ", " ");
                // Valor Devolvido
                quadro("select formatar_valor(nvl(sum(m.qtdevol*m.vlprod/nullif(m.qt,0)),0)) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+"", "qd7Fat", "Valor Devolvido", "retweet", "yellow", "R$ ", " ");
                // Valor Bonificado
                quadro("select formatar_valor(nvl(sum(decode(nvl(m.vlprod,0),0,m.punit*m.qt,nvl(m.vlprod,0))),0)) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and (nvl(m.bonificado, 'N')='S' or nvl(n.bonificado, 'N')='S') and n.posicao = 'F'"+relFat_WherePadrao+"", "qd8Fat", "Valor Bonificado", "gift", "green-sharp", "R$ ", " ");
            // Linha 3
                // Qtd. de Notas 
                quadro("select count(distinct m.numtrans) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+"", "qd9Fat", "Qtd. de Notas", "list-ol", "purple-intense", " ", " ");
                // Ticket Médio
                quadro("select formatar_valor(round(nvl(sum(m.vlprod),0),2)/nullif(count(distinct m.numtrans),0)) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+"", "qd10Fat", "Ticket M&eacute;dio", "balance-scale", "blue-chambray", "R$ ", " ");
                // Valor de Cancelamentos
                quadro("select formatar_valor(round(nvl(sum(m.vlprod),0),2)) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'C' and n.dtcancel is not null and m.dtcancel is not null and m.qt > 0 and n.codcli not in (select nvl(codcli,0) from msfilial) and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") and trunc(n.dtcancel) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtcancel) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and decode('"+codvendedor+"','0','0',n.codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+")", "qd11Fat", "Valor de Cancelamentos", "ban", "yellow-saffron", "R$ ", " ");
                // % Meta
                quadro("select round(nvl(sum(m.vlprod),0)/nullif(nvl(to_number('"+meta+"'),0),0)*100,2) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+"", "qd12Fat", "% Meta", "line-chart", "dark", " ", "%");

        // TABELAS
            //Exemplo 
            //autoTabela("select x.cob as %22Cobrança%22, x.qttitulos as %22Qtd.Títulos%22, x.valor as %22Valor%22, 'Total: R$ '||formatar_valor(sum(x.valor2) over()) as rodape from (select (nvl(upper(p.codcob),'*')||' - '||initcap(nvl(c.cobranca,'*'))) cob, count(distinct p.id) qttitulos, 'R$ '||formatar_valor(sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0))) valor, sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0)) valor2 from msparcelas p, mslanc l, mscob c where p.idlanc = l.idlanc and upper(p.codcob) = c.codcob (%2B) and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'R' and l.codfilial ="+codfilial+" and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy') group by upper(p.codcob), c.cobranca order by sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0)) desc) x", "tb1", "Contas a Receber por Cobran&ccedil;a",0)

            // Vendedores
            autoTabela("select x.name as %22Vendedor%22, x.qtvendas as %22Qtd.Vendas%22, x.valor as %22Valor%22, 'Total: R$  '||formatar_valor(sum(x.ord) over()) as rodape from ( select f.matricula||' - '||initcap(f.nome) as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord, count(distinct m.numtrans) qtvendas from msnf n, msfunc f, msmov m where m.numtrans = n.numtrans and n.codvendedor = f.matricula and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+" group by f.matricula, initcap(f.nome) order by sum(m.vlprod) desc) x", "tb1Fat", "Vendedores",0,0);
            //console.log(">>>>>> SQL -> select x.name as %22Vendedor%22, x.qtvendas as %22Qtd.Vendas%22, x.valor as %22Valor%22, 'Total: R$  '||formatar_valor(sum(x.ord) over()) as rodape from ( select f.matricula||' - '||initcap(f.nome) as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord, count(distinct m.numtrans) qtvendas from msnf n, msfunc f, msmov m where m.numtrans = n.numtrans and n.codvendedor = f.matricula and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+" group by f.matricula, initcap(f.nome) order by sum(m.vlprod) desc) x");
            // Marcas
            autoTabela("select x.name %22Marca%22, x.valor %22Valor%22, 'Total: R$ '||formatar_valor(sum(x.ord) over()) as rodape from ( select c.codmarca||' - '||initcap(nvl(c.marca, 'Nenhuma')) as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord from msnf n, msmov m, msproduto p, msmarca c where m.numtrans = n.numtrans and m.codprod = p.codprod and c.codmarca (%2B) = p.codmarca and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+" group by c.codmarca, initcap(nvl(c.marca, 'Nenhuma')) order by sum(m.vlprod) desc ) x", "tb2Fat", "Marcas",0,0);
            // Plano de Pagamentos
            autoTabela("select x.name %22Plano de Pagamento%22, x.valor %22Valor%22, 'Total R$ '||formatar_valor(sum(x.ord) over()) as rodape from ( select p.codplpag||' - '||initcap(nvl(p.descricao, 'Nenhum')) as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord from msnf n, msmov m, msplpag p where m.numtrans = n.numtrans and n.codplpag = p.codplpag (%2B) and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+" group by p.codplpag, p.descricao order by sum(m.vlprod) desc) x", "tb3Fat", "Planos de Pagamento",0,0);
            // Cidades
            autoTabela("select x.name %22Cidade%22, x.valor %22Valor%22, 'Total R$ '||formatar_valor(sum(x.ord) over()) as rodape from ( select initcap(nvl(p.nome, 'Nenhum')) || ' - ' || p.uf as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord from msnf n, msmov m, mscliente c, msmunicipio p where m.numtrans = n.numtrans and n.codcli = c.codcli and c.codcidade = p.id (%2B) and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+" group by p.nome, p.uf order by sum(m.vlprod) desc, p.uf, p.nome) x", "tb4Fat", "Cidades",0,0);
            //Cobranças
            autoTabela("select x.name %22Cobrança%22, x.valor %22Valor%22, 'Total R$ '||formatar_valor(sum(x.ord) over()) as rodape from (select decode(nvl(apenasnumeros(c.tipocob),99),0,'Dinheiro',1,'Cartão',2,'Cheque',3,'Boleto',4,'DNI',5,'Credito',6,'Carteira',7,'Depósito',99,'Não Identificado') name, 'R$ '||formatar_valor(nvl(sum(f.valor),0)) valor, nvl(sum(f.valor),0) ord from msnfcob f,mscob c where f.codcob=c.codcob and f.numtrans in ( select n.numtrans from msnf n, msmov m where m.numtrans = n.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+" group by n.numtrans) group by nvl(apenasnumeros(c.tipocob),99) order by sum(f.valor) desc) x", "tb5Fat", "Cobran&ccedil;as",0,0);
            //Deparmanetos
            autoTabela("select x.name %22Departamento%22, x.valor %22Valor%22, 'Total R$ '||formatar_valor(sum(x.ord) over()) as rodape from (select (nvl(d.codepto,0) || ' - ' || nvl(initcap(d.descricao),'Nenhum')) as name, 'R$ '||formatar_valor(nvl(sum(m.vlprod),0)) as valor, nvl(sum(m.vlprod),0) ord from msnf n, msmov m, msproduto p, mssecao s, msdepartamento d where m.numtrans = n.numtrans and m.codprod = p.codprod and p.codsec = s.codsec (%2B) and s.codepto = d.codepto (%2B) and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F'"+relFat_WherePadrao+" group by (nvl(d.codepto,0) || ' - ' || nvl(initcap(d.descricao),'Nenhum')) order by sum(m.vlprod) desc) x", "tb6Fat", "Departamentos",0,0);
        // Gráfico Fat 12 meses
        colunas("select * from (select to_number(to_char(trunc(n.dtsaida),'YYYYMM')) mes_ano, to_char(trunc(n.dtsaida),'Mon/yyyy') NAME, replace(to_char(round(sum(m.vlprod),2)),',','.') as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' and n.posicao = 'F' and n.codcli not in (select nvl(codcli,0) from msfilial) and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") and decode('"+codvendedor+"','0','0',n.codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+") group by to_number(to_char(trunc(n.dtsaida),'YYYYMM')), to_char(trunc(n.dtsaida),'Mon/yyyy') order by 1 desc) where rownum <= 12 order by 1;", "grafFat12Meses" , "Faturamento 12 meses");
    }

    if (modulo == 'pedidos') {

        setCookie("ccwCodFilial", document.getElementById("codfilialPed").value, 30);
        document.getElementById("codfilialPed").value = getCookie('ccwCodFilial');

        var codfilial = document.getElementById("codfilialPed").value;
        var dtIni = document.getElementById("dtIniPed").value;
        var dtFim = document.getElementById("dtFimPed").value;
        var codvendedor = document.getElementById("codvendedorPed").value;
        var meta = parseFloat(document.getElementById("metaPed").value);
        if (meta.length == 0 || meta == 0) {
            meta = 0;
        }
        if (codvendedor.length == 0 || codvendedor == '0') {
            codvendedor = '0';
        }

        var segundos = document.getElementById("segundosPed").value;
        if (segundos.length == 0 || segundos == 0) {
            segundos = 0;
        }

        var relPed_WherePadrao = " and n.codcli not in (select nvl(codcli,0) from msfilial)";
            relPed_WherePadrao += " and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+")";
            relPed_WherePadrao += " and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+")";
            relPed_WherePadrao += " and n.dtemissao >= to_date('"+dtIni+"', 'dd/mm/yyyy') and n.dtemissao <= to_date('"+dtFim+"', 'dd/mm/yyyy')";
            relPed_WherePadrao += " and decode('"+codvendedor+"','0','0',n.codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+")";
            relPed_WherePadrao += " and (";
            relPed_WherePadrao += "  ((select count(*) from msfunc where matricula="+getCookie('ccwMatricula')+" and cargo in ('SPV','VD','VE','RCA'))=0)";
            relPed_WherePadrao += "  or ((select count(*) from msfunc where matricula="+getCookie('ccwMatricula')+" and cargo in ('SPV','VD','VE','RCA'))>0";
            relPed_WherePadrao += "  and "+getCookie('ccwMatricula')+" in (n.codsupervisor,n.codvendedor))";
            relPed_WherePadrao += ")";

        // QUADROS
            // Linha 1
                //Qt. Clientes Cadastrados
                quadro("select count(codcli) valor from mscliente where dtexclusao is null and tipo = 'C' and decode('"+codvendedor+"','0','0',codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+")", "qd1Ped", "Qt. Clientes Cadastrados", "users", "purple-sharp", " ", " ");
                // Qt. Clientes Positivados
                quadro("select count(distinct n.codcli) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null", "qd2Ped", "Qt. Clientes Positivados", "users", "yellow-lemon", " ", " ");
                // % Positivação
                quadro("select round(nvl((ttP.ttP/nvl(ttC.ttC,1))*100,0),2) VALOR from (select count(distinct n.codcli) ttP from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null) ttP, (select count(c.codcli) ttC from mscliente c where c.tipo='C' and c.dtexclusao is null and decode('"+codvendedor+"','0','0',codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+")) ttC", "qd3Ped", "% Positiva&ccedil;&atilde;o", "users", "green-jungle", " ", "%");
                // % Mix Produtos
                quadro("select round(nvl((ttMix.ttMix/nvl(ttProd.ttProd,1))*100,0),2) VALOR from (select count(distinct(m.codprod)) ttMix from msmov m, msnf n where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null) ttMix,(select count(p.codprod) ttProd from msproduto p where p.dtexclusao is null) ttProd", "qd4Ped", "% Mix Produtos", "cubes", "purple", " ", "%");
            // Linha 2
                // Qtd. de Pedidos 
                quadro("select count(distinct m.numtrans) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null", "qd5Ped", "Qtd. de Pedidos", "list-ol", "red-haze", " ", " ");
                // Valor dos Pedidos
                quadro("select formatar_valor(round(nvl(sum(m.vlprod),0),2)) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null", "qd6Ped", "Valor dos Pedidos", "dollar", "green", "R$ ", " ");
                // Ticket Médio
                quadro("select formatar_valor(round(nvl(sum(m.vlprod),0),2)/nullif(count(distinct m.numtrans),0)) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null", "qd7Ped", "Ticket M&eacute;dio", "balance-scale", "yellow-saffron", "R$ ", " ");
                // % Meta
                quadro("select round(nvl(sum(m.vlprod),0)/nullif(nvl(to_number('"+meta+"'),0),0)*100,2) as VALOR from msnf n, msmov m where n.numtrans = m.numtrans and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null", "qd8Ped", "% Meta", "line-chart", "dark", " ", "%");


        // TABELAS
            // Vendedores
            autoTabela("select x.name as %22Vendedor%22, x.qtvendas as %22Qtd.Vendas%22, x.valor as %22Valor%22, 'Total: R$  '||formatar_valor(sum(x.ord) over()) as rodape from ( select f.matricula||' - '||initcap(f.nome) as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord, count(distinct m.numtrans) qtvendas from msnf n, msfunc f, msmov m where m.numtrans = n.numtrans and n.codvendedor = f.matricula and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null group by f.matricula, initcap(f.nome) order by sum(m.vlprod) desc) x", "tb1Ped", "Vendedores",0,0);
            // Marcas
            autoTabela("select x.name %22Marca%22, x.valor %22Valor%22, 'Total: R$ '||formatar_valor(sum(x.ord) over()) as rodape from ( select c.codmarca||' - '||initcap(nvl(c.marca, 'Nenhuma')) as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord from msnf n, msmov m, msproduto p, msmarca c where m.numtrans = n.numtrans and m.codprod = p.codprod and c.codmarca (%2B) = p.codmarca and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null group by c.codmarca, initcap(nvl(c.marca, 'Nenhuma')) order by sum(m.vlprod) desc ) x", "tb2Ped", "Marcas",0,0);
            // Plano de Pagamentos
            autoTabela("select x.name %22Plano de Pagamento%22, x.valor %22Valor%22, 'Total R$ '||formatar_valor(sum(x.ord) over()) as rodape from ( select p.codplpag||' - '||initcap(nvl(p.descricao, 'Nenhum')) as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord from msnf n, msmov m, msplpag p where m.numtrans = n.numtrans and n.codplpag = p.codplpag (%2B) and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null group by p.codplpag, p.descricao order by sum(m.vlprod) desc) x", "tb3Ped", "Planos de Pagamento",0,0);
            // Cidades
            autoTabela("select x.name %22Cidade%22, x.valor %22Valor%22, 'Total R$ '||formatar_valor(sum(x.ord) over()) as rodape from ( select initcap(nvl(p.nome, 'Nenhum')) || ' - ' || p.uf as name, 'R$ '||formatar_valor(round(nvl(sum(m.vlprod),0),2)) as valor, round(nvl(sum(m.vlprod),0),2) ord from msnf n, msmov m, mscliente c, msmunicipio p where m.numtrans = n.numtrans and n.codcli = c.codcli and c.codcidade = p.id (%2B) and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null group by p.nome, p.uf order by p.uf, p.nome, sum(m.vlprod) desc) x", "tb4Ped", "Cidades",0,0);
            //Cobranças
            autoTabela("select x.name %22Cobrança%22, x.valor %22Valor%22, 'Total R$ '||formatar_valor(sum(x.ord) over()) as rodape from (select decode(nvl(apenasnumeros(c.tipocob),99),0,'Dinheiro',1,'Cartão',2,'Cheque',3,'Boleto',4,'DNI',5,'Credito',6,'Carteira',7,'Depósito',99,'Não Identificado') name, 'R$ '||formatar_valor(nvl(sum(f.valor),0)) valor, nvl(sum(f.valor),0) ord from msnfcob f,mscob c where f.codcob=c.codcob and f.numtrans in ( select n.numtrans from msnf n, msmov m where m.numtrans = n.numtrans and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null group by n.numtrans) group by nvl(apenasnumeros(c.tipocob),99) order by sum(f.valor) desc) x", "tb5Ped", "Cobran&ccedil;as",0,0);
            //Deparmanetos
            autoTabela("select x.name %22Departamento%22, x.valor %22Valor%22, 'Total R$ '||formatar_valor(sum(x.ord) over()) as rodape from (select (nvl(d.codepto,0) || ' - ' || nvl(initcap(d.descricao),'Nenhum')) as name, 'R$ '||formatar_valor(nvl(sum(m.vlprod),0)) as valor, nvl(sum(m.vlprod),0) ord from msnf n, msmov m, msproduto p, mssecao s, msdepartamento d where m.numtrans = n.numtrans and m.codprod = p.codprod and p.codsec = s.codsec (%2B) and s.codepto = d.codepto (%2B) and nvl(n.faturamento,'N') = 'S' "+relPed_WherePadrao+" and n.dtcancel is null and m.dtcancel is null group by (nvl(d.codepto,0) || ' - ' || nvl(initcap(d.descricao),'Nenhum')) order by sum(m.vlprod) desc) x", "tb6Ped", "Departamentos",0,0);
    }

    if (modulo == 'financeiro') {

        setCookie("ccwCodFilial", document.getElementById("codfilialFin").value, 30);
        document.getElementById("codfilialFin").value = getCookie('ccwCodFilial');

        var codfilial = document.getElementById("codfilialFin").value;
        var dtIni = document.getElementById("dtIniFin").value;
        var dtFim = document.getElementById("dtFimFin").value;

        var segundos = document.getElementById("segundosFin").value;
        if (segundos.length == 0 || segundos == 0) {
            segundos = 0;
        }

        quadro("select formatar_valor(sum(nvl(p.valor,0)-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0))) as VALOR from msparcelas p, mslanc l where p.idlanc = l.idlanc and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'R' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy')", "qd1Fin", "Contas a Receber", "exclamation-circle", "red", "R$ ", " ");
        quadro("select formatar_valor(sum(nvl(p.valor,0)-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0))) as VALOR from msparcelas p, mslanc l where p.idlanc = l.idlanc and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'P' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy')", "qd2Fin", "Contas a Pagar", "exclamation-circle", "yellow-gold", "R$ ", " ");
        
        quadro("select formatar_valor(sum(p.vpago)) as VALOR from msparcelas p, mslanc l where p.idlanc = l.idlanc and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is not null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'R' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtpagto >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtpagto <= to_date('"+dtFim+"', 'dd/mm/yyyy')", "qd3Fin", "Contas Recebidas", "check-circle-o", "green", "R$ ", " ");
        quadro("select formatar_valor(sum(p.vpago)) as VALOR from msparcelas p, mslanc l where p.idlanc = l.idlanc and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is not null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'P' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtpagto >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtpagto <= to_date('"+dtFim+"', 'dd/mm/yyyy')", "qd4Fin", "Contas Pagas", "check-circle-o", "blue-steel", "R$ ", " ");

        autoTabela("select x.cob as %22Cobrança%22, x.qttitulos as %22Qtd.Títulos%22, x.valor as %22Valor%22, 'Total: R$ '||formatar_valor(sum(x.valor2) over()) as rodape from (select (nvl(upper(p.codcob),'*')||' - '||initcap(nvl(c.cobranca,'*'))) cob, count(distinct p.id) qttitulos, 'R$ '||formatar_valor(sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0))) valor, sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0)) valor2 from msparcelas p, mslanc l, mscob c where p.idlanc = l.idlanc and upper(p.codcob) = c.codcob (%2B) and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'R' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy') group by upper(p.codcob), c.cobranca order by sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0)) desc) x", "tb1Fin", "Contas a Receber por Cobran&ccedil;a",0)
        
        autoTabela("select x.cob as %22Cobrança%22, x.qttitulos as %22Qtd.Títulos%22, x.valor as %22Valor%22, 'Total: R$ '||formatar_valor(sum(x.valor2) over()) as rodape from (select (nvl(upper(p.codcob),'*')||' - '||initcap(nvl(c.cobranca,'*'))) cob, count(distinct p.id) qttitulos, 'R$ '||formatar_valor(sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0))) valor, sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0)) valor2 from msparcelas p, mslanc l, mscob c where p.idlanc = l.idlanc and upper(p.codcob) = c.codcob (%2B) and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'P' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy') group by upper(p.codcob), c.cobranca order by sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0)) desc) x", "tb2Fin", "Contas a Pagar por Cobran&ccedil;a",0)

        autoTabela("select (nvl(p.idcodconta,0)||' - '||initcap(nvl(c.conta,'*'))) %22Conta Contábil%22, count(distinct p.id) %22Qtd.Títulos%22, 'R$ '||formatar_valor(sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0))) %22Valor%22 from msparcelas p, mslanc l, msconta c where p.idlanc = l.idlanc and p.idcodconta = c.id (%2B) and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'R' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy') group by p.idcodconta, c.conta order by sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0)) desc", "tb3Fin", "Contas a Receber por Conta Cont&aacute;bil")
        
        autoTabela("select (nvl(p.idcodconta,0)||' - '||initcap(nvl(c.conta,'*'))) %22Conta Contábil%22, count(distinct p.id) %22Qtd.Títulos%22, 'R$ '||formatar_valor(sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0))) %22Valor%22 from msparcelas p, mslanc l, msconta c where p.idlanc = l.idlanc and p.idcodconta = c.id (%2B) and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'P' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy') group by p.idcodconta, c.conta order by sum(p.valor-nvl(p.vldesconto,0)%2Bnvl(p.vlacrescimo,0)%2Bnvl(p.vlencargos,0)) desc", "tb4Fin", "Contas a Pagar por Conta Cont&aacute;bil",0)
        var finRelSqlGraficoGeral = ""
            finRelSqlGraficoGeral += "select 'A Receber' NAME, replace(to_char(round(sum(nvl(p.valor,0)-nvl(p.vldesconto,0)<#43>nvl(p.vlacrescimo,0)<#43>nvl(p.vlencargos,0)),2)),',','.') as VALOR from msparcelas p, mslanc l where p.idlanc = l.idlanc and p.codcob not in ('DESD','CANC','TROCO','DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'R' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy')";
            finRelSqlGraficoGeral += " union select 'A Pagar' NAME, replace(to_char(round(sum(nvl(p.valor,0)-nvl(p.vldesconto,0)<#43>nvl(p.vlacrescimo,0)<#43>nvl(p.vlencargos,0)),2)),',','.') as VALOR from msparcelas p, mslanc l where p.idlanc = l.idlanc and p.codcob not in ('DESD','CANC','TROCO','DESC') and p.dtpagto is null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'P' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtvenc >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtvenc <= to_date('"+dtFim+"', 'dd/mm/yyyy')";
            finRelSqlGraficoGeral += " union select 'Recebidas' as NAME, replace(to_char(round(sum(p.vpago),2)),',','.') as VALOR from msparcelas p, mslanc l where p.idlanc = l.idlanc and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is not null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'R' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtpagto >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtpagto <= to_date('"+dtFim+"', 'dd/mm/yyyy')";
            finRelSqlGraficoGeral += " union select 'Pagas' as NAME, replace(to_char(round(sum(p.vpago),2)),',','.') as VALOR from msparcelas p, mslanc l where p.idlanc = l.idlanc and p.codcob not in ('DESD','CANC', 'TROCO', 'DESC') and p.dtpagto is not null and l.origemlanc <> 'EMP' and l.situacao <> 'C' and l.tiporp = 'P' and l.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and p.dtpagto >= to_date('"+dtIni+"', 'dd/mm/yyyy') and p.dtpagto <= to_date('"+dtFim+"', 'dd/mm/yyyy');";

        colunas(finRelSqlGraficoGeral, "quadroGeralFin", "Quadro Geral", "POST")
    }

    if (modulo == 'estoque') {

        setCookie("ccwCodFilial", document.getElementById("codfilialEst").value, 30);
        document.getElementById("codfilialEst").value = getCookie('ccwCodFilial');
        var codfilial = document.getElementById("codfilialEst").value;

        var segundos = document.getElementById("segundosEst").value;
        if (segundos.length == 0 || segundos == 0) {
            segundos = 0;
        }

        quadro("select count(distinct e.codprod) valor from msest e, msproduto p where e.codprod = p.codprod and p.dtexclusao is null and e.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+");", "qd1Est", "Mix de Produtos", "cubes", "blue", " ", " ");
        quadro("select count(distinct p.codmarca) valor from msest e, msproduto p where e.codprod = p.codprod and p.dtexclusao is null and e.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+");", "qd2Est", "Mix de Marcas", "certificate", "yellow", " ", " ");
        quadro("select formatar_valor(sum(nvl(e.vlcustopadrao,0)*nvl(e.qtestger,0))) valor from msest e , msproduto p where e.codprod = p.codprod and p.dtexclusao is null and e.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+");", "qd3Est", "Valor de Custo", "dollar", "red", "R$ ", " ");
        quadro("select formatar_valor(sum(nvl(obter_preco_venda(f.numregiao, e.codfilial, p.codbarra, nvl(f.codconsumidor, f.codcli)),0)*nvl(e.qtestger,0))) valor from msest e, msfilial f, msproduto p where e.codfilial = f.codfilial and e.codprod = p.codprod and p.dtexclusao is null and e.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+");", "qd4Est", "Valor de Venda", "dollar", "green", "R$ ", " ");

        autoTabela("select (nvl(c.codmarca,0) || ' - ' || nvl(initcap(c.marca),'Nenhuma')) as %22Marca%22, count(distinct e.codprod) as %22Mix%22, round(sum(e.qtestger),2) as %22Qtd.Produtos%22, 'R$ '||formatar_valor(nvl(sum(e.vlcustopadrao*e.qtestger),0)) as %22Valor%22 from msest e, msproduto p, msmarca c where e.codprod = p.codprod and p.codmarca = c.codmarca (%2B) and e.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") group by (nvl(c.codmarca,0) || ' - ' || nvl(initcap(c.marca),'Nenhuma')) order by nvl(sum(e.vlcustopadrao*e.qtestger),0) desc;", "tb1Est", "Estoque por Marca",0,0);

        autoTabela("select (nvl(d.codepto,0) || ' - ' || nvl(initcap(d.descricao),'Nenhum')) as %22Departamento%22, count(distinct e.codprod) as %22Mix%22, round(sum(e.qtestger),2) as %22Qtd.Produtos%22, 'R$ '||formatar_valor(nvl(sum(e.vlcustopadrao*e.qtestger),0)) as %22Valor%22 from msest e, msproduto p, mssecao s, msdepartamento d where e.codprod = p.codprod and p.codsec = s.codsec (%2B) and s.codepto = d.codepto (%2B) and e.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") group by (nvl(d.codepto,0) || ' - ' || nvl(initcap(d.descricao),'Nenhum')) order by nvl(sum(e.vlcustopadrao*e.qtestger),0) desc;", "tb2Est", "Estoque por Departamento",0,0);
    }

    if (modulo == 'fiscal') {
        setCookie("ccwCodFilial", document.getElementById("codfilialFis").value, 30);
        document.getElementById("codfilialFis").value = getCookie('ccwCodFilial');
        var codfilial = document.getElementById("codfilialFis").value;
        var dtIni = document.getElementById("dtIniFis").value;
        var dtFim = document.getElementById("dtFimFis").value;

        var segundos = document.getElementById("segundosFis").value;
        if (segundos.length == 0 || segundos == 0) {
            segundos = 0;
        }

        quadro("select formatar_valor(sum(m.vlprod)) as VALOR from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='E' and trunc(n.dtentrada) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtentrada) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+");", "qd1Fis", "Valor Entradas", "arrow-circle-down", "blue", "R$ ", " ");

        quadro("select count(distinct m.numtrans) as VALOR from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='E' and trunc(n.dtentrada) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtentrada) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+");", "qd2Fis", "Qtd. Entradas", "arrow-circle-down", "green", "", " ");

        quadro("select formatar_valor(sum(m.vlprod)) as VALOR from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+");", "qd3Fis", "Valor Sa&iacute;das", "arrow-circle-up", "red", "R$ ", " ");

        //console.log("select formatar_valor(sum(m.vlprod)) as VALOR from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("todasFiliais").value, '0')+");");

        quadro("select count(distinct m.numtrans) as VALOR from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+");", "qd4Fis", "Qtd. Sa&iacute;das", "arrow-circle-up", "yellow-gold", "", " ");


        quadro("select formatar_valor(sum(m.vlprod)) as VALOR from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is null and situacaonfe is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+");", "qd5Fis", "Vl.NF Pendentes", "warning", "purple-sharp", "R$ ", " ");
        quadro("select count(distinct m.numtrans) as VALOR from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is null and situacaonfe is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+");", "qd6Fis", "Qtd. Pendentes", "warning", "yellow-casablanca", " ", " ");


        colunas("select x.name, replace(to_char(round(x.valor,2)),',','.') valor from (select 'Vl.NF Entradas' name, sum(m.vlprod) valor, 1 ord from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='E' and trunc(n.dtentrada) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtentrada) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") union select 'Vl.NF Saídas' name, sum(m.vlprod) valor, 2 ord from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") union select 'Vl.ICMS Entradas' name, sum(nvl(m.vlicms,0)) valor, 3 ord from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='E' and trunc(n.dtentrada) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtentrada) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") union select 'Vl.ICMS Saídas' name, sum(decode(d.devolucao,'S',m.vlicms,(m.vlicms*qt))) valor, 4 ord from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") union select 'Vl.IPI Entradas' name, sum(nvl(m.vlipi,0)) valor , 5 ord from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='E' and trunc(n.dtentrada) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtentrada) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") union select 'Vl.IPI Saídas' name, sum(nvl(m.vlipi,0)*m.qt) valor, 6 ord from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") union select 'Vl.ST Entradas' name, sum(nvl(m.vlst,0)) valor, 7 ord from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='E' and trunc(n.dtentrada) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtentrada) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") union select 'Vl.ST Saídas' name, sum(nvl(m.vlst,0)*m.qt) valor, 8 ord from msnf n, msmov m, mscliente c, mstipodoc d where n.numtrans=m.numtrans and n.codcli=c.codcli and d.codoper=n.codoper and d.status in ('C','A') and n.dtcancel is null and m.oper='S' and n.numprotocolo_envio is not null and trunc(n.dtsaida) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtsaida) <= to_date('"+dtFim+"', 'dd/mm/yyyy') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("todasFiliais").value, '0')+")) x order by x.ord", "graficoGeralFis", "Resumo Fiscal", 'POST');
    }

    if (modulo == 'produto') {
        setCookie("ccwCodFilial", document.getElementById("codfilialProd").value, 30);
        document.getElementById("codfilialProd").value = getCookie('ccwCodFilial');
        var codfilial = document.getElementById("codfilialProd").value;
        var codbarra = document.getElementById("codbarraProd").value;

        var segundos = document.getElementById("segundosProd").value;
        if (segundos.length == 0 || segundos == 0) {
            segundos = 0;
        }

        if (codbarra.length == 0 || codbarra.value == '' ) {
            alert('Informe um codigo de barras...');
        } else {

            buscarDadoUnico("select '<h2><b>'||codprod||' - '||descricao||'</b></h2>' as RETORNO from msproduto where codbarra='"+codbarra+"';", 'descricao', 'innerHTML');
            buscarDadoUnico("select '<h3><b>Ref.: </b>'||referencia||'</h3>' as RETORNO from msproduto where codbarra='"+codbarra+"';", 'referencia', 'innerHTML');
            buscarDadoUnico("select '<h3><b>Unidade: </b>'||unidade||'</h3>' as RETORNO from msproduto where codbarra='"+codbarra+"';", 'unidade', 'innerHTML');
            buscarDadoUnico("select '<h3><b>Marca: </b>'||p.codmarca||' - '||m.marca||'</h3>' as RETORNO from msproduto p, msmarca m where p.codmarca = m.codmarca (%2B) and p.codbarra='"+codbarra+"';", 'marca', 'innerHTML');
            autoTabela("select (x.codfilial||' - '||x.razaosocial) %22Filial%22, x.qtestger %22Qtd.Estoque%22, x.qtreserv %22Qtd.Reservada%22, formatar_valor(x.pcusto) %22Prç.Custo%22, formatar_valor(x.pvenda) %22Prç.Venda%22 from (select e.codfilial, f.razaosocial, nvl(e.qtestger,0) qtestger, nvl(e.qtreserv,0) qtreserv, nvl(e.vlcustopadrao,0) pcusto, obter_preco_venda(nvl(f.numregiao,1), e.codfilial, p.codbarra, nvl(f.codconsumidor,e.codfilial)) pvenda from msproduto p, msest e, msfilial f where p.codprod = e.codprod and e.codfilial = f.codfilial and p.codbarra = '"+codbarra+"' order by to_number(e.codfilial)) x;", "tbProdutoProd", "Dados por Filial",0)
            linhaUnica("select rownum, x.data categoria, x.preco dado from (select to_char(nvl(n.dtentrada,trunc(n.dthora)),'dd/mm/yy') data, replace(to_char(round(nvl((m.vlprod/m.qt),0),2)),',','.') preco from msnf n, msmov m, msproduto p, mstipodoc t where n.numtrans = m.numtrans and m.codprod = p.codprod and n.codoper = t.codoper and m.dtcancel is null and n.dtcancel is null and t.oper = 'E' and nvl(t.terceiros,'N')='S' and nvl(t.bonificado,'N')='N' and nvl(t.transferencia,'N')='N' and nvl(t.atualizar_estoque_gerencial,'N')='S' and p.codbarra = '"+codbarra+"' and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") order by m.id desc) x where rownum <= 10 order by rownum desc; ", "graficoComprasProd", "Ultimas 10 Compras", "Preco Unitario")
            linhaUnica("select rownum, x.data categoria, x.preco dado from (select to_char(n.dtsaida,'dd/mm/yy') data, replace(to_char(round(nvl((m.vlprod/m.qt),0),2)),',','.') preco from msnf n, msmov m, msproduto p, mstipodoc t where n.numtrans = m.numtrans and m.codprod = p.codprod and n.codoper = t.codoper and m.dtcancel is null and n.dtcancel is null and t.oper = 'S' and nvl(n.faturamento,'N')='S' and nvl(m.bonificado,'N')='N' and p.codbarra = '"+codbarra+"' and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") order by m.id desc) x where rownum <= 10 order by rownum desc; ", "graficoVendasProd", "Ultimas 10 Vendas", "Preco Unitario")

        }
    }

    if (modulo == 'relPedidos') {

        setCookie("ccwCodFilial", document.getElementById("codfilialRelPed").value, 30);
        document.getElementById("codfilialRelPed").value = getCookie('ccwCodFilial');

        var codfilial = document.getElementById("codfilialRelPed").value;
        var dtIni = document.getElementById("dtIniRelPed").value;
        var dtFim = document.getElementById("dtFimRelPed").value;
        var codvendedor = document.getElementById("codvendedorRelPed").value;

        var segundos = document.getElementById("segundosRelPed").value;
        if (segundos.length == 0 || segundos == 0) {
            segundos = 0;
        }

        if (codvendedor.length == 0 || codvendedor == '0') {
            codvendedor = '0';
        }

        var sqlPedidos = "";
        sqlPedidos += "select ";
        sqlPedidos += "  count(*) over() qtReg ";
        sqlPedidos += "  ,0 as qtPag ";
        sqlPedidos += "  ,'atualizar(''"+modulo+"'', ''tb1RelPedItens'', 0, '||n.numtrans||')' as clickLine ";
        sqlPedidos += "  ,n.dthora <#34>Dt.Hora<#34> ";
        sqlPedidos += "  ,n.codfilial <#34>Filial<#34> ";
        sqlPedidos += "  ,n.numtrans <#34>Num.Trans<#34> ";
        sqlPedidos += "  ,n.numped <#34>Num.Ped.<#34> ";
        sqlPedidos += "  ,n.numcar <#34>Num.Carreg.<#34> ";
        sqlPedidos += "  ,n.numnota <#34>Nota<#34> ";
        sqlPedidos += "  ,n.dtsaida <#34>Dt.Saída<#34> ";
        sqlPedidos += "  ,formatar_valor(sum(m.vlprod)) <#34>Vl.Total<#34> ";
        sqlPedidos += "  ,to_char(round(sum(m.peso_bruto),4)) <#34>Peso Bruto<#34> ";
        sqlPedidos += "  ,(case  ";
        sqlPedidos += "      when (n.dtinicio_conf is null and n.dtiniciosep is null and n.posicao not in ('F','C','M')) then 'Novo' "; 
        sqlPedidos += "      when (n.dtiniciosep is not null and n.dtfimsep is null and n.posicao not in ('F','C','M')) then 'Em Separação' ";
        sqlPedidos += "      when (n.dtfimsep is not null and n.dtinicio_conf is null and n.posicao not in ('F','C','M')) then 'Separado' ";
        sqlPedidos += "      when (n.dtinicio_conf is not null and n.dtfim_conf  is null and n.posicao not in ('F','C','M')) then 'Em Conferencia' ";
        sqlPedidos += "      when (n.dtfim_conf is not null and n.dtinicio_conf is not null and n.posicao not in ('F','C','M')) then 'Conferido' ";
        sqlPedidos += "      when (posicao ='M') then 'Carga Montada' ";
        sqlPedidos += "      when (posicao='C') then 'Cancelado' ";
        sqlPedidos += "      when (posicao='F' and (select max(pc.dtacertocx) from msparcelas pc, mslanc lc where pc.idlanc = lc.idlanc and lc.numtrans = n.numtrans) is null) then 'Faturado' ";
        sqlPedidos += "      when (posicao='F' and (select max(pc.dtacertocx) from msparcelas pc, mslanc lc where pc.idlanc = lc.idlanc and lc.numtrans = n.numtrans) is not null ) then 'Acertado' ";
        sqlPedidos += "      else null end ";
        sqlPedidos += "  ) <#34>Status<#34>   ";
        sqlPedidos += "  ,(case  ";
        sqlPedidos += "      when (n.dtinicio_conf is null and n.dtiniciosep is null and n.posicao not in ('F','C','M')) then 'default' "; 
        sqlPedidos += "      when (coalesce(n.dtinicio_conf, n.dtfim_conf, n.dtiniciosep, n.dtfimsep) is not null and n.posicao not in ('F','C','M')) then 'yellow-lemon' "; 
        sqlPedidos += "      when posicao='C' then 'red' ";
        sqlPedidos += "      when posicao='F' then 'green-jungle' ";
        sqlPedidos += "      else null end ";
        sqlPedidos += "  ) COR_LINHA  ";
        sqlPedidos += "  ,c.codcli||' - '||c.nome <#34>Cliente<#34> ";
        sqlPedidos += "  ,c.fantasia <#34>Fantasia<#34> ";        
        sqlPedidos += "  ,n.codvendedor||' - '||v.nome <#34>Vendedor<#34> ";
        sqlPedidos += "  ,n.codcob||' - '||b.cobranca <#34>Cobrança<#34> ";
        sqlPedidos += "  ,n.codoper||' - '||d.descricao <#34>Operação<#34> ";
        sqlPedidos += "  ,cid.nome||' - '||uf.uf <#34>Cidade<#34> ";
        sqlPedidos += "  ,n.obs <#34>Observações<#34> ";
        sqlPedidos += "  ,n.codrotinalanc <#34>Rotina Lanç.<#34> ";
        sqlPedidos += "  ,n.versao <#34>Versão<#34> ";
        sqlPedidos += "from ";
        sqlPedidos += "  msnf n, mscliente c, msmov m, mscob b, mstipodoc d, msfunc v, msmunicipio cid, msestados uf ";
        sqlPedidos += "  where n.codcli = c.codcli and n.numtrans = m.numtrans and n.codcob = b.codcob and n.codoper = d.codoper and n.codvendedor = v.matricula and c.codcidade = cid.id and cid.iduf = uf.codigo ";
        sqlPedidos += "  and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") ";
        sqlPedidos += "  and n.dtemissao >= to_date('"+dtIni+"', 'dd/mm/yyyy') ";
        sqlPedidos += "  and n.dtemissao <= to_date('"+dtFim+"', 'dd/mm/yyyy') ";
        sqlPedidos += "  and decode('"+codvendedor+"','0','0',n.codvendedor) in ('0',"+vetorTexto(codvendedor, '0')+") ";
        sqlPedidos += "  and n.tipo='S' and n.dtcancel is null and m.dtcancel is null and n.vltotal > 0 and m.qt > 0 and n.tipo = 'S'  ";
        sqlPedidos += "  and 'S' in (n.faturamento, n.bonificado) and n.codcli not in (select nvl(codcli,0) from msfilial) ";
        sqlPedidos += "  and (((select count(*) from msfunc where matricula="+getCookie('ccwMatricula')+" and cargo in ('SPV','VE','VD','RCA'))=0) or ((select count(*) from msfunc where matricula="+getCookie('ccwMatricula')+" and cargo in ('SPV','VE','VD','RCA'))>0 and "+getCookie('ccwMatricula')+" in (n.codsupervisor,n.codvendedor))) ";
        sqlPedidos += "group by ";
        sqlPedidos += "  n.dthora,n.codfilial,n.numtrans,n.numped,n.numcar,n.numnota,n.dtsaida,n.dtinicio_conf,n.dtfim_conf,n.dtiniciosep,n.dtfimsep,n.posicao ";
        sqlPedidos += "  ,c.codcli,c.nome,c.fantasia,n.codvendedor,v.nome,n.codcob,b.cobranca,n.codoper,d.descricao,cid.nome,uf.uf,n.obs,n.codrotinalanc,n.versao ";
        sqlPedidos += "order by n.numtrans desc ";
        //console.log('sqlPedidos-> '+sqlPedidos);
        if (objeto == 'all' || objeto == 'tb1RelPed') {
            if (pagina == 0) {
                pagina = 1
            }
            autoTabela(sqlPedidos, "tb1RelPed", "Rela&ccedil;&atilde;o de Pedidos",pagina,20,modulo,'POST');
        }

        var sqlPedidoItens = "";
        sqlPedidoItens += "select ";
        sqlPedidoItens += "  m.numtrans %22Num.Trans%22, m.item %22Item%22, m.codprod %22Cód.Prod%22, p.codbarra %22Cód.Barras%22, p.descricao %22Produto%22, p.unidade %22Un.%22, p.embalagem %22Emb.%22, m.qt %22Qtd%22, formatar_valor(m.vlprod/nullif(m.qt,0))  %22P.Unit%22, formatar_valor(m.vlprod)  %22Vl.Prod%22, 'Total: R$ '||formatar_valor(sum(m.vlprod) over()) as rodape ";
        sqlPedidoItens += "from msmov m, msproduto p ";
        sqlPedidoItens += "where m.codprod = p.codprod ";
        sqlPedidoItens += " and numtrans = #chave";
        sqlPedidoItens += "order by 2";
        if (objeto == 'tb1RelPedItens') {
            autoTabela(sqlPedidoItens.replace('#chave', chave), "tb1RelPedItens", "Itens do Pedido",0,0,modulo);
            window.location.hash='';
            window.location.hash='tb1RelPedItens';
        }
    }
    
    if (segundos > 0) {
        setTimeout("atualizar('"+modulo+"');", segundos*1000);
    }
}