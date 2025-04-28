// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OptionsContract {
    struct Option {
        address farmer;
        address bank;
        string crop;
        uint256 quantity;
        uint256 priceFloor; // MSP
        uint256 premium;
        uint256 expiry;
        bool exercised;
    }

    IERC20 public paymentToken; // MATIC on Amoy
    address public government;
    Option[] public options;

    event OptionCreated(uint256 optionId);
    event OptionPurchased(uint256 optionId, address bank);
    event MSPClaimed(uint256 optionId, uint256 payout);

    constructor(address _paymentToken, address _government) {
        paymentToken = IERC20(_paymentToken);
        government = _government;
    }

    // Farmer creates option (crop, quantity, MSP)
    function createOption(
        string memory _crop,
        uint256 _quantity,
        uint256 _priceFloor,
        uint256 _premium,
        uint256 _expiry
    ) external {
        options.push(
            Option({
                farmer: msg.sender,
                bank: address(0),
                crop: _crop,
                quantity: _quantity,
                priceFloor: _priceFloor,
                premium: _premium,
                expiry: _expiry,
                exercised: false
            })
        );
        emit OptionCreated(options.length - 1);
    }

    // Bank purchases option (pays premium to farmer)
    function purchaseOption(uint256 _optionId) external {
        Option storage option = options[_optionId];
        require(option.bank == address(0), "Already purchased");

        paymentToken.transferFrom(msg.sender, option.farmer, option.premium);
        option.bank = msg.sender;
        emit OptionPurchased(_optionId, msg.sender);
    }

    // Government pays MSP if market price < floor
    function claimMSP(uint256 _optionId, uint256 _marketPrice) external {
        require(msg.sender == government, "Unauthorized");
        Option storage option = options[_optionId];
        require(block.timestamp > option.expiry, "Not expired");
        require(!option.exercised, "Already settled");

        if (_marketPrice < option.priceFloor) {
            uint256 payout = (option.priceFloor - _marketPrice) *
                option.quantity;
            paymentToken.transferFrom(government, option.farmer, payout);
            emit MSPClaimed(_optionId, payout);
        }
        option.exercised = true;
    }
}
