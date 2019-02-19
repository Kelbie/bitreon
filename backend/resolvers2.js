var async = require("async")

var models = require("./models");

var { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const { Client } = require("pg");

const client = new Client({});

client.connect();

const TX_NOTIFY = "TX_NOTIFY"

module.exports = {
  Query: {
    invoice: async (obj, args, context, info) => {
      const invoices_res = await client.query(`
        SELECT * FROM invoices
          WHERE invoice_id=$1
      `, [args.id]);
      var invoices = invoices_res.rows[0];

      const tiers_res = await client.query(`
        SELECT * FROM tiers
          WHERE id=$1
      `, [invoices.tier_id]);
      var tiers = tiers_res.rows[0];

      return {
        "id": invoices.invoice_id,
        "address": invoices.pub_key,
        "currency": "BTC",
        "amount": invoices.amount,
        "expiry": invoices.expiry,
        "tier": {
          "id": tiers.id,
          "title": tiers.title,
          "text": tiers.content,
          "currency": "USD",
          "amount": tiers.price
        }
      }
    },
    tier: async (obj, args, context, info) => {
      const tiers_res = await client.query(`
        SELECT * FROM tiers
          WHERE id=$1
      `, [args.id]);
      var tiers = tiers_res.rows[0];

      return {
        "id": tiers.id,
        "title": tiers.title,
        "text": tiers.content,
        "currency": "USD",
        "amount": tiers.price
      }
    },
    transaction: async (obj, args, context, info) => {
      const txid = await models.selectTransaction();

      return txid
    }
  },
  Mutation: {
    uploadTransaction: async (obj, args, context, info) => {
      // console.log(obj, args, context, info)
      // var headers = {
      //   'content-type': 'text/plain;'
      // };
      
      // var dataString = `{"jsonrpc": "1.0", "id":"curltest", "method": "getrawtransaction", "params": ["${args.txid}"] }`;
      
      // var options = {
      //     url: 'http://127.0.0.1:18332/',
      //     method: 'POST',
      //     headers: headers,
      //     body: dataString,
      //     auth: {
      //         'user': 'lol',
      //         'pass': 'lol'
      //     }
      // };
      
      // async function callback(error, response, body) {
      //     if (!error && response.statusCode == 200) {
      //         const result = JSON.parse(body);
      //         var tx = bitcoin.Transaction.fromHex(result.result);
      //         let address = bitcoin.address.fromOutputScript(tx.outs[0].script, bitcoin.networks.testnet)

      //         const invoice_res = await client.query(`
      //           UPDATE invoices 
      //             SET txid=$1, status=$2, time=$3 
      //               WHERE pub_key IN ($4);
      //         `, [args.txid, "paid", Math.round(+new Date()/1000), address])
      //     }
      // }
      
      // await request(options, callback);
      await models.insertTransaction(args.txid)
      console.log(args.txid)
      pubsub.publish(POST_ADDED, { txNotify: {txid: args.txid} });

      return {
        txid: args.txid
      }

    }
  },
  Subscription: {
    txNotify: {
      subscribe: () => pubsub.asyncIterator([TX_NOTIFY]),
    },
  },
};