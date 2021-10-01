var serverGold = "http://trunfodistribuidora.ddns.com.br:7773";

function carregarMenu() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState < 4) {
            document.getElementById("ulMenu").innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
        } else {
            if (this.readyState == 4 && this.status == 200) {
                obj = JSON.parse(this.responseText);
                var gradeMenu = "";
                var grupo = 0;
                var qtReg = 0;
                for(var i = 0; i < obj.items.length; i++) {
                    if (Number(obj.items[i].IDGRUPO) != grupo) { 
                        if (qtReg > 0) { 
                            gradeMenu += '    </ul>';
                            gradeMenu += '</li>';
                        }
                        gradeMenu += '<li class="nav-item" id="liGrp'+obj.items[i].IDGRUPO+'">';
                        gradeMenu += '    <a href="javascript:;" class="nav-link nav-toggle">';
                        gradeMenu += '        <i class="'+obj.items[i].ICON+'"></i>';
                        gradeMenu += '        <span class="title" id="nomeGrp'+obj.items[i].IDGRUPO+'">'+obj.items[i].NOME+'</span>';
                        gradeMenu += '        <span class="" id="selGrp'+obj.items[i].IDGRUPO+'" ></span>';
                        gradeMenu += '        <span class="" id="arrowGrp'+obj.items[i].IDGRUPO+'"></span>';
                        gradeMenu += '    </a>';
                        gradeMenu += '    <ul class="sub-menu">';
                    } else {
                        gradeMenu += '        <li class="nav-item" id="liMn'+obj.items[i].IDGRUPO+'.'+obj.items[i].ID+'" onclick="ativarMenu('+obj.items[i].IDGRUPO+','+obj.items[i].ID+','+"'"+obj.items[i].CONTEUDO+"'"+')">';
                        gradeMenu += '            <a href="javascript:;" class="nav-link ">';
                        gradeMenu += '                <span class="title" id="nomeMn'+obj.items[i].IDGRUPO+'.'+obj.items[i].ID+'"><i class="'+obj.items[i].ICON+'"></i> '+obj.items[i].NOME+'</span>';
                        gradeMenu += '                <span class="" id="selMn'+obj.items[i].IDGRUPO+'.'+obj.items[i].ID+'"></span>';
                        gradeMenu += '            </a>';
                        gradeMenu += '            <input type="hidden" id="padraoMenu'+obj.items[i].ID+'" name="padraoMenu'+obj.items[i].ID+'" value="0" />';
                        gradeMenu += '        </li>';
                    }
                    grupo = Number(obj.items[i].IDGRUPO);
                    qtReg = qtReg + 1;
                    if (Number(obj.totalCount) == qtReg ) {
                        gradeMenu += '    </ul>';
                        gradeMenu += '</li>';
                    }
                } 
            }
            document.getElementById("ulMenu").innerHTML = gradeMenu;
            ativarMenu(1,2,'divContInicio');
            if (getCookie("ccwSupervisor") == 'N') {
                permissoes('ocultar');
            }
        }
    };
    var sql = "select id, idgrupo, nome, icon, ordem, codrotina, conteudo from cwmenu where status = 'A' order by idgrupo, ordem;";
    xhttp.open("GET", serverGold+"/sql?usuario=SUPERVISOR&senha=SUPERV&sql="+sql, true);
    xhttp.send();
}

function permissoes(act) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            for(var i = 0; i < obj.items.length; i++) {
                validarPermissaoColosso(obj.items[i].IDGRUPO, obj.items[i].ID, obj.items[i].CODROTINA, obj.items[i].CONTEUDO, act);
            } 
        }
    };
    var sql = "select id, idgrupo, codrotina, conteudo from sirius.cwmenu where status = 'A' and nvl(codrotina,0) > 0 order by idgrupo, ordem;";
    xhttp.open("GET", serverGold+"/sql?usuario=SUPERVISOR&senha=SUPERV&sql="+sql, true);
    xhttp.send();
}

function validarPermissaoColosso(idgrupo, idmenu, codrotina, conteudo, act) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            for(var i = 0; i < obj.items.length; i++) {
                if (Number(obj.items[i].PERMISSAO) == 0) { 
                    if (act == "ocultar") {
                        document.getElementById("liMn"+idgrupo+"."+idmenu).setAttribute("class", "display-hide");
                        document.getElementById(conteudo).innerHTML = " ";
                    }
                }
            } 
        }
    };
    var sql = "select count(*) PERMISSAO from msacesso where codrotina = "+codrotina+" and controle = 0 and matricula = "+getCookie("ccwMatricula")+";";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function validarPermEspColosso(codrotina, controle, retorno) {
    document.getElementById(retorno).value = "N";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(this.responseText);
            for(var i = 0; i < obj.items.length; i++) {
                if (Number(obj.items[i].PERMISSAO) > 0) { 
                    document.getElementById(retorno).value = "S";
                }
            } 
        }
    };
    var sql = "select count(*) PERMISSAO from msacesso where codrotina = "+codrotina+" and controle = "+controle+" and matricula = "+getCookie("ccwMatricula")+";";
    xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
    xhttp.send();
}

function loadInicial(modulo) {

    checkCookie();
    filiais();
    filiaisRestritas();
    carregarMenu();
    validarPermEspColosso(4035, 1, "invContHiddenPermEnder");
    validarPermEspColosso(9003, 1, "sepContHidCortar");

    document.getElementById("titlePage").innerHTML = getCookie('ccwEmpresa') + ' - Colosso Web';
    document.getElementById("footerPage").innerHTML = 'Colosso Web &bull; Sete Tecnologia &bull; '+'Empresa: <b>' + getCookie('ccwEmpresa') + '</b> &bull; Server: <b>' + getCookie('ccwServidor') + '</b> &bull; Login: ' + '<b>' + getCookie('ccwEmail') + '</b>';

}

function padroes(modulo, idmenu) {
    if (Number(modulo) == 2) {
        carregarPadroesRelatorio(idmenu);
    }
    if (Number(modulo) == 3) {
        carregarPadroesInventario(idmenu);
    }
    if (Number(modulo) == 4) {
        carregarPadroesWMS(idmenu);
    }    
    document.getElementById("padraoMenu"+idmenu).value = 1;
}