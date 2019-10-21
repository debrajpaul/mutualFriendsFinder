import Twit from "twit";
import log from "./logger";

let { CONSUMER_KEY, CONSUMER_SECRET } = process.env;

if (!CONSUMER_KEY) {
    log(
        "app:twitterCrawler:client",
        `FATAL ERROR : CONSUMER_KEY is not defind! Please check .env setting`
    );
    process.exit(1);
}

if (!CONSUMER_SECRET) {
    log(
        "app:twitterCrawler:client",
        `FATAL ERROR : CONSUMER_SECRET is not defind! Please check .env setting`
    );
    process.exit(1);
}

const twitterCrawler = (
    access_token: string,
    access_token_secret: string,
    twitterAPIEndpoints = "friends/list"
) => {
    const client = new Twit({
        consumer_key: CONSUMER_KEY || "",
        consumer_secret: CONSUMER_SECRET || "",
        access_token,
        access_token_secret,
        timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
        strictSSL: true // optional - requires SSL certificates to be valid.
    });
    return client
        .get(twitterAPIEndpoints)
        .then((r: any) => r.data)
        .catch((e: any) => {
            log(e);
            log(
                "app:twitterCrawler:client",
                `FATAL ERROR : CONSUMER_SECRET is not defind! Please check .env setting`
            );
            Promise.reject(e);
        });
};

export { twitterCrawler };
