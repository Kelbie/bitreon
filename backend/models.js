var async = require("async")

const { Client } = require("pg");

const client = new Client({});

client.connect();

module.exports = {
  insertTransaction: async (txid) => {
    await client.query(`
      INSERT INTO transactions (txid)
        VALUES ($1)
    `, [txid])
  },
  selectTransaction: async () => {
    const txid_res = await client.query(`
      SELECT * FROM transactions
    `, []);

    const txid = txid_res.rows[txid_res.rows.length-1];

    return txid;
  }
}