// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./OptionsContract.sol";

/**
 * @title OptionsMarket
 * @dev Contract for trading agricultural options on a secondary market
 */
contract OptionsMarket is ERC721URIStorage, Ownable {
    // Replace Counters with simple uint256 counters
    uint256 private _nextTokenId;
    uint256 private _nextListingId;
    
    struct OptionListing {
        uint256 optionId;      // ID from the OptionsContract
        address seller;
        uint256 price;
        bool active;
    }
    
    // Payment token (e.g., USDC)
    IERC20 public paymentToken;
    OptionsContract public optionsContract;
    
    // Mapping from listing ID to listing details
    mapping(uint256 => OptionListing) public listings;
    // Mapping from option ID to listing ID
    mapping(uint256 => uint256) public optionToListing;
    
    event OptionListed(uint256 indexed listingId, uint256 indexed optionId, address indexed seller, uint256 price);
    event OptionSold(uint256 indexed listingId, uint256 indexed optionId, address seller, address buyer, uint256 price);
    event ListingCancelled(uint256 indexed listingId, uint256 indexed optionId);
    
    constructor(address _paymentToken, address _optionsContract) ERC721("ExproduceOption", "EXOP") Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        optionsContract = OptionsContract(_optionsContract);
        _nextTokenId = 1;
        _nextListingId = 1;
    }
    
    /**
     * @dev List an option for sale
     * The seller must be the owner of the option in the OptionsContract
     */
    function listOption(uint256 _optionId, uint256 _price) external {
        // Get option details from OptionsContract
        (
            address farmer,
            address bank,
            uint256 strikePrice,
            uint256 premium,
            uint256 expiryDate,
            uint256 quantity,
            string memory cropType,
            bool exercised,
            bool cancelled
        ) = optionsContract.getOption(_optionId);
        
        // Verify the caller is the farmer (owner of the option)
        require(farmer == msg.sender, "Not the option owner");
        require(!exercised, "Option already exercised");
        require(!cancelled, "Option already cancelled");
        require(block.timestamp < expiryDate, "Option expired");
        
        // Create a new listing
        uint256 listingId = _nextListingId;
        _nextListingId += 1;
        
        listings[listingId] = OptionListing({
            optionId: _optionId,
            seller: msg.sender,
            price: _price,
            active: true
        });
        
        optionToListing[_optionId] = listingId;
        
        emit OptionListed(listingId, _optionId, msg.sender, _price);
    }
    
    /**
     * @dev Buy a listed option
     */
    function buyOption(uint256 _listingId) external {
        OptionListing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        
        // Get option details to verify it's still valid
        (
            address farmer,
            address bank,
            uint256 strikePrice,
            uint256 premium,
            uint256 expiryDate,
            uint256 quantity,
            string memory cropType,
            bool exercised,
            bool cancelled
        ) = optionsContract.getOption(listing.optionId);
        
        require(!exercised, "Option already exercised");
        require(!cancelled, "Option already cancelled");
        require(block.timestamp < expiryDate, "Option expired");
        
        // Transfer payment from buyer to seller
        require(paymentToken.transferFrom(msg.sender, listing.seller, listing.price), "Payment failed");
        
        // Update the option ownership in the OptionsContract
        optionsContract.transferOptionOwnership(listing.optionId, msg.sender);
        
        // Mark listing as inactive
        listing.active = false;
        
        emit OptionSold(_listingId, listing.optionId, listing.seller, msg.sender, listing.price);
    }
    
    /**
     * @dev Cancel a listing
     */
    function cancelListing(uint256 _listingId) external {
        OptionListing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");
        
        listing.active = false;
        
        emit ListingCancelled(_listingId, listing.optionId);
    }
    
    /**
     * @dev Get all active listings
     */
    function getActiveListing(uint256 _listingId) external view returns (
        uint256 optionId,
        address seller,
        uint256 price,
        bool active
    ) {
        OptionListing storage listing = listings[_listingId];
        return (
            listing.optionId,
            listing.seller,
            listing.price,
            listing.active
        );
    }
    
    /**
     * @dev Create a new token (for future use if needed)
     */
    function mintToken(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId += 1;
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        return tokenId;
    }
}
