usuarioLogado = localStorage.getItem('usuario')
statusLogado = localStorage.getItem('logado')
codigoUsuario = localStorage.getItem('codigoUsuario')
ambiente = localStorage.getItem('ambiente')


if (statusLogado != 0) {

    window.location.href = "../login/login.html"
}

setTimeout(() => { $("#logado").val(codigoUsuario + ' - ' + usuarioLogado + ' - ' + ambiente) }, 300)


/*
* Data atual
*/
const hoje = new Date();
const dia = String(hoje.getDate()).padStart(2, '0')
const mes = String(hoje.getMonth() + 1).padStart(2, '0') // Mês começa em 0
const ano = hoje.getFullYear()
const dataAtualFormatada = `${mes}/${ano}`



/*
* Função que pega a data atual e adicina mais um mes
*/
const adicionarMeses = (dataMMYYYY, quantidadeMeses) => {
    const [mesStr, anoStr] = dataMMYYYY.split('/')
    const mesAtual = parseInt(mesStr) - 1 // JavaScript começa o mês em 0
    const anoAtual = parseInt(anoStr)

    const novaData = new Date(anoAtual, mesAtual + quantidadeMeses, 1)

    const novoMes = String(novaData.getMonth() + 1).padStart(2, '0')
    const novoAno = novaData.getFullYear()

    return `${novoMes}/${novoAno}`
}

const totalizadoresConsumo = async () => {

    // const versaoSelecionada= parseInt(localStorage.getItem('versaoConsumo'))

    const totalizadores = new servicoGraficos()
    const retornoT = await totalizadores.totalizadoresConsumo()

    return JSON.parse(retornoT)


}



totalizadoresConsumo().then((totais) => {

    const retornoDados = [parseInt(totais.QTDCON), parseInt(totais.QTDCO0), parseInt(totais.QTDCO1), parseInt(totais.QTDCO2), parseInt(totais.QTDCO3), parseInt(totais.QTDCO4), parseInt(totais.QTDCO5)]


    const nomesTooltip = ['Compra ', 'Consumo ', 'Consumo ', 'Consumo ', 'Consumo ', 'Consumo ', 'Consumo '];

    const $canvas = $('#graficoConsumo');
    //$('#graficoConsumo').css('margin-top', '70px'); // ou qualquer valor que quiser

    if ($canvas.length === 0) {
        console.error("Canvas com ID 'graficoConsumo' não encontrado.");
        return;
    }

    const ctx = $canvas[0].getContext('2d');
    if (!ctx) {
        console.error("Não foi possível obter o contexto do canvas.");
        return;
    }

    const meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [dataAtualFormatada, dataAtualFormatada, adicionarMeses(dataAtualFormatada, 1), adicionarMeses(dataAtualFormatada, 2), adicionarMeses(dataAtualFormatada, 3), adicionarMeses(dataAtualFormatada, 4), adicionarMeses(dataAtualFormatada, 5)],
        datasets: [{
                label: 'Consumo', // nome genérico (legenda será personalizada via cor)
                data: retornoDados,
                backgroundColor: [
                    'rgba(30, 100, 180, 0.6)', // vermelho para Compra
                    'rgba(54, 162, 235, 0.6)', // azul para Consumo
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000, // milissegundos (padrão é 1000)
                easing: 'easeOutQuart' // você pode ajustar o estilo também
            },
            plugins: {
                legend: {
                    display: true,
                 labels: {
                        generateLabels: function (chart) {
                            return [
                                {
                                    text: 'Compra',
                                    fillStyle: 'rgba(30, 100, 180, 0.6)',
                                    strokeStyle: 'rgba(30, 100, 180, 0.6)',
                                    lineWidth: 1
                                },
                                {
                                    text: 'Consumo',
                                    fillStyle: 'rgba(54, 162, 235, 0.6)',
                                    strokeStyle: 'rgba(54, 162, 235, 1)',
                                    lineWidth: 1
                                }
                            ];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'CONSUMO MENSAL'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const valor = context.formattedValue;
                            return `${nomesTooltip[index]}: ${valor}`;
                        }
                    }
                }
            }
        }
    })
})







// const meuGrafico = new Chart(ctx, {
//   type: 'bar',
//   data: {
//      labels: [dataAtualFormatada, adicionarMeses(dataAtualFormatada, 1), adicionarMeses(dataAtualFormatada, 2), adicionarMeses(dataAtualFormatada, 3), adicionarMeses(dataAtualFormatada, 4), adicionarMeses(dataAtualFormatada, 5)],
//     datasets: [{
//       label: 'Consumo',
//       data: retornoDados,
//       backgroundColor: 'rgba(54, 162, 235, 0.6)',
//       borderColor: 'rgba(54, 162, 235, 1)',
//       borderWidth: 1,
//       barThickness: 90
//     }]
//   },
//   options: {
//     responsive: true,
//                 plugins: {
//                 legend: {
//                     display: true,
//                 },
//                 title: {
//                     display: true,
//                     text: 'CONSUMO MENSAL'
//                 }
//             },
//     scales: {
//       y: {
//         beginAtZero: true,
//         min: 0
//       }
//     }
//   }
// })
