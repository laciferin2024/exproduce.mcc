// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OptionsContract
 * @dev Contract for managing agricultural options between farmers and banks
 */
contract OptionsContract is Ownable {
    struct Option {
        address farmer;
        address bank;
        uint256 strikePrice;
        uint256 premium;
        uint256 expiryDate;
        uint256 quantity;
        string cropType;
        bool exercised;
        bool cancelled;
    }

    Option[] public options;
    mapping(address => uint256[]) public farmerOptions;
    mapping(address => uint256[]) public bankOptions;
    
    // Payment token (e.g., USDC)
    IERC20 public paymentToken;
    
    // Address of the OptionsMarket contract
    address public optionsMarket;
    
    event OptionCreated(uint256 indexed optionId, address indexed farmer, address indexed bank, uint256 strikePrice, uint256 premium, uint256 expiryDate);
    event OptionExercised(uint256 indexed optionId, address indexed farmer, address indexed bank);
    event OptionCancelled(uint256 indexed optionId);
    event OptionTransferred(uint256 indexed optionId, address indexed from, address indexed to);

    constructor(address _paymentToken) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
    }
    
    /**
     * @dev Set the OptionsMarket contract address
     * Only the owner can call this
     */
    function setOptionsMarket(address _optionsMarket) external onlyOwner {
        optionsMarket = _optionsMarket;
    }

    /**
     * @dev Create a new option
     */
    function createOption(
        address _bank,
        uint256 _strikePrice,
        uint256 _premium,
        uint256 _expiryDate,
        uint256 _quantity,
        string memory _cropType
    ) external returns (uint256) {
        require(_expiryDate > block.timestamp, "Expiry date must be in the future");
        require(_quantity > 0, "Quantity must be greater than zero");
        
        // Transfer premium from farmer to contract
        require(paymentToken.transferFrom(msg.sender, address(this), _premium), "Premium transfer failed");
        
        uint256 optionId = options.length;
        options.push(Option({
            farmer: msg.sender,
            bank: _bank,
            strikePrice: _strikePrice,
            premium: _premium,
            expiryDate: _expiryDate,
            quantity: _quantity,
            cropType: _cropType,
            exercised: false,
            cancelled: false
        }));
        
        farmerOptions[msg.sender].push(optionId);
        bankOptions[_bank].push(optionId);
        
        emit OptionCreated(optionId, msg.sender, _bank, _strikePrice, _premium, _expiryDate);
        
        return optionId;
    }
    
    /**
     * @dev Exercise an option
     */
    function exerciseOption(uint256 _optionId) external {
        Option storage option = options[_optionId];
        
        require(msg.sender == option.farmer, "Only farmer can exercise");
        require(!option.exercised, "Option already exercised");
        require(!option.cancelled, "Option was cancelled");
        require(block.timestamp <= option.expiryDate, "Option expired");
        
        // Transfer strike price from bank to farmer
        require(paymentToken.transferFrom(option.bank, option.farmer, option.strikePrice * option.quantity), "Strike price transfer failed");
        
        option.exercised = true;
        
        emit OptionExercised(_optionId, option.farmer, option.bank);
    }
    
    /**
     * @dev Cancel an option (only bank can cancel)
     */
    function cancelOption(uint256 _optionId) external {
        Option storage option = options[_optionId];
        
        require(msg.sender == option.bank, "Only bank can cancel");
        require(!option.exercised, "Option already exercised");
        require(!option.cancelled, "Option already cancelled");
        
        // Return premium to farmer
        require(paymentToken.transfer(option.farmer, option.premium), "Premium return failed");
        
        option.cancelled = true;
        
        emit OptionCancelled(_optionId);
    }
    
    /**
     * @dev Transfer option ownership
     * Can only be called by the OptionsMarket contract
     */
    function transferOptionOwnership(uint256 _optionId, address _newOwner) external {
        require(msg.sender == optionsMarket, "Only OptionsMarket can transfer");
        
        Option storage option = options[_optionId];
        require(!option.exercised, "Option already exercised");
        require(!option.cancelled, "Option already cancelled");
        
        address oldOwner = option.farmer;
        option.farmer = _newOwner;
        
        // Update the farmerOptions mappings
        // Remove from old owner
        uint256[] storage oldOwnerOptions = farmerOptions[oldOwner];
        for (uint256 i = 0; i < oldOwnerOptions.length; i++) {
            if (oldOwnerOptions[i] == _optionId) {
                // Replace with the last element and pop
                oldOwnerOptions[i] = oldOwnerOptions[oldOwnerOptions.length - 1];
                oldOwnerOptions.pop();
                break;
            }
        }
        
        // Add to new owner
        farmerOptions[_newOwner].push(_optionId);
        
        emit OptionTransferred(_optionId, oldOwner, _newOwner);
    }
    
    /**
     * @dev Get all options for a farmer
     */
    function getFarmerOptions(address _farmer) external view returns (uint256[] memory) {
        return farmerOptions[_farmer];
    }
    
    /**
     * @dev Get all options for a bank
     */
    function getBankOptions(address _bank) external view returns (uint256[] memory) {
        return bankOptions[_bank];
    }
    
    /**
     * @dev Get option details
     */
    function getOption(uint256 _optionId) external view returns (
        address farmer,
        address bank,
        uint256 strikePrice,
        uint256 premium,
        uint256 expiryDate,
        uint256 quantity,
        string memory cropType,
        bool exercised,
        bool cancelled
    ) {
        Option storage option = options[_optionId];
        return (
            option.farmer,
            option.bank,
            option.strikePrice,
            option.premium,
            option.expiryDate,
            option.quantity,
            option.cropType,
            option.exercised,
            option.cancelled
        );
    }
}
