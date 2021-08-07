App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum){
      App.web3Provider = window.ethereum;
      try{
        await window.ethereum.enable();
      } catch(error){
        alert("account 접근 제한");
      }
    } else if (window.web3){
      App.web3Provider = window.web3.currentProvider;
    } else{
      // metamask가 없을경우.
      App.web3Provider = new Web3.provdiers.HttpProvider("http://localhost:8545");
    }
    web3 = new Web3(App.web3Provider)
    

    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON("Adoption.json", function(data){
      // Adoption.json ==> js Object로 변경
      const AdoptionArtifact = data;

      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      App.contracts.Adoption.setProvider(App.web3Provider);

      return App.markAdopted();
    })

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    /*
     * 입양되었다고 블록체인에 기록된 Pet들을 표시
     * 이더리움에서 상태를 읽어와야 함.
     */

    let adoptionInstance;
    
    // 해당 contract deploy여부 판단
    App.contracts.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;

      // Contract.<함수>.call vs Contract.<함수>.send
      return adoptionInstance.getAdopters.call()
    }).then(function(adopters){
      for (let i=0; i<adopters.length; i++){
        if (adopters[i] !== "0x0000000000000000000000000000000000000000"){
          $('.panel-pet').eq(i)
          .find('button').text("입양됨").attr('disabled', true);
        } 
      }
    }).catch(function(err){
      alert(err.message);
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();
    /**
     * 입양을 블록체인에 기록함.
     */

    const petId = parseInt($(event.target).data('id'));
    let adoptionInstance;

    web3.eth.getAccounts(function(error, accounts){
      if (error){
        console.error(error);
      }
      const account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance){
        adoptionInstance = instance;
        return adoptionInstance.adopt(petId, {from:account});
      }).then(function(result){
        return App.markAdopted();
      }).catch(function(err){
        alert(err.message);
      })
    })

  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
