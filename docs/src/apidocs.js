/**
 * @api {get} /price Request coin price
 * @apiName GetPrice
 * @apiGroup Price
 *
 * @apiQuery {String} coin Coin of wich you want to know the price (Required)
 *
 * @apiSuccess {Number} prezzo Price of the coin
 * @apiSuccess {String} name Name of the coin
 * @apiSuccess {Number} percent_24h Percentage of variance in the last 24h
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "prezzo": 19987.764567646056,
 *       "name": "bitcoin",
 *       "percent_24h": 1.92414138
 *     }
 *
 * @apiError Bad_Request Error in the user's request
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 * 
 *       "error": "bad request"
 */

/**
 * @api {get} /historical_price Request coin's historical_price
 * @apiName GetHistorical_price
 * @apiGroup Historical_price
 *
 * @apiQuery {String} coin Coin of wich you want to know the price (Required)
 *
 * @apiSuccess {String} name Name of the coin
 * @apiSuccess {Array} price Coin's price of the last 7 days
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "coin": "bitcoin",
 *          "price": [
 *             19539.461638101497,
 *             19493.753285764986,
 *             18093.92045239661,
 *             19618.81910399051,
 *             19547.783950274457,
 *             19629.42856365007,
 *             18965.76138078821
 *          ]
 *     }
 *
 * @apiError Bad_Request Error in the user's request
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 * 
 *       "error": "bad request" 
 */


/**
 * @api {get} /stats Request some global stats
 * @apiName GetGlobalStats
 * @apiGroup Global Stats
 *
 *
 * @apiSuccess {Number} total_market_cap Real time market cap
 * @apiSuccess {Number} btc_dominance Real time btc dominance
 * @apiSuccess {Number} total_volume_24h Real time total volume
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "total_market_cap": 891170756472.966,
 *       "btc_dominance": 42.415778064603,
 *       "total_volume_24h": 64927252985.26713
 *     }
 *
 * @apiError Bad_Request Error in the user's request
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 * 
 *       "error": "bad request"
 */

/**
 * @api {get} /gas Request gas price
 * @apiName GetGas
 * @apiGroup Gas Tracker
 *
 * @apiSuccess {String} low Gas price for a low priority transaction
 * @apiSuccess {String} average Gas price for a average priority transaction
 * @apiSuccess {String} high Gas price for a high priority transaction
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "low": "46",
 *       "average": "47",
 *       "high": "49"
 *     }
 *
 * @apiError Bad_Request Error in the user's request
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 * 
 *       "error": "bad request"
 */