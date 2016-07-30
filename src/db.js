import "babel-polyfill"
import vogels from "vogels"
import Joi from "joi"
import _ from "lodash"
import {count, min, max} from "./statistics"
vogels.AWS.config.loadFromPath("credentials.json")
const table = vogels.define("webgl_result", {
    hashKey: "name",
    timestamps: true,
    schema: {
        name: Joi.string(),
        data_type: Joi.string(),
        platform_name: Joi.string(),
        platform_version: Joi.string(),
        browser_name: Joi.string(),
        browser_version: Joi.string(),
        data: Joi.array()
    }
})
const statistics = vogels.define("webgl_statistic", {
    hashKey: "id",
    timestamps: true,
    schema: {
        id: Joi.string(),
        extensions: Joi.object(),
        parameters: Joi.object(),
        platform_name: Joi.string(),
        platform_version: Joi.string(),
        browser_name: Joi.string(),
        browser_version: Joi.string(),
        domain: Joi.string()
    }
})
const createTables = () => {
    return new Promise((resolve, reject) => {
        vogels.createTables(err => {
            if (err) {
                reject("Initializing DynamoDB tables was failed", err);
            } else {
                console.log("DynamoDB tables was initialized without any error")
                resolve()
            }
        })
    })
}
const query = (key) => {
    return new Promise((resolve, reject) => {
        table.query(key).exec((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}
const scanAll = () => {
    return new Promise((resolve, reject) => {
        statistics.scan().loadAll().exec((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}
const updateDomain = (item) => {
    const t = _.uniq(item.map(data => (data.attrs.domain)))
    table.create({
        name: "domain",
        data_type: "domain",
        data: t
    }, (err) => {
        err && console.log(err)
    })
}
scanAll().then(result => {
    count(result.Items)
    min(result.Items)
    max(result.Items)
    console.log(count(result.Items));
    console.log(min(result.Items));
    console.log(max(result.Items));
})
