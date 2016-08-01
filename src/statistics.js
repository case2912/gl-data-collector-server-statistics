import "babel-polyfill"
import _ from "lodash"
import {extensions, parameters} from "./statistics-target"
export const count = (item) => {
    let t = []
    t[extensions.length - 1] = 0
    t = _.map(t, (v) => (0))
    item.map(data => {
        _.each(extensions, (element, index) => {
            data.extensions[element] && (t[index] += 1)
        })
    })
    t = _.map(t, (v) => parseInt((v / item.length) * 100))
    return t
}
export const max = (item) => {
    let t = []
    t[parameters.length - 1] = 0
    t = _.map(t, (v) => (0))
    item.map(data => {
        _.each(parameters, (element, index) => {
            t[index] = Math.max(t[index], data.parameters[element])
        })
    })
    return t
}
export const min = (item) => {
    let t = []
    t[parameters.length - 1] = 0
    t = _.map(t, (v) => (9E12))
    item.map(data => {
        _.each(parameters, (element, index) => {
            t[index] = Math.min(t[index], data.parameters[element])
        })
    })
    t = _.map(t, (v) => {
        if (v === 9E12) {
            return 0
        } else {
            return v
        }
    })
    return t
}
