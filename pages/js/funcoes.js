// Componentes e Fixos 
    function dataAtualFormatada(idExibicao, tipoRetorno){
        var data = new Date();
        var dia = data.getDate();
        if (dia.toString().length == 1)
          dia = "0"+dia;
        var mes = data.getMonth()+1;
        if (mes.toString().length == 1)
          mes = "0"+mes;
        var ano = data.getFullYear();  
        
        var dataFormatada = dia+"/"+mes+"/"+ano;
        //document.getElementById(idExibicao).innerHTML = dataFormatada;
       
        if (tipoRetorno == 'value') {
            document.getElementById(idExibicao).value = dataFormatada; 
        }   
        if (tipoRetorno == 'innerHTML') {
            document.getElementById(idExibicao).innerHTML = dataFormatada;
        }   
    }

    function dataAtualFormatada2(idExibicao){
        var data = new Date();
        var dia = data.getDate();
        if (dia.toString().length == 1)
          dia = "0"+dia;
        var mes = data.getMonth()+1;
        if (mes.toString().length == 1)
          mes = "0"+mes;
        var ano = data.getFullYear();  
        
        var dataFormatada = dia+"/"+mes+"/"+ano;
        //document.getElementById(idExibicao).innerHTML = dataFormatada;
        document.getElementById(idExibicao).value = dataFormatada;
    }

    function getByIndex(obj, index) {

        return obj[Object.keys(obj)[index]];
    }

    function buscarDadoUnico(sql, idExibicao, tipoRetorno) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                if (tipoRetorno == 'value') {
                    document.getElementById(idExibicao).value = obj.items[0].RETORNO; 
                }   
                if (tipoRetorno == 'innerHTML') {
                    document.getElementById(idExibicao).innerHTML = obj.items[0].RETORNO; 
                }   
                if (tipoRetorno == 'return') {
                    return obj.items[0].RETORNO; 
                } 
            }
        };
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }

    function vetorTexto(str, vlpadrao) {
        if (str.length == 0 || str == '0') {
            str = vlpadrao;
        }
        str = "'" + str;
        str = str.split(",").join("','");
        str = str + "'";
        str = str.split(" ").join("");
        return str;
    }

    function compartilhar(id) {

        window.open('compartilhar.html?content='+encodeURIComponent(document.getElementById(id).innerHTML),'','toolbar=no,location=no,status=no,menubar=no,titlebar=no,width=500,height=500', false);
    }

    function filiais() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                
                var ret = "";
                for(var i = 0; i < obj.items.length; i++) {
                    ret += obj.items[i].CODFILIAL + ",";
                } 
                ret = ret.substr(0, ret.length-1);  
                document.getElementById("todasFiliais").value = ret;  
            }
        };
        var sql = "";
        if (getCookie("ccwSupervisor") == 'S') {
            sql += "select f.codfilial from msfilial f where f.dtexclusao is null;";
        } else {
            sql += "select f.codfilial from msfilial f, msacessodados a where f.dtexclusao is null and a.tabela = 'MSFILIAL' and f.codfilial = decode(a.registro, '*', f.codfilial, a.registro) and a.matricula = "+getCookie("ccwMatricula")+";";
        }
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }

    function filiaisRestritas() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                
                var ret = "";
                for(var i = 0; i < obj.items.length; i++) {
                    ret += obj.items[i].CODFILIAL + ",";
                } 
                ret = ret.substr(0, ret.length-1);  
                document.getElementById("flRestritas").value = ret;  
            }
        };
        var sql = "";
        if (getCookie("ccwSupervisor") == 'S') {
            sql += "select '0' codfilial from dual;";
        } else {
            sql += "select x.codfilial from msfilial x where x.codfilial not in (select f.codfilial from msfilial f, msacessodados a where f.dtexclusao is null and a.tabela = 'MSFILIAL' and f.codfilial = decode(a.registro, '*', f.codfilial, a.registro) and a.matricula = "+getCookie("ccwMatricula")+");";
        }
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }

    function filtroConsulta(idCont, idInput, nome, placeHolder, idModal, sql, inputSize, enterPress) {
        inputSize = typeof inputSize !== 'undefined' ? inputSize : 'small';
        enterPress = typeof enterPress !== 'undefined' ? enterPress : 0;
        var htmlRet = "";
        htmlRet += '<div class="input-group input-'+inputSize+'">';
        htmlRet += '    <label for="'+idInput+'">'+nome+'</label>';
        htmlRet += '    <input type="text" class="form-control" name="'+idInput+'" id="'+idInput+'" value="" placeholder="'+placeHolder+'" ';
        if (Number(enterPress) > 0) {
            htmlRet += '    onKeyPress="enterPress('+"'"+idInput+"'"+')"';
        }
        htmlRet += ' >';
        if (idModal.length > 0) {
            htmlRet += '    <span class="input-group-btn">';
            htmlRet += '        <a data-toggle="modal" href="#'+idModal+'">';
            htmlRet += '            <button class="btn blue" type="button">';
            htmlRet += '                <i class="fa fa-search"></i>';
            htmlRet += '            </button>';
            htmlRet += '        </a>';
            htmlRet += '    </span>';
        }
        htmlRet += '    <div class="form-control-focus"> </div>';
        htmlRet += '</div>';
        if (idModal.length > 0) {            
            //console.log('sql puro-> '+sql);
            //console.log('sql encode-> '+encodeURIComponent(sql));
            htmlRet += '<div class="form-body">';
            htmlRet += '    <div id="'+idModal+'" class="modal fade" tabindex="-1" data-width="800">';
            htmlRet += '        <div class="modal-header">';
            htmlRet += '            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>';
            htmlRet += '            <h4 class="modal-title"><b>Pesquise por texto e tecle "Enter".</b></h4>';
            htmlRet += '        </div>';
            htmlRet += '        <div class="modal-body">';
            htmlRet += '            <div class="form-group">';
            htmlRet += '                <input type="text" class="form-control" name="'+idModal+'_Consulta" id="'+idModal+'_Consulta" placeholder="..." maxlength="80" value="" onKeyPress="retornoModal('+"'"+idModal+"'"+','+"'"+idInput+"'"+','+"'"+encodeURIComponent(sql).replace(/'/g,"%27")+"'"+',this.value)" />';
            htmlRet += '            </div>';
            htmlRet += '            <div id="'+idModal+'_Retorno">';
            htmlRet += '            </div>';
            htmlRet += '        </div>';
            htmlRet += '        <div class="modal-footer">';
            htmlRet += '            <button type="button" data-dismiss="modal" class="btn btn-outline dark"> Sair </button>';
            htmlRet += '        </div>';
            htmlRet += '    </div>';
            htmlRet += '</div>';
        }
        document.getElementById(idCont).innerHTML = htmlRet;
    }

    function retornoModal(idModal, idInput, sql, strConsulta) {
        var tecla = event.which;
        if (tecla == 13) {
            sql = sql.replace("strConsulta", "%27%25"+encodeURIComponent(strConsulta)+"%25%27");
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState < 4) {
                    document.getElementById(idModal+'_Retorno').innerHTML = "Carregando...";
                } else {
                    if (this.readyState == 4 && this.status == 200) {
                        obj = JSON.parse(this.responseText);
                        var htmlRet = "";
                        var qtReg = 0;
                        for(var i = 0; i < obj.items.length; i++) {
                            qtReg = qtReg + 1;
                            htmlRet += '<h3>';
                            htmlRet += '<button class="btn green" data-dismiss="modal" aria-hidden="true" type="button" onClick="setRetornoModal('+"'"+obj.items[i].RETORNO+"'"+', '+"'"+idInput+"'"+')"><i class="fa fa-check"></i></button> ';
                            htmlRet += obj.items[i].RETORNO+' - '+obj.items[i].DESCRICAO+'<h3 />';
                        }
                        if (qtReg == 0) {
                            htmlRet = "";
                        }
                    } else {
                        htmlRet = "Nenhum resultado encontrado...";
                    }
                    document.getElementById(idModal+'_Retorno').innerHTML = htmlRet;
                }
            };
            //console.log('sql-> '+sql);
            xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
            xhttp.send();
        }
    }

    function setRetornoModal(retorno, input) {
        document.getElementById(input).value = retorno;
        // ações específicas
        if (input == 'invContInputCodigo') {
            document.getElementById("invContInputFiltroTipoCodigo").value = 2;
        }
    }

    function enterPress(input) {
        var tecla = event.which;
        if (tecla == 13) {
            if (input == 'invContInputCodigo') {
                invContContar();
            }
            if (input == 'invContInputCodigo2') {
                invContConsultar();
            }
            if (input == 'invContInputEndereco') {
                InvContEnderecar();
            }
            if (input == 'sepContInputCodigo') {
                sepSepararProd();
            }
        }
    }

    function localizar(input, idTabela, coluna) {
        var input, filter, table, tr, td, i;
        input = document.getElementById(input);
        filter = input.value.toUpperCase();
        table = document.getElementById(idTabela);
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) { 
            td = tr[i].getElementsByTagName("td")[coluna];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    } 
