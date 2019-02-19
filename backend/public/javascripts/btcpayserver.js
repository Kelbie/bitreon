const request = require('request');
const cheerio = require('cheerio');

function UpdateBTCPayServer(userId, pubkey) {
  var headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    Referer: "https://testnet.demo.btcpayserver.org/",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    TE: "Trailers"
    // 'Cookie': 'mp_96b84420a1a32e448f73e7b9ffccebdb_mixpanel=%7B%22distinct_id%22%3A%20%22167e21a4445114-0677243f7fbef88-4a566b-13c680-167e21a4446371%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_a37bac8664a332481726ae49603f9f63_mixpanel=%7B%22distinct_id%22%3A%20%227a4df678-1858-477f-961d-741c201ec6b1%22%7D; .AspNetCore.Antiforgery.9TtSrW0hzOs=CfDJ8CbxocSCAUFFlXYrlS_uZQkvzgA84P4bix4l1zFSyVWGPukMjtR8G6TxyzWiw3o-2b_XhvkDrANbCXIGL3UasEde-VhiJnMRlvme-B3zsfO7r2eH3UMI70P8jHAYFoN6bdm-qnmjdQIy4chv5t5UaNE'
  };

  var options = {
    url: "https://testnet.demo.btcpayserver.org/Account/Login",
    headers: headers
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const response = cheerio(body);
      const csrv = response
        .find('[name="__RequestVerificationToken"]')
        .attr("value");

      var headers = {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://testnet.demo.btcpayserver.org/Account/Login",
        "Content-Type": "application/x-www-form-urlencoded",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        TE: "Trailers"
        // 'Cookie': 'mp_96b84420a1a32e448f73e7b9ffccebdb_mixpanel=%7B%22distinct_id%22%3A%20%22167e21a4445114-0677243f7fbef88-4a566b-13c680-167e21a4446371%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_a37bac8664a332481726ae49603f9f63_mixpanel=%7B%22distinct_id%22%3A%20%227a4df678-1858-477f-961d-741c201ec6b1%22%7D; .AspNetCore.Antiforgery.9TtSrW0hzOs=CfDJ8CbxocSCAUFFlXYrlS_uZQkvzgA84P4bix4l1zFSyVWGPukMjtR8G6TxyzWiw3o-2b_XhvkDrANbCXIGL3UasEde-VhiJnMRlvme-B3zsfO7r2eH3UMI70P8jHAYFoN6bdm-qnmjdQIy4chv5t5UaNE'
      };

      var dataString = `Email=kevin@kelbie.me&Password=e7P%*1KPAbjV%UkyhAIQ&__RequestVerificationToken=${csrv}&RememberMe=false`;

      var options = {
        url: "https://testnet.demo.btcpayserver.org/Account/Login",
        method: "POST",
        headers: headers,
        body: dataString
      };

      request(options, function(error, response, body) {
        var headers = {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Referer: "https://testnet.demo.btcpayserver.org/stores",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          TE: "Trailers"
          // 'Cookie': 'mp_96b84420a1a32e448f73e7b9ffccebdb_mixpanel=%7B%22distinct_id%22%3A%20%22167e21a4445114-0677243f7fbef88-4a566b-13c680-167e21a4446371%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_a37bac8664a332481726ae49603f9f63_mixpanel=%7B%22distinct_id%22%3A%20%227a4df678-1858-477f-961d-741c201ec6b1%22%7D; .AspNetCore.Antiforgery.9TtSrW0hzOs=CfDJ8CbxocSCAUFFlXYrlS_uZQkvzgA84P4bix4l1zFSyVWGPukMjtR8G6TxyzWiw3o-2b_XhvkDrANbCXIGL3UasEde-VhiJnMRlvme-B3zsfO7r2eH3UMI70P8jHAYFoN6bdm-qnmjdQIy4chv5t5UaNE; .AspNetCore.Identity.Application=CfDJ8CbxocSCAUFFlXYrlS_uZQkY5GHe9iG_0eexInOyclVBkSvqmZrHMR0r3X_cvYEOaEcI7JDte-UtS4p3_VIuW0UexvP72yeUR4kUZ0s8qMej68YL4jTl7BTJO_uqruuwgYUbW8qJyrZxORgn4kJ16DZoSh8YAEYOYRTRnHRWmbNiG8ntXgltPlmuU5vN9_WrzZtmUa8-XEhR8a2LfHrERTueEMzzjR6iuyPkCc4vFOy2o3q6Tw8inaGxT3TW1tX81zXyk3iYZW_-Tewxq3Eyb58UptYPI5Va_fqKtYSWavGHceH5GLEc3chBfuEny6K1JmZ6m-wnVCRjyxt3P_lk3oYifhvK5OBqGaSyeRsNfzF3epeiU_JpkzCcbHa0wEuHMEmo1T-ALiAnXE5GijRQYoVF9UVL0pbd_UsaeVBCFLP6Yc7qZhsSa_am-CLjq1ahPKR9-laWwKgTbTLL0u1Ad5p8rv0JQ1bHPdPBxA-5rJt6yCZC4xqKrc3kibHaU_1x6peLEnszaC-O2hFkhDx1lBbxODvynAOx_3wxejoh05YP3Y0mkkRixFXFl3njv0IoRejRkjiYerx6vyGljtnimaw'
        };

        var options = {
          url: "https://testnet.demo.btcpayserver.org/stores/create",
          headers: headers
        };

        request(options, function(error, response, body) {
          if (!error && response.statusCode == 200) {
            const response = cheerio(body);
            const csrv = response
              .find('[name="__RequestVerificationToken"]')
              .attr("value");

            var headers = {
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              Referer: "https://testnet.demo.btcpayserver.org/stores/create",
              "Content-Type": "application/x-www-form-urlencoded",
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1",
              Pragma: "no-cache",
              "Cache-Control": "no-cache",
              TE: "Trailers"
            };

            var dataString = `Name=${userId}&__RequestVerificationToken=${csrv}`;

            var options = {
              url: "https://testnet.demo.btcpayserver.org/stores/create",
              method: "POST",
              headers: headers,
              body: dataString
            };

            request(options, function(error, response, body) {
              var headers = {
                "User-Agent":
                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                Referer:
                  "https://testnet.demo.btcpayserver.org/stores/Hn3DfaJaP2dfmKrDiAdHcnmhbUGB9V62z41o4pEiuspu",
                Connection: "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
                Cookie:
                  ".AspNetCore.Antiforgery.9TtSrW0hzOs=CfDJ8CbxocSCAUFFlXYrlS_uZQkvzgA84P4bix4l1zFSyVWGPukMjtR8G6TxyzWiw3o-2b_XhvkDrANbCXIGL3UasEde-VhiJnMRlvme-B3zsfO7r2eH3UMI70P8jHAYFoN6bdm-qnmjdQIy4chv5t5UaNE; .AspNetCore.Identity.Application=CfDJ8CbxocSCAUFFlXYrlS_uZQnYklQEFm9IWPnBtLRSvHv5Vl75nbPd3x61bb_htGLjvaTgCsC0_5xlF0pNl5cxbTzAHSGvs5WIJ1SCjpsZT4_lvIVReI1kGktTNKGHDnbTcAIvOP6zQZJ7yqCgkIpBl6fOkKm2QLaM61Db9DvjCBVXXX4CeINOlyf3dPY0lz9GMnsSrrTjEnlOH1S-XPxNG2GFpoexXZ8b5o4oQxBG9YBS02mADxrRSa-TbKa2gSlsqoGuh8dYE-0dmXkK-hvP2-34pQLsvjcDJ2Y1OHPAzGQtVBH8uzBu-c6jHFwTst3YwljNxC7ysNAc6xw8R9Kx4UDEjJUr1Z9nZyDBamf2Ig3oJGXYXmUYlMN-RPBuZfztWcb7TBU02j74ljLdmZYkKRUxwKwb-qV7eE-F6GLuhMAr5Ig0RYsC5ghfBOk_TNm71sPBpyh35p7qfB1m7R5rZMX6ORWVVIaahICRIkbizAKhknxzzAAsUAYki_-Bw3ZUM83wBIw7DhAEuQzXr5nT-CCq4fQFFZg752g4sEK2pxTNdLn4a-KaVLrYIU5wup66Mr8UIswCMHB_fiAS9ZEk-j0; mp_96b84420a1a32e448f73e7b9ffccebdb_mixpanel=%7B%22distinct_id%22%3A%20%22167e21a4445114-0677243f7fbef88-4a566b-13c680-167e21a4446371%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; mp_a37bac8664a332481726ae49603f9f63_mixpanel=%7B%22distinct_id%22%3A%20%227edc61cf-83c4-44d9-b405-1a7ac5feb572%22%7D"
              };

              var options = {
                url: "https://testnet.demo.btcpayserver.org/stores",
                headers: headers
              };

              request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                  var body_cheerio = cheerio(body);
                  var id = body_cheerio
                    .find(`td:contains("${userId}")`)
                    .next()
                    .next()
                    .children("a")
                    .eq(1)
                    .attr("href")
                    .split("/")[2];

                  var headers = {
                    "User-Agent":
                      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
                    Accept:
                      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    Referer: "https://testnet.demo.btcpayserver.org/stores",
                    Connection: "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    Pragma: "no-cache",
                    "Cache-Control": "no-cache"
                  };

                  var options = {
                    url: `https://testnet.demo.btcpayserver.org/stores/${id}/derivations/BTC`,
                    headers: headers
                  };

                  request(options, async function(error, response, body) {
                    const body_cheerio = cheerio(body);
                    const csrv = body_cheerio
                      .find('[name="__RequestVerificationToken"]')
                      .attr("value");

                    console.log(userId, pubkey, privkey)
                    await client.query(`
                      INSERT INTO keys (user_id, public_key)
                        VALUES ($1, $2)
                    `, [userId, pubkey])

                    var headers = {
                      "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
                      Accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                      "Accept-Language": "en-US,en;q=0.5",
                      Referer: `https://testnet.demo.btcpayserver.org/stores/${id}/derivations/BTC`,
                      "Content-Type": "application/x-www-form-urlencoded",
                      Connection: "keep-alive",
                      "Upgrade-Insecure-Requests": "1",
                      Pragma: "no-cache",
                      "Cache-Control": "no-cache",
                      TE: "Trailers"
                    };

                    var dataString = `CryptoCode=BTC&DerivationScheme=${pubkey}&Enabled=true&command=save&__RequestVerificationToken=${csrv}&Enabled=false`;

                    var options = {
                      url: `https://testnet.demo.btcpayserver.org/stores/${id}/derivations/BTC`,
                      method: "POST",
                      headers: headers,
                      body: dataString
                    };

                    request(options, function(error, response, body) {
                      if (!error && response.statusCode == 200) {
                        const body_cheerio = cheerio(body);
                        const csrv = body_cheerio
                          .find('[name="__RequestVerificationToken"]')
                          .attr("value");
                        console.log(csrv);

                        var headers = {
                          "User-Agent":
                            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
                          Accept:
                            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                          "Accept-Language": "en-US,en;q=0.5",
                          Referer: `https://testnet.demo.btcpayserver.org/stores/${id}/derivations/BTC`,
                          "Content-Type": "application/x-www-form-urlencoded",
                          Connection: "keep-alive",
                          "Upgrade-Insecure-Requests": "1",
                          Pragma: "no-cache",
                          "Cache-Control": "no-cache",
                          TE: "Trailers"
                        };

                        var dataString = `Confirmation=True&DerivationScheme=${pubkey}&Enabled=true&HintAddress=&command=save&__RequestVerificationToken=${csrv}`;

                        var options = {
                          url: `https://testnet.demo.btcpayserver.org/stores/${id}/derivations/BTC`,
                          method: "POST",
                          headers: headers,
                          body: dataString
                        };

                        request(options, function(error, response, body) {
                          var headers = {
                            "User-Agent":
                              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
                            Accept:
                              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "Accept-Language": "en-US,en;q=0.5",
                            Referer: `https://testnet.demo.btcpayserver.org/stores/${id}/derivations/BTC`,
                            Connection: "keep-alive",
                            "Upgrade-Insecure-Requests": "1",
                            Pragma: "no-cache",
                            "Cache-Control": "no-cache",
                            TE: "Trailers"
                          };

                          var options = {
                            url: `https://testnet.demo.btcpayserver.org/stores/${id}`,
                            headers: headers
                          };

                          request(options, function(error, response, body) {
                            if (!error && response.statusCode == 200) {
                              console.log(body);
                              console.log(id);
                              client.query(
                                `
                                INSERT INTO btcpaytokens (user_id, storeid) VALUES ($1, $2)
                              `,
                                [userId, id]
                              );

                              var headers = {
                                "User-Agent":
                                  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
                                Accept:
                                  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                                "Accept-Language": "en-US,en;q=0.5",
                                Referer: `https://testnet.demo.btcpayserver.org/stores/${id}`,
                                Connection: "keep-alive",
                                "Upgrade-Insecure-Requests": "1",
                                Pragma: "no-cache",
                                "Cache-Control": "no-cache",
                                TE: "Trailers"
                              };

                              var options = {
                                url: `https://testnet.demo.btcpayserver.org/stores/${id}/paybutton`,
                                headers: headers
                              };

                              request(options, function(
                                error,
                                response,
                                body
                              ) {
                                console.log(body);
                                const cheerio_body = cheerio(body);
                                const csrv = cheerio_body
                                  .find('[name="__RequestVerificationToken"]')
                                  .attr("value");
                                console.log(123, csrv);

                                var headers = {
                                  "User-Agent":
                                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:64.0) Gecko/20100101 Firefox/64.0",
                                  Accept:
                                    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                                  "Accept-Language": "en-US,en;q=0.5",
                                  Referer:
                                    `https://testnet.demo.btcpayserver.org/stores/${id}/paybutton`,
                                  "Content-Type":
                                    "application/x-www-form-urlencoded",
                                  Connection: "keep-alive",
                                  "Upgrade-Insecure-Requests": "1",
                                  Pragma: "no-cache",
                                  "Cache-Control": "no-cache",
                                  TE: "Trailers",
                                };

                                var dataString =
                                  `EnableStore=True&command=save&__RequestVerificationToken=${csrv}`;

                                var options = {
                                  url:
                                    `https://testnet.demo.btcpayserver.org/stores/${id}/paybutton`,
                                  method: "POST",
                                  headers: headers,
                                  body: dataString
                                };

                                request(options, function (error, response, body) {
                                  console.log(error, response.statusCode, response.statusMessage);
                                });
                              });
                            }
                          });
                        });
                      }
                    });
                  });
                }
              });
            });
          }
        });
      });
    }
  });
}

module.exports = {UpdateBTCPayServer};