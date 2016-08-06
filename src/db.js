import "babel-polyfill"
import vogels from "vogels"
import Joi from "joi"
import _ from "lodash"
import {
    count,
    min,
    max
} from "./statistics"
vogels.AWS.config.loadFromPath("credentials.json")
const table = vogels.define("webgl_result", {
    hashKey: "name",
    timestamps: true,
    schema: {
        name: Joi.string(),
        platform_name: Joi.string(),
        platform_version: Joi.string(),
        browser_name: Joi.string(),
        browser_version: Joi.string(),
        max: Joi.array(),
        min: Joi.array(),
        count: Joi.array(),
        index: Joi.array()
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
export const createTables = () => {
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
export const query = (key) => {
    return new Promise((resolve, reject) => {
        table.query(key).exec((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.Items.map(data => (data.attrs))[0])
            }
        })
    })
}
export const scanAll = () => {
    return new Promise((resolve, reject) => {
        statistics.scan().loadAll().exec((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.Items.map(data => (data.attrs)))
            }
        })
    })
}
const create = async(element) => {
    return new Promise((resolve, reject) => {
        table.update(element, (err) => {
            err
                ?
                reject(err) :
                resolve()
        })
    })
}
export const sendAllData = () => {
    return new Promise((resolve, reject) => {
        table.scan().loadAll().exec((err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.Items.map(data => (data.attrs)))
            }
        })
    })
}
const list = (item, name) => {
    return new Promise((resolve, reject) => {
        resolve(_.uniq(item.map(data => (data[name]))))
    })
}
export const update = async() => {
    const result = await scanAll()
    const browser_name = await list(result, "browser_name")
    const domain = await list(result, "domain")
    const platform_name = await list(result, "platform_name")
    create({
        name: "browser_name",
        index: browser_name
    })
    create({
        name: "domain",
        index: domain
    })
    create({
        name: "platform_name",
        index: platform_name
    })
    create({
        name: "all",
        max: await max(result),
        min: await min(result),
        count: await count(result)
    })
    browser_name.map(async(name) => {
        let t = await _.filter(result, (data) => (data.browser_name === name))
        let s = await list(t, "browser_version")
        let u = await _.chain(s).map(v => versionReplace(v)).uniq().value()
        u.map(async(version) => {
            let v = await _.filter(t, (data) => (versionReplace(data.browser_version) === version))
            create({
                name: name + version,
                max: await max(v),
                min: await min(v),
                count: await count(v)
            })
        })
        create({
            name: name,
            max: await max(t),
            min: await min(t),
            count: await count(t)
        })
    })
    _.map(platform_name, async(name) => {
        let t = await _.filter(result, (data) => (data.platform_name === name))
        let s = await list(t, "platform_version")
        let u = await _.chain(s).map(v => versionReplace(v)).uniq().value()
        u.map(async(version) => {
            let v = await _.filter(t, (data) => (versionReplace(data.platform_version) === version))
            create({
                name: name + version,
                max: await max(v),
                min: await min(v),
                count: await count(v)
            })
        })
        create({
            name: name,
            max: await max(t),
            min: await min(t),
            count: await count(t)
        })
    })
}
const versionReplace = (s) => (s.replace(/(?![0-9])(.*)/, ""))
