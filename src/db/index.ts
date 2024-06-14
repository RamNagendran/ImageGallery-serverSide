import dotenv from 'dotenv'
import bcrypt from "bcrypt";
import { Pool } from 'pg'
dotenv.config();


const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB
});


const passwordHasing = (password: string) => {
    const saltRounds = 5;
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    })
}


export async function intialDbExecution() {
    const client = await pool.connect();
    try {
        await client.query('CREATE SEQUENCE IF NOT EXISTS user_credentials_id_seq')
        await client.query(` CREATE TABLE IF NOT EXISTS "public"."user_credentials" (
            "id" int4 NOT NULL DEFAULT nextval('user_credentials_id_seq'::regclass),
            "fullname" text,
            "username" text,
            "email" text,
            "password" text,
            PRIMARY KEY ("id"))`
        )
        await client.query('CREATE SEQUENCE IF NOT EXISTS images_id_seq;')
        await client.query(`CREATE TABLE IF NOT EXISTS "public"."images" (
            "id" int4 NOT NULL DEFAULT nextval('images_id_seq'::regclass),
            "url" text,
            "uploadat" text,
            PRIMARY KEY ("id"));
        `)
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}


export const checkCredentials = async (req: LoginCredentials) => {
    const client = await pool.connect();
    try {
        const dbResult = await client.query(
            `SELECT * FROM user_credentials WHERE username = $1`,
            [req.username]
        );

        if (dbResult.rows.length === 0) {
            return {
                authentication: false,
                message: "Not a valid user"
            };
        }
        const storedHashedPass = dbResult.rows[0].password;
        const isPasswordMatch = await bcrypt.compare(req.password as string, storedHashedPass);
        if (!isPasswordMatch) {
            return {
                authentication: false,
                message: 'Incorrect password'
            };
        }
        return {
            authentication: true,
            result: {
                user_id: dbResult.rows[0].id,
                user_name: dbResult.rows[0].username,
                full_name: dbResult.rows[0].fullname,
                email: dbResult.rows[0].email,
            }
        };
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export async function dUserNameOrEmail_check(username: string, email: string) {
    const client = await pool.connect();
    const result: any = await client.query('SELECT username, email from user_credentials where username = $1 OR email = $2', [username, email]);
    if (result?.rowCount > 0) {
        return result.rows;
    } else {
        return false;
    }
}

export async function dAddNewUser(newUser: INewUser) {
    const client = await pool.connect();
    try {
      const hashedPassword = await passwordHasing(newUser.password)
      const query = `
        INSERT INTO user_credentials 
          (
            fullname,
            username,
            email,
            password
          ) 
        VALUES ($1, $2, $3, $4)`
      const values: any = [
        newUser.fullname,
        newUser.username,
        newUser.email,
        hashedPassword
      ]
      const result:any = await client.query(query, values)
      if (result.rowCount > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      client.release()
    }
  }
  