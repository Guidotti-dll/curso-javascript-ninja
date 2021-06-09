(function (DOM, document) {
  'use strict';

/*
Agora vamos criar a funcionalidade de "remover" um carro. Adicione uma nova
coluna na tabela, com um botão de remover.
Ao clicar nesse botão, a linha da tabela deve ser removida.
Faça um pull request no seu repositório, na branch `challenge-31`, e cole
o link do pull request no `console.log` abaixo.
Faça um pull request, também com a branch `challenge-31`, mas no repositório
do curso, para colar o link do pull request do seu repo.
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
          const $td = document.createElement('td');
          if(input.name === 'imagem'){
            const $carImage = document.createElement('img');
            $carImage.src = input.value;
            $td.appendChild($carImage);
          }else{
            $td.textContent = input.value;
          }
          $tr.appendChild($td);
        })
        $tr.appendChild(app.addRemoveButton());
        return $fragment.appendChild($tr)
        },

        addRemoveButton: function addRemoveButton() {
          const $td = document.createElement('td')
          const $removeButton = document.createElement('button')
          $removeButton.setAttribute('type', 'button'); 
          $removeButton.textContent = 'Remover'; 
          $removeButton.addEventListener('click', app.removeCar);
          $td.appendChild($removeButton);
          return $td;
        },

        removeCar: function removeCar() {
          //this referenciando o próprio botão
          const $removedCar = this.parentNode.parentNode;
          $removedCar.parentNode.removeChild($removedCar);
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
})(window.DOM,document);
