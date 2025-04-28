// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./OptionsContract.sol";

contract OptionsMarket {
    IERC20 public paymentToken;
    OptionsContract public optionsContract;

    struct Listing {
        uint256 optionId;
        uint256 price;
        address seller;
        bool active;
    }

    Listing[] public listings;

    event OptionListed(uint256 listingId);
    event OptionTraded(uint256 listingId, address buyer);

    constructor(address _optionsContract) {
        optionsContract = OptionsContract(_optionsContract);
        paymentToken = IERC20(optionsContract.paymentToken());
    }

    // Bank lists option for secondary sale
    function listOption(uint256 _optionId, uint256 _price) external {
        OptionsContract.Option memory option = optionsContract.options(
            _optionId
        );
        require(option.bank == msg.sender, "Not option owner");

        listings.push(
            Listing({
                optionId: _optionId,
                price: _price,
                seller: msg.sender,
                active: true
            })
        );
        emit OptionListed(listings.length - 1);
    }

    // Trader buys listed option
    function buyOption(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing inactive");

        paymentToken.transferFrom(msg.sender, listing.seller, listing.price);
        optionsContract.transferOption(listing.optionId, msg.sender);
        listing.active = false;
        emit OptionTraded(_listingId, msg.sender);
    }
}
