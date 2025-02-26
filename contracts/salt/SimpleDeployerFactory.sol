// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleDeployerFactory {
    event Deployed(address indexed addr, bytes32 salt);

    /**
     * @dev Deploys a contract deterministically using CREATE2.
     * @param salt A unique value used to determine the contract address.
     * @param bytecode The bytecode of the contract to deploy.
     */
    function deploy(bytes32 salt, bytes memory bytecode) external returns (address) {
        address addr;
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        require(addr != address(0), "Deployment failed");
        emit Deployed(addr, salt);
        return addr;
    }

    /**
     * @dev Computes the address of a contract deployed with a given salt and bytecode.
     * @param salt The salt value to use.
     * @param bytecodeHash The keccak256 hash of the contract bytecode.
     */
    function computeAddress(bytes32 salt, bytes32 bytecodeHash) public view returns (address) {
        return address(
            uint160(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            bytes1(0xff),
                            address(this),
                            salt,
                            bytecodeHash
                        )
                    )
                )
            )
        );
    }
}
