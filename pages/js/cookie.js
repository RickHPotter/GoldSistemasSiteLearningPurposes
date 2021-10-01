function setCookie(ccwCookie,ccwCookieValor,exdays) {
    var d = new Date();
    //d.setTime(d.getTime() + (exdays*24*60*60*1000));
    //d.setTime(d.getTime() + (exdays*24*60*1)); // Expirar em minutos (1 minuto)
    d.setTime(d.getTime() + (exdays*24*60*60*8)); // Expirar 8 horas
    var expires = "expires=" + d.toGMTString();
    document.cookie = ccwCookie + "=" + ccwCookieValor + ";" + expires + ";path=/";
}

function getCookie(ccwCookie) {
    var ccwCookieGet = ccwCookie + "="; 
    var decodedCookieGet = decodeURIComponent(document.cookie);
    var ca = decodedCookieGet.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(ccwCookieGet) == 0) {
            return c.substring(ccwCookieGet.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var ccwMatriculaCheck=getCookie("ccwMatricula");
    var ccwUsuarioCheck=getCookie("ccwUsuario");
    var ccwNomeCheck=getCookie("ccwNome");
    var ccwSenhaCheck=getCookie("ccwSenha");
    var ccwServidorCheck=getCookie("ccwServidor");
    if (ccwMatriculaCheck != "") {
      //alert("Welcome again " + user);
      //document.getElementById('divCookie').innerHTML = "<h3><b>Dados do Usu&aacute;rio Logado: </b></h3>Matr&iacute;cula: "+ccwMatriculaCheck+"<br />Nome de Usu&aacute;rio: "+ccwUsuarioCheck+"<br />Senha: "+ccwSenhaCheck+"<br />Servidor: "+ccwServidorCheck+"<br />Data Atual: "+Date()+"<br />Nome Amig&aacute;vel: "+ccwNomeCheck;
      //document.getElementById('divCookie').innerHTML = "";
    } else {
        X = 0;
        alert('Cookies expirados!')
        location.href = window.location.origin;
    }
}

function deleteCookie() {
    document.cookie = "ccwMatricula=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ccwUsuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ccwSenha=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ccwServidor=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ccwNome=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ccwIdEmpresa=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ccwEmpresa=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ccwEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "ccwSupervisor=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    //alert("Cookies expirados! "+window.location.origin);
    location.href = window.location.origin;
}
