import { NextFunction, Request, Response } from "express"
import { checkCredentials, dAddNewUser, dUserNameOrEmail_check } from "../db"
import { generateToken } from "../controller/auth"
import { validatePassword } from "../controller/helper"


export async function loginFunc(req: Request, res: Response) {
    try {
        let response = await checkCredentials(req.body)
        let result: any = {
            authentication: response.authentication
        }
        if (response.authentication === false) {
            result.message = response.message

        } else {
            let token = generateToken({ userId: req.body.username })
            result.userDetails = response.result
            result.token = token
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({
            authentication: false,
            message: "Internal Server Error"
        })
    }
} 


export async function addNewUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, email, password, fullname } = req.body;
        const exists_username_email = await dUserNameOrEmail_check(username, email)
        if (exists_username_email) {
            if (exists_username_email[0].email === email) {
                res.status(422).json({ message: "Email id already exist" })
            } else if (exists_username_email[0].username === username) {
                res.status(422).json({ message: "User name already exist" })
            }
            return next();
        }
        if (!validatePassword(password)) {
            res.status(422).json({message :"Invalid password. Password should have at least 8 characters, one uppercase & lowercase letters, and one special character."})
            return next();
        }
        const response: any = await dAddNewUser({fullname, email, password, username})
        if (response) {
            res.status(200).json({
                code: 200,
                message: "User added successfully!!"
            })
            return next();
        } else {
            res.status(500).json({
                code: 500,
                message: "Something unexpected happened, try again later"
            })
            return next();
        }
    } catch (err: any) {
        res.status(500).json({
            code: 500,
            message: err?.message || "Something unexpected happened, try again later"
        })
    }
}