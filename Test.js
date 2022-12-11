const CertificateVerifier = artifacts.require('CertificateVerifier');

contract('CertificateVerifier', (accounts) => {
  let contractInstance;
  const verifier = accounts[0];
  const key = '0x1234567890abcdef1234567890abcdef';

  beforeEach(async () => {
    contractInstance = await CertificateVerifier.new(verifier, key);
  });

  it('should initialize the contract with the correct verifier and key', async () => {
    const contractVerifier = await contractInstance.verifier();
    const contractKey = await contractInstance.key();
    assert.equal(contractVerifier, verifier, 'Verifier address is not correct');
    assert.equal(contractKey, key, 'Key is not correct');
  });

  it('should allow the verifier to verify a certificate', async () => {
    const certificateHash = '0xabcdef1234567890abcdef1234567890';
    await contractInstance.verifyCertificate(certificateHash, { from: verifier });
    const verifiedCertificates = await contractInstance.verifiedCertificates();
    assert.equal(verifiedCertificates.length, 1, 'Certificate was not added to the verified list');
    assert.equal(verifiedCertificates[0], certificateHash, 'Certificate hash is not correct');
  });

  it('should not allow a non-verifier address to verify a certificate', async () => {
    const certificateHash = '0xabcdef1234567890abcdef1234567890';
    try {
      await contractInstance.verifyCertificate(certificateHash, { from: accounts[1] });
      assert.fail('Certificate verification should not have succeeded');
    } catch (err) {
      assert.include(err.message, 'Unauthorized verifier');
    }
  });

  it('should not allow the same certificate to be verified twice', async () => {
    const certificateHash = '0xabcdef1234567890abcdef1234567890';
    await contractInstance.verifyCertificate(certificateHash, { from: verifier });
    try {
      await contractInstance.verifyCertificate(certificateHash, { from: verifier });
      assert.fail('Certificate verification should not have succeeded');
    } catch (err) {
      assert.include(err.message, 'Certificate already verified');
    }
  });
});
