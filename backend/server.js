const express = require('express')
const cors = require('cors')
const app = express()
const mysql = require('mysql2')

require('dotenv').config()

app.use(express.json())
app.use(cors()) // cross-origin resource sharing

const db = mysql.createConnection({
    host: 'localhost',
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: 'node-app',
})

db.connect((err) =>{
    if(!err){
        console.log("Connected to database successfully")
    }else{
        console.log("Failed to connect database")
    }
})

app.post('/new-task', (req, res) =>{
    console.log(req.body)
    const q = 'insert into todos (task, createdAt, status) values (?, ?, ?)'
    db.query(q, [req.body.task, new Date(), 'active'], (err, result) =>{
        if(err){
            console.log("Faild to store task")
        }else{
            console.log("todo saved")
            const updatedTasks = 'select * from todos'
            db.query(updatedTasks, (error, newList) =>{
                res.send(newList)
            })
        }
    })
})

app.get('/read-tasks', (req, res) =>{
    const q = 'select * from todos'
    db.query(q, (err, result) =>{
        if(err){
            console.log("Faild to read tasks")
        }else{
            console.log("got tasks successfully from db")
            //console.log(result)
            res.status(200).send(result)
        }
    })
})

app.post('/update-task', (req, res) =>{
    const q = 'update todos set task = ? where id = ?'
    console.log(req.body)
    db.query(q, [req.body.task, req.body.updatedId], (err, result) =>{
        if(err){
            console.log('faild to update')
        }else{
            console.log('updated')
            const updatedTasks = 'select * from todos'
            db.query(updatedTasks, (error, newList) =>{
                res.send(newList)
            })
        }
    })
})

app.post('/delete-task', (req, res) =>{
    const q = 'delete from todos where id = ?'
    db.query(q, [req.body.id], (err, result) =>{
        if(err){
            console.log('Failed to delete')
        }else{
            console.log('Deleted successfully')
            const updatedTasks = 'select * from todos'
            db.query(updatedTasks, (error, newList) =>{
                res.send(newList)
            })
        }
    })
})

app.post('/complete-task', (req, res) =>{
    const q = 'update todos set status = ? where id = ?'
    db.query(q, ['complete', req.body.id], (err, result) =>{
        if(result){
            db.query('select * from todos', (e, newList) =>{
                res.send(newList)
            })
        }
    })
})

app.listen(5000, ()=>{
    console.log('server started')
})