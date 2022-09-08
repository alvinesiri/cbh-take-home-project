const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const generateCandidate = input => {
  const hash = crypto.createHash("sha3-512").update(input).digest("hex");
  return hash ? hash : TRIVIAL_PARTITION_KEY;
};

exports.deterministicPartitionKey = (event) => {  
  
  let candidate = TRIVIAL_PARTITION_KEY;
  
  if (!event) return candidate;
  
  if (event.partitionKey) {
    candidate = event.partitionKey;
  } else {
    candidate = generateCandidate(JSON.stringify(event));
  }
  
  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  } 

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = generateCandidate(candidate);
  }
  
  return candidate;
};