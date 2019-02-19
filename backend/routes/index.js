var request = require("request");
request = request.defaults({ jar: true });
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();
var async = require("async");
const nodemailer = require("nodemailer");
var sha256 = require("sha256");
var bitcoin = require("bitcoinjs-lib")
var bip32 = require("bip32")
const btcpay = require("btcpay");
const keypair = btcpay.crypto.load_keypair(
  new Buffer.from(
    "0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff",
    "hex"
  )
);
var btcpayclient = new btcpay.BTCPayClient(
  "https://testnet.demo.btcpayserver.org",
  keypair
);
const btcpayserver = require('../public/javascripts/btcpayserver');

const { Client } = require("pg");

const client = new Client({});

// const client = new Client({
// 	database: "postgres",
// 	port: 5432,
// 	user: "postgres",
// 	password: "postgres"
// });

client.connect();

async function init() {
  // create users table
  await client.query(
    `CREATE TABLE IF NOT EXISTS users (
		id						SERIAL NOT NULL,
    display_name  VARCHAR(45) NOT NULL,
    username      VARCHAR(45) NOT NULL,
		email         VARCHAR(45) NOT NULL,
		supporters		INT,
		img           VARCHAR,
		password_hash	VARCHAR NOT NULL,
		token					VARCHAR,
    auth					BOOLEAN,
    date          BIGINT,

    PRIMARY KEY (id)
  );`
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS tiers (
			id				SERIAL,
			user_id		INT NOT NULL,
			price			INT NOT NULL,
			title			VARCHAR(255) NOT NULL,
			contents	VARCHAR(255) NOT NULL,
			PRIMARY KEY (id)
		);`
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS waitlist (
			id				SERIAL,
			username	VARCHAR(45) NOT NULL,
			email			VARCHAR(128) NOT NULL,
			type			VARCHAR(10) NOT NULL,
			PRIMARY KEY (id)
		);`
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS posts (
			id			SERIAL,
			user_id	INT NOT NULL,
			title		VARCHAR NOT NULL,
			content	VARCHAR NOT NULL,
			time		INT NOT NULL,
			PRIMARY KEY (id)
		)`
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS btcpaytokens (
			user_id		INT NOT NULL,
			storeId		VARCHAR NOT NULL,
			PRIMARY KEY(user_id)
		)`
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS keys (
			user_id		INT NOT NULL,
      public_key		VARCHAR NOT NULL,
			PRIMARY KEY(user_id)
		)`
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS invoices (
      id              SERIAL,
      invoice_id      VARCHAR,
      send_user_id    INT NOT NULL, 
      pub_key         VARCHAR NOT NULL, 
      amount          NUMERIC (17,8) NOT NULL, 
      receive_user_id INT NOT NULL, 
      index           INT NOT NULL, 
      expiry          BIGINT NOT NULL,
      status          VARCHAR,
      tier_id         INT NOT NULL,
      txid            VARCHAR,
      time            BIGINT,
      PRIMARY KEY (id)
		)`
  );
}

router.get("/", async (req, res, next) => {
  await init();
  const response = await client.query(`
		SELECT display_name, username, supporters, img 
			FROM users
				WHERE auth=TRUE
	`);
  const users = response.rows;

  res.json({ users: users });
});

const isAuthenticated = (req, res, next) => {
  res.locals.authenticated = false;
  if (req.session && req.session.user && req.session.user.username == req.params.username) {
    res.locals.authenticated = true;
  }
  console.log(res.locals);
  next();
};

router.get("/user/:username", isAuthenticated, async (req, res, next) => {
  const user_res = await client.query(
    `
		SELECT id, display_name, username, supporters, img FROM users 
			WHERE username=$1
	`,
    [req.params.username]
  );
  const user = await user_res.rows[0];

  // GET store of :username
  const store_res = await client.query(
    `
		SELECT storeid FROM btcpaytokens 
			WHERE user_id=$1
	`,
    [user.id]
  );
  const store = await store_res.rows[0];

  try {
    user.storeid = store.storeid;
  } catch (error) {}

  res.json({
    authenticated: res.locals.authenticated,
    user: user
  });
});

router.post("/:username/tier", isAuthenticated, async (req, res, next) => {
  const values = req.body;

  if (res.locals.authenticated) {
    if (values.action == "delete") {
      await client.query(
        `
				DELETE FROM tiers 
					WHERE id=$1
			`,
        [values.id]
      );
    } else {
      if (values.id != undefined) {
        // If tier exists
        await client.query(
          `
					UPDATE tiers SET user_id=$1, price=$2, title=$3, contents=$4 
						WHERE id=$5
				`,
          [
            req.session.user.id,
            values.price,
            values.title,
            values.content,
            values.id
          ]
        );
      } else {
        await client.query(
          `
				INSERT INTO tiers (user_id, price, title, contents)
					VALUES ($1, $2, $3, $4)
				`,
          [req.session.user.id, values.price, values.title, values.content]
        );
      }
    }
  }

  res.json({ a: 1 });
});

router.post("/waitlist", async (req, res, next) => {
  const values = req.body;
  await client.query(
    `
		INSERT INTO waitlist (username, email, type)
		VALUES ($1, $2, $3)`,
    [values.username, values.email, values.type]
  );

  res.json({ a: 1 });
});

router.post("/signup", async (req, res, next) => {
  const values = req.body;
  const errors = {};

  const usernameLookup = await client.query(
    `
		SELECT * FROM users WHERE username=$1
	`,
    [values.username]
  );

  const emailLookup = await client.query(
    `
		SELECT * FROM users WHERE email=$1
	`,
    [values.email]
  );

  const waitingListLookup = await client.query(
    `
		SELECT * FROM waitlist
			WHERE username=$1 OR email=$2
	`,
    [values.username, values.email]
  );

  // console.log(waitingListLookup)
  console.log(values);
  if (waitingListLookup.rows.length > 0) {
    if (
      waitingListLookup.rows[0].username == values.username &&
      waitingListLookup.rows[0].email == values.email
    ) {
    } else if (
      waitingListLookup.rows[0].username != values.username &&
      waitingListLookup.rows[0].email == values.email
    ) {
    } else {
      errors.main =
        "If you reserved this username please use the email you provided on the waitlist";
      errors.username = "This username is already taken";
      errors.email = "This email is already taken";
    }
  }

  if (values.username == "") {
    errors.username = "Username cannot be empty";
  }

  if (!/^[0-9a-zA-Z_]+$/.test(values.username)) {
    errors.username = "Username contains invalid characters"
  }

  if (values.email == "") {
    errors.email = "Email cannot be empty";
  }

  if (values.password == "") {
    errors.password = "Password cannot be empty";
  }

  if (usernameLookup.rows.length > 0) {
    errors.username = "This username is already taken";
  }

  if (emailLookup.rows.length > 0) {
    errors.email = "This email is already taken";
  }

  if (Object.keys(errors).length === 0 && errors.constructor === Object) {
    const token = sha256(Math.random().toString());
    const user_res = await client.query(
      `
			INSERT INTO users (display_name, username, email, password_hash, supporters, token, auth, date)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
		`,
      [
        values.username,
        values.username,
        values.email,
        values.password,
        0,
        token,
        false,
        Math.round(+new Date()/1000)
      ]
    );

    var userId = user_res.rows[0].id;

    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 587,
        secure: false,
        auth: {
          user: "noreply@bitreon.app",
          pass: "jw5TXsN4YGRayFV"
        }
      });

			// setup email data with unicode symbols
			var host = "";
			if (process.env.STAGE == "prod") {
				host = "https://bitreon.app";
			} else if (process.env.STAGE == "testnet") {
				host = "https://testnet.bitreon.app";
			} else if (process.env.STAGE == "dev") {
				host = "http://localhost:3000"
      }
      console.log("HOST:", host);
      let mailOptions = {
        from: '"Bitreon" <noreply@bitreon.app>',
        to: values.email,
        subject: "Bitreon: Verify your account",
        text: `Click the following link to verify your account: ${host}/verify/${token} If you did not create an account just ignore this email.`,
        html: `Click <a href="${host}/verify/${token}">here</a> to verify your account<br/>If you did not create an account just ignore this email`
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    });

    // Open Login Form

    res.json({ status: "success" });
  } else {
    res.json({ errors: errors, status: "error" });
  }
});

router.post("/signin", async (req, res, next) => {
  const values = req.body;
  const errors = {};

  const user = await client.query(
    `
		SELECT * FROM users 
			WHERE username=$1 AND password_hash=$2
	`,
    [values.username, values.password]
  );

  try {
    if (user.rows[0].auth == false) {
      errors.main = "You must verify your email";
    }
  } catch (e) {}

  if (user.rows.length == 0) {
    errors.main = "Username or password is wrong";
  }

  const usernameLookup = await client.query(
    `
		SELECT * FROM users WHERE username=$1
	`,
    [values.username]
  );

  if (usernameLookup.rows.length == 0) {
    errors.username = "This username does not exist";
  }

  if (values.password == "") {
    errors.password = "Password cannot be empty";
  }

  if (Object.keys(errors).length === 0 && errors.constructor === Object) {
    req.session.user = user.rows[0];

    res.json({ status: "success" });
  } else {
    res.json({ errors: errors, status: "error" });
  }
});

router.post("/:username/post", isAuthenticated, async (req, res, next) => {
  if (res.locals.authenticated) {
    const post_res = await client.query(
      `
		INSERT INTO posts (user_id, title, content, time)
			VALUES ($1, $2, $3, $4) RETURNING id
		`,
      [req.session.user.id, req.body.title, req.body.content, req.body.time]
    );

    const post = post_res.rows[0];

    res.json({ status: "successful", id: post.id });
  } else {
    res.json({ status: "error" });
  }
});

router.get("/user/:username/posts", async (req, res, next) => {
  const user_res = await client.query(`SELECT * FROM users WHERE username=$1`, [
    req.params.username
  ]);
  const user = await user_res.rows[0];

  const posts_res = await client.query(
    `SELECT * FROM posts WHERE user_id = $1 ORDER BY time DESC`,
    [user.id]
  );
  const posts = await posts_res.rows;

  res.json({ posts: posts });
});

router.get("/user/:username/tiers", async (req, res, next) => {
  const user_res = await client.query(`SELECT * FROM users WHERE username=$1`, [
    req.params.username
  ]);
  const user = await user_res.rows[0];

  const tiers_res = await client.query(
    `SELECT * FROM tiers WHERE user_id = $1 ORDER BY price`,
    [user.id]
  );
  const tiers = await tiers_res.rows;

  res.json({ tiers: tiers });
});

router.post(
  "/user/:username/posts/:index/delete",
  isAuthenticated,
  async (req, res, next) => {
    const user_res = await client.query(
      `
		SELECT * FROM users 
			WHERE username=$1
	`,
      [req.params.username]
    );
    const user = await user_res.rows[0];

    if (res.locals.authenticated) {
      await client.query(
        `
			DELETE FROM posts 
				WHERE id=$1
		`,
        [req.params.index]
      );
      res.json({ a: 1 });
    } else {
      res.json({ a: 2 });
    }
  }
);

router.post("/logout", isAuthenticated, async (req, res, next) => {
  req.session.destroy();
  res.json({ a: 1 });
});

router.get("/loggedIn", async (req, res, next) => {
  console.log(req.session)
  if (req.session.user != undefined) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

router.post("/verify/:token", async (req, res, next) => {
  const email_res = await client.query(
    `UPDATE users
			SET auth=true
				WHERE token=$1
					RETURNING id`,
    [req.params.token]
  );

  const user = await client.query(
    `
		SELECT * from users WHERE id=$1
	`,
    [email_res.rows[0].id]
  );

  req.session.user = user.rows[0];
  res.json({ username: user.rows[0].username });
});

router.post('/settings/:username/account', isAuthenticated, async(req, res, next) => {
  var errors = {};
  const values = req.body;
  console.log(values);

  if (values.username) {
    const user_res = await client.query(`
      SELECT * FROM users
        WHERE username=$1
    `, [values.username]);
  
    if (user_res.rows.length > 0) {
      errors.username = "That username is already taken";
    } else {
      req.session.user.username = values.username;
    }
  }

  if (values.displayName) {
    req.session.user.display_name = values.displayName;
  }

  if (Object.keys(errors).length === 0 && errors.constructor === Object) {
    await client.query(`
      UPDATE users SET username=$1, display_name=$2
        WHERE username=$3 RETURNING *
    `, [values.username, values.displayName, req.params.username]);
    res.json({status: "success"});
  } else {
    res.json({errors: errors, status: "error"});
  }
  
});

router.get('/settings/:username/wallet', isAuthenticated, async(req, res, next) => {
  const key_res = await client.query(`
    SELECT * FROM keys
  `)
  console.log(key_res);

  const key = await key_res.rows[0];
  console.log(key);
  res.json({key: key})  
});

const isAuthenticated2 = (req, res, next) => {
  res.locals.authenticated = false;
  if (req.session && req.session.user) {
    res.locals.authenticated = true;
  }
  console.log(res.locals);
  next();
};

router.post('/key', isAuthenticated2, async(req, res, next) => {
  console.log(req.session.user.id, req.body.pubkey);
  if (res.locals.authenticated) {
    await client.query(`
      INSERT INTO keys (user_id, public_key) 
        VALUES ($1, $2)
    `, [req.session.user.id, req.body.pubkey])
  }
  res.json({status: "ok"})
});

router.get('/key', isAuthenticated2, async(req, res, next) => {
  const key_res = await client.query(`
  SELECT * FROM keys
      WHERE user_id=$1
  `, [req.session.user.id])
  console.log(req.session.user.id, key_res)
  const key = key_res.rows[0];
  console.log(key)
  if (key) {
    res.sendStatus(200)
  } else {
    res.sendStatus(404)
  }

});

router.post('/invoice/:username/:tier', async(req, res, next) => {
  const user_res = await client.query(`
    SELECT id FROM users
      WHERE username = $1
  `, [req.params.username])
  const user_id = user_res.rows[0].id;

  const tiers_res = await client.query(`
    SELECT * FROM tiers
      WHERE id = $1
  `, [req.params.tier])
  const tiers = tiers_res.rows[0];

  const key_res = await client.query(`
    SELECT * FROM keys
      WHERE user_id = $1
  `, [user_id]);
  const key = key_res.rows[0];

  const invoices_res = await client.query(`
    SELECT DISTINCT ON (index) * FROM invoices 
      WHERE receive_user_id=$1 
        ORDER BY index, expiry DESC;
  `, [user_id]);
  const invoices = invoices_res.rows
  
  const oldest_pending = {
    index: 0,
    expiry: -1
  }

  var last_paid = 0;
  var max_index = 0;

  invoices.forEach(invoice => {
    if (invoice.expiry < Math.round(new Date()/1000) && (invoice.status == "pending")) {
      if (invoice.expiry < oldest_pending.expiry || oldest_pending.expiry == -1) {
        oldest_pending.expiry = invoice.expiry;
        oldest_pending.index = invoice.index;
      }
      console.log(123, oldest_pending)
    }
    if (invoice.status != "pending") {
      last_paid = invoice.index;
    }
    if (max_index < invoice.index) {
      max_index = invoice.index;
    }
  });
  
  var index = max_index + 1;
  if (oldest_pending.expiry != -1) {
    index = oldest_pending.index;
  }


  function getAddress (node, network) {
    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: network }),
      network: network
    })
    return address;
  }
  
  var network;
  var path;
  if (process.env.STAGE == "dev" || process.env.STAGE == "testnet") {
    path = `m/49/1/0/0/${index}`
    network = bitcoin.networks.testnet;
  } else if (process.env.STAGE == "prod") {
    path = `m/49/0/0/0/${index}`
    network = bitcoin.networks.mainnet
  }
  const address = getAddress(bip32.fromBase58(key.public_key).derivePath(path), network);
  var expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5);


  const invoice_res = await client.query(`
  INSERT INTO invoices (invoice_id, send_user_id, pub_key, amount, receive_user_id, index, expiry, status, tier_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
  `, [
    sha256(Math.random().toString()), 
    req.session.user ? req.session.user.id : -1, 
    address, 
    tiers.price, 
    user_id, 
    index, 
    Math.round(expiry.getTime()/1000), 
    "pending",
    req.params.tier
  ])
  const invoice = invoice_res.rows[0];

  async function listenToAddress(address) {
    var headers = {
      'content-type': 'text/plain;'
    };
    
    var dataString = `{"jsonrpc": "1.0", "id":"curltest", "method": "importaddress", "params": ["${address}", "", false] }`;
    
    var options = {
      url: 'http://127.0.0.1:18332/',
      method: 'POST',
      headers: headers,
      body: dataString,
      auth: {
        'user': 'lol',
        'pass': 'lol'
      }
    };
    
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(123123, body);
      }
    }
    
    await request(options, callback);
  }

  res.json({invoice: invoice.invoice_id})
});

router.get('/invoice/:invoice_id', async(req, res, next) => {
  const invoice_res = await client.query(`
    SELECT * FROM invoices
      WHERE invoice_id = $1
  `, [req.params.invoice_id])
  const invoice = invoice_res.rows[0]

  console.log(invoice);
  res.json(invoice)
});

router.get('/user/:username/tip', async(req, res, next) => {
  console.log(req.params.username)
  const user_res = await client.query(`
    SELECT id FROM users where username=$1;
  `, [req.params.username]);

  const user = user_res.rows[0];

  const ex_pub_key = await client.query(`
    SELECT public_key from keys where user_id=$1
  `, [user.id]);

  console.log(ex_pub_key.rows[0].public_key)

  function getAddress (node, network) {
    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network: network }),
      network: network
    })
    return address;
  }
  
  var network;
  var path;
  if (process.env.STAGE == "dev" || process.env.STAGE == "testnet") {
    path = `m/49/1/0/0/0`
    network = bitcoin.networks.testnet;
  } else if (process.env.STAGE == "prod") {
    path = `m/49/0/0/0/0`
    network = bitcoin.networks.mainnet
  }
  const address = getAddress(bip32.fromBase58(ex_pub_key.rows[0].public_key).derivePath(path), network);
  
  res.json({address});
});



module.exports = router;
