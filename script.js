$(document).ready(function() {
    // Máscara de telefone
    $('#tel').on('input', function() {
        var value = $(this).val().replace(/\D/g, '');
        var formattedValue = '';
        if (value.length > 0) {
            formattedValue += '(' + value.substring(0, 2) + ') ';
        }
        if (value.length > 2) {
            formattedValue += value.substring(2, 7) + '-' + value.substring(7, 11);
        }
        $(this).val(formattedValue);
    });

    // Máscara de valor
    $('#valor').on('input', function() {
        var value = $(this).val().replace(/\D/g, '');
        var formattedValue = '';
        if (value.length > 0) {
            formattedValue += 'R$ ';
        }
        if (value.length > 3) {
            formattedValue += value.substring(0, value.length - 2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            formattedValue += ',' + value.substring(value.length - 2);
        } else {
            formattedValue += value;
        }
        $(this).val(formattedValue);
    });

    function runApi(endpoint, method, data, successHandler) {
        $.ajax({
            url: endpoint,
            type: method,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: successHandler,
            error: function(xhr, status, error) {
                console.error('Erro:', error, xhr.responseText);
                $('#resultado').html('<div class="alert alert-danger">Erro ao executar a ação.</div>');
            }
        });
    }

    function limparFormulario() {
        $('#clienteForm')[0].reset();
    }

    function updateResult(result) {
        $('#resultado').html('<div class="alert alert-info">' + result + '</div>');
        setTimeout(() => {
            $('#resultado').empty();
        }, 3000);
        limparFormulario();
        carregarClientes();
    }

    $('#cadastrarBtn').click(function() {
        if (!$('#cliente').val() || !$('#tel').val()) {
            $('#resultado').html('<div class="alert alert-danger">Os campos "Nome" e "Telefone" são obrigatórios.</div>');
            setTimeout(() => {
                $('#resultado').empty();
            }, 3000);
            return;
        }
        const spinner = $('#cadastrarBtn .spinner-border');
        spinner.removeClass('d-none');
        const dados = {
            cliente: $('#cliente').val().toUpperCase(),
            tel: $('#tel').val(),
            idade: $('#idade').val(),
            sexo: $('#sexo').val() || "",
            instagram: $('#instagram').val().toUpperCase(),
            endereco: $('#endereco').val().toUpperCase(),
            cartela_cores: $('#cartela_cores').val() || "",
            estilo1: $('#estilo1').val() || "",
            estilo2: $('#estilo2').val() || "",
            estilo3: $('#estilo3').val() || "",
            biotipo: $('#biotipo').val() || "",
            formato_rosto: $('#formato_rosto').val() || "",
            altura: $('#altura').val().replace(/\./g, '').replace(',', '.'),
            peso: $('#peso').val().replace(/\./g, '').replace(',', '.'),
            calcado: $('#calcado').val(),
            medida_ombro: $('#medida_ombro').val().replace(/\./g, '').replace(',', '.'),
            medida_cintura: $('#medida_cintura').val().replace(/\./g, '').replace(',', '.'),
            medida_quadril: $('#medida_quadril').val().replace(/\./g, '').replace(',', '.'),
            medida_rosto: $('#medida_rosto').val().replace(/\./g, '').replace(',', '.'),
            medida_tronco: $('#medida_tronco').val().replace(/\./g, '').replace(',', '.'),
            medida_perna: $('#medida_perna').val().replace(/\./g, '').replace(',', '.'),
            pescoco: $('#pescoco').val() || "",
            busto: $('#busto').val().replace(/\./g, '').replace(',', '.'),
            ombros: $('#ombros').val() || "",
            ombros_tamanho: $('#ombros_tamanho').val() || "",
            peso_visual: $('#peso_visual').val() || "",
            valor: $('#valor').val().replace('R$', '').replace(/\./g, '').replace(',', '.'),
            servico_valor: $('#servico_valor').val() || "",
            forma_pagamento: $('#forma_pagamento').val() || "",
            observacoes: $('#observacoes').val(),
            academia: $('#academia').val(),
            trabalho_formal: $('#trabalho_formal').val(),
            trabalho_informal: $('#trabalho_informal').val(),
            home_office: $('#home_office').val(),
            almoco_familia: $('#almoco_familia').val(),
            viagem: $('#viagem').val(),
            balada: $('#balada').val(),
            sair_jantar: $('#sair_jantar').val(),
            eventos_corporativos: $('#eventos_corporativos').val(),
            praia_clube: $('#praia_clube').val(),
            data_atendimento: $('#data_atendimento').val().split('-').reverse().join('/') || "",
            data_pagamento: $('#data_pagamento').val().split('-').reverse().join('/') || ""
        };
        runApi('/cadastrar', 'POST', dados, function(response) {
            $('#resultado').html('<div class="alert alert-info">' + response.result + '</div>');
            setTimeout(() => {
                $('#resultado').empty();
            }, 3000);
            spinner.addClass('d-none');
            limparFormulario();
            carregarClientes(); // Atualiza a tabela após salvar/editar/excluir
        });
    });

    $('#editarBtn').click(function() {
        const dados = {
            id: $('#id').val(),
            cliente: $('#cliente').val().toUpperCase(),
            tel: $('#tel').val(),
            idade: $('#idade').val(),
            sexo: $('#sexo').val() || "",
            instagram: $('#instagram').val().toUpperCase(),
            endereco: $('#endereco').val().toUpperCase(),
            cartela_cores: $('#cartela_cores').val() || "",
            estilo1: $('#estilo1').val() || "",
            estilo2: $('#estilo2').val() || "",
            estilo3: $('#estilo3').val() || "",
            biotipo: $('#biotipo').val() || "",
            formato_rosto: $('#formato_rosto').val() || "",
            altura: $('#altura').val().replace(/\./g, '').replace(',', '.'),
            peso: $('#peso').val().replace(/\./g, '').replace(',', '.'),
            calcado: $('#calcado').val(),
            medida_ombro: $('#medida_ombro').val().replace(/\./g, '').replace(',', '.'),
            medida_cintura: $('#medida_cintura').val().replace(/\./g, '').replace(',', '.'),
            medida_quadril: $('#medida_quadril').val().replace(/\./g, '').replace(',', '.'),
            medida_rosto: $('#medida_rosto').val().replace(/\./g, '').replace(',', '.'),
            medida_tronco: $('#medida_tronco').val().replace(/\./g, '').replace(',', '.'),
            medida_perna: $('#medida_perna').val().replace(/\./g, '').replace(',', '.'),
            pescoco: $('#pescoco').val() || "",
            busto: $('#busto').val().replace(/\./g, '').replace(',', '.'),
            ombros: $('#ombros').val() || "",
            ombros_tamanho: $('#ombros_tamanho').val() || "",
            peso_visual: $('#peso_visual').val() || "",
            valor: $('#valor').val().replace('R$', '').replace(/\./g, '').replace(',', '.'),
            servico_valor: $('#servico_valor').val() || "",
            forma_pagamento: $('#forma_pagamento').val() || "",
            observacoes: $('#observacoes').val(),
            academia: $('#academia').val(),
            trabalho_formal: $('#trabalho_formal').val(),
            trabalho_informal: $('#trabalho_informal').val(),
            home_office: $('#home_office').val(),
            almoco_familia: $('#almoco_familia').val(),
            viagem: $('#viagem').val(),
            balada: $('#balada').val(),
            sair_jantar: $('#sair_jantar').val(),
            eventos_corporativos: $('#eventos_corporativos').val(),
            praia_clube: $('#praia_clube').val(),
            data_atendimento: $('#data_atendimento').val().split('-').reverse().join('/') || "",
            data_pagamento: $('#data_pagamento').val().split('-').reverse().join('/') || ""
        };
        runApi('/editar', 'POST', dados, function(response) {
            updateResult(response.result);
        });
    });

    $('#excluirBtn').click(function() {
        const id = $('#id').val();
        if (confirm('Deseja realmente excluir esse cliente?')) {
            runApi('/excluir', 'POST', { id }, function(response) {
                updateResult(response.result);
            });
        }
    });

    $('#pesquisarBtn').click(function() {
        const query = prompt("Pesquisa aqui pelo nome ou ID");
        if (query) {
            $.ajax({
                url: '/pesquisar',
                type: 'GET',
                data: { query: query },
                success: function(response) {
                    if (response.result) {
                        $('#resultado').html('<div class="alert alert-warning">' + response.result + '</div>');
                        setTimeout(() => {
                            $('#resultado').empty();
                        }, 3000);
                    } else {
                        // Preencha os campos do formulário com os dados do cliente retornado
                        $('#id').val(response.id);
                        $('#cliente').val(response.cliente);
                        $('#tel').val(response.tel);
                        $('#idade').val(response.idade);
                        $('#instagram').val(response.instagram);
                        $('#sexo').val(response.sexo);
                        $('#data_atendimento').val(response.data_atendimento.split('/').reverse().join('-'));
                        $('#data_pagamento').val(response.data_pagamento.split('/').reverse().join('-'));
                        $('#endereco').val(response.endereco);
                        $('#cartela_cores').val(response.cartela_cores);
                        $('#estilo1').val(response.estilo1);
                        $('#estilo2').val(response.estilo2);
                        $('#estilo3').val(response.estilo3);
                        $('#biotipo').val(response.biotipo);
                        $('#formato_rosto').val(response.formato_rosto);
                        $('#altura').val(response.altura.replace('.', ','));
                        $('#peso').val(response.peso.replace('.', ','));
                        $('#calcado').val(response.calcado);
                        $('#medida_ombro').val(response.medida_ombro.replace('.', ','));
                        $('#medida_cintura').val(response.medida_cintura.replace('.', ','));
                        $('#medida_quadril').val(response.medida_quadril.replace('.', ','));
                        $('#medida_rosto').val(response.medida_rosto.replace('.', ','));
                        $('#medida_tronco').val(response.medida_tronco.replace('.', ','));
                        $('#medida_perna').val(response.medida_perna.replace('.', ','));
                        $('#pescoco').val(response.pescoco);
                        $('#busto').val(response.busto.replace('.', ','));
                        $('#ombros').val(response.ombros);
                        $('#ombros_tamanho').val(response.ombros_tamanho);
                        $('#peso_visual').val(response.peso_visual);
                        $('#valor').val(response.valor.replace('.', ','));
                        $('#servico_valor').val(response.servico_valor);
                        $('#forma_pagamento').val(response.forma_pagamento);
                        $('#observacoes').val(response.observacoes);
                        $('#academia').val(response.academia);
                        $('#trabalho_formal').val(response.trabalho_formal);
                        $('#trabalho_informal').val(response.trabalho_informal);
                        $('#home_office').val(response.home_office);
                        $('#almoco_familia').val(response.almoco_familia);
                        $('#viagem').val(response.viagem);
                        $('#balada').val(response.balada);
                        $('#sair_jantar').val(response.sair_jantar);
                        $('#eventos_corporativos').val(response.eventos_corporativos);
                        $('#praia_clube').val(response.praia_clube);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Erro:', error);
                    $('#resultado').html('<div class="alert alert-danger">Erro ao executar a ação.</div>');
                }
            });
        }
    });

    function carregarClientes() {
        runApi('/carregar', 'GET', {}, function(response) {
            console.log('Dados recebidos do servidor:', response);
            const tabela = $('#tabelaClientes tbody');
            tabela.empty();
            if (response.length === 0) {
                tabela.append('<tr><td colspan="43" class="text-center">Nenhum cliente encontrado.</td></tr>');
            } else {
                response.forEach(cliente => {
                    tabela.append(`
                        <tr>
                            <td>${cliente.id}</td>
                            <td>${cliente.cliente}</td>
                            <td>${cliente.tel}</td>
                            <td>${cliente.idade}</td>
                            <td>${cliente.sexo}</td>
                            <td>${cliente.instagram}</td>
                            <td>${cliente.endereco}</td>
                            <td>${cliente.cartela_cores}</td>
                            <td>${cliente.estilo1}</td>
                            <td>${cliente.estilo2}</td>
                            <td>${cliente.estilo3}</td>
                            <td>${cliente.biotipo}</td>
                            <td>${cliente.formato_rosto}</td>
                            <td>${cliente.altura.replace('.', ',')}</td>
                            <td>${cliente.peso.replace('.', ',')}</td>
                            <td>${cliente.calcado}</td>
                            <td>${cliente.medida_ombro.replace('.', ',')}</td>
                            <td>${cliente.medida_cintura.replace('.', ',')}</td>
                            <td>${cliente.medida_quadril.replace('.', ',')}</td>
                            <td>${cliente.medida_rosto.replace('.', ',')}</td>
                            <td>${cliente.medida_tronco.replace('.', ',')}</td>
                            <td>${cliente.medida_perna.replace('.', ',')}</td>
                            <td>${cliente.pescoco}</td>
                            <td>${cliente.busto.replace('.', ',')}</td>
                            <td>${cliente.ombros}</td>
                            <td>${cliente.ombros_tamanho}</td>
                            <td>${cliente.peso_visual}</td>
                            <td>${cliente.servico_valor}</td>
                            <td>${cliente.forma_pagamento}</td>
                            <td>${cliente.observacoes}</td>
                            <td>${cliente.valor.replace('.', ',')}</td>
                            <td>${cliente.academia}</td>
                            <td>${cliente.trabalho_formal}</td>
                            <td>${cliente.trabalho_informal}</td>
                            <td>${cliente.home_office}</td>
                            <td>${cliente.almoco_familia}</td>
                            <td>${cliente.viagem}</td>
                            <td>${cliente.balada}</td>
                            <td>${cliente.sair_jantar}</td>
                            <td>${cliente.eventos_corporativos}</td>
                            <td>${cliente.praia_clube}</td>
                            <td>${cliente.data_atendimento}</td>
                            <td>${cliente.data_pagamento}</td>
                        </tr>
                    `);
                });
            }
        });
    }

    carregarClientes();
});
