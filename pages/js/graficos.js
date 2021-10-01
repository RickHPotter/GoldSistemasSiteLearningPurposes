// Gráficos/Tabels
    function velocimetro(sql, cont, nome) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState < 4) {
                document.getElementById(cont).innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
            } else {
                if (this.readyState == 4 && this.status == 200) {
                    obj = JSON.parse(this.responseText);
                    gerarVelocimetro(obj.items[0].VALOR, document.getElementById("meta").value, cont, nome);
                }
            }
        };
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }

    function gerarVelocimetro(valor, meta, cont, nome) {
        if (meta.length == 0 || meta == 0) {
            meta = valor;
        }
        var gaugeOptions = {
            chart: {
                type: 'solidgauge'
            },
            title: null,
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            tooltip: {
                enabled: false
            },
            yAxis: {
                stops: [
                    [0.1, '#DF5353'], // red
                    [0.5, '#DDDF0D'], // yellow
                    [0.9, '#55BF3B']  // green
                ],
                lineWidth: 0,
                minorTickInterval: null,
                //tickAmount: 0,
                //tickAmount: 1,
                title: {
                    y: -70
                },
                labels: {
                    y: 16
                }
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            }
        };
        var chartSpeed = Highcharts.chart(cont, Highcharts.merge(gaugeOptions, {
            yAxis: {
                min: 0,
                max: parseFloat(meta),
                title: {
                    text: nome
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: nome,
                data: [parseFloat(valor)],
                dataLabels: {
                    format:
                        '<div style="text-align:center">' +
                        '<span style="font-size:25px">R$ {y}</span><br/>' +
                        '<span style="font-size:12px;opacity:0.4"></span>' +
                        '</div>'
                },
                tooltip: {
                    valueSuffix: '.'
                }
            }]
        }));
    }

    function pizza(sql, cont, nome) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState < 4) {
                document.getElementById(cont).innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
            } else {
                if (this.readyState == 4 && this.status == 200) {
                    obj = JSON.parse(this.responseText);
                    
                    var JSdados = [];
                    for(var i = 0; i < obj.items.length; i++) {
                        JSdados = JSdados.concat( { name: obj.items[i].NAME, y: parseFloat(obj.items[i].VALOR) } );
                    } 
                    gerarPizza(JSdados, cont, nome);
                }
            }
        };
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }

    function gerarPizza(dados, cont, nome) {
        Highcharts.chart(cont, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '<span style="font-size:12px">'+nome+'</span>'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y:.2f}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y:.2f} '
                    }
                }
            },
            series: [{
                name: 'Valor',
                colorByPoint: true,
                data: dados
            }]
        });    
    }

    function barras(sql, cont, nome) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState < 4) {
                document.getElementById(cont).innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
            } else {
                if (this.readyState == 4 && this.status == 200) {
                    obj = JSON.parse(this.responseText);
                    
                    var JSdados = [];
                    for(var i = 0; i < obj.items.length; i++) {
                        JSdados = JSdados.concat( { name: obj.items[i].NAME, y: parseFloat(obj.items[i].VALOR) } );
                    } 

                    gerarBarras(JSdados, cont, nome);
                }
            }
        };
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }

    function gerarBarras(dados, cont, nome) {
        
        grafico = {
            chart: {
                type: 'bar'
            },
            title: {
                text: '<span style="font-size:12px">'+nome+'</span>'
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}'
                        //format: '{point.y}'
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>'
                //pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
            },
            series: [{
                name: "Vendedores",
                colorByPoint: true,
                data: dados
                //data: [{"name":"Weber Bueno","y":108},{"name":"João Paulo Pereira de Morais","y":685.88}]
            }]
        };

        Highcharts.chart(cont, grafico);
    }

    function colunas(sql, cont, nome, metodo) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState < 4) {
                document.getElementById(cont).innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
            } else {
                if (this.readyState == 4 && this.status == 200) {
                    obj = JSON.parse(this.responseText);
                    var JSdados = [];
                    for(var i = 0; i < obj.items.length; i++) {
                        JSdados = JSdados.concat( { name: obj.items[i].NAME, y: parseFloat(obj.items[i].VALOR) } );
                    } 
                    gerarColunas(JSdados, cont, nome);
                }
            }
        };

        metodo = typeof metodo !== 'undefined' ? metodo : 'GET';
        if (getCookie("ccwWS2")=='N') {
            metodo = 'GET';
        }
        if (metodo == 'GET') {
            sql = sql.replace(/<#43>/g, "%2B");
            sql = sql.replace(/<#34>/g, "%22");
            xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
            xhttp.send();
        }
        if (metodo == 'POST') {
            sql = sql.replace(/%2B/g, "<#43>");
            sql = sql.replace(/%22/g, "<#34>");
            xhttp.open("POST", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha"), true);
            xhttp.send(sql);
        }
        
    }

    function gerarColunas(dados, cont, nome) {
        
        grafico = {
            chart: {
                type: 'column'
            },
            title: {
                text: '<span style="font-size:12px">'+nome+'</span>'
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}'
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b><br/>'
            },
            series: [{
                name: "Dados",
                colorByPoint: true,
                data: dados
                //data: [{"name":"Weber Bueno","y":108},{"name":"João Paulo Pereira de Morais","y":685.88}]
            }]
        };

        Highcharts.chart(cont, grafico);
    }

    function linhaUnica(sql, cont, nome, linha) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState < 4) {
                document.getElementById(cont).innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
            } else {
                if (this.readyState == 4 && this.status == 200) {
                    obj = JSON.parse(this.responseText);
                    
                    var categorias = [];
                    for(var i = 0; i < obj.items.length; i++) {
                        categorias = categorias.concat(obj.items[i].CATEGORIA);
                    }
                    var dados = [];
                    for(var i = 0; i < obj.items.length; i++) {
                        dados = dados.concat(parseFloat(obj.items[i].DADO,2));
                    }
                    gerarLinhaUnica(cont, nome, linha, categorias, dados);
                }
            }
        };
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }

    function gerarLinhaUnica(cont, nome, linha, categorias, dados) {

        grafico = {
            chart: {
                type: 'line'
            },
            title: {
                text: '<span style="font-size:12px">'+nome+'</span>'
            },
            xAxis: {
                categories: categorias
            },
            yAxis: {
                title: {
                    text: 'Valor'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: [{
                name: linha,
                data: dados
            }]
        };
        Highcharts.chart(cont, grafico); 
    }

    function quadro(sql, cont, nome, icon, cor, operador1, operador2) {
        var xhttp = new XMLHttpRequest();
        var htmlQuadro = "";
        xhttp.onreadystatechange = function() {
            if (this.readyState < 4) {
                document.getElementById(cont).innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
            } else {
                if (this.readyState == 4 && this.status == 200) {
                    obj = JSON.parse(this.responseText);
                    htmlQuadro += '';
                    //"ondblclick='javascript:document.getElementById('+'"'+cont+'"'+').remove();'"
                    htmlQuadro += "    <div class='dashboard-stat dashboard-stat-v2 "+ cor +"' ondblclick='javascript:document.getElementById("+'"'+cont+'"'+").innerHTML="+'" "'+";'>";
                    //htmlQuadro += '    <div class="dashboard-stat dashboard-stat-v2 '+ cor +'" >';
                    htmlQuadro += '        <div class="visual">';
                    htmlQuadro += '            <i class="fa fa-'+ icon +'"></i>';
                    htmlQuadro += '        </div>';
                    htmlQuadro += '        <div class="details">';
                    htmlQuadro += '            <div class="number">';
                    htmlQuadro += '                <span data-counter="counterup" data-value="0">'+ operador1 +' '+ obj.items[0].VALOR +'</span>'+ operador2;
                    htmlQuadro += '            </div>';
                    htmlQuadro += '            <div class="desc"> '+ nome +' </div>';
                    htmlQuadro += '        </div>';
                    htmlQuadro += '    </div>';
                    htmlQuadro += '';
                    document.getElementById(cont).innerHTML = htmlQuadro;
                }
            }
        };
        //console.log(getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql);
        xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sql, true);
        xhttp.send();
    }

    function autoTabela(sql, cont, nome, pagina, qtRegPag, modulo, metodo) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState < 4) {
                document.getElementById(cont).innerHTML = "<div align='center'><img src='images/gifCarregando5.gif' width='100' heigth='100' /></div>";
            } else {
                if (this.readyState == 4 && this.status == 200) {
                    obj = JSON.parse(this.responseText);
                    var hcols;
                    var cols;
                    var rows;
                    var obj2;
                    var qtCols = 0;
                    var htmlTabela = "";
                    var sqlMod = "";

                    htmlTabela += '<div class="portlet light bordered">';
                    htmlTabela += '    <div class="portlet-title">';
                    htmlTabela += '        <div class="caption"><span class="caption-subject font-dark bold">'+ nome +'</span></div>';
                    htmlTabela += '        <div class="actions">';
                    
                    if (obj.totalCount > 0 && Number(pagina) > 0) {
                        var antPag = Number(pagina)-1;
                        var proPag = Number(pagina)+1;

                        if (Number(pagina) != 1) {
                            htmlTabela += '            <a id="'+cont+'btPriPag" class="btn btn-circle btn-icon-only btn-default" onClick="atualizar('+"'"+modulo+"'"+','+"'"+cont+"'"+',1);" >';
                            htmlTabela += '                <i class="fa fa-angle-double-left"></i>';
                            htmlTabela += '            </a>';
                            htmlTabela += '            <a id="'+cont+'btAntPag" class="btn btn-circle btn-icon-only btn-default" onClick="atualizar('+"'"+modulo+"'"+','+"'"+cont+"'"+','+antPag+');" >';
                            htmlTabela += '                <i class="fa fa-angle-left"></i>';
                            htmlTabela += '            </a>';
                        }
                            htmlTabela += ' Pag. <b><span id="'+cont+'pagAtual">'+pagina+'</span></b> de <b><span id="'+cont+'pagMax">'+obj.items[0].QTPAG+'</span></b> '
                        if (Number(pagina) != Number(obj.items[0].QTPAG)) {
                            htmlTabela += '            <a id="'+cont+'btProPag" class="btn btn-circle btn-icon-only btn-default" onClick="atualizar('+"'"+modulo+"'"+','+"'"+cont+"'"+','+proPag+');" >';
                            htmlTabela += '                <i class="fa fa-angle-right"></i>';
                            htmlTabela += '            </a>';
                            htmlTabela += '            <a id="'+cont+'btUltPag" class="btn btn-circle btn-icon-only btn-default" onClick="atualizar('+"'"+modulo+"'"+','+"'"+cont+"'"+','+obj.items[0].QTPAG+');">';
                            htmlTabela += '                <i class="fa fa-angle-double-right"></i>';
                            htmlTabela += '            </a>';
                        }
                    }

                    htmlTabela += '            <a class="btn btn-circle btn-icon-only btn-default" onclick="javascript:document.getElementById('+"'"+cont+"'"+').innerHTML = '+"' '"+';"><i class="fa fa-eye-slash"></i></a>';
                    htmlTabela += '        </div>'; 
                    htmlTabela += '    </div>';
                    htmlTabela += '    <div class="portlet-body">';                
                    htmlTabela += '        <div class="table-responsive">';
                    htmlTabela += '            <table class="table table-condensed table-hover">';
                    htmlTabela += '                <thead>';
                    htmlTabela += '                    <tr>';

                    for (hcols in obj.items[0]) {
                        qtCols += + 1;
                        if (hcols == 'RODAPE' || hcols == 'COR_LINHA' || hcols == 'RN' || hcols == 'QTREG' || hcols == 'QTPAG' || hcols == 'CLICKLINE') {
                            continue;
                        }
                        htmlTabela += '                        <th><b>'+hcols+'</b></th>';
                    }
                    
                    htmlTabela += '                    </tr>';
                    htmlTabela += '                </thead>';

                    if (obj.totalCount == 0) {
                        htmlTabela += '                    <tbody><tr><td align="center"><span class="font-red">N&atilde;o h&aacute; dados para mostrar...</spam></td></tr></tbody>';
                    } else {
                        htmlTabela += '                <tbody>';
                        for(var i = 0; i < obj.items.length; i++) {
                            if (obj.items[i].COR_LINHA != 'default' || obj.items[i].COR_LINHA.length > 0) {
                                htmlTabela += '                    <tr class="bg-'+obj.items[i].COR_LINHA+'" onClick="'+obj.items[i].CLICKLINE+'">';
                            } else {
                                htmlTabela += '                    <tr onClick="'+obj.items[i].CLICKLINE+'">';
                            }

                            for (cols in obj.items[0]) {
                                if (cols == 'RODAPE' || cols == 'COR_LINHA' || cols == 'RN' || cols == 'QTREG' || cols == 'QTPAG' || cols == 'CLICKLINE') {
                                    continue;
                                }
                                obj2 = obj.items[i];
                                htmlTabela += '                    <td>'+ obj2[cols] +'</td>';
                            }
                            htmlTabela += '                    </tr>';
                        } 
                        if (obj.items[0].RODAPE !== undefined) {
                            htmlTabela += '                    <tr><td colspan="'+qtCols+'" align="right"><h4><b>'+obj.items[0].RODAPE+'</b></h4></td></tr>';
                        }
                        htmlTabela += '                </tbody>';
                    }

                    htmlTabela += '            </table>';
                    htmlTabela += '        </div>';
                    htmlTabela += '    </div>';
                    htmlTabela += '</div>';
                }

                document.getElementById(cont).innerHTML = htmlTabela;
            }
        };

        pagina = typeof pagina !== 'undefined' ? pagina : 0;
        metodo = typeof metodo !== 'undefined' ? metodo : 'GET';
        if (getCookie("ccwWS2")=='N') {
            metodo = 'GET';
        }

        if (Number(pagina)>0) {
            var pagAnt = Number(qtRegPag)-1;
            sqlMod = 'select y.* from (select rownum as rn, x.* from (' ;
            sqlMod = sqlMod + sql.replace('0 as qtPag','ceil(count(*) over()/'+Number(qtRegPag)+') qtPag') +'  ) x where rownum < '+Number(pagina)+' * '+Number(qtRegPag);
            if (metodo == 'GET') {
                sqlMod += ' %2B ';
            }
            if (metodo == 'POST') {
                sqlMod += ' <#43> ';
            }
            sqlMod += ' 1 ) y where y.rn >= '+Number(pagina)+' * '+Number(qtRegPag)+' - '+pagAnt+' ;';
        } else {
            sqlMod = sql;
        }
        //console.log('--->>> '+sqlMod);
        if (metodo == 'GET') {
            sqlMod = sqlMod.replace(/<#43>/g, "%2B");
            sqlMod = sqlMod.replace(/<#34>/g, "%22");
            //console.log('get sql-> '+sqlMod);
            xhttp.open("GET", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha")+"&sql="+sqlMod, true);
            xhttp.send();
        }
        if (metodo == 'POST') {
            sqlMod = sqlMod.replace(/%2B/g, "<#43>");
            sqlMod = sqlMod.replace(/%22/g, "<#34>");
            //console.log('post sql-> '+sqlMod);
            xhttp.open("POST", getCookie("ccwServidor")+"/sql?usuario="+getCookie("ccwUsuario")+"&senha="+getCookie("ccwSenha"), true);
            xhttp.send(sqlMod);
        }

    }
