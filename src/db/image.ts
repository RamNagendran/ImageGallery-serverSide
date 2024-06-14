import dotenv from 'dotenv'
import { Pool } from 'pg'
dotenv.config();


const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB
});


export async function fetchImages() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM images')
        if (result.rows) {
            return result.rows
        }
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export async function addNewImage(imageDetails: ImageDetails) {

    const client = await pool.connect();
    try {
        const result:any = await client.query('INSERT INTO images (url, uploadat) VALUES ($1, $2)', [imageDetails.url, imageDetails.uploadat])
        if (result.rowCount > 0) {
            return true
        }
    } catch (err) {
        throw err
    } finally {
        client.release();
    }
}

export async function removeImage(id:string) {
    const client = await pool.connect();
    try {
        const result:any = client.query('DELETE from images WHERE id = $1', [id])
        if (result) {
            return true
        }
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}
