
let Auction = artifacts.require('./Auction.sol');

let auctionIntance;

contract('AuctionContract', function(accounts){
    // accounts[0] s the default account
    // Test case: Contract Development
    describe('Contract development', function(){
        it ('Contract development', function(){
            // Fetching the contract instance of our smart contract
            return Auction.deployed().then(function(instance){
                // We save the instance in a global variable and all smart contract functions are called using this
                auctionIntance = instance;
                assert(auctionIntance !== undefined, 'Auction contract should be defined');
            });
        });
        it('Initial rule with corrected startingPrice and minimumStep', function(){
            // Fetching the rule of Auction 
            return auctionIntance.rule().then(function(rule){
                // we save the instance in a global variable and all smart contract functions called using this
                assert(rule !== undefined,'Rule should be defined');
                assert.equal(rule.startingPrice, 50, 'Starting price should be 50');
                assert.equal(rule.minimumStep, 5, 'Minimum step should be 5');
               
            });
        });
    });

    // Test case #1: Register - Dang ki
    describe('Register', function(){
        // 	Only Auctioneer can register bidders - 3 bidders
        it('Only Auctioneer can register bidders', function(){
            return auctionIntance.register(accounts[1],100,{from: accounts[0]}).then(function(result){
                assert.equal(result.receipt.status, true);
            }).then(function(result){
                return auctionIntance.register(accounts[2],100,{from: accounts[0]});
            }).then(function(result){
                return auctionIntance.register(accounts[3],100,{from: accounts[0]});
            });
        });
        // Negative test-Test case #1: Should NOT allow non Auctioneer to register - accounts[1]
        it('Should NOT allow non Auctioneer to register', function(){
            return auctionIntance.register(accounts[2], 100, {from: accounts[1]}).then(function(result){
                throw("Failed to register bidders from non Auctioneer!");
            }).catch(function(e){
                if(e === 'Failed to register bidders from non Auctioneer!'){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // This action is only available in Created State.
        it('This action is only available in Created State', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.CREATED,'Should be in Created state');
            }).then(function(){
                return auctionIntance.register(accounts[4],100,{from: accounts[0]});
            }).then(function(result){
                    assert.equal(result.receipt.status, true);
                }); 
        });
         // Negative test-Test case #1: Should NOT allow to register with no input (address & nunber of tokens)
         it('Should NOT allow to register due to missing input for regester function', function(){
            return auctionIntance.register({from: accounts[0]}).then(function(result){
                throw("Failed to register bidders due to missing input parameters");
            }).catch(function(e){
                if(e === 'Failed to register bidders due to missing input parameters'){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });

    });

    // Test case 2 :Start the session: Bat dau phien
    describe('Start the session', function(){

        // Only Auctioneer can start the session - This action is only available in Created State.
        it('Only Auctioneer can start the session', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.CREATED,'Should be in Created state');
            }).then(function(){
                return auctionIntance.startSession({from:accounts[0]});
            }).then(function(result){
                    assert.equal(result.receipt.status, true);
                }); 
        });
        // Negative test- Test case #2- Should NOT allow non Auctioneer to start the session
        it('Should NOT allow non Auctioneer to start the session', function(){
            return auctionIntance.startSession({from: accounts[1]}).then(function(result){
                throw("Failed to start the session from non Auctioneer!");
            }).catch(function(e){
                if(e === 'Failed to start the session from non Auctioneer!'){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
    });

    // Test case #3: BID - Dau gia
    describe('BID - Dau Gia', function(){
        // All the Bidders can bid - This action is only available in Started State
        // THe next price must higher than the lastest price plus minimum step (5)
        it('All the Bidders can bid', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.STARTED,'Should be in STARTED state');
            }).then(function(){
                return auctionIntance.bid(55,{from:accounts[1]});
            }).then(function(result){
                return auctionIntance.bid(60,{from:accounts[2]});
            }).then(function(result){
                return auctionIntance.bid(65,{from:accounts[3]});
            }).then(function(result){
                assert.equal(result.receipt.status, true);
            });
        });

        // Negative test-Test case #3: Should not allow non-bidder can bid - accounts[6]
        it('Should not allow non-bidder can bid', function(){
                return auctionIntance.bid(70,{from: accounts[6]}).then(function(result){
                    throw("Failed to bid from non-bidder: accounts[6]");
                }).catch(function(e){
                    if(e === 'Failed to bid from non-bidder: accounts[6]'){
                        assert(false);
                    }else{
                        assert(true);
                    }
                });
        });    
        // Negative test-Test case #3: Should not allow no input for bid (missing number of tokens to bid)
        it('Should not allow no input for bid', function(){
            return auctionIntance.bid({from: accounts[4]}).then(function(result){
                throw("Failed to bid from a bidder: accounts[4] due to missing number of tokens to bid");
            }).catch(function(e){
                if(e === 'Failed to bid from a bidder: accounts[4] due to missing number of tokens to bid'){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });
        // Negative test-Test case #3: Should not allow to bid with the next price is lower than the latest price
        it('Should not allow to bid with the next price is lower than the latest price', function(){
            return auctionIntance.bid(30,{from: accounts[4]}).then(function(result){
                throw("Failed to bid from a bidder: accounts[4] because the next price is lower than the latest price");
            }).catch(function(e){
                if(e === 'Failed to bid from a bidder: accounts[4] because the next price is lower than the latest price'){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });

        //Negative test-Test case #1: Other state can not register - in Started state
        it('Other state can not register', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.STARTED,'Should be in Created state');
                return auctionIntance.register(accounts[5],100,{from: accounts[0]}).then(function(result){
                    throw("Failed to register in another state: Started State");
                }).catch(function(e){
                    if(e === 'Failed to register in another state: Started State'){
                        assert(false);
                    }else{
                        assert(true);
                    }
                });
            });
        });

        //Negative test-Test case #2: Other state can not start the session - in Started state
        it('Other state can not start the session', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.STARTED,'Should be in Created state');
                return auctionIntance.startSession({from:accounts[0]}).then(function(result){
                    throw("Failed to start the session in another state: Started State");
                }).catch(function(e){
                    if(e === 'Failed to start the session in another state: Started State'){
                        assert(false);
                    }else{
                        assert(true);
                    }
                });
            });
        }); 

        //Negative test-Test case #5: Other state can not get back the deposit - in Started state
        it('Other state can not start the session', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.STARTED,'Should be in Closing state only');
                return auctionIntance.getDeposit({from: accounts[2]}).then(function(result){
                    throw("Failed to get back the deposit in another state: Started State");
                }).catch(function(e){
                    if(e === 'Failed to get back the deposit in another state: Started State'){
                        assert(false);
                    }else{
                        assert(true);
                    }
                });
            });
        }); 

    });
    
    // Test case #4: Announce - Cong Bo - call winner address
    describe('Announce - Cong Bo', function(){
        // Only the Auctioneer can announce - 	This action is only available in Started State.
        // 4th call of announce function, the session ends and can know the winner
        it('Only the Auctioneer can announce!', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.STARTED,'Should be in STARTED state');
            }).then(function(){
                // 1st call 
                return auctionIntance.announce({from: accounts[0]});
            }).then(function(result){
                // 2nd call
                return auctionIntance.announce({from: accounts[0]});
            }).then(function(){
                // 3rd call
                return auctionIntance.announce({from: accounts[0]});
            }).then(function(){
                // 4th call - the session ends
                return auctionIntance.announce({from: accounts[0]});
            }).then(function(){
                return auctionIntance.currentWinner({from: accounts[0]});
            }).then(function(winner){
                assert.equal(winner, accounts[3], "The winner should be an accounts[3]");
            });
        });
                

    });
    // Test case #5: Get back the deposit - TRa lai tien coc
    describe('Get back the deposit', function(){

        // All the Bidders (except the Winner) can Get back the deposit. - 	This action is only available in Closing State

        it('All the Bidders (except the Winner) can Get back the deposit!', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.CLOSING,'Should be in CLOSING state');
            }).then(function(){
                return auctionIntance.getDeposit({from: accounts[1]});
            }).then(function(result){
                assert.equal(result.receipt.status, true);
            });
        });


        // Negative test -Test case #5 - Should NOT allow winner can get the the deposit - accounts[3]
        it('Should NOT allow winner can get the the deposit', function(){
            return auctionIntance.getDeposit({from: accounts[3]}).then(function(result){
                throw("Failed to get the deposit from winner!");
            }).catch(function(e){
                if(e === 'Failed to get the deposit from winner!'){
                    assert(false);
                }else{
                    assert(true);
                }
            });
        });


        //Negative test-Test case #4: Other state can not announce - in Closing State
        it('Other state can not announce', function(){
            return auctionIntance.state().then(function(state){
                assert.equal(state,Auction.State.CLOSING,'Should be in Started state');
                return auctionIntance.announce({from: accounts[0]}).then(function(result){
                    throw("Failed to announce in another state: Closing State");
                }).catch(function(e){
                    if(e === 'Failed to announce in another state: Closing State'){
                        assert(false);
                    }else{
                        assert(true);
                    }
                });
            });
        }); 

    });

})