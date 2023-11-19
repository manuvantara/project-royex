CREATE TABLE royalty_tokens (
  symbol CHAR(11) PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  contract_address CHAR(42) NOT NULL
);

CREATE TABLE royalty_payment_pools (
  contract_address CHAR(42) PRIMARY KEY,
  royalty_token_symbol CHAR(11) REFERENCES royalty_tokens(symbol),
  latest_block_number BIGINT DEFAULT 0 NOT NULL
);

CREATE TABLE stakeholder_collectives (
  contract_address CHAR(42) PRIMARY KEY,
  royalty_token_symbol CHAR(11) REFERENCES royalty_tokens(symbol),
  latest_block_number BIGINT DEFAULT 0 NOT NULL
);

CREATE TABLE stakeholder_collective_proposals (
  contract_address CHAR(42),
  proposal_id CHAR(100),
  
  proposer CHAR(42) NOT NULL,
  title VARCHAR(250) NOT NULL,
  description VARCHAR(4000) NOT NULL,
  
  votes_for NUMERIC(78, 0) DEFAULT 0 NOT NULL,
  votes_against NUMERIC(78, 0) DEFAULT 0 NOT NULL,
  votes_abstain NUMERIC(78, 0) DEFAULT 0 NOT NULL,

  is_executed BOOLEAN DEFAULT FALSE NOT NULL,

  PRIMARY KEY (contract_address, proposal_id),
  FOREIGN KEY (contract_address) REFERENCES stakeholder_collectives(contract_address)
);

CREATE TABLE otc_markets (
  contract_address CHAR(42) PRIMARY KEY,

  royalty_token_symbol CHAR(11) REFERENCES royalty_tokens(symbol),
  latest_block_number BIGINT DEFAULT 0 NOT NULL
);

CREATE TABLE otc_market_offers (
  contract_address CHAR(42),
  offer_id CHAR(77),

  seller CHAR(42) NOT NULL,
  royalty_token_amount NUMERIC(78, 0) NOT NULL,
  stablecoin_amount NUMERIC(78, 0) NOT NULL,
  
  PRIMARY KEY (contract_address, offer_id),
  FOREIGN KEY (contract_address) REFERENCES otc_markets(contract_address)
);

CREATE TABLE otc_market_floor_price_changed_events (
  contract_address CHAR(42),
  block_timestamp BIGINT,
  floor_price NUMERIC(78, 18) NOT NULL,
  PRIMARY KEY (contract_address, block_timestamp),
  FOREIGN KEY (contract_address) REFERENCES otc_markets(contract_address)
);

CREATE TABLE otc_market_offer_accepted_events (
  contract_address CHAR(42),
  block_timestamp BIGINT,
  offer_id CHAR(77),
  seller CHAR(42) NOT NULL,
  royalty_token_amount NUMERIC(78, 0) NOT NULL,
  stablecoin_amount NUMERIC(78, 0) NOT NULL,
  buyer CHAR(42) NOT NULL,
  PRIMARY KEY (contract_address, block_timestamp, offer_id),
  FOREIGN KEY (contract_address) REFERENCES otc_markets(contract_address)
);

CREATE TABLE initial_royalty_offerings (
  contract_address CHAR(42) PRIMARY KEY,
  royalty_token_symbol CHAR(11) REFERENCES royalty_tokens(symbol),
  latest_block_number BIGINT DEFAULT 0 NOT NULL
);

CREATE TABLE royalty_exchanges (
  contract_address CHAR(42) PRIMARY KEY,
  royalty_token_symbol CHAR(11) REFERENCES royalty_tokens(symbol),
  latest_block_number BIGINT DEFAULT 0 NOT NULL
);

CREATE TABLE royalty_token_sold_events (
  contract_address CHAR(42),
  block_timestamp BIGINT,
  trader CHAR(42),
  royalty_token_amount BIGINT NOT NULL,
  stablecoin_amount BIGINT NOT NULL,
  updated_royalty_token_reserve BIGINT NOT NULL,
  updated_stablecoin_reserve BIGINT NOT NULL,

  PRIMARY KEY (contract_address, block_timestamp),
  FOREIGN KEY (contract_address) REFERENCES royalty_exchanges(contract_address)
);

CREATE TABLE royalty_token_bought_events (
  contract_address CHAR(42),
  block_timestamp BIGINT,
  trader CHAR(42),
  royalty_token_amount BIGINT NOT NULL,
  stablecoin_amount BIGINT NOT NULL,
  updated_royalty_token_reserve BIGINT NOT NULL,
  updated_stablecoin_reserve BIGINT NOT NULL,

  PRIMARY KEY (contract_address, block_timestamp),
  FOREIGN KEY (contract_address) REFERENCES royalty_exchanges(contract_address)
);

CREATE TABLE royalty_pool_withdrawn_events (
  contract_address CHAR(42),
  block_timestamp BIGINT,
  checkpoint_key BIGINT NOT NULL,
  investor CHAR(42),
  amount BIGINT NOT NULL,

  PRIMARY KEY (contract_address, block_timestamp, checkpoint_key),
  FOREIGN KEY (contract_address) REFERENCES royalty_payment_pools(contract_address)
);

CREATE TABLE royalty_pool_deposited_events (
  contract_address CHAR(42),
  block_timestamp BIGINT,
  sender CHAR(42),
  deposit BIGINT NOT NULL,

  PRIMARY KEY (contract_address, block_timestamp),
  FOREIGN KEY (contract_address) REFERENCES royalty_payment_pools(contract_address)
);

CREATE TABLE initial_royalty_tokens_bought_events (
  contract_address CHAR(42),
  block_timestamp BIGINT,
  amount BIGINT NOT NULL,

  PRIMARY KEY (contract_address, block_timestamp),
  FOREIGN KEY (contract_address) REFERENCES initial_royalty_offerings(contract_address)
);