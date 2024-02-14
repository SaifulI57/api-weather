import mongoose, { Schema } from "mongoose";

const Kab = new Schema({
    name: String,
    data: {
        hu: {
            format: String,
            t: [
                {
                    h: String,
                    value: [String]
                }
            ]
        },
        humax: {
            format: String,
            t: [
                {
                    d: String,
                    value: [String]
                }
            ]
        },
        tmax: {
            format: String,
            t: [
                {
                    d: String,
                    value: [String]
                }
            ]
        },
        humin: {
            format: String,
            t: [
                {
                    d: String,
                    value: [String]
                }
            ]
        },
        tmin: {
            format: String,
            t: [
                {
                    d: String,
                    value: [String]
                }
            ]
        },
        t: {
            format: String,
            t: [
                {
                    h: String,
                    value: [String]
                }
            ]
        },
        weather: {
            format: String,
            t: [
                {
                    h: String,
                    value: [String]
                }
            ]
        },
        wd: {
            format: String,
            t: [
                {
                    h: String,
                    value: [String]
                }
            ]
        },
        wd: {
            format: String,
            t: [
                {
                    h: String,
                    value: [String]
                }
            ]
        }
    }
});

export let kab = mongoose.model("kabupaten", Kab);
