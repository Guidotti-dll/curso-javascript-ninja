(function (DOM) {
  'use strict';

/*
A loja de carros será nosso desafio final. Na aula anterior, você fez a parte
do cadastro dos carros. Agora nós vamos começar a deixar ele com cara de
projeto mesmo.
Crie um novo repositório na sua conta do GitHub, com o nome do seu projeto.
Na hora de criar, o GitHub te dá a opção de criar o repositório com um
README. Use essa opção.
Após criar o repositório, clone ele na sua máquina.
Crie uma nova branch chamada `challenge-30`, e copie tudo o que foi feito no
desafio da aula anterior para esse novo repositório, nessa branch
`challenge-30`.
Adicione um arquivo na raiz desse novo repositório chamado `.gitignore`.
O conteúdo desse arquivo deve ser somente as duas linhas abaixo:
node_modules
npm-debug.log
Faça as melhorias que você achar que são necessárias no seu código, removendo
duplicações, deixando-o o mais legível possível, e então suba essa alteração
para o repositório do seu projeto.
Envie um pull request da branch `challenge-30` para a `master` e cole aqui
nesse arquivo, dentro do `console.log`, o link para o pull request no seu
projeto.
*/

    const app = (function() {
      return {
        init : function init() {
          this.companyInfo();
          this.initEvents();
        },

        initEvents: function initEvents () {
          DOM('[data-js="form"]').on('submit', this.handleSubmit)
        },

        handleSubmit: function handleSubmit (e) {
          e.preventDefault();
          const $inputs = DOM('input').element;
          const $cars = DOM('[data-js="cars"]').get();
          if (!app.hasFieldEmpty($inputs)) {
            app.showMessage($inputs);
            return;
          }
          $cars.appendChild(app.createNewCar($inputs))
          app.clearInputs($inputs);
        },

        showMessage: function showMessage(inputs) {
          const emptyFields = []
          inputs.forEach((item) => {
            if (item.value === '') {
              emptyFields.push(item.name)
            }
          })
          alert(`Você deve preencher os seguintes campos: ${emptyFields.slice(0,- 1).join(', ')} e ${emptyFields.slice(-1)}`);
        },

        hasFieldEmpty: function hasFieldEmpty(inputs) {
          let result = true;
          inputs.forEach((item) => {
            result = true;
            if (item.value === '') {
              result = false;
            }
          })
          return(result);
        },


        createNewCar: function createNewCar (inputs) {
          const $fragment =  document.createDocumentFragment();
          const $tr =  document.createElement('tr');

          inputs.forEach((input)=>{
          const $td = document.createElement('td')
          if(input.name === 'imagem'){
            const $carImage = document.createElement('img');
            $carImage.src = input.value
            $td.appendChild($carImage);
          }else{
            $td.textContent = input.value
          }
          $tr.appendChild($td)
        })

        return $fragment.appendChild($tr)
        },

        clearInputs: function clearInputs(inputs) {
          inputs.forEach((item) => {
            item.value = ''
          })
        },

        companyInfo: function companyInfo () {
          const ajax = new XMLHttpRequest();
          ajax.open('GET', './company.json', true);
          ajax.send();
          ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
        },

        getCompanyInfo: function getCompanyInfo() {
          //this referenciando o ajax
          if (!app.isReady.call(this)) 
            return;
          const data = JSON.parse(this.responseText);
          
          const $companyName =  DOM('[data-js="company-name"]').get();
          const $companyPhone =  DOM('[data-js="company-phone"]').get();

          $companyName.textContent = data.name;
          $companyPhone.textContent = data.phone;
        },

        isReady: function isReady() {
          return this.readyState === 4 && this.status === 200;
        }
      }
    }())

    app.init()
})(window.DOM);
