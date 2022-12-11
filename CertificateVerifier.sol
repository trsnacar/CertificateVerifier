pragma solidity ^0.5.0;

contract CertificateVerifier {
    // An address verifying the certificate
    address public verifier;

    // A key that validates the certificate
    bytes32 public key;

    // A set of verified certificates held
    bytes32[] public verifiedCertificates;

    constructor(address _verifier, bytes32 _key) public {
        verifier = _verifier;
        key = _key;
    }

    // A function for certificate validation
    function verifyCertificate(bytes32 certificateHash) public {
        // The verifier address so that the certificate can be verifiedn
        // must use the key key
        require(msg.sender == verifier, "Unauthorized verifier");

        // The same hash value in an array of validated certificate
        // checks whether there is a record containing
        for (uint i = 0; i < verifiedCertificates.length; i++) {
            require(verifiedCertificates[i] != certificateHash, "Certificate already verified");
        }

        // Records the validation of the certificate
        verifiedCertificates.push(certificateHash);
    }
}
