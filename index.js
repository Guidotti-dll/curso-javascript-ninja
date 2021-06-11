(function (DOM, document) {
  'use strict';

/*
Já temos as funcionalidades de adicionar e remover um carro. Agora, vamos persistir esses dados, 
salvando-os temporariamente na memória de um servidor.
Nesse diretório do `challenge-32` tem uma pasta `server`. É um servidor simples, em NodeJS, para 
que possamos utilizar para salvar as informações dos nossos carros.
Para utilizá-lo, você vai precisar fazer o seguinte:
- Via terminal, acesse o diretório `server`;
- execute o comando `npm install` para instalar as dependências;
- execute `node app.js` para iniciar o servidor.
Ele irá ser executado na porta 3000, que pode ser acessada via browser no endereço: 
`http://localhost:3000`
O seu projeto não precisa estar rodando junto com o servidor. Ele pode estar em outra porta.
As mudanças que você irá precisar fazer no seu projeto são:
- Para listar os carros cadastrados ao carregar o seu projeto, faça um request GET no endereço
`http://localhost:3000/car`
- Para cadastrar um novo carro, faça um POST no endereço `http://localhost:3000/car`, enviando
os seguintes campos:
  - `image` com a URL da imagem do carro;
  - `brandModel`, com a marca e modelo do carro;
  - `year`, com o ano do carro;
  - `plate`, com a placa do carro;
  - `color`, com a cor do carro.
Após enviar o POST, faça um GET no `server` e atualize a tabela para mostrar o novo carro cadastrado.
Crie uma branch `challenge-32` no seu projeto, envie um pull request lá e cole nesse arquivo a URL
do pull request.
*/

    const app = (function() {
      return {
        init : function init() {
          this.companyInfo();
          this.initEvents();
          this.getCars();
        },

        initEvents: function initEvents () {
          DOM('[data-js="form"]').on('submit', this.handleSubmit)
        },

        handleSubmit: function handleSubmit (e) {
          e.preventDefault();
          const $inputs = DOM('input').element;
          if (!app.hasFieldEmpty($inputs)) {
            app.showMessage($inputs);
            return;
          }

          if (online) {
            app.postCar($inputs);
          }else {
            cars.push(app.getInputsValues($inputs));
            app.createNewCar(cars)
          }
          
          app.clearInputs($inputs);
        },

        getCars: function getCars() {
          ajax.open('GET', 'http://localhost:3000/car');
          ajax.send();
          ajax.addEventListener('readystatechange', function () {
            setTimeout(() => {
              if(app.isReady.call(this)){
                online = true;
                const response = JSON.parse(ajax.responseText);
                app.createNewCar(response);
              }else{
                online = false;
                alert('O servidor não esta no ar!! Todos os carros que você cadastrar agora iram sumir após recarregar a pagina!! Ligue o servidor para uma melhor experiência!');
              }
            }, 1000);
          }
          )},

        postCar: function postCar(inputs) {
          const ajax = new XMLHttpRequest();
          var car = app.getInputsValues(inputs);
          ajax.open('POST', 'http://localhost:3000/car');
          ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          ajax.send(`image=${car.image}&brandModel=${car.brandModel}&year=${car.year}&plate=${car.plate}&color=${car.color}`);
          ajax.onreadystatechange = function () {
            if(app.isReady.call(this)){
              console.log(ajax.responseText);
              app.getCars();
            }
          }
        },

        createNewCar: function createNewCar (inputs) {
          const $cars = DOM('[data-js="cars"]').get();
              $cars.innerHTML = `
              <tr>
                <td>Modelo</td>
                <td>Ano</td>
                <td>Placa</td>
                <td>Cor</td>
                <td>Imagem</td>
              </tr>
              `
              inputs.forEach((input)=>{
              $cars.innerHTML += `
              <tr>
                <td>${input.brandModel}</td>
                <td>${input.year}</td>
                <td>${input.plate}</td>
                <td>${input.color}</td>
                <td><img src="${input.image}"></td>
              </tr>`
            })
            
            const $tr = DOM('tr');
            $tr.forEach((tr, index)=>{ 
              index !== 0 ?
              tr.appendChild(app.addRemoveButton())
              : null });
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
          const plate = $removedCar.children[2].textContent
          if(online){
            const ajax = new XMLHttpRequest();
            ajax.open('DELETE', `http://localhost:3000/car/${plate}`);
            ajax.send();
            ajax.onreadystatechange = function () {
              if(app.isReady.call(this)){
                console.log(ajax.responseText)
              }
            }
          }else {
            const carIndex = cars.findIndex(car => car.plate === plate);
            cars.splice(carIndex, 1);
          }
          $removedCar.parentNode.removeChild($removedCar);
        },

        getInputsValues: function getInputsValues(inputs) {
          const newCar = {}
          inputs.forEach((input)=>{
            newCar[input.name] = input.value;
          })
          return newCar;
        },

        clearInputs: function clearInputs(inputs) {
          inputs.forEach((item) => {
            item.value = ''
          })
        },

        showMessage: function showMessage(inputs) {
          const emptyFields = []
          inputs.forEach((item) => {
            if (item.value === '') {
              emptyFields.push(item.placeholder)
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

        companyInfo: function companyInfo () {
          const ajax = new XMLHttpRequest();
          ajax.open('GET', './company.json');
          ajax.send();
          ajax.addEventListener('readystatechange', this.getCompanyInfo);
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
        },
      }

    }())
    const ajax = new XMLHttpRequest();
    let online = false;
    let cars = [];

    app.init();
})(window.DOM,document);
