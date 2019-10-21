import uuid from "uuid/v1";
import log from "../utils/logger";
import connect from "../utils/dbc";
import { ObjectId } from "mongodb";
import Graph from "../providers/graph";
import CustomError from "./custom-error";
import { twitterCrawler } from "../utils/twitter-crawler";

let { KEY } = process.env;
if (!KEY) {
    log(
        "app:user:app.js",
        "FATAL ERROR : KEY is not defind! Please check .env setting"
    );
    process.exit(1);
}
export default class MutualTreeService {
    /**
     * @function
     * @instance
     * @memberof MutualTreeService
     * @name addAnInterest
     * @param { Object } body authentic User to access this function object
     * @param { Object } params end_user phone number object
     * @returns success Object or error object.
     * @description Change phone number.
     */
    addAnInterest = async (body: any) => {
        try {
            // db connection
            const dbc: any = await connect();
            const { parentNode, childNode } = body;
            const graph = Graph.newInstance().covertMongoObjToGraphObj(
                await dbc.collection("knowledgeGraph").findOne({ KEY })
            );
            if (!graph) {
                log(
                    "app:MutualTreeService:addAnInterest",
                    "Initialing the knowlege tree"
                );
                const newGraph = Graph.newInstance();
                newGraph.addNode(parentNode);
                newGraph.addNode(childNode);
                newGraph.addEdge(parentNode, childNode);
                const { result } = await dbc
                    .collection("knowledgeGraph")
                    .insertOne({
                        graph: newGraph,
                        KEY
                    });
                return { result };
            }
            if (!graph.isExist(parentNode)) {
                log(
                    "app:MutualTreeService:addAnInterest",
                    "Parent Node does not exist. Please check"
                );
                throw new CustomError(
                    "app:MutualTreeService:addAnInterest",
                    "Parent Node does not exist. Please check"
                );
            }
            graph.addNode(childNode);
            graph.addEdge(parentNode, childNode);

            console.log("graph--> ", graph);
            const neighbors = graph.display();
            console.log("neighbors--> ", neighbors);

            // pushing to the user db
            let { result } = await dbc
                .collection("knowledgeGraph")
                .updateOne({ KEY }, { $set: { graph } });
            return { result, graph };
        } catch (ex) {
            throw ex;
        }
    };

    /**
     * @function
     * @instance
     * @memberof MutualTreeService
     * @name getGraph
     * @param { String } phone end_user phone number
     * @returns success Object or error object.
     * @description List of user details.
     */
    getGraph = async () => {
        try {
            // db connection
            const dbc: any = await connect();
            const exist = Graph.newInstance().covertMongoObjToGraphObj(
                await dbc.collection("knowledgeGraph").findOne({ KEY })
            );
            if (!exist) {
                log(
                    "app:MutualTreeService:getGraph",
                    "User does not exist. Please check"
                );
                throw new CustomError(
                    "app:MutualTreeService:getGraph",
                    "User does not exist. Please check"
                );
            }
            return { result: exist };
        } catch (ex) {
            throw ex;
        }
    };

    /**
     * @function
     * @instance
     * @memberof MutualTreeService
     * @name searchGraph
     * @param { String } phone end_user phone number
     * @returns success Object or error object.
     * @description List of user details.
     */
    searchGraph = async (body: any) => {
        try {
            // db connection
            const dbc: any = await connect();
            const { friendOne, friendTwo } = body;
            const graph = Graph.newInstance().covertMongoObjToGraphObj(
                await dbc.collection("knowledgeGraph").findOne({ KEY })
            );
            if (!graph) {
                log(
                    "app:MutualTreeService:searchGraph",
                    "User does not graph. Please check"
                );
                throw new CustomError(
                    "app:MutualTreeService:searchGraph",
                    "User does not graph. Please check"
                );
            }
            if (!graph.isExist(friendOne)) {
                log(
                    "app:MutualTreeService:addAnInterest",
                    "friendOne Node does not exist. Please check"
                );
                throw new CustomError(
                    "app:MutualTreeService:addAnInterest",
                    "friendOne Node does not exist. Please check"
                );
            }
            if (!graph.isExist(friendTwo)) {
                log(
                    "app:MutualTreeService:addAnInterest",
                    "friendTwo Node does not exist. Please check"
                );
                throw new CustomError(
                    "app:MutualTreeService:addAnInterest",
                    "friendTwo Node does not exist. Please check"
                );
            }
            const friendOne_friends = graph.search(friendOne);
            const friendTwo_friends = graph.search(friendTwo);
            const mergeArray = [...friendOne_friends, ...friendTwo_friends];
            const mutual_friends = mergeArray.filter(
                (v, i) => mergeArray.indexOf(v) !== i
            );
            return {
                result: {
                    friendOne_friends,
                    friendTwo_friends,
                    mutual_friends
                }
            };
        } catch (ex) {
            throw ex;
        }
    };

    /**
     * @function
     * @instance
     * @memberof Borrower
     * @name signUpWithTwitterDev
     * @param { String } access_token twitter access token by end_user
     * @param { Object } authenticUser authentic User to access this function
     * @returns success Object or error object.
     * @description crawler for twitter.
     */
    twitterCrawler = async (
        twitter_access_token: Array<string>,
        twitter_access_token_secret: Array<string>
    ) => {
        try {
            // first user
            const first = await twitterCrawler(
                twitter_access_token[0],
                twitter_access_token_secret[0],
                "friends/list"
            );

            // API record status checking here
            if (!first || first.length === 0) {
                log(
                    "app:MutualTreeService:twitterCrawler",
                    "Your Twitter account privacy settings do not allow us to connect. Please review your permission",
                    first
                );
                throw new CustomError(
                    "app:MutualTreeService:twitterCrawler",
                    "Your Twitter account privacy settings do not allow us to connect. Please review your permission"
                );
            }
            // second user
            const second = await twitterCrawler(
                twitter_access_token[1],
                twitter_access_token_secret[1],
                "friends/list"
            );

            // API record status checking here
            if (!second || second.length === 0) {
                log(
                    "app:MutualTreeService:twitterCrawler",
                    "Your Twitter account privacy settings do not allow us to connect. Please review your permission",
                    second
                );
                throw new CustomError(
                    "app:MutualTreeService:twitterCrawler",
                    "Your Twitter account privacy settings do not allow us to connect. Please review your permission"
                );
            }
            let friendOne_friends: Array<string> = [];
            first.users.map((d: any) => {
                return friendOne_friends.push(d.screen_name);
            });
            let friendTwo_friends: Array<string> = [];
            second.users.map((d: any) => {
                return friendTwo_friends.push(d.screen_name);
            });
            const mergeArray = [...friendOne_friends, ...friendTwo_friends];
            const mutual_friends = mergeArray.filter(
                (v, i) => mergeArray.indexOf(v) !== i
            );
            return {
                result: {
                    friendOne_friends,
                    friendTwo_friends,
                    mutual_friends
                }
            };
        } catch (ex) {
            throw ex;
        }
    };
}
