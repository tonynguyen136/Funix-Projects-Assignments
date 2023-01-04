const TheFunixCryptoSim = artifacts.require("TheFunixCryptoSim");

contract("TheFunixCryptoSim", function (accounts) {
  let instance;

  before(async function () {
    instance = await TheFunixCryptoSim.deployed();
  });

  describe("Contract", function () {
    it("should deployed", function () {
      return assert.isTrue(instance !== undefined);
    });
  });

  // *** Start Code here ***
  // Test case #1: Thong tin token
  describe("Thong tin token", function(){
    // Kiem tra ma cua token - FCS
    it("Kiem tra ma cua token - FCS", async function(){
      const symbol = await instance.symbol();
      assert.equal(symbol,'FCS', "Symbol of token should be FCS");
    });
    // Kiem tra ten cua token - TheFunixSims
    it("Kiem tra ten cua token - The FunixSims", async function(){
      const name = await instance.name();
      assert.equal(name,'TheFunixCryptoSims', "Name of token should be TheFunixCryptoSims");
    });
  });
  // Test case #2: Thong tin cac Genesis
  describe("Thong tin cac Genesis", function(){
    // Kiem tra thuoc tinh cua Gennesis thu nhat
    it("Kiem tra thuoc tinh cua Gennesis thu nhat", function(){
      return instance.getSimDetails(0).then(function(sims){
        //const firstAtrribute = ["0","0","0","0","0","0","0"];
        //expect(sims[1]).to.deep.equal(firstAtrribute);
        assert.equal(sims[0], 0, 'simId of the first genesis is 0');
        
        assert.equal(sims[1].body, 0, 'body of the first genesis is 0');
        assert.equal(sims[1].eye, 0, 'eye of the first genesis is 0');
        assert.equal(sims[1].hairstyle, 0, 'hairstyle of the first genesis is 0');
        assert.equal(sims[1].outfit, 0, 'outfit of the first genesis is 0');
        assert.equal(sims[1].accessory, 0, 'accessory of the first genesis is 0');
        assert.equal(sims[1].hiddenGenes, 0, 'hiddenGenes of the first genesis is 0');
        assert.equal(sims[1].generation, 0, 'generation of the first genesis is 0');

        assert.equal(sims[2], 0, 'matronId of the first genesis is 0');
        assert.equal(sims[3], 0, 'sireId of the first genesis is 0');
      });
    });
    // Kiem tra thuoc tinh cua Gennesis thu hai
    it("Kiem tra thuoc tinh cua Gennesis thu hai", function(){
      return instance.getSimDetails(1).then(function(sims){
        //const secondAtrribute = ["3","7","127","31","31","0","0"];
        //expect(sims[1]).to.deep.equal(secondAtrribute);
        assert.equal(sims[0], 1, 'simId of the second genesis is 1');
        
        assert.equal(sims[1].body, 3, 'body of the second genesis is 3');
        assert.equal(sims[1].eye, 7, 'eye of the second genesis is 7');
        assert.equal(sims[1].hairstyle, 127, 'hairstyle of the second genesis is 127');
        assert.equal(sims[1].outfit, 31, 'outfit of the second genesis is 31');
        assert.equal(sims[1].accessory, 31, 'accessory of the second genesis is 31');
        assert.equal(sims[1].hiddenGenes, 0, 'hiddenGenes of the second genesis is 0');
        assert.equal(sims[1].generation, 0, 'generation of the second genesis is 0');

        assert.equal(sims[2], 0, 'matronId of the second genesis is 0');
        assert.equal(sims[3], 0, 'sireId of the second genesis is 0');
      });
    });

  });
  // Test case #3: Thuat toan lai tao
  describe("Thuat toan lai tao", function(){
    // Kiem tra gen an X matronAttr.hiddenGenes = sireAttr.hiddenGenes
    it("TH1 - Kiem tra gen an X", function(){
      return instance.buySim({from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(2);
      }).then(function(newSim){
        // 3,7,127,31,30,3,1 = sims[2].attributes
        // Gen an X moi tao la 3 (X = hiddenGenes = 3)
        // matronAttr.hiddenGenes  =0, sireAttr.hiddenGenes = 0
        assert.equal(newSim[1].hiddenGenes, 3, 'hiddenGenes of X in case 1 should be equal 3');
      });
    });

    // Kiem tra gen an X matronAttr.hiddenGenes > sireAttr.hiddenGenes (sims[2] vs sims[1])
    it("TH2 - Kiem tra gen an X", function(){
      return instance.breedSim(2,1,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(3);
      }).then(function(newSim){
        // 0,6,127,30,28,3,2 = sims[3].attributes
        // Gen an X moi tao la 3 (X = hiddenGenes = 3)
        // x = matronAttr.hiddenGenes (because matronAttr.hiddenGenes > sireAttr.hiddenGenes)
        // matronAttr.hiddenGenes  =3, sireAttr.hiddenGenes = 0
        assert.equal(newSim[1].hiddenGenes, 3, 'hiddenGenes of X in case 2 should be equal 3');
      });
    });
    // Kiem tra gen an X matronAttr.hiddenGenes < sireAttr.hiddenGenes (sims[0] vs sims[2])
    it("TH3 - Kiem tra gen an X", function(){
      return instance.breedSim(0,2,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(4);
      }).then(function(newSim){
        //  3,7,127,31,29,3,2 = sims[4].attributes
        // Gen an X moi tao la 3 (X = hiddenGenes = 3)
        // x = sireAttr.hiddenGenes (because matronAttr.hiddenGenes = 0 < sireAttr.hiddenGenes = 3)
        // matronAttr.hiddenGenes  =0, sireAttr.hiddenGenes = 3
        assert.equal(newSim[1].hiddenGenes, 3, 'hiddenGenes of X in case 3 should be equal 3');
      });
    });
    // Kiem tra gen an X matronAttr.hiddenGenes = sireAttr.hiddenGenes (sims[3] vs sims[4])
    it("TH4 - Kiem tra gen an X", function(){
      return instance.breedSim(3,4,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(5);
      }).then(function(newSim){
        // 3,7,127,30,25,0,3
        // Gen an X moi tao la 0 (X = hiddenGenes = 0)
        // x = (matronAttr.hiddenGenes * sireAttr.hiddenGenes + 3) % 4 =0
        // matronAttr.hiddenGenes  = 3, sireAttr.hiddenGenes = 3
        assert.equal(newSim[1].hiddenGenes, 0, 'hiddenGenes of X in case 4 should be equal 0');
      });
    });

    // Kiem tra thuoc tinh cua Genesis thu hai
    // Kiem tra cung luc tat ca cac thuoc tinh cua Sim moi dc lai tao
    // TH1: X = 0, generation = sireAttr.generation + 1 =  2 + 1 = 3
    // sims[2] and sims[3] 
    it("TH1 - Kiem tra thuoc tinh cua Sim moi duoc lai tao the he thu 3", function(){
      return instance.breedSim(2,3,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(6);
      }).then(function(newsims){
        // 3,6,127,30,26,0,3
        assert.equal(newsims[1].body,3, 'body of the new SIM is 3');
        assert.equal(newsims[1].eye, 6, 'eye of the new SIM is 6');
        assert.equal(newsims[1].hairstyle, 127, 'hairstyle of the new SIM is 127');
        assert.equal(newsims[1].outfit, 30, 'outfit of the new SIM is 30');
        assert.equal(newsims[1].accessory, 26, 'accessory of the new SIM is 26');
        assert.equal(newsims[1].hiddenGenes, 0, 'hiddenGenes of the new SIM is 0');
        assert.equal(newsims[1].generation, 3, 'generation of the new SIM is 3');
      });
    });
    // TH2: X = 3, generation = sireAttr.generation + 1 = 4
    // sims[1] and sims[6] 
    it("TH2 - Kiem tra thuoc tinh cua Sim moi duoc lai tao the he thu 4", function(){
      return instance.breedSim(1,6,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(7);
      }).then(function(newsims){
        // 0,5,127,29,24,3,4
        assert.equal(newsims[1].body,0, 'body of the new SIM is 0');
        assert.equal(newsims[1].eye, 5, 'eye of the new SIM is 5');
        assert.equal(newsims[1].hairstyle, 127, 'hairstyle of the new SIM is 127');
        assert.equal(newsims[1].outfit, 29, 'outfit of the new SIM is 29');
        assert.equal(newsims[1].accessory, 24, 'accessory of the new SIM is 24');
        assert.equal(newsims[1].hiddenGenes, 3, 'hiddenGenes of the new SIM is 3');
        assert.equal(newsims[1].generation, 4, 'generation of the new SIM is 4');
      });
    });
    // TH3: X = 3, generation = sireAttr.generation + 1 = 5
    // sims[5] and sims[7] 
    it("TH3 - Kiem tra thuoc tinh cua Sim moi duoc lai tao the he thu 5", function(){
      return instance.breedSim(5,7,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(8);
      }).then(function(newsims){
        // 3,4,127,27,16,3,5
        assert.equal(newsims[1].body,3, 'body of the new SIM is 3');
        assert.equal(newsims[1].eye, 4, 'eye of the new SIM is 4');
        assert.equal(newsims[1].hairstyle, 127, 'hairstyle of the new SIM is 127');
        assert.equal(newsims[1].outfit, 27, 'outfit of the new SIM is 27');
        assert.equal(newsims[1].accessory, 16, 'accessory of the new SIM is 16');
        assert.equal(newsims[1].hiddenGenes, 3, 'hiddenGenes of the new SIM is 3');
        assert.equal(newsims[1].generation, 5, 'generation of the new SIM is 5');
      });
    });
    // TH4: X = 0, generation = sireAttr.generation + 1 = 6
    // sims[7] and sims[8] 
    it("TH4 - Kiem tra thuoc tinh cua Sim moi duoc lai tao the he thu 6", function(){
      return instance.breedSim(7,8,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(9);
      }).then(function(newsims){
        // 3,4,127,25,8,0,6
        assert.equal(newsims[1].body,3, 'body of the new SIM is 3');
        assert.equal(newsims[1].eye, 4, 'eye of the new SIM is 4');
        assert.equal(newsims[1].hairstyle, 127, 'hairstyle of the new SIM is 127');
        assert.equal(newsims[1].outfit, 25, 'outfit of the new SIM is 25');
        assert.equal(newsims[1].accessory, 8, 'accessory of the new SIM is 8');
        assert.equal(newsims[1].hiddenGenes, 0, 'hiddenGenes of the new SIM is 0');
        assert.equal(newsims[1].generation, 6, 'generation of the new SIM is 6');
      });
    });
     // TH5: X = 3, generation = sireAttr.generation + 1 = 7
    // sims[8] and sims[9] 
    it("TH5 - Kiem tra thuoc tinh cua Sim moi duoc lai tao the he thu 7", function(){
      return instance.breedSim(8,9,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(10);
      }).then(function(newsims){
        // 0,0,127,20,23,3,7
        assert.equal(newsims[1].body,0, 'body of the new SIM is 0');
        assert.equal(newsims[1].eye, 0, 'eye of the new SIM is 0');
        assert.equal(newsims[1].hairstyle, 127, 'hairstyle of the new SIM is 127');
        assert.equal(newsims[1].outfit, 20, 'outfit of the new SIM is 20');
        assert.equal(newsims[1].accessory, 23, 'accessory of the new SIM is 23');
        assert.equal(newsims[1].hiddenGenes, 3, 'hiddenGenes of the new SIM is 3');
        assert.equal(newsims[1].generation, 7, 'generation of the new SIM is 7');
      });
    });
     // TH6: X = 3, generation = sireAttr.generation + 1 = 8
    // sims[9] and sims[10] 
    it("TH6 - Kiem tra thuoc tinh cua Sim moi duoc lai tao the he thu 8", function(){
      return instance.breedSim(9,10,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(11);
      }).then(function(newsims){
        // 3,4,127,13,30,3,8
        assert.equal(newsims[1].body,3, 'body of the new SIM is 3');
        assert.equal(newsims[1].eye, 4, 'eye of the new SIM is 4');
        assert.equal(newsims[1].hairstyle, 127, 'hairstyle of the new SIM is 127');
        assert.equal(newsims[1].outfit, 13, 'outfit of the new SIM is 13');
        assert.equal(newsims[1].accessory, 30, 'accessory of the new SIM is 30');
        assert.equal(newsims[1].hiddenGenes, 3, 'hiddenGenes of the new SIM is 3');
        assert.equal(newsims[1].generation, 8, 'generation of the new SIM is 8');
      });
    });
    // TH7: X = 0, generation = sireAttr.generation + 1 = 9
    // sims[10] and sims[11] 
    it("TH7 - Kiem tra thuoc tinh cua Sim moi duoc lai tao the he thu 9", function(){
      return instance.breedSim(10,11,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(12);
      }).then(function(newsims){
        // 3,4,127,2,21,0,9
        assert.equal(newsims[1].body,3, 'body of the new SIM is 3');
        assert.equal(newsims[1].eye, 4, 'eye of the new SIM is 4');
        assert.equal(newsims[1].hairstyle, 127, 'hairstyle of the new SIM is 127');
        assert.equal(newsims[1].outfit, 2, 'outfit of the new SIM is 2');
        assert.equal(newsims[1].accessory, 21, 'accessory of the new SIM is 21');
        assert.equal(newsims[1].hiddenGenes, 0, 'hiddenGenes of the new SIM is 0');
        assert.equal(newsims[1].generation, 9, 'generation of the new SIM is 9');
      });
    });
    // TH8: X = 3, generation = sireAttr.generation + 1 = 10
    // sims[11] and sims[12] 
    it("TH8 - Kiem tra thuoc tinh cua Sim moi duoc lai tao the he thu 10", function(){
      return instance.breedSim(11,12,{from: accounts[0]}).then(function(attributes){
        return instance.getSimDetails(13);
      }).then(function(newsims){
        // 0,0,127,15,18,3,10
        assert.equal(newsims[1].body,0, 'body of the new SIM is 0');
        assert.equal(newsims[1].eye, 0, 'eye of the new SIM is 0');
        assert.equal(newsims[1].hairstyle, 127, 'hairstyle of the new SIM is 127');
        assert.equal(newsims[1].outfit, 15, 'outfit of the new SIM is 15');
        assert.equal(newsims[1].accessory, 18, 'accessory of the new SIM is 18');
        assert.equal(newsims[1].hiddenGenes, 3, 'hiddenGenes of the new SIM is 3');
        assert.equal(newsims[1].generation, 10, 'generation of the new SIM is 10');
        //assert.equal(inRange(newsims[1].generation, 2, 100),true, 'generation of the new SIM is 10');
      });
    });

  });
   // Phan Nang cao: Kiem tra vung du lieu cua cac thuoc tinh
  describe("Kiem tra vung du lieu cua cac thuoc tinh", function(){
    it("Kiem tra vung gia tri cua tung thuoc tinh", function(){
      return instance.getSimDetails(2).then(function(sims){
        assert.equal(sims[1].body >= 0 && sims[1].body <= 3, true, 'body attribute of the sim from 0 to 3');
        assert.equal(sims[1].eye >= 0 && sims[1].eye <= 7, true, 'eye attribute of the sim from 0 to 7');
        assert.equal(sims[1].hairstyle >= 0 && sims[1].hairstyle <= 127, true, 'hairstyle attribute of the sim from 0 to 127');
        assert.equal(sims[1].outfit >= 0 && sims[1].outfit <= 31, true, 'outfit attribute of the sim from 0 to 31');
        assert.equal(sims[1].accessory >= 0 && sims[1].accessory <= 31, true, 'accessory attribute of the sim from 0 to 31');
        assert.equal(sims[1].hiddenGenes >= 0 && sims[1].hiddenGenes <= 3, true, 'hiddenGenes attribute of the sim from 0 to 3');
        assert.equal(sims[1].generation >= 0 && sims[1].generation <= 255, true, 'generation attribute of the sim from 0 to 255');
      });
    });

  });

  // *** End Code here ***
});
