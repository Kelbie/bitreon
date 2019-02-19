module.exports = `
  type Query {
    invoice(id: String!): Invoice!,
    tier(id: Int!): Tier!,
    transaction: Transaction!
  }

  type Mutation {
    uploadTransaction(txid: String!): Transaction!
  }

  type Subscription {
    txNotify: Transaction
  }

  type Transaction {
    txid: String!
  }


  type Invoice {
    id: String!,
    address: String!,
    currency: String!,
    amount: Float!,
    expiry: Int!,
    tier: Tier
  }

  type Tier {
    id: Int!
    title: String!,
    text: String!,
    currency: String!,
    amount: Float!
  }
`