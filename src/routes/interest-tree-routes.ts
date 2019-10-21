/**
 * @namespace
 * @module Routes
 * @description Route details for API serive.
 * */
import * as dotenv from "dotenv";
import express from "express";
import log from "../utils/logger";
import {
    body_validator,
    params_validator,
    query_validator
} from "../middleware/validator";
import MutualTreeService from "../services/mutualTeeService";
import addNodeValidator from "../schemas/add-node-schema";
import mutualFiendsValidator from "../schemas/find-mutual-friends-schema";
import { success, fail } from "../utils/response-helpers";

dotenv.config();
const interestGraphRouter = express.Router();
const mutualTreeService = new MutualTreeService();

// for testing
interestGraphRouter.get("/", (req, res) => {
    res.json(success("API interest-graph-service Router service is working"));
});

/**
 * @function
 * @memberof module:Routes
 * @name Add_frends
 * @description Add a node to the graph
 * @route {POST} /interest-tree
 * @example <caption>Example request body:</caption>
{
	"parentNode":"becket", 
	"childNode":"jame"
}
 * @example <caption>Example Success response:</caption>
{
    "result": {
        "n": 1,
        "ok": 1
    },
    "success": true,
    "message": "Done"
}
* @example <caption>Example Error response:</caption>
{
    "success": false,
    "message": {
        "errorMessage": "Parent Node does not exist. Please check",
        "date": "2019-10-21T05:30:27.385Z"
    }
}
 * */
interestGraphRouter.post(
    "/interest-tree",
    body_validator(addNodeValidator),
    async (req, res) => {
        try {
            res.json(
                success("Done", await mutualTreeService.addAnInterest(req.body))
            );
        } catch (ex) {
            log("app:main-router", ex);
            res.json(fail(ex));
        }
    }
);

/**
 * @function
 * @memberof module:Routes
 * @name Get_link
 * @description get all collection
 * @route {GET} /interest-tree
 * @example <caption>Example Success response:</caption>
{
    "result": {
        "edges": {
            "becket": [
                {
                    "node": "jame",
                    "weight": 1
                },
                {
                    "node": "manoj",
                    "weight": 1
                },
                {
                    "node": "debraj",
                    "weight": 1
                }
            ],
            "jame": [
                {
                    "node": "becket",
                    "weight": 1
                }
            ],
            "manoj": [
                {
                    "node": "becket",
                    "weight": 1
                },
                {
                    "node": "debraj",
                    "weight": 1
                }
            ],
            "debraj": [
                {
                    "node": "becket",
                    "weight": 1
                }
            ]
        },
        "nodes": [
            "becket",
            "jame",
            "manoj",
            "debraj",
            "debraj"
        ]
    },
    "success": true,
    "message": "Done"
}
* @example <caption>Example Error response:</caption>
{
    "success": false,
    "message": {
        "errorMessage": "*******************************************",
        "date": "2019-01-17T11:53:53.856Z"
    }
}
 * */
interestGraphRouter.get("/interest-tree", async (req, res) => {
    try {
        res.json(success("Done", await mutualTreeService.getGraph()));
    } catch (ex) {
        log("app:main-router", ex);
        res.json(fail(ex));
    }
});

/**
 * @function
 * @memberof module:Routes
 * @name Find_mutual_fiends
 * @description find mutual fiends
 * @route {POST} /interest-tree-search
 * @example <caption>Example request body:</caption>
{
	"vertex1":"becket",
	"vertex2":"manoj"
}
 * @example <caption>Example Success response:</caption>
{
    "result": {
        "vertex1_friends": [
            "jame",
            "manoj",
            "debraj"
        ],
        "vertex2_friends": [
            "becket",
            "debraj"
        ],
        "mutual_friends": [
            "debraj"
        ]
    },
    "success": true,
    "message": "Done"
}
* @example <caption>Example Error response:</caption>
{
    "success": false,
    "message": {
        "errorMessage": "vertex1 Node does not exist. Please check",
        "date": "2019-10-21T08:16:00.307Z"
    }
}
 * */
interestGraphRouter.post(
    "/interest-tree-search",
    body_validator(mutualFiendsValidator),
    async (req, res) => {
        try {
            res.json(
                success("Done", await mutualTreeService.searchGraph(req.body))
            );
        } catch (ex) {
            log("app:main-router", ex);
            res.json(fail(ex));
        }
    }
);

/**
 * User info
 * @function
 * @memberof module:Routes
 * @name User_twitter_crawler
 * @bodyparam access_token (google token)
 * @headerparam access_token (users token)
 * @description To crawl user google page
 * @route {POST} /user-twitter-crawler
 * @example <caption>Example request body:</caption>
{
	"access_token":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
 * @example <caption>Example Success response:</caption>
{
    "n": 1,
    "nModified": 1,
    "ok": 1,
    "success": true,
    "message": "successful google crawling"
}
* @example <caption>Example Error response:</caption>
{
    "success": false,
    "message": {
        "errorMessage": "Invalid google access_token! Please go through the checked list",
        "date": "2019-01-17T11:53:53.856Z"
    }
}
 * */
interestGraphRouter.post("/twitter-crawler", async (req, res) => {
    try {
        let { authToken, authTokenSecret } = req.body;
        res.json(
            success(
                "successfully login",
                await mutualTreeService.twitterCrawler(
                    authToken,
                    authTokenSecret
                )
            )
        );
    } catch (ex) {
        log("app:main-router", ex);
        res.status(417).json(fail(ex.data));
    }
});

export default interestGraphRouter;
