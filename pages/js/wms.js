function carregarPadroesWMS(idmenu) {

    if (Number(idmenu) == 18) {
        selectFiltros("select to_number(e.codfilial) as valor, e.codfilial||' - '||tools.ReduzirNome(f.razaosocial) as descricao from msendereco e, msfilial f where e.codfilial = f.codfilial group by e.codfilial, tools.ReduzirNome(f.razaosocial) order by to_number(e.codfilial)", "divCeFilial", -1, "Todas as Filiais", "ceFilial");
        selectFiltros("select deposito as valor, 'Depósito '||deposito as descricao from msendereco group by deposito, 'Depósito '||deposito order by 1", "divCeDep", -1, "Todos os Dep&oacute;sitos", "ceDep");
        selectFiltros("select rua as valor, 'Rua '||rua as descricao from msendereco group by rua, 'Rua '||rua order by 1", "divCeRua", -1, "Todas as Ruas", "ceRua");
        selectFiltros("select predio as valor, 'Prédio '||predio as descricao from msendereco group by predio order by 1", "divCePredio", -1, "Todos os Pr&eacute;dios", "cePredio");
        selectFiltros("select nivel as valor, 'Nível '||nivel as descricao from msendereco group by nivel, 'Nível '||nivel order by 1", "divCeNivel", -1, "Todos os N&iacute;veis", "ceNivel");
        selectFiltros("select apto as valor, 'Apto. '||apto as descricao from msendereco group by apto, 'Apto. '||apto order by 1", "divCeApto", -1, "Todas os Aptos.", "ceApto");
    }
    if (Number(idmenu) == 19) {
        sepPedidosAbertos(); 
    }
    if (Number(idmenu) == 21) {
        buscarDadoUnico("select to_char(trunc(sysdate,'MM'), 'dd/mm/yyyy') RETORNO from dual", "gestSepDtIniFil", "value");
        dataAtualFormatada('gestSepDtFimFil', 'value');
        document.getElementById("gestSepCodfilialFil").value = getCookie('ccwCodFilial');
        document.getElementById("gestSepbtnAtt").removeAttribute("disabled");
    }

}

function WMSConsultaProd() {
    var codbarra = document.getElementById("wmsCodbarra").value;
    document.getElementById("ret").setAttribute("class", "alert alert-danger display-hide");
    document.getElementById("ret").innerHTML = "";
    document.getElementById("divDadosProd").setAttribute("class", "display-hide");
    if (codbarra.length = 0) {
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("load1").setAttribute("class", "font-red display-show");
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) {
                    document.getElementById("soundError").play();
                    document.getElementById("wmsCodbarra").focus();
                    document.getElementById("wmsCodbarra").select();
                    document.getElementById("divEnderecos").setAttribute("class", "display-hide");
                    document.getElementById("ret").setAttribute("class", "alert alert-danger display-show");
                    document.getElementById("ret").innerHTML = "<p>C&oacute;digo de Barras <b>"+codbarra+"</b> n&atilde;o encontrado...</p>";
                } else {
                    document.getElementById("soundBip").play();
                    document.getElementById("hidCodprod").value = obj.items[0].CODPROD;
                    document.getElementById("DPCodprod").innerHTML = obj.items[0].CODPROD;
                    document.getElementById("DPRef").innerHTML = obj.items[0].REFERENCIA;
                    document.getElementById("DPDesc").innerHTML = obj.items[0].DESCRICAO;
                    document.getElementById("DPEmb").innerHTML = obj.items[0].EMBALAGEM + ' - ' +obj.items[0].UNIDADE;
                    document.getElementById("divDadosProd").setAttribute("class", "display-show");
                    document.getElementById("divEnderecos").setAttribute("class", "display-show");
                    document.getElementById("codbarraEnder").value = "";
                    document.getElementById("codbarraEnder").focus();
                    document.getElementById("codbarraEnder").select();
                    tabelaEnderecos(obj.items[0].CODPROD);

                }
            }
            document.getElementById("load1").setAttribute("class", "font-red display-hide");
        }
    };
 
    var sql = "select codprod, referencia, descricao, embalagem, unidade from msproduto where codbarra = '"+codbarra+"' and rownum = 1;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function tabelaEnderecos(codprod) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("load1").setAttribute("class", "font-red display-show");
            document.getElementById("divEnderecos").setAttribute("class", "display-show");
            //document.getElementById("ret").setAttribute("class", "alert alert-success display-hide");
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                var htmlTabela = "";
                if (obj.totalCount == 0) {
                    htmlTabela += '                    <span class="font-red">Nenhum endere&ccedil;o cadastrado...</spam>';
                } else {
                    //htmlTabela += '<div class="portlet light bordered">';
                    //htmlTabela += '    <div class="portlet-title tabbable-line">';
                    htmlTabela += '        <div class="table-scrollable">';
                    htmlTabela += '            <table class="table table-condensed table-striped flip-content">';
                    htmlTabela += '                <thead>';
                    htmlTabela += '                    <tr>';
                    htmlTabela += '                        <td><b> </b></td>';
                    //htmlTabela += '                        <td><b>Cod</b></td>';
                    //htmlTabela += '                        <td><b>Fil</b></td>';
                    htmlTabela += '                        <td><b>Tipo</b></td>';
                    htmlTabela += '                        <td><b>Dep</b></td>';
                    htmlTabela += '                        <td><b>Rua</b></td>';
                    htmlTabela += '                        <td><b>Pr&eacute;dio</b></td>';
                    htmlTabela += '                        <td><b>N&iacute;vel</b></td>';
                    htmlTabela += '                        <td><b>Apt</b></td>';
                    htmlTabela += '                    </tr>';
                    htmlTabela += '                </thead>';
                    htmlTabela += '                <tbody>';
                    for(var i = 0; i < obj.items.length; i++) {
                        htmlTabela += '                    <tr>';
                        htmlTabela += '                        <td>';
                        htmlTabela += '                            <button class="btn btn-icon-only red" type="button" onclick="removerEndereco('+obj.items[i].CODENDER+', '+obj.items[i].CODFILIAL+', '+codprod+');">';
                        htmlTabela += '                                <i class="fa fa-trash"></i>'
                        htmlTabela += '                            </button>';
                        htmlTabela += '                        </td>';
                        //htmlTabela += '                        <td>'+ obj.items[i].CODENDER +'</td>';
                        //htmlTabela += '                        <td>'+ obj.items[i].CODFILIAL +'</td>';
                        htmlTabela += '                        <td>'+ obj.items[i].TP +'</td>';
                        htmlTabela += '                        <td>'+ obj.items[i].DEPOSITO +'</td>';
                        htmlTabela += '                        <td>'+ obj.items[i].RUA +'</td>';
                        htmlTabela += '                        <td>'+ obj.items[i].PREDIO +'</td>';
                        htmlTabela += '                        <td>'+ obj.items[i].NIVEL +'</td>';
                        htmlTabela += '                        <td>'+ obj.items[i].APTO +'</td>';
                        htmlTabela += '                    </tr>';
                    } 
                    htmlTabela += '                </tbody>';
                }
                htmlTabela += '            </table>';
                htmlTabela += '        </div>';
                //htmlTabela += '</div>';
            }
            document.getElementById("tbEnderecos").innerHTML = htmlTabela;
            document.getElementById("load1").setAttribute("class", "font-red display-hide");
        }
    };
    //var sql = "select e.codender, to_number(e.codfilial) codfilial, e.deposito, e.rua, e.predio, e.nivel, e.apto from msenderpk pk, msendereco e where e.codender = pk.codender_unidade and pk.codprod = "+codprod+" order by to_number(e.codfilial), e.deposito, e.rua, e.predio, e.nivel, e.apto";
    var sql = ""; 
        sql += "select e.codender, to_number(e.codfilial) codfilial, e.deposito, e.rua, e.predio, e.nivel, e.apto, decode(e.tipo,'U','Pk.Und','P','Pulmão','-') tp ";
        sql += "from msestend ee, msendereco e ";
        sql += "where e.codender = ee.codender and ee.codprod = "+codprod+" ";
        sql += "order by to_number(e.codfilial), e.deposito, e.rua, e.predio, e.nivel, e.apto, decode(e.tipo,'U','Pk.Und','P','Pulmão','-'); ";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function enderecar(codbarra, codprod) {
    checkCookie();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("load1").setAttribute("class", "font-red display-show");
            document.getElementById("ret").setAttribute("class", "alert alert-success display-hide");
            document.getElementById("divEnderecos").setAttribute("class", "display-show");
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    document.getElementById("soundBip").play();
                    document.getElementById("ret").setAttribute("class", "alert alert-success display-show");
                    document.getElementById("ret").innerHTML = "Produto endere&ccedil;ado!";
                    document.getElementById("codbarraEnder").value = "";
                    document.getElementById("wmsCodbarra").select();
                    document.getElementById("wmsCodbarra").focus();
                    tabelaEnderecos(codprod);
                } else {
                    document.getElementById("soundError").play();
                    document.getElementById("codbarraEnder").select();
                    document.getElementById("ret").setAttribute("class", "alert alert-danger display-show");
                    document.getElementById("ret").innerHTML = obj.items[0].RETORNO;
                }
            }
            document.getElementById("load1").setAttribute("class", "font-red display-hide");
        }
    };
 
    var sql = "begin web_wms.enderecar('"+codbarra+"', '"+codprod+"', :p_cursor); end;";
    //console.log(getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql);
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function removerEndereco(codender, codfilial, codprod) {
    checkCookie();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("load1").setAttribute("class", "font-red display-show");
            document.getElementById("ret").setAttribute("class", "alert alert-success display-hide");
            document.getElementById("divEnderecos").setAttribute("class", "display-show");
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    document.getElementById("soundBip").play();
                    document.getElementById("codbarraEnder").focus();
                    document.getElementById("codbarraEnder").select();
                    document.getElementById("ret").setAttribute("class", "alert alert-success display-show");
                    document.getElementById("ret").innerHTML = "Produto removido do endere&ccedil;o!";
                    tabelaEnderecos(codprod);
                } else {
                    document.getElementById("soundError").play();
                    document.getElementById("ret").setAttribute("class", "alert alert-danger display-show");
                    document.getElementById("ret").innerHTML = obj.items[0].RETORNO;
                }
            }
            document.getElementById("load1").setAttribute("class", "font-red display-hide");
        }
    };
 
    var sql = "begin web_wms.remEndereco('"+codender+"', '"+codfilial+"', '"+codprod+"', :p_cursor); end;";
    //console.log(getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql);
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function WMSBuscarProdutos() {
    var consultaProd = encodeURIComponent(document.getElementById("WMSConsultaProd").value);
    if (consultaProd.length = 0) {
        return;
    }
    document.getElementById("resultWMSConsultaProd").innerHTML = "...";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("resultWMSConsultaProd").innerHTML = "Carregando...";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                var consultaProd = "";
                if (Number(obj.totalCount) == 0) { 
                     consultaProd += '<h4 class="text-danger">Nenhum resultado encontrado...</h4> ';
                } else {
                    for(var i = 0; i < obj.items.length; i++) {
                        consultaProd += '<h4> ';
                        consultaProd += '<button class="btn green" data-dismiss="modal" aria-hidden="true" type="button" onClick="WMSsetCodBarra('+obj.items[i].CODBARRA+')"><i class="fa fa-check"></i></button> ';
                        consultaProd += obj.items[i].CODPROD+' - '+obj.items[i].DESCRICAO+' - '+obj.items[i].EMBALAGEM+' - '+obj.items[i].UNIDADE;
                        consultaProd += '</h4>';
                    }      
                }                   
            }
            document.getElementById("resultWMSConsultaProd").innerHTML = consultaProd;
        }
    };
 
    var sql = "select x.codprod, x.descricao, x.embalagem, x.unidade, x.codbarra, rownum from (select p.codprod, p.descricao, p.embalagem, p.unidade, p.codbarra from msproduto p where p.dtexclusao is null and removeacento(to_char(p.codprod)||p.descricao||p.referencia||p.codbarra) like removeacento('%25"+consultaProd+"%25') ) x where rownum <= 20 order by x.descricao;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function WMSsetCodBarra(codbarra) {
    
    document.getElementById("wmsCodbarra").value = codbarra;
    WMSConsultaProd();
}

function buscarEnderecos() {
    var ceFilial = document.getElementById("ceFilial").value;
    var ceDep = document.getElementById("ceDep").value;
    var ceRua = document.getElementById("ceRua").value;
    var cePredio = document.getElementById("cePredio").value;
    var ceNivel = document.getElementById("ceNivel").value;
    var ceApto = document.getElementById("ceApto").value;
    var sql = "select x.* from (select codender, codbarra, codfilial, deposito, rua, predio, nivel, apto, decode(tipo,'U','Pk.Und','P','Pulmão','-') tp from msendereco where tipo in ('U', 'P') ";
    if (Number(ceFilial)>-1) {
        sql += " and to_number(codfilial)  = "+ceFilial;
    }
    if (Number(ceDep)>-1) {
        sql += " and deposito = "+ceDep;
    }
    if (Number(ceRua)>-1) {
        sql += " and rua = "+ceRua;
    }
    if (Number(cePredio)>-1) {
        sql += " and predio = "+cePredio;
    }
    if (Number(ceNivel)>-1) {
        sql += " and nivel = "+ceNivel;
    }
    if (Number(ceApto)>-1) {
        sql += " and apto = "+ceApto;
    }
    sql += ") x where rownum <= 20 order by to_number(x.codfilial), 4,5,6,7,8";


    document.getElementById("resultConsultaEnder").innerHTML = "...";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("resultConsultaEnder").innerHTML = "Carregando...";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                var consultaEnder = "";
                if (Number(obj.totalCount) == 0) { 
                     consultaEnder += '<h4 class="text-danger">Nenhum resultado encontrado...</h4> ';
                } else {
                    for(var i = 0; i < obj.items.length; i++) {
                        consultaEnder += '<h4> ';
                        consultaEnder += '<button class="btn green" data-dismiss="modal" aria-hidden="true" type="button" onClick="setEndereco('+"'"+obj.items[i].CODBARRA+"'"+')"><i class="fa fa-check"></i></button> ';
                        consultaEnder += 'Tipo: <b>'+obj.items[i].TP+'</b> / ';
                        consultaEnder += 'Filial: <b>'+obj.items[i].CODFILIAL+'</b> / ';
                        consultaEnder += 'Dep: <b>'+obj.items[i].DEPOSITO+'</b> / ';
                        consultaEnder += 'Rua: <b>'+obj.items[i].RUA+'</b> / ';
                        consultaEnder += 'Prd: <b>'+obj.items[i].PREDIO+'</b> / ';
                        consultaEnder += 'Nvl: <b>'+obj.items[i].NIVEL+'</b> / ';
                        consultaEnder += 'Apto: <b>'+obj.items[i].APTO+'</b> ';
                        consultaEnder += '</h4>';
                    }      
                }                   
            }
            document.getElementById("resultConsultaEnder").innerHTML = consultaEnder;
        }
    };
 
    //console.log(getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql);
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function setEndereco(codendereco) {
    document.getElementById("codbarraEnder").value = codendereco;
    document.getElementById("codbarraEnder").focus();
    document.getElementById("codbarraEnder").select();
    enderecar(codendereco, document.getElementById("hidCodprod").value);
}

function selectFiltros(sql, cont, vlpadrao, descricaoPadrao, idSelect) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById(cont).innerHTML = "Carregando...";
        } else {

            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);

                var htmlLista = "";
                var qtReg = 0;
                htmlLista += '<select class="form-control" name="'+idSelect+'" id="'+idSelect+'" onchange="buscarEnderecos();">';
                htmlLista += '    <option value="'+vlpadrao+'" selected="selected"> '+descricaoPadrao+' </option>';
                
                for(var i = 0; i < obj.items.length; i++) {
                    qtReg = qtReg + 1;

                    htmlLista += '<option value="'+obj.items[i].VALOR+'">'+obj.items[i].DESCRICAO+'</option>';

                }

                htmlLista += '</select>';

                if (qtReg == 0) {
                    htmlLista = "";
                }
            }
        }
        document.getElementById(cont).innerHTML = htmlLista;
    };
    //console.log('criou -> '+cont);
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function sepPedidosAbertos() {
    var ord = document.getElementById("sepInputFiltroOrdem").value;
    var htmlLista = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("sepDivListaPedidosAbertos").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) { 
                     htmlLista += '<h3 class="text-danger">Nenhum pedido aberto encontrado...</h3> ';
                } else {
                    htmlLista += '<div class="table-scrollable table-scrollable-borderless">';
                    htmlLista += '    <table class="table table-hover table-light" id="sepTabelaPedidosAbertos">';
                    for(var i = 0; i < obj.items.length; i++) {
                        htmlLista += '        <tr onClick="sepSelecionarPedido('+obj.items[i].NUMTRANS+','+obj.items[i].NUMPED+','+obj.items[i].CODCLI+','+"'"+obj.items[i].CLIENTE+"'"+','+"'"+obj.items[i].DTEMISSAO+"'"+');">';
                        htmlLista += '            <td>';
                        htmlLista += '                <span class="font-'+obj.items[i].COR+'"><b>N&ordm;.Ped.: '+obj.items[i].NUMPED+' | '+obj.items[i].DTEMISSAO+' | '+obj.items[i].CODCLI+' - '+obj.items[i].CLIENTE+'</b><br /><span class="text-muted">'+obj.items[i].POSICAOTXT+' - '+obj.items[i].SITUACAO+'</span>';
                        htmlLista += '            </td>';
                        htmlLista += '        </tr> ';
                    }   
                    htmlLista += '    </table>';
                    htmlLista += '</div>';
                }                   
            }
            document.getElementById("sepDivListaPedidosAbertos").innerHTML = htmlLista;
        }
    };
 
    var sql = "";
        sql += "";
        sql += "select n.numped, n.numtrans, to_char(n.dtemissao, 'dd/mm/yyyy') dtemissao, n.codcli, c.nome cliente ";
        sql += "  ,n.posicao, decode(n.posicao,'P','Pendente','L','Liberado','B','Bloqueado','M','Montado', '--') posicaoTxt ";
        sql += "  ,case ";
        sql += "    when n.dtiniciosep is null and n.dtinicio_conf is null then 'Novo' ";
        sql += "    when n.dtiniciosep is not null and n.dtfimsep is null then 'Em Separação' ";
        sql += "  end situacao ";
        sql += "  ,case  ";
        sql += "    when n.dtiniciosep is null and n.dtinicio_conf is null then 'green-jungle' ";
        sql += "    when n.dtiniciosep is not null and n.dtfimsep is null then 'yellow-crusta' ";
        sql += "    else 'dark' ";
        sql += "  end cor ";
        sql += "from msnf n, mscliente c ";
        sql += "where n.codcli = c.codcli ";
        sql += "and n.numped is not null ";
        sql += "and ((n.dtiniciosep is null and n.dtinicio_conf is null) ";
        sql += "  or (n.dtiniciosep is not null and n.dtfimsep is null)) ";
        sql += "and n.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") ";
        sql += "and nvl(n.posicao,'X') not in ('F','C','X') ";
        sql += "order by ";

        if (Number(ord) == 0) {
            sql += "n.dtemissao desc, n.numtrans desc;";
        }
        if (Number(ord) == 1) {
            sql += "to_number(decode(n.posicao,'L',0,'P',1,2)), n.numtrans desc;";
        }
        if (Number(ord) == 2) {
            sql += "to_number(case  ";
            sql += "  when n.dtiniciosep is null and n.dtinicio_conf is null then 0 ";
            sql += "  when n.dtiniciosep is not null and n.dtfimsep is null then 1 ";
            //sql += "  when n.dtfimsep is not null and n.dtinicio_conf is null then 2 ";
            //sql += "  when n.dtinicio_conf is not null and n.dtfim_conf is null then 3 ";
            //sql += "  when n.dtfim_conf is not null then 4 ";
            sql += "  else 5 ";
            sql += "end), n.numtrans desc;";
        }
        if (Number(ord) == 3) {
            sql += "n.numped desc; ";
        }
        if (Number(ord) == 4) {
            sql += "c.nome, n.numtrans desc; ";
        }

    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function sepSelecionarPedido(numtrans, numped, codcli, cliente, dtemissao) {

    document.getElementById("sepContHidPedSel").value = numped;
    document.getElementById("sepContHidTransPedSel").value = numtrans;
    document.getElementById("sepContDivInputCodigo").innerHTML = "";
    document.getElementById("sepDivRetSeparacao").innerHTML = "";

    var sqlFiltroProdPed = "";
        sqlFiltroProdPed += "select prd.* from ( ";
        sqlFiltroProdPed += "  select p.codbarra as RETORNO, substr(p.descricao||' - '||p.embalagem||' '||p.unidade,0,45) as DESCRICAO ";
        sqlFiltroProdPed += "    ,m.codmarca, m.marca ";
        sqlFiltroProdPed += "    ,p.codsec, s.descricao secao ";
        sqlFiltroProdPed += "    ,s.codepto, d.descricao departamento ";
        sqlFiltroProdPed += "  from msproduto p, msdepartamento d, mssecao s, msmarca m, msmov mv, msnf n ";
        sqlFiltroProdPed += "  where p.dtexclusao is null ";
        sqlFiltroProdPed += "  and p.codsec = s.codsec (+) ";
        sqlFiltroProdPed += "  and s.codepto = d.codepto (+) ";
        sqlFiltroProdPed += "  and p.codmarca = m.codmarca (+) ";
        sqlFiltroProdPed += "  and p.codprod = mv.codprod ";
        sqlFiltroProdPed += "  and mv.numtrans = n.numtrans ";
        sqlFiltroProdPed += "  and n.numped = "+numped+" ";
        sqlFiltroProdPed += "  and removeacento(to_char(p.codprod)||p.codbarra||p.descricao||m.marca||s.descricao||d.descricao) like upper(strConsulta) ";
        sqlFiltroProdPed += "  order by p.descricao ";
        sqlFiltroProdPed += ") prd where rownum <= 100; ";        
    filtroConsulta("sepContDivInputCodigo", "sepContInputCodigo", "C&oacute;digo", "", "sepContModalCodigo", sqlFiltroProdPed, 'xlarge', 1);  

    document.getElementById("sepAbaPedidos").setAttribute("class", "tab-pane fade");
    document.getElementById("sepAbaSeparacao").setAttribute("class", "tab-pane fade active in");
    document.getElementById("sepHAbaPedidos").removeAttribute("class");
    document.getElementById("sepHAbaSeparacao").setAttribute("class", "active");

    document.getElementById("sepContHeadPedido").innerHTML = "<b>N&ordm;.Ped.: "+numped+" | "+dtemissao+" | "+codcli+" - "+cliente+"</b>";
    document.getElementById("sepContRowInputs").setAttribute("class", "row display-show");
    document.getElementById("sepContRowProds").setAttribute("class", "row display-show");
    document.getElementById("sepContInputCodigo").focus();
    document.getElementById("sepContInputCodigo").select();
    sepCarregarProdutosPed(numped);
    sepAttSttPedido(numtrans);
}

function sepAttSttPedido(numtrans) {
    var html = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("sepContSttPedido").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='60' heigth='60' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) { 
                     html += '<h3 class="text-danger">Dados de status do pedido n&aatilde;o localizados...</h3> ';
                } else {
                    html += '<h4>Separador: <b>'+obj.items[0].FUNC+'</b></h4>';
                    html += '<h4>In&iacute;cio: <b>'+obj.items[0].DTINICIOSEP+'</b> / T&eacute;rmino: <b>'+obj.items[0].DTFIMSEP+'</b></h4>';
                }                   
            } else {
                html = '<h3 class="text-danger">Erro ao localizar status do pedido.</h3>';
            }
            document.getElementById("sepContSttPedido").innerHTML = html;
        }
    };
    var sql = "";
        sql += "select ";
        sql += "  n.numtrans ";
        sql += "  ,decode(n.codfuncsep,0,'...',n.codfuncsep||' - '||f.nome) func ";
        sql += "  ,nvl(to_char(n.dtiniciosep,'dd/mm/yyyy hh24:mi'), '...') dtiniciosep ";
        sql += "  ,nvl(to_char(n.dtfimsep,'dd/mm/yyyy hh24:mi'), '...') dtfimsep ";
        sql += "from msnf n, msfunc f ";
        sql += "where ";
        sql += "  nvl(n.codfuncsep,0) = f.matricula (%2B) ";
        sql += "  and n.numtrans = "+numtrans+"; ";
        //console.log('ERRO->   '+sql);
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();  
}

function sepCarregarProdutosPed(numped) {
    var ord = document.getElementById("sepContInputOrdem").value;
    var htmlLista = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("sepContDivProdsPed").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) { 
                     htmlLista += '<h3 class="text-danger">Nenhum produto encontrado...</h3> ';
                } else {
                    if (Number(obj.items[0].SEPSALDO) == 0) {
                        document.getElementById("sepTxtModalConfSep").innerHTML = "Todos os produtos foram separados, confirmar separa&ccedil;&atilde;o?";
                    } else {
                        document.getElementById("sepTxtModalConfSep").innerHTML = "Existem produtos n&atilde;o separados no pedido, deseja confirmar separa&ccedil;&atilde;o?";
                    }
                    htmlLista += '<div class="table-scrollable table-scrollable-borderless">';
                    htmlLista += '    <table class="table table-hover table-light" id="sepTabelaProdsPed">';
                    for(var i = 0; i < obj.items.length; i++) {
                        htmlLista += '        <tr id="sepTrId'+obj.items[i].ID+'" onClick="sepContSetCodbarra('+obj.items[i].CODBARRA+', '+obj.items[i].SALDO+')">';
                        htmlLista += '            <td>';
                        htmlLista += '                <span class="font-'+obj.items[i].COR+'"><b>'+obj.items[i].ITEM+' - '+obj.items[i].CODBARRA+' ('+obj.items[i].CODPROD+') '+obj.items[i].DESCRICAO+' - '+obj.items[i].EMBALAGEM+' '+obj.items[i].UNIDADE+' </b></span><br />';
                        htmlLista += '                <span>Dep: '+obj.items[i].DEPOSITO_U+' Rua: '+obj.items[i].RUA_U+' Prd: '+obj.items[i].PREDIO_U+' Nvl: '+obj.items[i].NIVEL_U+' Apt: '+obj.items[i].APTO_U+'</span><br />';
                        htmlLista += '                <span class="text-muted">Qt.Separada: <b>'+obj.items[i].QTSEPARADA+'/'+obj.items[i].QT+'</b></span>';
                        htmlLista += '            </td>';
                        htmlLista += '        </tr> ';
                    }   
                    htmlLista += '    </table>';
                    htmlLista += '</div>';
                }                   
            }
            document.getElementById("sepContDivProdsPed").innerHTML = htmlLista;
        }
    };

    var sql = "";
        sql += "select ";
        sql += "  nvl(sum(m.qt) over(),0)-nvl(sum(m.qtseparada) over(),0) sepSaldo ";
        sql += "  ,m.id, m.item, m.codprod, p.codbarra, p.descricao, p.embalagem, p.unidade ";
        sql += "  ,m.qt, nvl(m.qtseparada,0) qtseparada, nvl(m.qt,0)-nvl(m.qtseparada,0) saldo ";
        sql += "  ,m2.deposito_u, m2.rua_u, m2.predio_u, m2.nivel_u, m2.apto_u ";
        sql += "  ,(case when nvl(m.qtseparada,0)=0 then 'dark' ";
        sql += "         when nvl(m.qtseparada,0)>0 and nvl(m.qtseparada,0)<m.qt then 'yellow-crusta' ";
        sql += "         when nvl(m.qtseparada,0)>0 and nvl(m.qtseparada,0)=m.qt then 'green-jungle' ";
        sql += "         else 'dark' ";
        sql += "  end) cor ";
        sql += "from msnf n, msmov m, msproduto p, msmov2 m2 ";
        sql += "where m.numtrans = n.numtrans ";
        sql += "and m.id = m2.idmov ";
        sql += "and m.codprod = p.codprod ";
        sql += "and n.numped = "+numped+" ";
        if (Number(ord) == 0) { 
            sql += "order by m2.deposito_u, m2.rua_u, m2.predio_u, m2.nivel_u, m2.apto_u; ";
        }
        if (Number(ord) == 1) { 
            sql += "order by m.item; ";
        }
        if (Number(ord) == 2) { 
            sql += "order by p.descricao; ";
        }

    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function sepAtualizarProd(numped, codprod) {
    var htmlLista = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            for(var i = 0; i < obj.items.length; i++) {
                htmlLista = "";
                htmlLista += '            <td>';
                htmlLista += '                <span class="font-'+obj.items[i].COR+'"><b>'+obj.items[i].ITEM+' - '+obj.items[i].CODBARRA+' ('+obj.items[i].CODPROD+') '+obj.items[i].DESCRICAO+' - '+obj.items[i].EMBALAGEM+' '+obj.items[i].UNIDADE+' </b></span><br />';
                htmlLista += '                <span>Dep: '+obj.items[i].DEPOSITO_U+' Rua: '+obj.items[i].RUA_U+' Prd: '+obj.items[i].PREDIO_U+' Nvl: '+obj.items[i].NIVEL_U+' Apt: '+obj.items[i].APTO_U+'</span><br />';
                htmlLista += '                <span class="text-muted">Qt.Separada: <b>'+obj.items[i].QTSEPARADA+'/'+obj.items[i].QT+'</b></span>';
                htmlLista += '            </td>';
                document.getElementById("sepTrId"+obj.items[i].ID).innerHTML = htmlLista;
                document.getElementById("sepTrId"+obj.items[i].ID).setAttribute("onClick", 'sepContSetCodbarra('+obj.items[i].CODBARRA+', '+obj.items[i].SALDO+')');
            }   
        }
    };

    var sql = "";
        sql += "select ";
        sql += "  m.numtrans, m.id, m.item, m.codprod, p.codbarra, p.descricao, p.embalagem, p.unidade ";
        sql += "  ,m.qt, nvl(m.qtseparada,0) qtseparada, nvl(m.qt,0)-nvl(m.qtseparada,0) saldo ";
        sql += "  ,m2.deposito_u, m2.rua_u, m2.predio_u, m2.nivel_u, m2.apto_u ";
        sql += "  ,(case when nvl(m.qtseparada,0)=0 then 'dark' ";
        sql += "         when nvl(m.qtseparada,0)>0 and nvl(m.qtseparada,0)<m.qt then 'yellow-crusta' ";
        sql += "         when nvl(m.qtseparada,0)>0 and nvl(m.qtseparada,0)=m.qt then 'green-jungle' ";
        sql += "         else 'dark' ";
        sql += "  end) cor ";
        sql += "from msnf n, msmov m, msproduto p, msmov2 m2 ";
        sql += "where m.numtrans = n.numtrans ";
        sql += "and m.id = m2.idmov ";
        sql += "and m.codprod = p.codprod ";
        sql += "and n.numped = "+numped+" ";
        sql += "and m.codprod = "+codprod+"; ";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function sepSepararProd(){
    document.getElementById("sepDivRetSeparacao").innerHTML = "";
    var numtrans = document.getElementById("sepContHidTransPedSel").value;
    var codbarra = document.getElementById("sepContInputCodigo").value;
    var qt = document.getElementById("sepContInputQtd").value;

    if ((Number(numtrans.length) == 0) || (Number(codbarra.length) == 0)|| (Number(qt.length) == 0)) {
        document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>Informe quantidade e c&oacute;digo de barras.</h2></div>";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("sepDivRetSeparacao").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-success'><h2>Produto separado!</h2></div>";
                    if (obj.items[0].ATT_STT == 'S') {
                        sepAttSttPedido(numtrans);
                    }
                    sepAtualizarProd(obj.items[0].NUMPED, obj.items[0].CODPROD);
                    document.getElementById("sepContInputCodigo").value = "";
                    document.getElementById("sepContInputCodigo").focus();
                    document.getElementById("sepContInputCodigo").select();
                    document.getElementById("sepContInputQtd").value = 1;
                    if (obj.items[0].CONCLUIDA == 'S') {
                        document.getElementById("sepTxtModalConfSep").innerHTML = "Todos os produtos foram separados, confirmar separa&ccedil;&atilde;o?";
                    } else {
                        document.getElementById("sepTxtModalConfSep").innerHTML = "Existem produtos n&atilde;o separados no pedido, deseja confirmar separa&ccedil;&atilde;o?";
                    }
                } else {
                    document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            } else {
                document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>Houve erros ao separar produto...</h2></div>";  
            }
        }
    };
 
    var sql = "begin web_wms.separar('"+numtrans+"', '"+codbarra+"', '"+qt+"', '"+getCookie("ccwMatricula")+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function sepConcluirSeparacao(){
    document.getElementById("sepDivRetSeparacao").innerHTML = "";
    var numtrans = document.getElementById("sepContHidTransPedSel").value;
    var cortar = document.getElementById("sepContHidCortar").value;
    if (Number(numtrans.length) == 0) {
        document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>Transa&ccedil;&atilde;o não localizada, recarregue a p&aacute;gina.</h2></div>";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("sepDivRetSeparacao").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    alert('Separação concluída!');
                    document.getElementById("sepAbaPedidos").setAttribute("class", "tab-pane fade active in");
                    document.getElementById("sepAbaSeparacao").setAttribute("class", "tab-pane fade");
                    document.getElementById("sepHAbaPedidos").setAttribute("class", "active");
                    document.getElementById("sepHAbaSeparacao").removeAttribute("class");
                    sepPedidosAbertos();
                } else {
                    document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            } else {
                document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>Houve erros ao concluir separa&ccedil;&atilde;o...</h2></div>";  
            }
        }
    };
    var sql = "begin web_wms.concluirSeparacao('"+numtrans+"', '"+getCookie("ccwMatricula")+"', '"+cortar+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function sepReiniciarSeparacao(){
    document.getElementById("sepDivRetSeparacao").innerHTML = "";
    var numtrans = document.getElementById("sepContHidTransPedSel").value;
    var numped = document.getElementById("sepContHidPedSel").value;
    if (Number(numtrans.length) == 0) {
        document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>Transa&ccedil;&atilde;o não localizada, recarregue a p&aacute;gina.</h2></div>";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("sepDivRetSeparacao").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    //alert('Separação reiniciada!');
                    document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-success'><h2>Separa&ccedil;&atilde;o reiniciada...</h2></div>";
                    //document.getElementById("sepAbaPedidos").setAttribute("class", "tab-pane fade active in");
                    //document.getElementById("sepAbaSeparacao").setAttribute("class", "tab-pane fade");
                    //document.getElementById("sepHAbaPedidos").setAttribute("class", "active");
                    //document.getElementById("sepHAbaSeparacao").removeAttribute("class");
                    //sepPedidosAbertos();
                    sepAttSttPedido(numtrans);
                    sepCarregarProdutosPed(numped);
                } else {
                    document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            } else {
                document.getElementById("sepDivRetSeparacao").innerHTML = "<div class='alert alert-danger'><h2>Houve erros ao reiniciar separa&ccedil;&atilde;o...</h2></div>";  
            }
        }
    };
    var sql = "begin web_wms.reiniciarSeparacao('"+numtrans+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function sepContSetCodbarra(codbarra, qt) {
    window.location.hash='';
    document.getElementById("sepContInputCodigo").value = codbarra;
    //document.getElementById("sepContInputQtd").value = qt;
    document.getElementById("sepContInputQtd").value = 1;
    document.getElementById("sepContInputCodigo").focus();
    document.getElementById("sepContInputCodigo").select();
    window.location.hash='sepContHeadPedido';
}

function sepGestAtualizar() {
    var codfilial = document.getElementById("gestSepCodfilialFil").value;
    var dtIni = document.getElementById("gestSepDtIniFil").value;
    var dtFim = document.getElementById("gestSepDtFimFil").value;
    var segundos = document.getElementById("gestSepSegAuto").value;
    if (segundos.length == 0 || segundos == 0) {
        segundos = 0;
    }

    quadro("select count(*) as VALOR from msnf n where n.numped is not null and n.dtiniciosep is null and n.dtinicio_conf is null and nvl(n.posicao,'X') not in ('F','C','X') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and trunc(n.dtemissao) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtemissao) <= to_date('"+dtFim+"', 'dd/mm/yyyy')", "sepGestQd1", "A Separar", "inbox", "blue-sharp", " ", " ");
    quadro("select count(*) as VALOR from msnf n where n.numped is not null and n.dtiniciosep is not null and n.dtfimsep is null and nvl(n.posicao,'X') not in ('F','C','X') and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and trunc(n.dtiniciosep) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtiniciosep) <= to_date('"+dtFim+"', 'dd/mm/yyyy')", "sepGestQd2", "Em Separação", "clock-o", "yellow-gold", " ", " ");
    quadro("select count(*) as VALOR from msnf n where n.numped is not null and n.dtiniciosep is not null and n.dtfimsep is not null and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+") and trunc(n.dtfimsep) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtfimsep) <= to_date('"+dtFim+"', 'dd/mm/yyyy')", "sepGestQd3", "Separados", "check", "green-jungle", " ", " ");

    var sqlPadrSeparadores = "";
        sqlPadrSeparadores += "select x.separador as %22Separador%22, x.qtd as %22Qtd.%22, x.valor as %22Valor%22, 'Total: R$ '||formatar_valor(sum(x.valor2) over()) as rodape from (";
        sqlPadrSeparadores += "select f.matricula||' - '||f.nome separador, count(*) qtd, 'R$ '||formatar_valor(sum(n.vltotal)) valor, sum(n.vltotal) valor2 ";
        sqlPadrSeparadores += "from msnf n, msfunc f ";
        sqlPadrSeparadores += "where n.codfuncsep = f.matricula ";
        sqlPadrSeparadores += "and n.numped is not null ";
        sqlPadrSeparadores += "and n.codfilial in ("+vetorTexto(codfilial, document.getElementById("todasFiliais").value)+")  ";

    autoTabela(sqlPadrSeparadores+"and n.dtfimsep is not null and trunc(n.dtfimsep) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtfimsep) <= to_date('"+dtFim+"', 'dd/mm/yyyy') group by f.matricula, f.nome order by 2 desc, 3 desc, f.nome) x", "sepGestTb1", "Ranking de Separação",0);

    autoTabela(sqlPadrSeparadores+"and n.dtiniciosep is not null and n.dtfimsep is null and nvl(n.posicao,'X') not in ('F','C','X') and trunc(n.dtiniciosep) >= to_date('"+dtIni+"', 'dd/mm/yyyy') and trunc(n.dtiniciosep) <= to_date('"+dtFim+"', 'dd/mm/yyyy') group by f.matricula, f.nome order by 2 desc, 3 desc, f.nome) x", "sepGestTb2", "Operadores em Separação", 0);


    clearTimeout("sepGestAtualizar();");
    if (segundos > 0) {
        setTimeout("sepGestAtualizar();", segundos*1000);
    }

}