function carregarPadroesInventario(idmenu) {
    var sqlFiltInventAberto = "";
        sqlFiltInventAberto += "select i.numinvent as RETORNO ";
        sqlFiltInventAberto += "  ,substr('Fl.: '||i.codfilial||' - Dt.: '||to_char(i.data, 'dd/mm/yyyy hh24:mi:ss')||' '||(case when i.dttermino is null then '(A)' else '(F)' end),0,45) as DESCRICAO ";
        sqlFiltInventAberto += "from msinventario i, msfilial f ";
        sqlFiltInventAberto += "where i.codfilial = f.codfilial ";
        sqlFiltInventAberto += "and i.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") ";
        sqlFiltInventAberto += "and removeacento(to_char(i.numinvent)||i.codfilial||f.razaosocial||f.nome_fantasia) like upper(strConsulta) ";
        sqlFiltInventAberto += "and i.dttermino is null order by 1 desc; ";
    var sqlFiltAddProdInvManut = "";
        sqlFiltAddProdInvManut += "select prd.* from ( ";
        sqlFiltAddProdInvManut += "  select p.codprod as RETORNO, substr(p.descricao||' - '||p.embalagem||' '||p.unidade,0,45) as DESCRICAO ";
        sqlFiltAddProdInvManut += "    ,m.codmarca, m.marca ";
        sqlFiltAddProdInvManut += "    ,p.codsec, s.descricao secao ";
        sqlFiltAddProdInvManut += "    ,s.codepto, d.descricao departamento ";
        sqlFiltAddProdInvManut += "  from msproduto p, msdepartamento d, mssecao s, msmarca m ";
        sqlFiltAddProdInvManut += "  where p.dtexclusao is null ";
        sqlFiltAddProdInvManut += "  and p.codsec = s.codsec (+) ";
        sqlFiltAddProdInvManut += "  and s.codepto = d.codepto (+) ";
        sqlFiltAddProdInvManut += "  and p.codmarca = m.codmarca (+) ";
        sqlFiltAddProdInvManut += "  and removeacento(to_char(p.codprod)||p.codbarra||p.descricao||m.marca||s.descricao||d.descricao) like upper(strConsulta) ";
        sqlFiltAddProdInvManut += "  order by p.descricao ";
        sqlFiltAddProdInvManut += ") prd where rownum <= 100 ";
    var sqlFiltInventCodmarca = "select marca as ord, codmarca as RETORNO, substr(marca,0,45) as DESCRICAO from msmarca where removeacento(to_char(codmarca)||marca) like upper(strConsulta) order by 1;";
    var sqlFiltInventCodepto = "select codepto as ord, codepto as RETORNO, substr(descricao,0,45) as DESCRICAO from msdepartamento where removeacento(to_char(codepto)||descricao) like upper(strConsulta) order by 1;";
    var sqlFiltInventCodsec = "select codsec as ord, codsec as RETORNO, substr(descricao,0,45) as DESCRICAO from mssecao where removeacento(to_char(codsec)||descricao) like upper(strConsulta) order by 1;";
    var sqlFiltInventEndereco = "";
        sqlFiltInventEndereco += "select e.codbarra as RETORNO ";
        sqlFiltInventEndereco += "  ,substr('Fl.:'||e.codfilial||' '||decode(e.tipo,'U','Pk.Und','P','Pulmão','-')||' Dep:'||e.deposito||' Prd:'||e.predio||' Rua:'||e.rua||' Nvl:'||e.nivel||' Apt:'||e.apto, 0, 50) as DESCRICAO ";
        sqlFiltInventEndereco += "  ,to_number(e.codfilial),e.deposito,e.predio,e.rua,e.nivel,e.apto ";
        sqlFiltInventEndereco += "from msendereco e ";
        sqlFiltInventEndereco += "where ";
        sqlFiltInventEndereco += "e.codfilial not in ("+vetorTexto(document.getElementById("flRestritas").value, '0')+") ";
        sqlFiltInventEndereco += "and removeacento(e.codfilial||to_char(e.codbarra)||'Fl.:'||e.codfilial||' Dep:'||to_char(e.deposito)||' '||' Prd:'||to_char(e.predio)||' Rua:'||to_char(e.rua)||' Nvl:'||to_char(e.nivel)||' Apt:'||to_char(e.apto)) like upper(strConsulta) ";
        sqlFiltInventEndereco += "order by 3,4,5,6,7,8 desc; ";


    //Filtros Montagem
        if (Number(idmenu) == 12) {
            filtroConsulta("invMontDivFiltroCodfilial", "invMontInputFiltroCodfilial", "C&oacute;d.Filial", "", "invMontModalCodfilial", "select to_number(codfilial) as ord, codfilial as RETORNO, substr(razaosocial,0,45) as DESCRICAO from msfilial where dtexclusao is null and removeacento(codfilial||razaosocial||nome_fantasia) like upper(strConsulta) order by 1;");
            filtroConsulta("invMontDivFiltroCodmarca", "invMontInputFiltroCodmarca", "C&oacute;d.Marca", "", "invMontModalCodmarca", sqlFiltInventCodmarca);
            filtroConsulta("invMontDivFiltroCodepto", "invMontInputFiltroCodepto", "C&oacute;d.Depart.", "", "invMontModalCodepto", sqlFiltInventCodepto);
            filtroConsulta("invMontDivFiltroCodsec", "invMontInputFiltroCodsec", "C&oacute;d.Se&ccedil;&atilde;o", "", "invMontModalCodsec", sqlFiltInventCodsec);
        }
    //Filtros Manutenção
        if (Number(idmenu) == 13) {
            filtroConsulta("invManutDivFiltroNuminvent", "invManutInputFiltroNuminvent", "N&ordm; Invent&aacute;rio", "", "invManutModalNuminvent", sqlFiltInventAberto);
            filtroConsulta("invManutDivFiltroCodprod2", "invManutInputFiltroCodprod2", "C&oacute;d. Produto", "", "invManutModalCodprod2", sqlFiltAddProdInvManut);
            filtroConsulta("invManutDivFiltroCodprod", "invManutInputFiltroCodprod", "C&oacute;d. Produto", "", "invManutModalCodprod", sqlFiltAddProdInvManut);
        }
    // Filtros Contagem
        if (Number(idmenu) == 14) {
            var invContPermEnder = document.getElementById("invContHiddenPermEnder").value;
            filtroConsulta("invContDivFiltroNuminvent", "invContInputFiltroNuminvent", "N&ordm; Invent&aacute;rio", "", "invContModalNuminvent", sqlFiltInventAberto);
            filtroConsulta("invContDivInputCodigo", "invContInputCodigo", "C&oacute;digo", "", "invContModalCodigo", sqlFiltAddProdInvManut, 'xlarge', 1);  
            filtroConsulta("invContDivInputCodigo2", "invContInputCodigo2", "C&oacute;digo", "", "invContModalCodigo2", sqlFiltAddProdInvManut, 'xlarge', 1);  

            if (invContPermEnder == "S") {
                //document.getElementById("invContDivEnderecamento").setAttribute("class", "row display-show");
                document.getElementById("invContDivInputEndereco").setAttribute("class", "form-group form-md-line-input has-success");
                filtroConsulta("invContDivInputEndereco", "invContInputEndereco", "C&oacute;d.Barra Endere&ccedil;o", "", "invContModalEndereco", sqlFiltInventEndereco, 'medium', 1);
            }
        }
    // Filtro Acompanhamento 
        if (Number(idmenu) == 15) {
            filtroConsulta("invAcompDivFiltroNuminvent", "invAcompInputFiltroNuminvent", "N&ordm; Invent&aacute;rio", "", "invAcompModalNuminvent", sqlFiltInventAberto.replace("and i.dttermino is null", " "));
            filtroConsulta("invAcompDivFiltroCodprod", "invAcompInputCodprod", "C&oacute;d. Produto", "", "invAcompModalCodprod", sqlFiltAddProdInvManut); 
            filtroConsulta("invAcompDivFiltroCodmarca", "invAcompInputFiltroCodmarca", "C&oacute;d.Marca", "", "invAcompModalCodmarca", sqlFiltInventCodmarca);
            filtroConsulta("invAcompDivFiltroCodepto", "invAcompInputFiltroCodepto", "C&oacute;d.Depart.", "", "invAcompModalCodepto", sqlFiltInventCodepto);
            filtroConsulta("invAcompDivFiltroCodsec", "invAcompInputFiltroCodsec", "C&oacute;d.Se&ccedil;&atilde;o", "", "invAcompModalCodsec", sqlFiltInventCodsec);
        }
    // Filtro Finalizar
        if (Number(idmenu) == 16) {
            filtroConsulta("invFinDivFiltroNuminvent", "invFinInputFiltroNuminvent", "N&ordm; Invent&aacute;rio", "", "invFinModalNuminvent", sqlFiltInventAberto, 'xlarge');
        }
}

function invContVerConfig() {
    var atual = document.getElementById("invContVerConfigAtual").value;
    if (Number(atual) == 0) {
        document.getElementById("invContRowConfig").setAttribute("class", "row display-show");
        document.getElementById("iconInvContVerConfig").setAttribute("class", "fa fa-eye-slash");
        document.getElementById("invContVerConfigAtual").value = 1;
    }
    if (Number(atual) == 1) {
        document.getElementById("invContRowConfig").setAttribute("class", "row display-hide");
        document.getElementById("iconInvContVerConfig").setAttribute("class", "fa fa-eye");
        document.getElementById("invContVerConfigAtual").value = 0;
    }
}

function invContVerConsulta() {
    var atual = document.getElementById("invContVerConsultaAtual").value;
    if (Number(atual) == 0) {
        document.getElementById("invContRowConsulta").setAttribute("class", "row display-show");
        document.getElementById("iconInvContVerConsulta").setAttribute("class", "fa fa-eye-slash");
        document.getElementById("invContVerConsultaAtual").value = 1;
    }
    if (Number(atual) == 1) {
        document.getElementById("invContRowConsulta").setAttribute("class", "row display-hide");
        document.getElementById("iconInvContVerConsulta").setAttribute("class", "fa fa-eye");
        document.getElementById("invContVerConsultaAtual").value = 0;
    }
}

function invMontFiltrar() {
    var codfilial = document.getElementById("invMontInputFiltroCodfilial").value;
    var codmarca = document.getElementById("invMontInputFiltroCodmarca").value;
    var codepto = document.getElementById("invMontInputFiltroCodepto").value;
    var codsec = document.getElementById("invMontInputFiltroCodsec").value;
    var estoque = document.getElementById("invMontInputFiltroEstoque").value;
    var descricao = encodeURIComponent(document.getElementById("invMontInputFiltroDesc").value);
    if (codmarca.length == 0 || codmarca == '0') {
        codmarca = '0';
    }
    if (codepto.length == 0 || codepto == '0') {
        codepto = '0';
    }
    if (codsec.length == 0 || codsec == '0') {
        codsec = '0';
    }
    var ret = "";
    var qtReg = 0;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invMontRetornoProdutos").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) {
                    ret = "<div align='center'><h3 class='text-danger'>Nenhum produto encontrado...</h3></div>";
                } else {
                    if (Number(obj.items[0].QTFL) == 0) {
                        ret = "<div align='center'><h3 class='text-danger'>Informe uma Filial v&aacute;lida.</h3></div>";
                    } else {
                        if (Number(obj.items[0].PROD_INVABERTO) > 0) {
                            ret += "<h2 class='text-danger'>Existem produtos dessa lista montados no invent&aacute;rio <b>"+obj.items[0].MAX_INVABERTO+"</b><br />Finalize ou Cancele o invent&aacute;rio para montar um novo.</h2>";
                        } else {
                            ret += "<h2 class='text-primary'><b>"+obj.items[0].QTREG+"</b> produtos encontrados.<h2/>";
                            ret += '<h3>Montar invent&aacute;rio dos produtos abaixo listados?&nbsp;<button class="btn btn-success" type="button" onClick="montarInventario('+"'"+codfilial+"'"+","+"'"+codmarca+"'"+","+"'"+codepto+"'"+","+"'"+codsec+"'"+","+"'"+estoque+"'"+","+"'"+descricao+"'"+');">Montar Invent&aacute;rio</button><h3/>';
                            ret += "<div class='table-scrollable'>";
                            ret += "    <table class='table table-condensed table-hover'>";
                            ret += "        <thead>";
                            ret += "            <tr>";
                            ret += "                <th>C&oacute;d.</th>";
                            ret += "                <th>Produto</th>";
                            ret += "                <th>Embalagem</th>";
                            ret += "                <th>Marca</th>";
                            ret += "                <th>Departamento</th>";
                            ret += "                <th>Se&ccedil;&atilde;o</th>";
                            ret += "                <th>Estoque Atual</th>";
                            ret += "            </tr>";
                            ret += "        </thead>";
                            ret += "        <tbody>";
                            for(var i = 0; i < obj.items.length; i++) {
                                ret += "            <tr>";
                                ret += "                <td>"+obj.items[i].CODPROD   +"</td>";
                                ret += "                <td>"+obj.items[i].DESCRICAO +"</td>";
                                ret += "                <td>"+obj.items[i].EMBALAGEM + " - " + obj.items[i].UNIDADE+"</td>";
                                ret += "                <td>"+obj.items[i].CODMARCA  + " - " + obj.items[i].MARCA+".</td>";
                                ret += "                <td>"+obj.items[i].CODEPTO   + " - " + obj.items[i].DEPARTAMENTO+"</td>";
                                ret += "                <td>"+obj.items[i].CODSEC    + " - " + obj.items[i].SECAO+"</td>";
                                ret += "                <td>"+obj.items[i].QTESTGER  +"</td>";
                                ret += "            </tr>";
                            } 
                            ret += "        </tbody>";
                            ret += "    </table>";
                            ret += "</div>";
                        }
                    }
                }
            } else {
                ret = "<div align='center'><h3 class='text-danger'>Erro ao consultar produtos...</h3></div>";
            }
            document.getElementById("invMontRetornoProdutos").innerHTML = ret;
        }
    };

    var sql = "";
    sql += 'select y.* from (select rownum as rn, x.* from ( ' ;    
    sql += "select nvl(est.qtestger,0) qtestger, prd.*, fl.qtFl, count(*) over() qtReg, 500 as qtPag from ( ";  
    sql += "  select p.codprod, p.descricao, p.unidade, p.embalagem ";
    sql += "    ,m.codmarca, m.marca ";  
    sql += "    ,p.codsec, s.descricao secao ";  
    sql += "    ,s.codepto, d.descricao departamento ";
    sql += "    ,(select count(w.codprod) from msinventprod w, msinventario y where w.numinvent = y.numinvent and y.dttermino is null and w.codprod = p.codprod and codfilial = apenasNumeros('"+codfilial+"')) prod_invaberto ";
    sql += "    ,(select max(y.numinvent) from msinventprod w, msinventario y where w.numinvent = y.numinvent and y.dttermino is null and w.codprod = p.codprod and codfilial = apenasNumeros('"+codfilial+"')) max_invaberto ";
    sql += "  from msproduto p, msdepartamento d, mssecao s, msmarca m ";   
    sql += "  where p.dtexclusao is null ";   
    sql += "  and p.codsec = s.codsec (%2B) ";  
    sql += "  and s.codepto = d.codepto (%2B) ";   
    sql += "  and p.codmarca = m.codmarca (%2B) ";  
    sql += "  and decode('"+codmarca+"','0','0',m.codmarca) in ('0',"+vetorTexto(codmarca, '0')+") ";   
    sql += "  and decode('"+codepto+"','0','0',s.codepto) in ('0'," +vetorTexto(codepto, '0')+") ";   
    sql += "  and decode('"+codsec+"','0','0',p.codsec) in ('0',"  +vetorTexto(codsec, '0')+") "; 
    sql += "  and upper(p.codprod||p.codbarra||p.referencia||p.descricao||p.embalagem||p.unidade) like upper('%25"+descricao+"%25') "; 

    sql += "  order by p.descricao ";   
    sql += ") prd, ( ";   
    sql += "  select codfilial, codprod, qtestger ";   
    sql += "  from msest ";   
    sql += "  where codfilial = '"+codfilial+"' ";   
    sql += ") est, ("; 
    sql += "  select count(*) qtFl from msfilial ";   
    sql += "  where codfilial = apenasNumeros('"+codfilial+"') ";   
    sql += ") fl ";
    sql += "where ";   
    sql += "  prd.codprod = est.codprod (%2B) ";

    if (Number(estoque) != 0) {
        sql += " and nvl(est.qtestger,0) ";
        if (Number(estoque) == 1) {
            sql += "> 0 ";
        }
        if (Number(estoque) == 2) {
            sql += ">= 0 ";
        }
        if (Number(estoque) == 3) {
            sql += "= 0 ";
        }
        if (Number(estoque) == 4) {
            sql += "<= 0 ";
        }
        if (Number(estoque) == 5) {
            sql += "< 0 ";
        }
    }
    sql += "  ) x where rownum < 1 * 500 %2B 1 ) y ";
    sql += " where y.rn >= 1 * 500 - 499 ";
    sql += ";";    

    pagina = typeof pagina !== 'undefined' ? pagina : 0;

    //console.log('sql-> '+ sql);
    
	//xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    //xhttp.send();
	
    var metodo = 'GET';
    if (getCookie("ccwWS2")=='N') {
        metodo = 'GET';
    } else {
        metodo = 'POST';
    }

    if (metodo == 'GET') {
        sql = sql.replace(/<#43>/g, "%2B");
        sql = sql.replace(/<#34>/g, "%22");
        sql = sql.replace(/<#37>/g, "%25");
        //console.log('sql->   '+sql);
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }
    if (metodo == 'POST') {
        sql = sql.replace(/%2B/g, "<#43>");
        sql = sql.replace(/%22/g, "<#34>");
        sql = sql.replace(/%25/g, "%");
        xhttp.open("POST", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha"), true);
        xhttp.send(sql);
    } 
	
}

function montarInventario(codfilial, codmarca, codepto, codsec, estoque, descricao) {
    checkCookie();
    var ret = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invMontRetornoProdutos").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    ret = "<h2 class='text-success'>Invent&aacute;rio montado com sucesso.<br />N&ordm;. do invent&aacute;rio: <b>"+obj.items[0].NUMINVENT+"</b></h2>";
                } else {
                    ret = "<h2 class='text-danger'>"+obj.items[0].RETORNO+"</h2>";
                }
            } else {
                ret = "<div align='center'><h2 class='text-danger'>Houve erros ao montar invent&aacute;rio</h2></div>";  
            }
            document.getElementById("invMontRetornoProdutos").innerHTML = ret;
        }
    };
 
    var sql = "begin web_inventario.montarInventario('"+codfilial+"', '"+codmarca+"', '"+codepto+"', '"+codsec+"', '"+estoque+"', '"+descricao+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invManutFiltrar() {
    var numinvent = document.getElementById("invManutInputFiltroNuminvent").value;
    var codprod = document.getElementById("invManutInputFiltroCodprod2").value;
    if (codprod.length == 0 || codprod == '0') {
        codprod = '0';
    }
    document.getElementById("invManutDivAddProd").setAttribute("class", "display-hide");
    var ret = "";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invManutRetornoProdutos").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) {
                    ret = "<div align='center'><h3 class='text-danger'>Nenhum produto encontrado...</h3></div>";
                } else {
                    if (Number(obj.items[0].TERMINO) == 1) {
                        ret = "<div align='center'><h3 class='text-danger'>Invent&aacute;rio finalizado! N&atilde;o &eacute; poss&iacute;vel efetuar manuten&ccedil;&atilde;o...</h3></div>";
                    } else {
                        document.getElementById("invManutDivAddProd").setAttribute("class", "display-show");
                        ret += '<p><a href="#invManutModalConfirmCancel" role="button" class="btn red" data-toggle="modal"> <i class="fa fa-trash"></i> Cancelar e Excluir Invent&aacute;rio </a></p>';

                            ret += '<div id="invManutModalConfirmCancel" class="modal fade" tabindex="-1" data-width="700">';
                            ret += '	<div class="modal-header">';
                            ret += '		<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>';
                            ret += '		<h4 class="modal-title">Deseja realmente cancelar e excluir o invent&aacute;rio <b>'+obj.items[0].NUMINVENT+'</b>?</h4>';
                            ret += '	</div>';
                            ret += '	<div class="modal-body">';
                            ret += '		<p> Este processo &eacute; irreverss&iacute;vel. Contagens registradas ser&atilde;o perdidas...<br/></p>';
                            ret += '	</div>';
                            ret += '	<div class="modal-footer">';
                            ret += '		<button class="btn default" data-dismiss="modal" aria-hidden="true">N&atilde;o</button>';
                            ret += '		<button data-dismiss="modal" class="btn blue" onClick="invManutCancelar('+obj.items[0].NUMINVENT+');">Sim, estou ciente.</button>';
                            ret += '	</div>';
                            ret += '</div>';

                        ret += "<div class='table-scrollable'>";
                        ret += "    <table class='table table-condensed table-hover'>";
                        ret += "        <thead>";
                        ret += "            <tr>";
                        ret += "                <th>#</th>";
                        ret += "                <th>C&oacute;d.</th>";
                        ret += "                <th>C&oacute;d.Barra</th>";
                        ret += "                <th>Produto</th>";
                        ret += "                <th>Qtd.Estoque</th>";
                        ret += "                <th>Qtd.Contada</th>";
                        ret += "            </tr>";
                        ret += "        </thead>";
                        ret += "        <tbody>";
                        for(var i = 0; i < obj.items.length; i++) {
                            ret += "            <tr id='imlp"+obj.items[i].NUMINVENT+obj.items[i].CODPROD+"'>";
                            ret += '                <td><button class="btn btn-icon-only red" onClick="invManutRemProd('+obj.items[i].NUMINVENT+','+obj.items[i].CODPROD+');"><i class="fa fa-trash"></i></button></td>';
                            ret += "                <td>"+obj.items[i].CODPROD         +"</td>";
                            ret += "                <td>"+obj.items[i].CODBARRA        +"</td>";
                            ret += "                <td>"+obj.items[i].DESCRICAO       +"</td>";
                            ret += "                <td>"+obj.items[i].QT0             +"</td>";
                            ret += "                <td>"+obj.items[i].QTDEULTCONTAGEM +"</td>";
                            ret += "            </tr>";
                        } 
                        ret += "        </tbody>";
                        ret += "    </table>";
                        ret += "</div>";
                    }
                }
            } else {
                ret = "<div align='center'><h3 class='text-danger'>Erro ao consultar invent&aacute;rio...</h3></div>";
            }
            document.getElementById("invManutRetornoProdutos").innerHTML = ret;
        }
    };

    var sql = "";
    sql += "select i.numinvent, i.codprod, p.codbarra, p.descricao, i.qt0, i.qtdeultcontagem ";
    sql += "  ,(case when v.dttermino is null then 0 else 1 end) termino ";
    sql += "from msinventprod i, msproduto p, msinventario v ";
    sql += "where i.codprod = p.codprod ";
    sql += "and i.numinvent = v.numinvent  ";
    sql += "and i.numinvent = nvl("+numinvent+",0) ";
    sql += "and decode('"+codprod+"','0','0',i.codprod) in ('0',"+vetorTexto(codprod, '0')+") "    
    sql += "order by p.descricao; ";
    //console.log('sql-> '+ sql);
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invManutAddProd() {
    var ret = "";
    document.getElementById("invManutRetornoAcoes").innerHTML = "";
    var numinvent = document.getElementById("invManutInputFiltroNuminvent").value;
    var codprod = document.getElementById("invManutInputFiltroCodprod").value;
    if ((Number(numinvent.length) == 0) || (Number(codprod.length) == 0)) {
        document.getElementById("invManutRetornoAcoes").innerHTML = "<div class='alert alert-danger'><h2>Informe o N&ordm; do Invent&aacute;rio e C&oacute;d. do Produto.</h2></div>";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invManutRetornoAcoes").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    ret = "<div class='alert alert-success'><h2>Produto c&oacute;digo ("+obj.items[0].CODPROD+") adicionado com sucesso ao invent&aacute;rio ("+obj.items[0].NUMINVENT+").</h2></div>";
                    invManutFiltrar();
                } else {
                    ret = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            } else {
                ret = "<div class='alert alert-danger'><h2>Houve erros ao adicionar produto no invent&aacute;rio</h2></div>";  
            }
            document.getElementById("invManutRetornoAcoes").innerHTML = ret;
        }
    };
 
    var sql = "begin web_inventario.addProduto('"+numinvent+"', '"+codprod+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invManutCancelar(numinvent) {
    var ret = "";
    document.getElementById("invManutRetornoAcoes").innerHTML = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invManutRetornoAcoes").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    ret = "<div class='alert alert-success'><h2>Invent&aacute;rio <b>"+obj.items[0].NUMINVENT+"</b> exclu&iacute;do...</h2></div>";
                    document.getElementById("invManutDivAddProd").setAttribute("class", "display-hide");
                    document.getElementById("invManutRetornoProdutos").innerHTML = "";
                } else {
                    ret = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            } else {
                ret = "<div class='alert alert-danger'><h2>Houve erros ao excluir invent&aacute;rio</h2></div>";  
            }
            document.getElementById("invManutRetornoAcoes").innerHTML = ret;
        }
    };
 
    var sql = "begin web_inventario.cancelar('"+numinvent+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invManutRemProd(numinvent, codprod) {
    var ret = "";
    document.getElementById("invManutRetornoAcoes").innerHTML = "";
    if ((Number(numinvent.length) == 0) || (Number(codprod.length) == 0)) {
        document.getElementById("invManutRetornoAcoes").innerHTML = "<h2 class='text-danger'>Informe o N&ordm; do Invent&aacute;rio e C&oacute;d. do Produto.</h2>";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invManutRetornoAcoes").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    ret = "<div class='alert alert-success'><h2>Produto c&oacute;digo ("+codprod+") removido do invent&aacute;rio ("+numinvent+").</h2></div>";
                    document.getElementById("imlp"+numinvent+codprod).remove();
                } else {
                    ret = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            } else {
                ret = "<div class='alert alert-danger'><h2>Houve erros ao remover produto do invent&aacute;rio</h2></div>";  
            }
            document.getElementById("invManutRetornoAcoes").innerHTML = ret;
        }
    };
 
    var sql = "begin web_inventario.remProduto('"+numinvent+"', '"+codprod+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invContContar() {
    var ret = "";
    var logTemp = document.getElementById("invContLogContagem").innerHTML;
    var qtLog = document.getElementById("invContHiddenQtLog").value;
    var idLog = 0;
    var delLog = 0;
    var deletarLog = 0;
    var invContPermEnder = document.getElementById("invContHiddenPermEnder").value;
    document.getElementById("invContDivEnderecamento").setAttribute("class", "row display-hide");
    if (invContPermEnder == "S") {
        document.getElementById("invContInputEndereco").value = "";
    }
    if (Number(qtLog) > 19) {
        delLog = Number(qtLog)-19;
    }

    var numinvent = document.getElementById("invContInputFiltroNuminvent").value;
    var codigo = document.getElementById("invContInputCodigo").value;
    var tipoCodigo = document.getElementById("invContInputFiltroTipoCodigo").value;
    var qt = document.getElementById("invContInputQtd").value;
    var contagem = document.getElementById("invContInputFiltroNumCont").value;
    var focoRet = document.getElementById("invContInputFiltroFoco").value;

    document.getElementById("invContRetornoContagem").innerHTML = "";
    if (Number(numinvent.length) == 0) {
        document.getElementById("invContRetornoContagem").innerHTML = "<div class='alert alert-danger'><h2 class='text-danger'>Informe o N&ordm; do Invent&aacute;rio.</h2></div>";
        return;
    }
    if (Number(codigo.length) == 0) {
        document.getElementById("invContRetornoContagem").innerHTML = "<div class='alert alert-danger'><h2 class='text-danger'>Informe o C&oacute;d. do Produto ou C&oacute;d. de Barras.</h2></div>";
        return;
    }
    if (Number(qt.length) == 0) {
        document.getElementById("invContRetornoContagem").innerHTML = "<div class='alert alert-danger'><h2 class='text-danger'>Quantidade Inv&aacute;lida.</h2></div>";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invContLogContagem").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    ret = "<div class='alert alert-success'><h2>"+obj.items[0].PRODUTO+"</h2></div>";
                    idLog = Number(qtLog)+1;
                    document.getElementById("invContHiddenQtLog").value = Number(idLog);
                    deletarLog = 1;

                    logTemp = "<div id='icll_"+idLog+"'>&nbsp;&bull;&nbsp;"+obj.items[0].DTHORA+"&nbsp;|&nbsp;"+obj.items[0].PRODUTO+"&nbsp;|&nbsp;Qtd.:&nbsp;"+obj.items[0].QT+"</div>" + logTemp;

                    document.getElementById("invContInputQtd").value = 1;
                    document.getElementById("invContInputCodigo").value = "";
                    if (Number(focoRet) == 1) {
                        document.getElementById("invContInputCodigo").focus();  
                    }
                    if (Number(focoRet) == 2) {
                        document.getElementById("invContInputQtd").focus(); 
                        document.getElementById("invContInputQtd").select();
                    }
                    if (invContPermEnder == "S") {
                        document.getElementById("invContDivEnderecamento").setAttribute("class", "row display-show");
                        document.getElementById("invContHiddenCodprodEnder").value = obj.items[0].CODPROD;
                        document.getElementById("invContTituloPnEnder").innerHTML = obj.items[0].PRODUTO;
                        document.getElementById("invContInputEndereco").focus(); 
                        document.getElementById("invContInputEndereco").select();
                        invContTbEnderecos(obj.items[0].CODPROD);
                    }
                } else {
                    ret = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                    document.getElementById("invContInputCodigo").focus();
                    document.getElementById("invContInputCodigo").select();
                }
            } else {
                ret = "<div class='alert alert-danger'><h2>Houve erros ao registrar contagem</h2></div>";  
            }
            document.getElementById("invContRetornoContagem").innerHTML = ret;
            document.getElementById("invContLogContagem").innerHTML = logTemp;
            if ((Number(delLog) > 0) && (Number(deletarLog) == 1)) {
                document.getElementById("icll_"+delLog).remove();
            }
        }
    };
    var sql = "begin web_inventario.contar('"+numinvent+"', '"+codigo+"', '"+tipoCodigo+"', '"+qt+"', '"+contagem+"', '"+getCookie("ccwMatricula")+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invContTbEnderecos(codprod) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            //document.getElementById("invContRetornoEnderecos").innerHTML = "<div class='alert alert-primary'><h2>Carregando...</h2></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                var htmlTabela = "";
                if (obj.totalCount == 0) {
                    htmlTabela += '                    <span class="font-red">Nenhum endere&ccedil;o cadastrado...</spam>';
                } else {
                    htmlTabela += '        <div class="table-scrollable">';
                    htmlTabela += '            <table class="table table-condensed table-striped flip-content">';
                    htmlTabela += '                <thead>';
                    htmlTabela += '                    <tr>';
                    htmlTabela += '                        <td><b> </b></td>';
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
                        htmlTabela += '                            <button class="btn btn-icon-only red" type="button" onclick="invContRemoverEndereco('+obj.items[i].CODENDER+', '+obj.items[i].CODFILIAL+', '+codprod+');">';
                        htmlTabela += '                                <i class="fa fa-trash"></i>'
                        htmlTabela += '                            </button>';
                        htmlTabela += '                        </td>';
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
            }
            //document.getElementById("invContRetornoEnderecos").innerHTML = "";
            document.getElementById("invContTbEnderecos").innerHTML = htmlTabela;
        }
    };
    var sql = ""; 
        sql += "select e.codender, to_number(e.codfilial) codfilial, e.deposito, e.rua, e.predio, e.nivel, e.apto, decode(e.tipo,'U','Pk.Und','P','Pulmão','-') tp ";
        sql += "from msestend ee, msendereco e ";
        sql += "where e.codender = ee.codender and ee.codprod = "+codprod+" ";
        sql += "order by to_number(e.codfilial), e.deposito, e.rua, e.predio, e.nivel, e.apto, decode(e.tipo,'U','Pk.Und','P','Pulmão','-'); ";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function InvContEnderecar() {
    checkCookie();
    var codbarra = document.getElementById("invContInputEndereco").value;
    var codprod = document.getElementById("invContHiddenCodprodEnder").value;
    var focoRet = document.getElementById("invContInputFiltroFoco").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invContRetornoEnderecos").innerHTML = "<div class='alert alert-primary'><h2>Carregando...</h2></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    document.getElementById("invContRetornoEnderecos").innerHTML = "<div class='alert alert-success'><h2>Produto endereçado com sucesso.</h2></div>";
                    invContTbEnderecos(codprod);
                    document.getElementById("invContInputEndereco").value == "";
                    if (Number(focoRet) == 1) {
                        document.getElementById("invContInputCodigo").focus();  
                    }
                    if (Number(focoRet) == 2) {
                        document.getElementById("invContInputQtd").focus(); 
                        document.getElementById("invContInputQtd").select();
                    }
                } else {
                    document.getElementById("invContRetornoEnderecos").innerHTML = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            }
        }
    };
    var sql = "begin web_wms.enderecar('"+codbarra+"', '"+codprod+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invContRemoverEndereco(codender, codfilial, codprod) {
    checkCookie();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invContRetornoEnderecos").innerHTML = "<div class='alert alert-primary'><h2>Carregando...</h2></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    document.getElementById("invContRetornoEnderecos").innerHTML = "<div class='alert alert-success'><h2>Produto Removido do Endereço.</h2></div>";
                    invContTbEnderecos(codprod);
                } else {
                    document.getElementById("invContRetornoEnderecos").innerHTML = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            }
        }
    };
    var sql = "begin web_wms.remEndereco('"+codender+"', '"+codfilial+"', '"+codprod+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invContConsultar() {
    var numinvent = document.getElementById("invContInputFiltroNuminvent").value;
    var codigo = document.getElementById("invContInputCodigo2").value;
    var tipoCodigo = document.getElementById("invContInputFiltroTipoCodigo").value;
    if (numinvent.length == 0 || numinvent == '0') {
        document.getElementById("invContDivConsultar").innerHTML = "<div class='alert alert-danger'><h2 class='text-danger'>Informe o N&ordm; do Invent&aacute;rio nas configura&ccedil;&otilde;es.</h2></div>";
        return;
    }
    if (codigo.length == 0 || codigo == '0') {
        document.getElementById("invContDivConsultar").innerHTML = "<div class='alert alert-danger'><h2 class='text-danger'>Informe C&oacute;d.Produto ou C&oacute;d.Barras para consultar.</h2></div>";
        return;
    }
    var ret = "";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invContDivConsultar").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) {
                    ret = "<div class='alert alert-danger'><h2 class='text-danger'>Nenhum registro encontrado...</h2></div>";
                } else {
                    ret += "<div class='table-scrollable'>";
                    ret += "    <table class='table table-condensed table-hover'>";
                    ret += "        <thead>";
                    ret += "            <tr>";
                    ret += "                <th>Dt.Hora</th>";
                    ret += "                <th>Dispositivo</th>";
                    ret += "                <th>Qtd.</th>";
                    ret += "                <th>Usu&aacute;rio</th>";
                    ret += "                <th>Produto</th>";                    
                    ret += "            </tr>";
                    ret += "        </thead>";
                    ret += "        <tbody>";
                    for(var i = 0; i < obj.items.length; i++) {
                        ret += "            <tr>";
                        ret += "                <td>"+obj.items[i].DTHORA+"</td>";
                        ret += "                <td>"+obj.items[i].DISPOSITIVO+"</td>";
                        ret += "                <td>"+obj.items[i].QTDIG+"</td>";
                        ret += "                <td>"+obj.items[i].USUARIO+"</td>";
                        ret += "                <td>"+obj.items[i].PRODUTO+"</td>";
                    } 
                    ret += "        </tbody>";
                    ret += "    </table>";
                    ret += "</div>";
                    
                }
            } else {
                ret = "<div class='alert alert-danger'><h2 class='text-danger'> Erro ao consultar contagem...</h2></div>";
            }
            document.getElementById("invContDivConsultar").innerHTML = ret;
        }
    };

    var sql = "";
        sql += "select ";
        sql += "  id.dthora, id.qtdig, id.dispositivo ";
        sql += "  ,id.matricula||' - '||f.nome usuario ";
        sql += "  ,p.codprod||' - '||p.descricao||' - '||p.unidade||' '||p.embalagem produto ";
        sql += "from msinventdig id, msproduto p, msfunc f ";
        sql += "where id.codprod = p.codprod and id.matricula = f.matricula ";
        sql += "and id.numinvent = "+numinvent+" ";
        if (Number(tipoCodigo) == 1) {
            sql += "and p.codbarra = '"+codigo+"' ";
        } else {
            sql += "and id.codprod = "+codigo+" ";
        }
        sql += "order by id.dthora desc; ";

    //console.log('url-> '+ getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql);
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invAcompFiltrar(qds, grid, pagina) {
	qds = typeof qds !== 'undefined' ? qds : 'N';
	grid = typeof grid !== 'undefined' ? grid : 'N';
	pagina = typeof pagina !== 'undefined' ? pagina : 0;
	if (qds == "S") {
		invAcompQuadros();
	}
	if (grid == "S") {
        window.location.hash='';
		var pagAtual = Number(document.getElementById("invAcompHidProxPag").value);
		var proxPag = Number(pagAtual)+1;
		if (Number(pagina) == 1) {
			document.getElementById("invAcompHidProxPag").value = "1";
			proxPag = 1;
		} else {
			document.getElementById("invAcompHidProxPag").value = proxPag;
		}
		invAcompGrid(proxPag);
		if (Number(pagina) != 1) {
			window.location.hash='invAcompbtnProxPag';
		}
	}
}

function invAcompGrid(pagina) {
    var numinvent = document.getElementById("invAcompInputFiltroNuminvent").value;
    var codprod = document.getElementById("invAcompInputCodprod").value;
    var codmarca = document.getElementById("invAcompInputFiltroCodmarca").value;
    var codepto = document.getElementById("invAcompInputFiltroCodepto").value;
    var codsec = document.getElementById("invAcompInputFiltroCodsec").value;
    var descricao = encodeURIComponent(document.getElementById("invAcompInputFiltroDesc").value);
    var situacao = document.getElementById("invAcompInputFiltroSituacao").value;
    var ordem = document.getElementById("invAcompInputFiltroOrdem").value;
	document.getElementById("invAcompbtnProxPag").setAttribute("class", "btn red btn-block display-hide");

    if (numinvent.length == 0 || numinvent == '0') {
        document.getElementById("invAcompRetorno").innerHTML = "<div class='alert alert-danger'><h2 class='text-danger'>Informe o N&ordm; do Invent&aacute;rio.</h2></div>";
        return;
    }
    if (codprod.length == 0 || codprod == '0') {
    	codprod = '0';
    }
    if (codmarca.length == 0 || codmarca == '0') {
        codmarca = '0';
    }
    if (codepto.length == 0 || codepto == '0') {
        codepto = '0';
    }
    if (codsec.length == 0 || codsec == '0') {
        codsec = '0';
    }
    var ret = "";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
        	if (Number(pagina) == 1) {
        		document.getElementById("invAcompRetorno").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        	}
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) {
                	if (Number(pagina) == 1) {
                		ret = "<div class='alert alert-danger'><h2 class='text-danger'>Nenhum registro encontrado...</h2></div>";
                		document.getElementById("invAcompbtnProxPag").setAttribute("class", "btn red btn-block display-hide");
                	}
                } else {
                	if (Number(pagina) == obj.items[0].QTPAG) {
                		document.getElementById("invAcompbtnProxPag").setAttribute("class", "btn red btn-block display-hide");
                	}
                	if (Number(pagina) == 1) {
	                    ret += "<div class='row'>";
	                    ret += "	<div class='col-md-4'><span class='text-primary'><b>Invent&aacute;rio N&ordm;: "+obj.items[0].NUMINVENT+" / Filial: "+obj.items[0].CODFILIAL+"</b></span></div>";
	                    ret += "	<div class='col-md-4'><span class='text-primary'><b>Dt.Cria&ccedil;&atilde;o: "+obj.items[0].DATA+"</b></span></div>";
	                    ret += "	<div class='col-md-4'><span class='text-primary'><b>Dt.Finaliza&ccedil;&atilde;o: "+obj.items[0].DTTERMINO+"</b></span></div>";
	                    ret += "</div>";
                    }
                    ret += "<div class='table-scrollable'>";
                    ret += "    <table class='table table-condensed table-hover'>";
                    ret += "        <thead>";
                    ret += "            <tr>";
                    ret += "                <th>C&oacute;d.</th>";
                    ret += "                <th>C&oacute;d.Barras</th>";
                    ret += "                <th>Produto</th>";
                    ret += "                <th>Vl.Custo</th>";
                    ret += "                <th>Qt.Est.</th>";
                    ret += "                <th>Vl.Est.</th>";
                    ret += "                <th>Qt.Invent.</th>";
                    ret += "                <th>Vl.Invent.</th>";
                    ret += "                <th>Qt.Diverg.</th>";
                    ret += "                <th>Vl.Diverg.</th>";
                    ret += "                <th>Dt.&Uacute;lt.Cont.</th>";                    
                    ret += "            </tr>";
                    ret += "        </thead>";
                    ret += "        <tbody>";
                    for(var i = 0; i < obj.items.length; i++) {
                        ret += "            <tr onClick='invAcompMontarModalHistProd("+numinvent+","+obj.items[i].CODPROD+");' data-toggle='modal' href='#invAcompModalHistCont' ";
                        if (obj.items[i].COR_LINHA != 'default') {
                            ret += "class='font-"+obj.items[i].COR_LINHA+"'";
                        }
                        ret += "            >";
                        ret += "                <td>"+obj.items[i].CODPROD+"</td>";
                        ret += "                <td>"+obj.items[i].CODBARRA+"</td>";
                        ret += "                <td>"+obj.items[i].DESCRICAO+"<br /><span class='text-muted'>"+obj.items[i].MARCA+" / "+obj.items[i].DEPTO+" / "+obj.items[i].SECAO+"</span></td>";
                        ret += "                <td>"+obj.items[i].CUSTO+"</td>";
                        ret += "                <td>"+obj.items[i].QT0+"</td>";
                        ret += "                <td>"+obj.items[i].VLESTOQUE+"</td>";
                        ret += "                <td>"+obj.items[i].QTDEULTCONTAGEM+"</td>";
                        ret += "                <td>"+obj.items[i].VLINVENT+"</td>";
                        ret += "                <td>"+obj.items[i].QTDIV+"</td>";
                        ret += "                <td>"+obj.items[i].VLDIV+"</td>";
                        ret += "                <td>"+obj.items[i].DTULTCONT+"</td>";
                        ret += "            </tr>";
                    } 
                    ret += "        </tbody>";
                    ret += "    </table>";
                    ret += "</div>";
                    ret += "<div align='center'><span class='text-muted'> -- Fim p&aacute;gina "+pagina+" -- </span></div>";
                    document.getElementById("invAcompbtnProxPag").setAttribute("class", "btn red btn-block display-show");
                }
            } else {
            	if (Number(pagina) == 1) {
            		ret = "<div class='alert alert-danger'><h2 class='text-danger'>	Erro ao consultar invent&aacute;rio...</h2></div>";
            	}
            }
        	if (Number(pagina) == 1) {
        		document.getElementById("invAcompRetorno").innerHTML = ret;
        	} else {
        		document.getElementById("invAcompRetorno").innerHTML += ret;
        	}
        }
    };

    var sql = "";
        sql += "select ";
        sql += "  formatar_valor(nvl(est.vlcustopadrao,0)) custo ";
        sql += "  ,count(*) over() qtReg "; 
        sql += "  ,ceil(count(*) over()/100) qtPag ";
        sql += "  ,formatar_valor(nvl(est.vlcustopadrao,0)*nvl(princ.qt0,0)) vlestoque ";
        sql += "  ,formatar_valor(nvl(est.vlcustopadrao,0)*nvl(princ.qtdeultcontagem,0)) vlinvent ";
        sql += "  ,(nvl(princ.qtdeultcontagem,0)-nvl(princ.qt0,0)) qtdiv ";
        sql += "  ,formatar_valor((nvl(est.vlcustopadrao,0)*nvl(princ.qtdeultcontagem,0)) ";
        sql += "   -(nvl(est.vlcustopadrao,0)*nvl(princ.qt0,0))) vldiv ";
        sql += "  ,(case when princ.qtdeultcontagem is null then 'default' ";
        sql += "    when princ.contagem=0 and princ.qtdeultcontagem is not null and princ.qtdeultcontagem<>princ.qt0 then 'red' ";
        sql += "    when princ.contagem=1 and princ.qtdeultcontagem is not null and princ.qt0<>princ.qt1 then 'red' ";
        sql += "    when princ.contagem=2 and princ.qtdeultcontagem is not null and princ.qt1<>princ.qt2 then 'red' ";
        sql += "    when princ.contagem=3 and princ.qtdeultcontagem is not null and princ.qt2<>princ.qt3 then 'red' ";
        sql += "    when princ.contagem=4 and princ.qtdeultcontagem is not null and princ.qt3<>princ.qt4 then 'red' ";
        sql += "    when princ.contagem=5 and princ.qtdeultcontagem is not null and princ.qt4<>princ.qt5 then 'red' ";
        sql += "    else 'green' ";
        sql += "  end) cor_linha ";
        sql += "  ,princ.* ";
        sql += "  ,dig.dtultcont ";
        sql += "from ( ";
        sql += "  select ";
        sql += "    i.numinvent, i.data, i.dttermino, i.codfilial ";
        sql += "    ,ip.codprod, p.codbarra, p.descricao, ip.qt0, ip.qt1, ip.qt2, ip.qt3, ip.qt4, ip.qt5, ip.qtdeultcontagem, ip.qtinvent ";
        sql += "    ,p.codmarca, p.codsec, s.codepto, m.marca, s.descricao as secao, d.descricao as depto ";
        sql += "    ,(case when nvl(ip.qtdeultcontagem,0)>0 then 1 else 0 end) flagCont ";
        sql += "    ,(case when ip.qt1 is null then 0 ";
        sql += "       when ip.qt2 is null then 1 ";
        sql += "       when ip.qt3 is null then 2 ";
        sql += "       when ip.qt4 is null then 3 ";
        sql += "       when ip.qt5 is null then 4 ";
        sql += "       when ip.qt5 is not null then 5 ";
        sql += "    end) contagem ";
        sql += "  from msinventario i, msinventprod ip, msproduto p, msmarca m, msdepartamento d, mssecao s ";
        sql += "  where i.numinvent = ip.numinvent ";
        sql += "  and ip.codprod = p.codprod ";
        sql += "  and p.codmarca = m.codmarca (%2B) ";
        sql += "  and p.codsec = s.codsec (%2B) ";
        sql += "  and s.codepto = d.codepto (%2B) ";
        sql += ") princ, ( ";
        sql += "  select id.codprod, id.numinvent, max(id.dthora) dtultcont from msinventdig id group by id.codprod, id.numinvent ";
        sql += ") dig, ( ";
        sql += "  select codfilial, codprod, vlcustopadrao from msest ";
        sql += ") est ";
        sql += "where ";
        sql += "  princ.numinvent = "+numinvent+" ";
        sql += "  and decode('"+codprod+"','0','0',princ.codprod) in ('0',"+vetorTexto(codprod, '0')+") ";
        if (Number(situacao) != 0) {
            if (Number(situacao) == 1) {
                sql += "  and nvl(princ.qtdeultcontagem,0) > 0 ";
            }
            if (Number(situacao) == 2) {
                sql += "  and princ.qtdeultcontagem is null ";
            }
        } 
        sql += "  and decode('"+codmarca+"','0','0',princ.codmarca) in ('0',"+vetorTexto(codmarca, '0')+") ";   
        sql += "  and decode('"+codepto+"','0','0',princ.codepto) in ('0'," +vetorTexto(codepto, '0')+") ";   
        sql += "  and decode('"+codsec+"','0','0',princ.codsec) in ('0',"  +vetorTexto(codsec, '0')+") "; 
        sql += "  and upper(princ.codprod||princ.codbarra||princ.descricao) like upper('%25"+descricao+"%25') ";                
        sql += "  and princ.numinvent = dig.numinvent (%2B) ";
        sql += "  and princ.codprod  = dig.codprod (%2B) ";
        sql += "  and princ.codfilial = est.codfilial (%2B) ";
        sql += "  and princ.codprod = est.codprod (%2B) ";
	    sql += "order by ";
	    if (Number(ordem) == 0) {
			sql += "  princ.descricao ";
	    }
	    if (Number(ordem) == 1) {
			sql += "  princ.descricao desc ";
	    }
	    if (Number(ordem) == 2) {
			sql += "  nvl(dig.dtultcont,trunc(sysdate)-99999) desc ";
	    }
	    if (Number(ordem) == 3) {
			sql += "  nvl(princ.qtdeultcontagem,0) desc ";
	    }

    var metodo = 'GET';
    if (getCookie("ccwWS2")=='N') {
        metodo = 'GET';
    } else {
        metodo = 'POST';
    }

	pagina = typeof pagina !== 'undefined' ? pagina : 0;
    var sqlPagH = "select y.* from ( select rownum as rn, x.* from ( ";
    var sqlPagF = " ) x where rownum < "+Number(pagina)+" * 100 %2B 1 ) y where y.rn >= "+Number(pagina)+" * 100 - 99; ";
    if (Number(pagina) > 0) {
    	sql = sqlPagH + sql + sqlPagF;
    }

    if (metodo == 'GET') {
        sql = sql.replace(/<#43>/g, "%2B");
        sql = sql.replace(/<#34>/g, "%22");
        sql = sql.replace(/<#37>/g, "%25");
        //console.log('sql->   '+sql);
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }
    if (metodo == 'POST') {
        sql = sql.replace(/%2B/g, "<#43>");
        sql = sql.replace(/%22/g, "<#34>");
        sql = sql.replace(/%25/g, "%");
        xhttp.open("POST", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha"), true);
        xhttp.send(sql);
    }    
}

function invAcompQuadros() {
    var numinvent = document.getElementById("invAcompInputFiltroNuminvent").value;
    var codprod = document.getElementById("invAcompInputCodprod").value;
    var codmarca = document.getElementById("invAcompInputFiltroCodmarca").value;
    var codepto = document.getElementById("invAcompInputFiltroCodepto").value;
    var codsec = document.getElementById("invAcompInputFiltroCodsec").value;
    var descricao = encodeURIComponent(document.getElementById("invAcompInputFiltroDesc").value);
    var situacao = document.getElementById("invAcompInputFiltroSituacao").value;
    var ordem = document.getElementById("invAcompInputFiltroOrdem").value;

    document.getElementById("invAcompQdQtProd").innerHTML = "";
    document.getElementById("invAcompQdQtProdCont").innerHTML = "";
    document.getElementById("invAcompQdPercContagem").innerHTML = "";
    document.getElementById("invAcompQdTempoContagem").innerHTML = "";
    document.getElementById("invAcompQdVlEstoque").innerHTML = "";
    document.getElementById("invAcompQdVlInvent").innerHTML = "";
    document.getElementById("invAcompQdVlDiverg").innerHTML = "";
    document.getElementById("invAcompQdPercDiverg").innerHTML = "";

    if (numinvent.length == 0 || numinvent == '0') {
        document.getElementById("invAcompRetornoQds").innerHTML = "<div class='alert alert-danger'><h2 class='text-danger'>Informe o N&ordm; do Invent&aacute;rio.</h2></div>";
        return;
    }
    if (codprod.length == 0 || codprod == '0') {
    	codprod = '0';
    }
    if (codmarca.length == 0 || codmarca == '0') {
        codmarca = '0';
    }
    if (codepto.length == 0 || codepto == '0') {
        codepto = '0';
    }
    if (codsec.length == 0 || codsec == '0') {
        codsec = '0';
    }
    var ret = "";
    var sqlWherePadrao = "";
		sqlWherePadrao += "from msinventario i, msinventprod ip, msproduto p, msmarca m, msdepartamento d, mssecao s ";
		sqlWherePadrao += "where i.numinvent = ip.numinvent ";
		sqlWherePadrao += "and ip.codprod = p.codprod ";
		sqlWherePadrao += "and p.codmarca = m.codmarca (%2B) ";
		sqlWherePadrao += "and p.codsec = s.codsec (%2B) ";
		sqlWherePadrao += "and s.codepto = d.codepto (%2B) ";
		sqlWherePadrao += "and i.numinvent = "+numinvent+" ";
        sqlWherePadrao += "and decode('"+codmarca+"','0','0',m.codmarca) in ('0',"+vetorTexto(codmarca, '0')+") ";   
        sqlWherePadrao += "and decode('"+codepto+"','0','0',s.codepto) in ('0'," +vetorTexto(codepto, '0')+") ";   
        sqlWherePadrao += "and decode('"+codsec+"','0','0',p.codsec) in ('0',"  +vetorTexto(codsec, '0')+") "; 
        sqlWherePadrao += "and upper(p.codprod||p.codbarra||p.descricao) like upper('%25"+descricao+"%25') ";  
        sqlWherePadrao += "and decode('"+codprod+"','0','0',p.codprod) in ('0',"+vetorTexto(codprod, '0')+") ";
        if (Number(situacao) != 0) {
            if (Number(situacao) == 1) {
                sqlWherePadrao += "and nvl(ip.qtdeultcontagem,0) > 0 ";
            }
            if (Number(situacao) == 2) {
                sqlWherePadrao += "and ip.qtdeultcontagem is null ";
            }
        }
    quadro("select nvl(count(*),0) as VALOR "+sqlWherePadrao+";", "invAcompQdQtProd", "Qt. Produtos", "cubes", "blue-sharp", " ", " ");
    quadro("select nvl(count(*),0) as VALOR "+sqlWherePadrao+" and nvl(ip.qtdeultcontagem,0) > 0 ;", "invAcompQdQtProdCont", "Qt.Prod. Contados", "check", "green", " ", " ");
    quadro("select round((sum(case when nvl(ip.qtdeultcontagem,0)>0 then 1 else 0 end)/count(*))*100,2) as VALOR "+sqlWherePadrao+";", "invAcompQdPercContagem", "% Contagem", "line-chart", "yellow-saffron", " ", " %");
    quadro("select numero(apenasnumeros(substr(NUMTODSINTERVAL((nvl(max(i.dttermino), sysdate) - max(i.data)),'day'),8,3)))||' dia(s) '||substr(NUMTODSINTERVAL((nvl(max(i.dttermino), sysdate) - max(i.data)),'day'),11,6) as VALOR "+sqlWherePadrao+";", "invAcompQdTempoContagem", "Tempo de Contagem", "clock-o", "yellow-gold", " ", " ");
    quadro("select formatar_valor(nvl(sum(e.vlcustopadrao*ip.qt0),0)) as VALOR "+sqlWherePadrao.replace(", mssecao s ", ", mssecao s, msest e ")+" and e.codfilial = i.codfilial and e.codprod = ip.codprod;", "invAcompQdVlEstoque", "Vl. Estoque", "dollar", "red-mint", " ", " ");
    quadro("select formatar_valor(nvl(sum(case when nvl(ip.qtdeultcontagem,0)>0 then e.vlcustopadrao*ip.qtdeultcontagem else 0 end),0)) as VALOR "+sqlWherePadrao.replace(", mssecao s ", ", mssecao s, msest e ")+" and e.codfilial = i.codfilial and e.codprod = ip.codprod;", "invAcompQdVlInvent", "Vl. Inventário", "dollar", "purple-sharp", " ", " ");
    quadro("select formatar_valor(nvl(sum(case when nvl(ip.qtdeultcontagem,0)>0 then e.vlcustopadrao*ip.qtdeultcontagem else 0 end),0)-nvl(sum(e.vlcustopadrao*ip.qt0),0)) as VALOR "+sqlWherePadrao.replace(", mssecao s ", ", mssecao s, msest e ")+" and e.codfilial = i.codfilial and e.codprod = ip.codprod;", "invAcompQdVlDiverg", "Vl. Diverg.", "dollar", "blue-dark", " ", " "); 
    quadro("select round((nvl(sum(case when nvl(ip.qtdeultcontagem,0)>0 then e.vlcustopadrao*ip.qtdeultcontagem else 0 end),0)/nullif(nvl(sum(e.vlcustopadrao*ip.qt0),0),0))*100,2) as VALOR "+sqlWherePadrao.replace(", mssecao s ", ", mssecao s, msest e ")+" and e.codfilial = i.codfilial and e.codprod = ip.codprod;", "invAcompQdPercDiverg", "% Vl. Diverg.", "line-chart", "green-jungle", " ", " %");                    
}

function invAcompMontarModalHistProd(numinvent, codprod) {
	document.getElementById("invAcompRetHistProd").innerHTML = "";
	var ret = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invAcompRetHistProd").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (Number(obj.totalCount) == 0) {
                    ret = "<div align='center'><h3 class='text-danger'>Sem contagem registrada para este produto...</h3></div>";
                } else {
                	ret += "<h3><b>"+obj.items[0].PRODUTO+"</b></h3>";
                    ret += "<div class='table-scrollable'>";
                    ret += "    <table class='table table-condensed table-hover'>";
                    ret += "        <thead>";
                    ret += "            <tr>";
                    ret += "                <th>Usu&aacute;rio</th>";
                    ret += "                <th>Dt.Hora</th>";
                    ret += "                <th>Dispositivo</th>";
                    ret += "                <th>Qtd.</th>";
                    ret += "            </tr>";
                    ret += "        </thead>";
                    ret += "        <tbody>";
                    for(var i = 0; i < obj.items.length; i++) {
                        ret += "            <tr>";
                        ret += "                <td>"+obj.items[i].USUARIO+"</td>";
                        ret += "                <td>"+obj.items[i].DTHORA+"</td>";
                        ret += "                <td>"+obj.items[i].DISPOSITIVO+"</td>";
                        ret += "                <td>"+obj.items[i].QTDIG+"</td>";
                    } 
                    ret += "        </tbody>";
                    ret += "    </table>";
                    ret += "</div>";
                }
            } else {
                ret = "<div align='center'><h3 class='text-danger'>Erro ao consultar hist&oacute;rico...</h3></div>";
            }
            document.getElementById("invAcompRetHistProd").innerHTML = ret;
        }
    };
    var sql = "";
	sql += "select ";
	sql += "  p.codprod||' - '||p.descricao produto ";
	sql += "  ,to_char(id.dthora,'dd/mm/yyyy hh24:mi:ss') dthora ";
	sql += "  ,id.dispositivo ";
	sql += "  ,id.qtdig ";
	sql += "  ,id.matricula||' - '||f.nome usuario ";
	sql += "from msinventdig id, msproduto p, msfunc f ";
	sql += "where id.numinvent = numero(nvl("+numinvent+",0)) and id.codprod = numero(nvl("+codprod+",0)) ";
	sql += "and id.codprod = p.codprod and id.matricula = f.matricula ";
	sql += "order by dthora; ";
	xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function invFinalizar() {
    var ret = "";
    document.getElementById("invFinRetorno").innerHTML = "";
    document.getElementById("invFinBtnFinalizar").setAttribute("disabled", "disabled");
    var numinvent = document.getElementById("invFinInputFiltroNuminvent").value;
    if (Number(numinvent.length) == 0) {
        document.getElementById("invFinRetorno").innerHTML = "<h2 class='text-danger'>Informe o N&ordm; do Invent&aacute;rio.</h2>";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("invFinRetorno").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (obj.items[0].RETORNO == 'OK') {
                    ret = "<div class='alert alert-success'><h2>Invent&aacute;rio <b>"+obj.items[0].NUMINVENT+"</b> finalizado com sucesso. Data e hora: <b>"+obj.items[0].DTHORA+"</b></h2></div>";
                } else {
                    ret = "<div class='alert alert-danger'><h2>"+obj.items[0].RETORNO+"</h2></div>";
                }
            } else {
                ret = "<div class='alert alert-danger'><h2>Houve erros ao finalizar invent&aacute;rio</h2></div>";  
            }
            document.getElementById("invFinRetorno").innerHTML = ret;
            document.getElementById("invFinBtnFinalizar").removeAttribute("disabled");
        }
    };
 
    var sql = "begin web_inventario.finalizar('"+numinvent+"', :p_cursor); end;";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}




